import { neon } from "@neondatabase/serverless";

export type LeadStatus = "new" | "contacted" | "closed_won" | "closed_lost";
export type LeadSource = "contact_form" | "calendly";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  business: string | null;
  source: LeadSource;
  calendly_event_uri: string | null;
  call_scheduled_at: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

export interface FollowUpSend {
  id: number;
  lead_id: number;
  step: number;
  sent_at: string;
}

export interface PageView {
  id: number;
  path: string;
  referrer: string | null;
  visitor_id: string | null;
  created_at: string;
}

// Vercel's newer Postgres (Neon) integration sometimes prefixes every
// variable with the project name instead of using plain names — e.g.
// "nextgenclosersai_POSTGRES_URL" instead of "POSTGRES_URL" — so this
// checks both the plain name and any variable ending with it.
const CONNECTION_STRING_SUFFIXES = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
];

function getConnectionString(): string | null {
  const envKeys = Object.keys(process.env);
  for (const suffix of CONNECTION_STRING_SUFFIXES) {
    const exact = process.env[suffix];
    if (exact) return exact;

    const prefixed = envKeys.find((key) => key.endsWith(`_${suffix}`));
    if (prefixed && process.env[prefixed]) return process.env[prefixed]!;
  }
  return null;
}

export function isDbConfigured(): boolean {
  return Boolean(getConnectionString());
}

let client: ReturnType<typeof neon> | null = null;

function getClient() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error(
      "No database connection string found. Add a Postgres database to this project in Vercel (Storage tab), which sets DATABASE_URL automatically.",
    );
  }
  if (!client) {
    client = neon(connectionString);
  }
  return client;
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getClient();
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL DEFAULT '',
          email TEXT NOT NULL,
          phone TEXT,
          business TEXT,
          source TEXT NOT NULL,
          calendly_event_uri TEXT,
          call_scheduled_at TIMESTAMPTZ,
          status TEXT NOT NULL DEFAULT 'new',
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS leads_calendly_event_email_idx
        ON leads (calendly_event_uri, email)
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS follow_up_sends (
          id SERIAL PRIMARY KEY,
          lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
          step INTEGER NOT NULL,
          sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          UNIQUE (lead_id, step)
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS page_views (
          id SERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          referrer TEXT,
          visitor_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at)`;
    })();
  }
  return schemaReady;
}

export async function upsertContactFormLead(input: {
  name: string;
  email: string;
  phone: string;
  business: string;
}): Promise<void> {
  await ensureSchema();
  const sql = getClient();
  await sql`
    INSERT INTO leads (name, email, phone, business, source, status)
    VALUES (${input.name}, ${input.email}, ${input.phone}, ${input.business}, 'contact_form', 'new')
  `;
}

export async function upsertCalendlyLead(input: {
  name: string;
  email: string;
  phone: string | null;
  calendlyEventUri: string;
  callScheduledAt: string;
}): Promise<Lead | null> {
  await ensureSchema();
  const sql = getClient();
  const rows = (await sql`
    INSERT INTO leads (name, email, phone, source, calendly_event_uri, call_scheduled_at, status)
    VALUES (${input.name}, ${input.email}, ${input.phone}, 'calendly', ${input.calendlyEventUri}, ${input.callScheduledAt}, 'new')
    ON CONFLICT (calendly_event_uri, email) DO NOTHING
    RETURNING *
  `) as unknown as Lead[];
  return rows[0] ?? null;
}

export async function listLeads(): Promise<Lead[]> {
  await ensureSchema();
  const sql = getClient();
  const rows = (await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 500`) as unknown as Lead[];
  return rows;
}

export async function getLead(id: number): Promise<Lead | null> {
  await ensureSchema();
  const sql = getClient();
  const rows = (await sql`SELECT * FROM leads WHERE id = ${id}`) as unknown as Lead[];
  return rows[0] ?? null;
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await ensureSchema();
  const sql = getClient();
  await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
}

export async function getFollowUpHistory(leadId: number): Promise<FollowUpSend[]> {
  await ensureSchema();
  const sql = getClient();
  const rows = await sql`SELECT * FROM follow_up_sends WHERE lead_id = ${leadId} ORDER BY step ASC`;
  return rows as unknown as FollowUpSend[];
}

export async function getAllFollowUpSends(): Promise<FollowUpSend[]> {
  await ensureSchema();
  const sql = getClient();
  const rows = await sql`SELECT * FROM follow_up_sends`;
  return rows as unknown as FollowUpSend[];
}

export async function logFollowUpSent(leadId: number, step: number): Promise<boolean> {
  await ensureSchema();
  const sql = getClient();
  const rows = (await sql`
    INSERT INTO follow_up_sends (lead_id, step)
    VALUES (${leadId}, ${step})
    ON CONFLICT (lead_id, step) DO NOTHING
    RETURNING id
  `) as unknown as { id: number }[];
  return rows.length > 0;
}

export async function logPageView(input: {
  path: string;
  referrer: string | null;
  visitorId: string | null;
}): Promise<void> {
  await ensureSchema();
  const sql = getClient();
  await sql`
    INSERT INTO page_views (path, referrer, visitor_id)
    VALUES (${input.path}, ${input.referrer}, ${input.visitorId})
  `;
}

export interface VisitStats {
  pageViewsToday: number;
  pageViews7d: number;
  pageViews30d: number;
  uniqueVisitors7d: number;
  uniqueVisitors30d: number;
}

export async function getVisitStats(): Promise<VisitStats> {
  await ensureSchema();
  const sql = getClient();
  type CountRow = { count: number };
  const [today, d7, d30, u7, u30] = (await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= date_trunc('day', now())`,
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= now() - interval '7 days'`,
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= now() - interval '30 days'`,
    sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM page_views WHERE created_at >= now() - interval '7 days' AND visitor_id IS NOT NULL`,
    sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM page_views WHERE created_at >= now() - interval '30 days' AND visitor_id IS NOT NULL`,
  ])) as unknown as [CountRow[], CountRow[], CountRow[], CountRow[], CountRow[]];
  return {
    pageViewsToday: today[0]?.count ?? 0,
    pageViews7d: d7[0]?.count ?? 0,
    pageViews30d: d30[0]?.count ?? 0,
    uniqueVisitors7d: u7[0]?.count ?? 0,
    uniqueVisitors30d: u30[0]?.count ?? 0,
  };
}

export async function listRecentPageViews(limit = 50): Promise<PageView[]> {
  await ensureSchema();
  const sql = getClient();
  const rows = await sql`SELECT * FROM page_views ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as unknown as PageView[];
}
