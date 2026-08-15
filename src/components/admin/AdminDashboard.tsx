"use client";

import { useMemo, useState } from "react";
import { AdminEvent, AdminGuest } from "./shared";
import { EventView } from "./EventView";
import { GuestView } from "./GuestView";

export function AdminDashboard({
  events,
  guests,
}: {
  events: AdminEvent[];
  guests: AdminGuest[];
}) {
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const total = guests.reduce((n, g) => n + g.invitees.length, 0);
    const rsvpd = guests
      .filter((g) => g.rsvpStatus)
      .reduce((n, g) => n + g.invitees.length, 0);
    const notYet = guests
      .filter((g) => !g.rsvpStatus)
      .reduce((n, g) => n + g.invitees.length, 0);
    const coming = guests
      .flatMap((g) => g.invitees)
      .filter((inv) => (inv.attendingEvents?.length ?? 0) > 0).length;
    return { total, rsvpd, notYet, coming };
  }, [guests]);

  const statCards = [
    { label: "Total people", value: stats.total },
    { label: "RSVP'd", value: stats.rsvpd },
    { label: "Not yet", value: stats.notYet },
    { label: "Coming", value: stats.coming },
  ];

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-lg px-5 py-6 text-center"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-gold)",
              }}
            >
              {s.value}
            </p>
            <p
              className="t-label mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <EventView events={events} guests={guests} />

      <GuestView
        events={events}
        guests={guests}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
