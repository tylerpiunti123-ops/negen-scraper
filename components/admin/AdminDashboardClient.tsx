"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead, LeadStatus, VisitStats, PageView, FollowUpSend } from "@/lib/db";
import { followUpSequence, isStepDue } from "@/lib/followUpSequence";
import { cn } from "@/lib/utils";

interface Props {
  leads: Lead[];
  visitStats: VisitStats;
  recentViews: PageView[];
  followUpSends: FollowUpSend[];
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed_won: "Closed — Won",
  closed_lost: "Closed — Lost",
};

export function AdminDashboardClient({
  leads: initialLeads,
  visitStats,
  recentViews,
  followUpSends: initialSends,
}: Props) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [sends, setSends] = useState(initialSends);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const sentStepsByLead = useMemo(() => {
    const map = new Map<number, Set<number>>();
    for (const s of sends) {
      if (!map.has(s.lead_id)) map.set(s.lead_id, new Set());
      map.get(s.lead_id)!.add(s.step);
    }
    return map;
  }, [sends]);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/sync-calendly", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sync failed.");
      setSyncMessage(
        data.errors?.length
          ? `Synced ${data.newBookings} new booking(s). Errors: ${data.errors.join("; ")}`
          : `Synced ${data.newBookings} new booking(s).`,
      );
      router.refresh();
    } catch (err) {
      setSyncMessage(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${lead.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleSendNow(lead: Lead, step: number) {
    const key = `${lead.id}-${step}`;
    setBusyKey(key);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/send-followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });
      if (res.ok) {
        setSends((prev) => [
          ...prev,
          { id: Date.now(), lead_id: lead.id, step, sent_at: new Date().toISOString() },
        ]);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Could not send.");
      }
    } finally {
      setBusyKey(null);
    }
  }

  const now = new Date();
  const upcomingCalls = leads.filter(
    (l) => l.call_scheduled_at && new Date(l.call_scheduled_at) > now,
  ).length;

  return (
    <div className="min-h-screen bg-ink-950 px-4 py-10 text-paper-50 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold">NextGen Closers AI — Admin</p>
            <p className="mt-1 text-sm text-mist-400">Leads, follow-ups, and site traffic.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="rounded-lg border border-ink-600 bg-ink-900 px-4 py-2 text-sm text-paper-50 hover:border-accent disabled:opacity-50"
            >
              {syncing ? "Syncing…" : "Sync Calendly now"}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-ink-600 px-4 py-2 text-sm text-mist-400 hover:text-paper-50"
            >
              Log out
            </button>
          </div>
        </div>

        {syncMessage && <p className="mt-3 text-sm text-mist-400">{syncMessage}</p>}

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Visits today" value={visitStats.pageViewsToday} />
          <Stat label="Visits (7d)" value={visitStats.pageViews7d} />
          <Stat label="Visits (30d)" value={visitStats.pageViews30d} />
          <Stat label="Unique visitors (7d)" value={visitStats.uniqueVisitors7d} />
          <Stat label="Total leads" value={leads.length} />
          <Stat label="Upcoming calls" value={upcomingCalls} />
        </div>

        <div className="mt-10">
          <p className="text-lg font-semibold">Leads</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-ink-700">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-ink-700 bg-ink-900/60 text-xs uppercase tracking-wider text-mist-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Call time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Follow-ups</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-mist-500">
                      No leads yet.
                    </td>
                  </tr>
                )}
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-ink-800 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-paper-50">{lead.name || "—"}</p>
                      {lead.business && <p className="text-xs text-mist-500">{lead.business}</p>}
                    </td>
                    <td className="px-4 py-3 text-mist-400">
                      <p>{lead.email}</p>
                      {lead.phone && <p className="text-xs">{lead.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-mist-400">
                      {lead.source === "calendly" ? "Calendly" : "Contact form"}
                    </td>
                    <td className="px-4 py-3 text-mist-400">
                      {lead.call_scheduled_at
                        ? new Date(lead.call_scheduled_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                        className="rounded-md border border-ink-600 bg-ink-950 px-2 py-1 text-xs text-paper-50"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {lead.source !== "calendly" ? (
                        <span className="text-xs text-mist-500">Not applicable</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {followUpSequence.map((step) => {
                            const sent = sentStepsByLead.get(lead.id)?.has(step.step);
                            const due = !sent && isStepDue(step, lead, now);
                            const key = `${lead.id}-${step.step}`;
                            return (
                              <div key={step.step} className="flex items-center gap-2 text-xs">
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    sent ? "bg-signal-on" : due ? "bg-accent" : "bg-ink-600",
                                  )}
                                />
                                <span className={sent ? "text-mist-400" : "text-mist-500"}>
                                  {step.label}
                                </span>
                                {!sent && (
                                  <button
                                    onClick={() => handleSendNow(lead, step.step)}
                                    disabled={busyKey === key}
                                    className="text-accent hover:underline disabled:opacity-50"
                                  >
                                    {busyKey === key ? "Sending…" : "Send now"}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-lg font-semibold">Recent site visits</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-ink-700">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-ink-700 bg-ink-900/60 text-xs uppercase tracking-wider text-mist-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentViews.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-mist-500">
                      No visits logged yet.
                    </td>
                  </tr>
                )}
                {recentViews.map((view) => (
                  <tr key={view.id} className="border-b border-ink-800">
                    <td className="px-4 py-3 text-mist-400">
                      {new Date(view.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-paper-50">{view.path}</td>
                    <td className="px-4 py-3 text-mist-500">{view.referrer || "Direct"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/40 p-4">
      <p className="text-[11px] uppercase tracking-wider text-mist-500">{label}</p>
      <p className="mt-1.5 text-xl font-semibold text-paper-50">{value}</p>
    </div>
  );
}
