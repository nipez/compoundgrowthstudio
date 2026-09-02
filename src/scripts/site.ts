import { collectAttribution, submissionId, type LeadKind, type LeadPayload } from '../lib/leads';
import { computeLeak } from '../lib/retention';

function readEnv(name: 'PUBLIC_FORM_ENDPOINT'): string {
  // Read via bracket access so Vite cannot fold empty defines into dead code.
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value.trim() : '';
}

function leadsEndpoint(): string {
  const endpoint = readEnv('PUBLIC_FORM_ENDPOINT');
  if (!endpoint) console.error('[cgs] Missing PUBLIC_FORM_ENDPOINT — form submissions cannot be delivered');
  return endpoint;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function markSuccess(form: HTMLFormElement) {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (btn) {
    const done = btn.dataset.cgsLabelDone;
    if (done) {
      btn.textContent = done;
      btn.disabled = true;
    }
  }
  const note = form.querySelector<HTMLElement>('[data-cgs-note]');
  if (note?.dataset.cgsNoteDone) {
    note.textContent = note.dataset.cgsNoteDone;
  }
}

function setPending(form: HTMLFormElement, pending: boolean) {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!btn) return;
  btn.disabled = pending;
  if (pending) {
    btn.dataset.cgsLabelPrev = btn.textContent ?? '';
    btn.textContent = 'Sending…';
  } else if (btn.dataset.cgsLabelPrev) {
    btn.textContent = btn.dataset.cgsLabelPrev;
    delete btn.dataset.cgsLabelPrev;
  }
}

function markError(form: HTMLFormElement) {
  const message = 'We could not send that. Please try again in a moment.';
  const note = form.querySelector<HTMLElement>('[data-cgs-note]');
  if (note) {
    note.textContent = message;
    note.dataset.cgsState = 'error';
    return;
  }
  // Forms without a note line get an inline message rather than a browser alert.
  let inline = form.querySelector<HTMLElement>('[data-cgs-inline-error]');
  if (!inline) {
    inline = document.createElement('div');
    inline.setAttribute('data-cgs-inline-error', '');
    inline.style.cssText = 'margin-top: 10px; font-size: 13px; line-height: 1.45; color: #B42318;';
    form.appendChild(inline);
  }
  inline.textContent = message;
}

function sourcePage(): string {
  return `${location.pathname}${location.search || ''}${location.hash || ''}` || '/';
}

/** Posts the submission. Returns false so callers can surface a real failure. */
async function deliver(payload: LeadPayload): Promise<boolean> {
  const endpoint = leadsEndpoint();
  if (!endpoint) return false;

  // text/plain keeps this a "simple" request, so the browser skips the CORS
  // preflight that Google Apps Script cannot answer. Receivers still parse
  // the body as JSON.
  const body = JSON.stringify(payload);
  const headers = { 'Content-Type': 'text/plain;charset=utf-8' };

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body });
    if (!response.ok) {
      console.error('[cgs] delivery rejected', response.status);
      return false;
    }
    return true;
  } catch (error) {
    // Some browsers and privacy extensions refuse to expose the response of a
    // cross-origin redirect. The request itself still goes through, so send it
    // once more without reading the reply rather than losing the submission.
    console.warn('[cgs] delivery response unreadable, retrying opaque', error);
    try {
      await fetch(endpoint, { method: 'POST', headers, body, mode: 'no-cors' });
      return true;
    } catch (retryError) {
      console.error('[cgs] delivery failed', retryError);
      return false;
    }
  }
}

function basePayload(kind: LeadKind, email: string): LeadPayload {
  const url = new URL(location.href);
  return {
    id: submissionId(),
    kind,
    email,
    sourcePage: sourcePage(),
    sourceUrl: url.toString(),
    referrer: document.referrer || undefined,
    utm: collectAttribution(url),
    submittedAt: new Date().toISOString(),
  };
}

