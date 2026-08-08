/**
 * Protect short compound words (e.g. "high-value") from wrapping on the hyphen.
 * Longer hyphenated phrases stay breakable so mobile layouts don't overflow.
 */
function protectHyphens(text: string): string {
  return text.replace(/(\w{1,8})-(\w{1,8})/g, '$1\u2011$2');
}

/**
 * Keep the last N words together so short endings don't orphan on their own line.
 * Caps the glued run so long display headlines can still wrap on phones.
 */
export function preventWidow(text: string, keep = 2): string {
  const value = text?.trim();
  if (!value) return text ?? '';

  const protectedText = protectHyphens(value);
  const parts = protectedText.split(/\s+/);
  if (parts.length <= 1) return protectedText;

  const glued = Math.min(keep, 2, parts.length - 1);
  if (glued <= 0) return protectedText;

  // Avoid an unbreakable tail wider than ~22 chars (rough phone-line budget).
  let n = glued;
  while (n > 1) {
    const tail = parts.slice(-n).join(' ');
    if (tail.replace(/\u2011/g, '-').length <= 22) break;
    n -= 1;
  }

  return `${parts.slice(0, -n).join(' ')}\u00A0${parts.slice(-n).join('\u00A0')}`;
}

/** Split on sentence boundaries for intentional multi-line display headlines. */
export function splitSentences(text: string): string[] {
  const value = text?.trim();
  if (!value) return [];

  const parts = value
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length ? parts : [value];
}
