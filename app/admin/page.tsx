import { isDbConfigured, listLeads, getVisitStats, listRecentPageViews, getAllFollowUpSends } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isDbConfigured()) {
    return (
      <div className="min-h-screen bg-ink-950 px-4 py-16 text-paper-50">
        <div className="mx-auto max-w-lg rounded-2xl border border-ink-700 bg-ink-900/60 p-8">
          <p className="text-lg font-semibold">No database connected yet</p>
          <p className="mt-3 text-sm leading-relaxed text-mist-400">
            Add a Postgres database to this project in Vercel (Storage tab → Create Database →
            Postgres), which sets the connection env vars automatically. Once that&apos;s deployed,
            this page will work.
          </p>
        </div>
      </div>
    );
  }

  const [leads, visitStats, recentViews, followUpSends] = await Promise.all([
    listLeads(),
    getVisitStats(),
    listRecentPageViews(30),
    getAllFollowUpSends(),
  ]);

  return (
    <AdminDashboardClient
      leads={leads}
      visitStats={visitStats}
      recentViews={recentViews}
      followUpSends={followUpSends}
    />
  );
}