async function submitLead(form: HTMLFormElement, kind: 'guide' | 'newsletter' | 'calculator') {
  const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value;
  if (honeypot) {
    markSuccess(form);
    return;
  }
  const email = String((form.elements.namedItem('email') as HTMLInputElement | null)?.value || '')
    .trim()
    .toLowerCase();
  if (!isValidEmail(email)) {
    form.reportValidity();
    return;
  }
  const clinic = String((form.elements.namedItem('clinic') as HTMLInputElement | null)?.value || '').trim();
  const city = String((form.elements.namedItem('city') as HTMLInputElement | null)?.value || '').trim();
  const calcSummary = String(
    (form.elements.namedItem('calc_summary') as HTMLInputElement | null)?.value || '',
  ).trim();

  if (kind === 'calculator' && (!clinic || !city)) {
    form.reportValidity();
    return;
  }

  setPending(form, true);
  const delivered = await deliver({
    ...basePayload(kind, email),
    clinic: clinic || undefined,
    city: city || undefined,
    calculator: kind === 'calculator' ? calcSummary || undefined : undefined,
  });
  setPending(form, false);

  if (!delivered) {
    markError(form);
    return;
  }

  markSuccess(form);
  if (kind === 'guide') {
    window.setTimeout(() => {
      window.location.assign('/guides/meta-ads/?thanks=1');
    }, 350);
  } else if (kind === 'calculator') {
    window.setTimeout(() => {
      window.location.assign('/contact/?from=calculator');
    }, 900);
  }
}

async function submitContact(form: HTMLFormElement) {
  const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value;
  if (honeypot) {
    markSuccess(form);
    return;
  }
  const name = String((form.elements.namedItem('name') as HTMLInputElement | null)?.value || '').trim();
  const email = String((form.elements.namedItem('email') as HTMLInputElement | null)?.value || '')
    .trim()
    .toLowerCase();
  const clinic = String((form.elements.namedItem('clinic') as HTMLInputElement | null)?.value || '').trim();
  const message = String(
    (form.elements.namedItem('message') as HTMLTextAreaElement | null)?.value || '',
  ).trim();
  const preferredDayRaw = String(
    (form.elements.namedItem('preferredDay') as HTMLInputElement | null)?.value || '',
  ).trim();
  const preferredTime = String(
    (form.elements.namedItem('preferredTime') as HTMLInputElement | null)?.value || '',
  ).trim();
  const newsletter = Boolean(
    (form.elements.namedItem('newsletter') as HTMLInputElement | null)?.checked,
  );

  if (!name || !isValidEmail(email)) {
    form.reportValidity();
    return;
  }

  const preferredDay = preferredDayRaw || '';

  const scheduleLine =
    preferredDay && preferredTime ? `Preferred time: ${preferredDay} at ${preferredTime} ET` : '';
  const combinedMessage = [scheduleLine, message].filter(Boolean).join('\n\n') || undefined;

  setPending(form, true);
  const delivered = await deliver({
    ...basePayload('contact', email),
    name,
    clinic: clinic || undefined,
    message: combinedMessage,
    preferredDay: preferredDay || undefined,
    preferredTime: preferredTime ? `${preferredTime} ET` : undefined,
    newsletter,
  });
  setPending(form, false);

  if (!delivered) {
    markError(form);
    return;
  }

  markSuccess(form);
  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>(
      'input:not([type="hidden"]):not([name="website"]), textarea, button.cgs-slot',
    )
    .forEach((el) => {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') return;
      el.disabled = true;
    });
}

function money(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function num(n: number): string {
  return new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(n);
}

function readCalcInputs(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-cgs-calc-inputs]');
  if (!form) return null;
  const get = (name: string) =>
    Number((form.elements.namedItem(name) as HTMLInputElement | null)?.value || 0);
  return {
    activePatients: get('activePatients'),
    monthlyPrice: get('monthlyPrice'),
    newPatientsPerMonth: get('newPatientsPerMonth'),
    retentionAt12: Math.min(1, Math.max(0, get('retentionAt12Pct') / 100)),
    patientAcquisitionCost: get('patientAcquisitionCost'),
    avgMonthsRetained: get('avgMonthsRetained'),
  };
}

