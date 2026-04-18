"use client";

import { useState } from "react";
import { lookup } from "@instantdb/react";
import { db } from "@/lib/instant/db";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus?: string;
  mealPreference?: string;
  partyMembers?: string;
  rsvpSubmittedAt?: number;
  scheduleGroup?: string;
}

const MEAL_LABELS: Record<string, string> = {
  veg: "Vegetarian",
  "non-veg": "Non-Veg",
  vegan: "Vegan",
  pescatarian: "Pescatarian",
};

export function RSVPTab() {
  const { isLoading, data } = db.useQuery({ guests: {} });
  const guests: Guest[] = data?.guests ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNames, setEditNames] = useState("");
  const [saving, setSaving] = useState(false);

  const attending = guests.filter((g) => g.rsvpStatus === "attending");
  const declined = guests.filter((g) => g.rsvpStatus === "not-attending");
  const noResponse = guests.filter((g) => !g.rsvpStatus || g.rsvpStatus === "");

  // Count total people across all party members
  function countPeople(guests: Guest[]) {
    return guests.reduce((sum, g) => {
      try {
        const members = g.partyMembers ? JSON.parse(g.partyMembers) : null;
        return sum + (Array.isArray(members) ? members.length : 1);
      } catch {
        return sum + 1;
      }
    }, 0);
  }

  const totalAttending = countPeople(attending);

  function getPartyNames(guest: Guest): string {
    try {
      const members = guest.partyMembers ? JSON.parse(guest.partyMembers) : null;
      if (!Array.isArray(members) || members.length === 0) return guest.name;
      return members.map((m: { name: string }) => m.name).join(", ");
    } catch {
      return guest.name;
    }
  }

  function startEdit(guest: Guest) {
    setEditingId(guest.id);
    setEditNames(getPartyNames(guest));
  }

  async function savePartyMembers(guest: Guest) {
    setSaving(true);
    const names = editNames
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) {
      setSaving(false);
      return;
    }
    // Merge new names with any existing RSVP data per member
    let existing: { name: string; eventIds?: string[]; meal?: string; dietary?: string }[] = [];
    try {
      existing = guest.partyMembers ? JSON.parse(guest.partyMembers) : [];
    } catch {
      existing = [];
    }
    const existingByName = Object.fromEntries(existing.map((m) => [m.name, m]));
    const updated = names.map((name) => {
      const { name: _n, ...rest } = existingByName[name] ?? {};
      return { name, ...rest };
    });
    try {
      await db.transact(
        db.tx.guests[lookup("email", guest.email)].merge({
          partyMembers: JSON.stringify(updated),
          partySize: updated.length,
        })
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Party Members", "RSVP Status", "Schedule Group", "Submitted At"];
    const rows = guests.map((g) => [
      g.name,
      g.email,
      getPartyNames(g),
      g.rsvpStatus ?? "No response",
      g.scheduleGroup ?? "-",
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

      <div>
        <h3
          className="text-xl mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 400 }}
        >
          Guest List ({guests.length} parties)
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-dim)" }}>
          Party Members — comma-separated names. The magic link holder RSVPs for everyone listed.
        </p>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border-gold)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface)" }}>
                <th className="text-left p-3 font-medium" style={{ color: "var(--color-gold)" }}>
                  Account Name
                </th>
                <th className="text-left p-3 font-medium hidden md:table-cell" style={{ color: "var(--color-gold)" }}>
                  Email
                </th>
                <th className="text-left p-3 font-medium" style={{ color: "var(--color-gold)" }}>
                  Party Members
                </th>
                <th className="text-left p-3 font-medium" style={{ color: "var(--color-gold)" }}>
                  RSVP
                </th>
                <th className="text-left p-3 font-medium hidden md:table-cell" style={{ color: "var(--color-gold)" }}>
                  Group
                </th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, i) => (
                <tr
                  key={guest.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface-alt)",
                  }}
                >
                  <td className="p-3" style={{ color: "var(--color-text)" }}>
                    {guest.name}
                  </td>
                  <td className="p-3 hidden md:table-cell" style={{ color: "var(--color-text-muted)" }}>
                    {guest.email}
                  </td>
                  <td className="p-3">
                    {editingId === guest.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editNames}
                          onChange={(e) => setEditNames(e.target.value)}
                          placeholder="Name1, Name2, …"
                          className="rsvp-input"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", minWidth: "180px" }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); savePartyMembers(guest); }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          disabled={saving}
                        />
                        <button
                          onClick={() => savePartyMembers(guest)}
                          disabled={saving}
                          className="text-xs px-2 py-1 rounded transition-opacity hover:opacity-70"
                          style={{ color: "var(--color-gold)", border: "1px solid var(--color-gold)" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs transition-opacity hover:opacity-70"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(guest)}
                        className="text-left transition-opacity hover:opacity-70 group"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        <span>{getPartyNames(guest)}</span>
                        <span
                          className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-gold)" }}
                        >
                          edit
                        </span>
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={guest.rsvpStatus} />
                  </td>
                  <td className="p-3 hidden md:table-cell" style={{ color: "var(--color-text-muted)" }}>
                    {guest.scheduleGroup ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
