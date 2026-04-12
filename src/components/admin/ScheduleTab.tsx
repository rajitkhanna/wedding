"use client";

import { db } from "@/lib/instant/db";

export function ScheduleTab() {
  const { isLoading, data } = db.useQuery({ scheduleEvents: {} });
  const events = data?.scheduleEvents ?? [];

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
      <h2
        className="text-3xl mb-8"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-gold)",
          fontWeight: 400,
        }}
      >
        Schedule
      </h2>
      {events.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>No events scheduled.</p>
      ) : (
        <div className="space-y-4">
          {events.map(
            (event: { id: string; title?: string; time?: number }) => (
              <div
                key={event.id}
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-gold)",
                }}
              >
                <p style={{ color: "var(--color-text)" }}>
                  {event.title ?? "Event"}
                </p>
                {event.time && (
                  <p style={{ color: "var(--color-text-muted)" }}>
                    {new Date(event.time).toLocaleString()}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
