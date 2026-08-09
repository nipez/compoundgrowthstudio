import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';

type Tab = 'contact' | 'leads';

type ContactRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  clinic: string | null;
  message: string | null;
  newsletter: boolean | null;
  source_page: string | null;
};

type LeadRow = {
  id: string;
  created_at: string;
  email: string | null;
  tag: string | null;
  clinic: string | null;
  city: string | null;
  notes: string | null;
  source_page: string | null;
};

const PAGE_SIZE = 200;

function readEnv(name: 'PUBLIC_SUPABASE_URL' | 'PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = (import.meta.env as Record<string, string | undefined>)[name];
  return typeof value === 'string' ? value : '';
}

const url = readEnv('PUBLIC_SUPABASE_URL');
const anonKey = readEnv('PUBLIC_SUPABASE_ANON_KEY');
const client: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

const state: {
  tab: Tab;
  contact: ContactRow[];
  leads: LeadRow[];
  query: string;
} = { tab: 'contact', contact: [], leads: [], query: '' };

function fmtDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setStatus(message: string, tone: 'idle' | 'error' = 'idle') {
  const node = el<HTMLElement>('admin-status');
  if (!node) return;
  node.textContent = message;
  node.dataset.tone = tone;
}

function matchesQuery(row: ContactRow | LeadRow): boolean {
  if (!state.query) return true;
  const haystack = Object.values(row).join(' ').toLowerCase();
  return haystack.includes(state.query);
}

function renderContact(rows: ContactRow[]): string {
  if (!rows.length) return '<p class="admin-empty">No contact submissions yet.</p>';
  return `
    <table class="admin-table">
      <thead>
        <tr><th>Received</th><th>Name</th><th>Email</th><th>Clinic</th><th>Message</th><th>Newsletter</th><th>Page</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
          <tr>
            <td class="admin-nowrap">${esc(fmtDate(row.created_at))}</td>
            <td>${esc(row.name)}</td>
            <td><a href="mailto:${esc(row.email)}">${esc(row.email)}</a></td>
            <td>${esc(row.clinic) || '—'}</td>
            <td class="admin-message">${esc(row.message) || '—'}</td>
            <td>${row.newsletter ? 'Yes' : 'No'}</td>
            <td class="admin-dim">${esc(row.source_page) || '—'}</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`;
}

function renderLeads(rows: LeadRow[]): string {
  if (!rows.length) return '<p class="admin-empty">No guide or newsletter signups yet.</p>';
  return `
    <table class="admin-table">
      <thead>
        <tr><th>Received</th><th>Email</th><th>Source</th><th>Clinic</th><th>City</th><th>Page</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
          <tr>
            <td class="admin-nowrap">${esc(fmtDate(row.created_at))}</td>
            <td><a href="mailto:${esc(row.email)}">${esc(row.email)}</a></td>
            <td><span class="admin-tag">${esc(row.tag)}</span></td>
            <td>${esc(row.clinic) || '—'}</td>
            <td>${esc(row.city) || '—'}</td>
            <td class="admin-dim">${esc(row.source_page) || '—'}</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`;
}

function activeRows(): (ContactRow | LeadRow)[] {
  const rows = state.tab === 'contact' ? state.contact : state.leads;
  return rows.filter(matchesQuery);
}

function render() {
  const body = el<HTMLElement>('admin-table-body');
  if (!body) return;

  document.querySelectorAll<HTMLButtonElement>('[data-admin-tab]').forEach((btn) => {
    btn.dataset.active = btn.dataset.adminTab === state.tab ? 'true' : 'false';
  });

  const rows = activeRows();
  body.innerHTML =
    state.tab === 'contact' ? renderContact(rows as ContactRow[]) : renderLeads(rows as LeadRow[]);

  const count = el<HTMLElement>('admin-count');
  if (count) {
    const total = state.tab === 'contact' ? state.contact.length : state.leads.length;
    count.textContent =
      rows.length === total ? `${total} total` : `${rows.length} of ${total} shown`;
  }
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((h) => cell(row[h])).join(','))].join(
    '\n',
  );
}

function downloadCsv() {
  const rows = activeRows() as unknown as Record<string, unknown>[];
  if (!rows.length) return;
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `cgs-${state.tab}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function loadRows() {
  if (!client) return;
  setStatus('Loading submissions…');

  const [contact, leads] = await Promise.all([
    client
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE),
    client.from('leads').select('*').order('created_at', { ascending: false }).limit(PAGE_SIZE),
  ]);

  if (contact.error || leads.error) {
    setStatus(
      `Could not load submissions. ${contact.error?.message ?? leads.error?.message ?? ''}`,
      'error',
    );
    return;
  }

  state.contact = (contact.data ?? []) as ContactRow[];
  state.leads = (leads.data ?? []) as LeadRow[];
  setStatus('');
  render();
}

function showSignedIn(session: Session) {
  el<HTMLElement>('admin-login')?.setAttribute('hidden', '');
  el<HTMLElement>('admin-panel')?.removeAttribute('hidden');
  el<HTMLElement>('admin-panel-body')?.removeAttribute('hidden');
  const who = el<HTMLElement>('admin-user');
  if (who) who.textContent = session.user.email ?? '';
  void loadRows();
}

function showSignedOut() {
  el<HTMLElement>('admin-panel')?.setAttribute('hidden', '');
  el<HTMLElement>('admin-panel-body')?.setAttribute('hidden', '');
  el<HTMLElement>('admin-login')?.removeAttribute('hidden');
  setStatus('');
}

function initAuth() {
  if (!client) {
    setStatus('Supabase is not configured for this build.', 'error');
    return;
  }

  const form = el<HTMLFormElement>('admin-login-form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = String((form.elements.namedItem('email') as HTMLInputElement)?.value || '').trim();
    const password = String((form.elements.namedItem('password') as HTMLInputElement)?.value || '');
    setStatus('Signing in…');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message, 'error');
      return;
    }
    setStatus('');
  });

  el<HTMLButtonElement>('admin-signout')?.addEventListener('click', async () => {
    await client.auth.signOut();
  });

  el<HTMLButtonElement>('admin-refresh')?.addEventListener('click', () => void loadRows());
  el<HTMLButtonElement>('admin-export')?.addEventListener('click', downloadCsv);

  el<HTMLInputElement>('admin-search')?.addEventListener('input', (event) => {
    state.query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-admin-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tab = (btn.dataset.adminTab as Tab) ?? 'contact';
      render();
    });
  });

  client.auth.getSession().then(({ data }) => {
    if (data.session) showSignedIn(data.session);
    else showSignedOut();
  });

  client.auth.onAuthStateChange((_event, session) => {
    if (session) showSignedIn(session);
    else showSignedOut();
  });
}

initAuth();
