/** Shared shape for every marketing form submission sent to the CRM. */
export type LeadKind = 'contact' | 'guide' | 'newsletter' | 'calculator';

export type LeadPayload = {
  /** Stable per-submission id so a retried delivery is not stored twice. */
  id: string;
  kind: LeadKind;
  email: string;
  name?: string;
  clinic?: string;
  city?: string;
  message?: string;
  /** Preferred call day selected on /contact (human-readable + ISO). */
  preferredDay?: string;
  /** Preferred call time selected on /contact (e.g. "10:30 AM ET"). */
  preferredTime?: string;
  newsletter?: boolean;
  /** Serialized calculator inputs + results when kind is 'calculator'. */
  calculator?: string;
  /** Path + query + hash of the page the form was submitted from. */
  sourcePage: string;
  sourceUrl: string;
  referrer?: string;
  utm?: Record<string, string>;
  submittedAt: string;
};

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'from',
  'gclid',
  'fbclid',
] as const;

export function submissionId(): string {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Campaign + intent params, so `?from=compliance-teardown` reaches the CRM. */
export function collectAttribution(url: URL): Record<string, string> {
  const out: Record<string, string> = {};
  UTM_KEYS.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) out[key] = value;
  });
  return out;
}
