"use client";

import { db } from "@/lib/instant/db";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus?: string;
  mealPreference?: string;
  plusOneName?: string;
  rsvpSubmittedAt?: number;
}

export function RSVPTab() {
  const { isLoading, data } = db.useQuery({ guests: {} });
  const guests: Guest[] = data?.guests ?? [];

  const attending = guests.filter((g) => g.rsvpStatus === "attending");
  const declined = guests.filter((g) => g.rsvpStatus === "not-attending");
  const noResponse = guests.filter((g) => !g.rsvpStatus || g.rsvpStatus === "");

  const mealCounts = attending.reduce(
    (acc, g) => {
      const meal = g.mealPreference ?? "none";
      acc[meal] = (acc[meal] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalPlusOnes = attending.filter((g) => g.plusOneName).length;
  const totalAttending = attending.length + totalPlusOnes;

  function exportCSV() {
    const headers = [
      "Name",
      "Email",
      "RSVP Status",
      "Meal Preference",
      "Plus One",
      "Submitted At",
    ];
    const rows = guests.map((g) => [
      g.name,
      g.email,
      g.rsvpStatus ?? "No response",
      g.mealPreference ?? "-",
      g.plusOneName ?? "-",
      g.rsvpSubmittedAt
        ? new Date(g.rsvpSubmittedAt).toLocaleDateString()
        : "-",
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
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
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
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          RSVP Overview
        </h2>
        <button
          onClick={exportCSV}
          className="rounded px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "var(--color-gold)",
            color: "var(--color-bg)",
          }}
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Attending"
          value={totalAttending}
          color="var(--color-gold)"
        />
        <StatCard
          label="Declined"
          value={declined.length}
          color="var(--color-red)"
        />
        <StatCard
          label="No Response"
          value={noResponse.length}
          color="var(--color-text-muted)"
        />
      </div>

      <div className="mb-8">
        <h3
          className="text-xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Meal Breakdown
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(mealCounts).map(([meal, count]) => (
            <span
              key={meal}
              className="rounded-full px-4 py-2 text-sm"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-text)",
              }}
            >
              {MEAL_LABELS[meal] ?? meal}:{" "}
              <strong style={{ color: "var(--color-gold)" }}>{count}</strong>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3
          className="text-xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Guest List ({guests.length})
        </h3>
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--color-border-gold)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface)" }}>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--color-gold)" }}
                >
                  Name
                </th>
                <th
                  className="text-left p-3 font-medium hidden md:table-cell"
                  style={{ color: "var(--color-gold)" }}
                >
                  Email
                </th>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--color-gold)" }}
                >
                  RSVP
                </th>
                <th
                  className="text-left p-3 font-medium"
                  style={{ color: "var(--color-gold)" }}
                >
                  Meal
                </th>
                <th
                  className="text-left p-3 font-medium hidden lg:table-cell"
                  style={{ color: "var(--color-gold)" }}
                >
                  Plus One
                </th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, i) => (
                <tr
                  key={guest.id}
                  style={{
                    backgroundColor:
                      i % 2 === 0
                        ? "var(--color-surface)"
                        : "var(--color-surface-alt)",
                  }}
                >
                  <td className="p-3" style={{ color: "var(--color-text)" }}>
                    {guest.name}
                  </td>
                  <td
                    className="p-3 hidden md:table-cell"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {guest.email}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={guest.rsvpStatus} />
                  </td>
                  <td
                    className="p-3"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {guest.mealPreference
                      ? (MEAL_LABELS[guest.mealPreference] ??
                        guest.mealPreference)
                      : "-"}
                  </td>
                  <td
                    className="p-3 hidden lg:table-cell"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {guest.plusOneName ?? "-"}
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

const MEAL_LABELS: Record<string, string> = {
  veg: "Vegetarian",
  "non-veg": "Non-Veg",
  vegan: "Vegan",
  pescatarian: "Pescatarian",
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-gold)",
      }}
    >
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="text-3xl"
        style={{ fontFamily: "var(--font-display)", color, fontWeight: 400 }}
      >
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
  if (!config)
    return <span style={{ color: "var(--color-text-dim)" }}>Pending</span>;

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
