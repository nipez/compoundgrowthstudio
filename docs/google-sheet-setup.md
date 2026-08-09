# Track form submissions in a Google Sheet

Every form on the site — contact requests, the free Meta ads guide, the
newsletter, and the calculator — posts to one URL. Point that URL at a Google
Sheet and each submission becomes a new row. No database, no login, no code.

Takes about five minutes, once.

## 1. Create the sheet

Go to [sheets.new](https://sheets.new) and name it something like
**CGS Form Submissions**. Leave it empty — the script adds the header row.

## 2. Add the script

In that sheet: **Extensions → Apps Script**. Delete whatever is in the editor
and paste this in full:

```javascript
const HEADERS = [
  'Received',
  'Type',
  'Email',
  'Name',
  'Clinic',
  'City',
  'Message',
  'Newsletter',
  'Came from',
  'Page',
  'Referrer',
  'Calculator',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const data = JSON.parse(e.postData.contents);

    // The site retries when a browser blocks reading the response, so ignore
    // a submission id that was already stored.
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
      data.newsletter ? 'Yes' : '',
      utm.from || utm.utm_campaign || utm.utm_source || '',
      data.sourcePage || '',
      data.referrer || '',
      data.calculator || '',
    ]);

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
```

Click the **save** icon.

## 3. Deploy it

Click **Deploy → New deployment**.

- Click the gear next to "Select type" and choose **Web app**
- **Execute as:** Me
- **Who has access:** **Anyone** ← this matters; "Anyone with Google account" will not work
- Click **Deploy**

Google asks you to authorize the first time. It will warn that the app is
unverified — click **Advanced → Go to (project name)** and allow it. You are
authorizing your own script.

Copy the **Web app URL**. It looks like:

```
https://script.google.com/macros/s/AKfycb.....X1/exec
```

## 4. Point the site at it

In Railway → the `compound-growth-studio` service → **Variables**, set:

```
FORM_ENDPOINT = <the web app URL you just copied>
```

If `CRM_LEADS_ENDPOINT` is still there, delete it so there is only one.

Redeploy the service. The URL is baked into the page script at build time, so a
redeploy is required for the change to take effect.

## 5. Test it

Submit the guide form in the site footer with your own email. A new row should
appear in the sheet within a second or two.

## If a submission shows "We could not send that"

Some browsers and privacy extensions refuse to expose the response of a
cross-origin redirect, which is how Apps Script replies. The site retries such
a submission without reading the reply, so the row still arrives — the
`data.id` check above is what keeps that retry from creating a duplicate.

If the error persists, the request is being blocked outright. Check for an ad
blocker or content blocker on `script.google.com`, or confirm the deployment's
**Who has access** is still **Anyone**.

## Getting notified

To get an email whenever a submission arrives, in the sheet go to
**Tools → Notification settings → Edit notifications**, then choose
*Any changes are made* and *Email — right away*.

## Changing the script later

Edits to the script are not live until you redeploy: **Deploy → Manage
deployments → pencil icon → Version: New version → Deploy**. The URL stays the
same, so nothing changes in Railway.

## Moving to the CRM later

Nothing here locks you in. When the CRM lead route is ready, swap
`FORM_ENDPOINT` to that URL and redeploy — the payload the site sends is
identical either way. See [`crm-lead-intake.md`](./crm-lead-intake.md).
