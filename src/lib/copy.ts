/** Keep the last N words together so short endings don't orphan on their own line. */
export function preventWidow(text: string, keep = 2): string {
  const value = text?.trim();
  if (!value) return text ?? '';

  const parts = value.split(/\s+/);
  if (parts.length <= keep) return parts.join('\u00A0');

  return `${parts.slice(0, -keep).join(' ')}\u00A0${parts.slice(-keep).join('\u00A0')}`;
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
