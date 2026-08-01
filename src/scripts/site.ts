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

async function submitLead(form: HTMLFormElement, tag: 'lead_magnet' | 'newsletter') {
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
  });
  if (error) {
    console.error('[cgs] lead insert failed', error.message);
    alert('Something went wrong. Please try again.');
    return;
  }
  markSuccess(form);
  if (tag === 'lead_magnet') {
    window.setTimeout(() => {
      window.location.assign('/guides/meta-ads/?thanks=1');
    }, 350);
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

function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-cgs-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const kind = form.dataset.cgsForm;
      if (kind === 'lead_magnet') void submitLead(form, 'lead_magnet');
      else if (kind === 'newsletter') void submitLead(form, 'newsletter');
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

initForms();
initCounters();
initAiDemoHeight();
initSystemStages();
