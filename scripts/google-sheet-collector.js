/**
 * Google Apps Script for CGS form submissions.
 * Paste into Extensions → Apps Script on the CGS Form Submissions sheet.
 * Deploy as web app (Execute as: Me, Who has access: Anyone).
 */
const HEADERS = [
  'Received',
  'Type',
  'Email',
  'Name',
  'Clinic',
  'City',
  'Message',
  'Preferred Day',
  'Preferred Time',
  'Newsletter',
  'Came from',
  'Page',
  'Referrer',
  'Calculator',
];

const NOTIFY_EMAILS = [
  'nick@compoundgrowthstudio.com',
  'conor@compoundgrowthstudio.com',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const data = JSON.parse(e.postData.contents);

    const cache = CacheService.getScriptCache();
    if (data.id) {
      if (cache.get(data.id)) {
        return ContentService.createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      cache.put(data.id, '1', 600);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const utm = data.utm || {};

    sheet.appendRow([
      new Date(),
      data.kind || '',
      data.email || '',
      data.name || '',
      data.clinic || '',
      data.city || '',
      data.message || '',
      data.preferredDay || '',
      data.preferredTime || '',
      data.newsletter ? 'Yes' : '',
      utm.from || utm.utm_campaign || utm.utm_source || '',
      data.sourcePage || '',
      data.referrer || '',
      data.calculator || '',
    ]);

    try {
      notifyTeam(data);
    } catch (mailError) {
      console.error('notifyTeam failed', mailError);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function notifyTeam(data) {
  const kind = data.kind || 'submission';
  const subject =
    kind === 'contact'
      ? `New Growth Gap Call — ${data.name || data.email}`
      : `New ${kind} lead — ${data.email || 'unknown'}`;

  const lines = [
    `Type: ${kind}`,
    `Email: ${data.email || ''}`,
    data.name ? `Name: ${data.name}` : '',
    data.clinic ? `Clinic: ${data.clinic}` : '',
    data.city ? `City: ${data.city}` : '',
    data.preferredDay ? `Preferred day: ${data.preferredDay}` : '',
    data.preferredTime ? `Preferred time: ${data.preferredTime}` : '',
    data.newsletter ? 'Newsletter: Yes' : '',
    data.message ? `\nMessage:\n${data.message}` : '',
    data.calculator ? `\nCalculator:\n${data.calculator}` : '',
    `\nPage: ${data.sourcePage || ''}`,
    data.sourceUrl ? `URL: ${data.sourceUrl}` : '',
    data.referrer ? `Referrer: ${data.referrer}` : '',
  ].filter(Boolean);

  MailApp.sendEmail({
    to: NOTIFY_EMAILS.join(','),
    subject: subject,
    body: lines.join('\n'),
  });
}
