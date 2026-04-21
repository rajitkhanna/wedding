"use client";

import { useState } from "react";
import { id } from "@instantdb/react";
import { db } from "@/lib/instant/db";

interface Invitee {
  id: string;
  name: string;
  sortOrder: number;
  attendingEventIds?: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  day: string;
  startTime: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus?: string;
  rsvpSubmittedAt?: number;
  invitees: Invitee[];
  invitedEvents: ScheduleEvent[];
}

export function RSVPTab() {
  const { isLoading, data } = db.useQuery({ guests: { invitees: {}, invitedEvents: {} } });
  const { data: eventsData } = db.useQuery({ scheduleEvents: {} });

  const guests: Guest[] = (data?.guests ?? []).map((g) => ({
    id: g.id,
    name: g.name as string,
    email: g.email as string,
    rsvpStatus: g.rsvpStatus as string | undefined,
    rsvpSubmittedAt: g.rsvpSubmittedAt as number | undefined,
    invitees: ((g.invitees ?? []) as Invitee[]).sort((a, b) => a.sortOrder - b.sortOrder),
    invitedEvents: (g.invitedEvents ?? []) as ScheduleEvent[],
  }));

  const allEvents: ScheduleEvent[] = (eventsData?.scheduleEvents ?? [])
    .map((e) => ({
      id: e.id,
      title: e.title as string,
      day: e.day as string,
      startTime: e.startTime as string,
    }))
    .sort((a, b) => {
      const dayOrder = { friday: 0, saturday: 1, sunday: 2 };
      return (dayOrder[a.day as keyof typeof dayOrder] ?? 3) - (dayOrder[b.day as keyof typeof dayOrder] ?? 3);
    });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const attending = guests.filter((g) => g.rsvpStatus === "attending");
  const declined = guests.filter((g) => g.rsvpStatus === "not-attending");
  const noResponse = guests.filter((g) => !g.rsvpStatus);

  const totalAttending = attending.reduce((sum, g) => sum + (g.invitees.length || 1), 0);

  async function addInvitee(guest: Guest) {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    try {
      const newId = id();
      await db.transact(
        db.tx.invitees[newId]
          .update({ name, sortOrder: guest.invitees.length })
          .link({ guest: guest.id }),
      );
      setNewName("");
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  async function removeInvitee(inviteeId: string) {
    setSaving(true);
    try {
      await db.transact(db.tx.invitees[inviteeId].delete());
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  async function toggleEvent(guest: Guest, eventId: string, linked: boolean) {
    try {
      if (linked) {
        await db.transact(db.tx.guests[guest.id].unlink({ invitedEvents: eventId }));
      } else {
        await db.transact(db.tx.guests[guest.id].link({ invitedEvents: eventId }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Party Members", "RSVP Status", "Submitted At"];
    const rows = guests.map((g) => [
      g.name,
      g.email,
      g.invitees.map((i) => i.name).join(", ") || g.name,
      g.rsvpStatus ?? "No response",
      g.rsvpSubmittedAt ? new Date(g.rsvpSubmittedAt).toLocaleDateString() : "-",
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-3xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
        >
          RSVP Overview
        </h2>
        <button
          onClick={exportCSV}
          className="rounded px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--color-gold)", color: "var(--color-bg)" }}
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Attending (people)" value={totalAttending} color="var(--color-gold)" />
        <StatCard label="Declined (parties)" value={declined.length} color="var(--color-red)" />
        <StatCard label="No Response" value={noResponse.length} color="var(--color-text-muted)" />
      </div>

      <h3
        className="text-xl mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
      >
        Guest List ({guests.length} parties)
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--color-text-dim)" }}>
        Click a row to manage invitees and assigned events.
      </p>

      <div className="flex flex-col gap-2">
        {guests.map((guest) => {
          const isExpanded = expandedId === guest.id;
          const invitedEventIds = new Set(guest.invitedEvents.map((e) => e.id));

          return (
            <div
              key={guest.id}
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--color-border-gold)" }}
            >
              {/* Row */}
              <button
                type="button"
                className="w-full flex items-center gap-4 px-4 py-3 text-left transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--color-surface)" }}
                onClick={() => setExpandedId(isExpanded ? null : guest.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {guest.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                    {guest.email}
                  </p>
                </div>
                <div className="shrink-0 text-xs" style={{ color: "var(--color-text-dim)" }}>
                  {guest.invitees.length > 0
                    ? guest.invitees.map((i) => i.name).join(", ")
                    : "No invitees"}
                </div>
                <StatusBadge status={guest.rsvpStatus} />
                <span style={{ color: "var(--color-gold-dim)" }}>{isExpanded ? "▴" : "▾"}</span>
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div
                  className="px-4 pb-4 pt-3 flex flex-col gap-5"
                  style={{ backgroundColor: "var(--color-bg)", borderTop: "1px solid var(--color-border)" }}
                >
                  {/* Invitees */}
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--color-gold-dim)" }}>
                      Invitees (party members)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {guest.invitees.map((inv, idx) => (
                        <span
                          key={inv.id}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            border: "1px solid var(--color-border-gold)",
                            color: "var(--color-text)",
                          }}
                        >
                          {idx === 0 && (
                            <span style={{ color: "var(--color-gold-dim)", fontSize: "0.6rem" }}>★</span>
                          )}
                          {inv.name}
                          <button
                            type="button"
                            onClick={() => removeInvitee(inv.id)}
                            disabled={saving}
                            className="transition-opacity hover:opacity-60"
                            style={{ color: "var(--color-text-dim)" }}
                            aria-label={`Remove ${inv.name}`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Add invitee name…"
                        className="rsvp-input flex-1"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { e.preventDefault(); addInvitee(guest); }
                        }}
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => addInvitee(guest)}
                        disabled={saving || !newName.trim()}
                        className="rounded px-3 py-1 text-xs transition-opacity hover:opacity-80 disabled:opacity-40"
                        style={{ backgroundColor: "var(--color-gold)", color: "var(--color-bg)" }}
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>
                      ★ = party leader (signs in and RSVPs for the group)
                    </p>
                  </div>

                  {/* Invited events */}
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--color-gold-dim)" }}>
                      Invited to events
                    </p>
                    {allEvents.length === 0 ? (
                      <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>No events in database.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {allEvents.map((event) => {
                          const linked = invitedEventIds.has(event.id);
                          return (
                            <label
                              key={event.id}
                              className="flex items-center gap-2.5 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={linked}
                                onChange={() => toggleEvent(guest, event.id, linked)}
                                className="rsvp-checkbox"
                              />
                              <span className="rsvp-checkbox-custom" aria-hidden="true" />
                              <span className="text-xs" style={{ color: "var(--color-text)" }}>
                                <span style={{ color: "var(--color-text-dim)", marginRight: "0.35rem" }}>
                                  {event.day.charAt(0).toUpperCase() + event.day.slice(1)}
                                </span>
                                {event.title}
                                <span style={{ color: "var(--color-text-dim)", marginLeft: "0.35rem" }}>
                                  · {event.startTime}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-lg p-5"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border-gold)" }}
    >
      <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
      <p className="text-3xl" style={{ fontFamily: "var(--font-display)", color, fontWeight: 400 }}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const configs: Record<string, { label: string; color: string }> = {
    attending: { label: "Attending", color: "var(--color-gold)" },
    "not-attending": { label: "Declined", color: "var(--color-red)" },
  };
  const config = configs[status ?? ""];
  if (!config) return <span style={{ color: "var(--color-text-dim)" }}>Pending</span>;
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs"
      style={{
        backgroundColor: "var(--color-bg)",
        color: config.color,
        border: `1px solid ${config.color}`,
      }}
    >
      {config.label}
    </span>
  );
}