function paintCalc(root: HTMLElement) {
  const inputs = readCalcInputs(root);
  if (!inputs) return;
  const result = computeLeak(inputs);

  const set = (sel: string, value: string) => {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) el.textContent = value;
  };
  set('[data-cgs-calc-headline]', money(result.tenPointLiftWorth));
  set('[data-cgs-calc-lift-patients]', num(result.liftPatientsKept));
  set('[data-cgs-calc-lost]', num(result.patientsLostPerYear));
  set('[data-cgs-calc-revenue]', money(result.annualRevenueNeverEarned));
  set('[data-cgs-calc-replace]', money(result.annualReplacementCost));

  const summary = root.querySelector<HTMLInputElement>('[data-cgs-calc-summary]');
  if (summary) {
    summary.value = JSON.stringify({
      ...inputs,
      patientsLostPerYear: result.patientsLostPerYear,
      annualRevenueNeverEarned: result.annualRevenueNeverEarned,
      annualReplacementCost: result.annualReplacementCost,
      liftPatientsKept: result.liftPatientsKept,
      tenPointLiftWorth: result.tenPointLiftWorth,
    });
  }
}

function initCalculator() {
  document.querySelectorAll<HTMLElement>('[data-cgs-calculator]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-cgs-calc-inputs]');
    if (!form) return;
    const update = () => paintCalc(root);
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    });
    update();
  });
}

function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-cgs-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const kind = form.dataset.cgsForm;
      if (kind === 'lead_magnet') void submitLead(form, 'guide');
      else if (kind === 'newsletter') void submitLead(form, 'newsletter');
      else if (kind === 'calculator') void submitLead(form, 'calculator');
      else if (kind === 'contact') void submitContact(form);
    });
  });
}

function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-counter-end]');
  if (!els.length) return;

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const run = (el: HTMLElement) => {
    const end = Number(el.dataset.counterEnd || 0);
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = String(Math.round(ease(p) * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (typeof IntersectionObserver !== 'function') {
    els.forEach(run);
    return;
  }

  els.forEach((el) => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          run(el);
        });
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
  });
}

function initAiDemoHeight() {
  window.addEventListener('message', (event) => {
    const f = document.getElementById('ai-demo') as HTMLIFrameElement | null;
    const allowedOrigin =
      f?.dataset.aiDemoOrigin || 'https://midwest-exteriors-production.up.railway.app';
    if (event.origin !== allowedOrigin) return;
    const d = event.data;
    if (d && d.type === 'ai-demo:height' && typeof d.height === 'number') {
      if (f) f.style.height = `${d.height}px`;
    }
  });
}

function initSystemStages() {
  const root = document.querySelector<HTMLElement>('[data-cgs-stages]');
  if (!root) return;

  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-cgs-stage]'));
  if (nodes.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;

  const paint = () => {
    const progress = (index / (nodes.length - 1)) * 100;
    root.style.setProperty('--progress', `${progress}%`);
    nodes.forEach((node, i) => {
      if (i < index) node.dataset.state = 'done';
      else if (i === index) node.dataset.state = 'active';
      else node.dataset.state = 'idle';
    });
  };

  paint();
  if (reduceMotion) return;

  window.setInterval(() => {
    index = (index + 1) % nodes.length;
    paint();
  }, 1400);
}

function initMobileNav() {
  const nav = document.querySelector<HTMLElement>('[data-cgs-nav]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-cgs-nav-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-cgs-nav-panel]');
  if (!nav || !toggle || !panel) return;

  const setOpen = (open: boolean) => {
    nav.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('cgs-nav-lock', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(nav.dataset.open !== 'true');
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  const mq = window.matchMedia('(min-width: 1101px)');
  const onBreakpoint = () => {
    if (mq.matches) setOpen(false);
  };
  if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onBreakpoint);
  else mq.addListener(onBreakpoint);
}

initForms();
initCalculator();
initCounters();
initAiDemoHeight();
initSystemStages();
initMobileNav();
