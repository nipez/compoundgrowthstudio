import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function readEnv(name: 'PUBLIC_SUPABASE_URL' | 'PUBLIC_SUPABASE_ANON_KEY'): string {
  // Read via bracket access so Vite cannot fold empty defines into dead code.
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value : '';
}

function supabase(): SupabaseClient | null {
  const url = readEnv('PUBLIC_SUPABASE_URL');
  const key = readEnv('PUBLIC_SUPABASE_ANON_KEY');
  if (!url || !key) {
    console.warn('[cgs] Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY');
    return null;
  }
  return createClient(url, key);
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

function sourcePage(): string {
  return `${location.pathname}${location.hash || ''}` || '/';
}

async function submitLead(
  form: HTMLFormElement,
  tag: 'lead_magnet' | 'newsletter' | 'calculator',
) {
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

  if (tag === 'calculator' && (!clinic || !city)) {
    form.reportValidity();
    return;
  }

  const client = supabase();
  if (!client) {
    markSuccess(form);
    if (tag === 'lead_magnet') {
      window.setTimeout(() => {
        window.location.assign('/guides/meta-ads/?thanks=1');
      }, 350);
    }
    return;
  }
  const { error } = await client.from('leads').insert({
    email,
    source_page: sourcePage(),
    tag,
    // Extra context when columns exist; ignored/null-safe if schema is email-only.
    clinic: clinic || null,
    city: city || null,
    notes: calcSummary || null,
  });
  if (error) {
    // Fallback without optional columns if the leads table is still minimal.
    const { error: retryError } = await client.from('leads').insert({
      email,
      source_page: sourcePage(),
      tag,
    });
    if (retryError) {
      console.error('[cgs] lead insert failed', error.message, retryError.message);
      alert('Something went wrong. Please try again.');
      return;
    }
  }
  markSuccess(form);
  if (tag === 'lead_magnet') {
    window.setTimeout(() => {
      window.location.assign('/guides/meta-ads/?thanks=1');
    }, 350);
  } else if (tag === 'calculator') {
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
  const newsletter = Boolean(
    (form.elements.namedItem('newsletter') as HTMLInputElement | null)?.checked,
  );

  if (!name || !isValidEmail(email)) {
    form.reportValidity();
    return;
  }

  const client = supabase();
  if (!client) {
    markSuccess(form);
    return;
  }

  const { error } = await client.from('contact_submissions').insert({
    name,
    email,
    clinic: clinic || null,
    message: message || null,
    newsletter,
    source_page: sourcePage(),
  });
  if (error) {
    console.error('[cgs] contact insert failed', error.message);
    alert('Something went wrong. Please try again.');
    return;
  }

  if (newsletter) {
    await client.from('leads').insert({
      email,
      source_page: sourcePage(),
      tag: 'newsletter',
    });
  }

  markSuccess(form);
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]):not([name="website"]), textarea')
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
  const patientsLostPerYear = Math.round(inputs.activePatients * (1 - inputs.retentionAt12));
  const annualRevenueNeverEarned = Math.round(
    patientsLostPerYear * inputs.monthlyPrice * inputs.avgMonthsRetained,
  );
  const annualReplacementCost = Math.round(patientsLostPerYear * inputs.patientAcquisitionCost);
  const liftPatientsKept = Math.round(inputs.activePatients * 0.1);
  const tenPointLiftWorth = Math.round(liftPatientsKept * inputs.monthlyPrice * inputs.avgMonthsRetained);

  const set = (sel: string, value: string) => {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) el.textContent = value;
  };
  set('[data-cgs-calc-headline]', money(tenPointLiftWorth));
  set('[data-cgs-calc-lift-patients]', num(liftPatientsKept));
  set('[data-cgs-calc-lost]', num(patientsLostPerYear));
  set('[data-cgs-calc-revenue]', money(annualRevenueNeverEarned));
  set('[data-cgs-calc-replace]', money(annualReplacementCost));

  const summary = root.querySelector<HTMLInputElement>('[data-cgs-calc-summary]');
  if (summary) {
    summary.value = JSON.stringify({
      ...inputs,
      patientsLostPerYear,
      annualRevenueNeverEarned,
      annualReplacementCost,
      liftPatientsKept,
      tenPointLiftWorth,
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
      if (kind === 'lead_magnet') void submitLead(form, 'lead_magnet');
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
