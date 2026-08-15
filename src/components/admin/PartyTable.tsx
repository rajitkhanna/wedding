"use client";

import { useState } from "react";
import { AdminEvent, StatusBadge } from "./shared";

export type PartyRow = {
  id: string;
  party: string;
  side?: string;
  code?: string;
  contactEmail?: string;
  rsvpStatus?: string;
  members: { id: string; name: string; attendingEvents?: AdminEvent[] }[];
};

function EventChip({ event }: { event: AdminEvent }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap"
      style={{
        backgroundColor: "var(--color-gold-light)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      {event.title}
    </span>
  );
}

function sortEvents(
  attending: AdminEvent[] | undefined,
  eventOrder?: AdminEvent[],
) {
  if (!attending?.length) return [];
  return [...attending].sort(
    (a, b) => (eventOrder?.indexOf(a) ?? 0) - (eventOrder?.indexOf(b) ?? 0),
  );
}

export function PartyTable({
  rows,
  eventOrder,
  showEventBadges = true,
}: {
  rows: PartyRow[];
  eventOrder?: AdminEvent[];
  showEventBadges?: boolean;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = async (id: string, code?: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore clipboard permission errors
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500);
  };

  if (rows.length === 0) {
    return (
      <div className="px-6 pb-5">
        <p className="t-fine">No RSVPs yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-3 px-4 pb-5 md:hidden sm:px-6">
        {rows.map((p) => (
          <div
            key={p.id}
            className="rounded-lg px-4 py-3.5"
            style={{
              backgroundColor: "var(--color-surface-alt)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className="flex items-center justify-end"
              style={{ minHeight: "2rem" }}
            >
              <StatusBadge rsvpd={Boolean(p.rsvpStatus)} />
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {p.members.map((m) => (
                <div key={m.id} className="flex flex-col gap-1">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    {m.name}
                  </span>
                  {showEventBadges &&
                    (sortEvents(m.attendingEvents, eventOrder).length ? (
                      <span className="flex flex-wrap gap-1.5">
                        {sortEvents(m.attendingEvents, eventOrder).map((e) => (
                          <EventChip key={e.id} event={e} />
                        ))}
                      </span>
                    ) : (
                      <span className="t-fine">—</span>
                    ))}
                </div>
              ))}
            </div>
            {p.code ? (
              <div className="mt-3 flex items-center justify-between">
                <span className="t-fine">Code</span>
                <button
                  type="button"
                  onClick={() => copyCode(p.id, p.code)}
                  title="Click to copy code"
                  className="inline-flex min-h-[44px] items-center text-sm tracking-wide cursor-pointer transition-colors"
                  style={{
                    color: "var(--color-gold-dim)",
                    textDecoration: "underline dotted",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {p.code}
                  {copiedId === p.id ? (
                    <span className="ml-1.5" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-alt)",
              }}
            >
              {[
                { h: "Members", w: "64%" },
                { h: "Code", w: "20%" },
                { h: "RSVP", w: "16%" },
              ].map(({ h, w }) => (
                <th
                  key={h}
                  className="t-label px-6 py-3"
                  style={{ color: "var(--color-text-muted)", width: w }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <td className="px-6 py-3.5">
                  <div className="flex flex-col gap-2.5">
                    {p.members.map((m) => {
                      const attending = sortEvents(
                        m.attendingEvents,
                        eventOrder,
                      );
                      return (
                        <div key={m.id} className="flex flex-col gap-1">
                          <span
                            className="text-sm"
                            style={{ color: "var(--color-text)" }}
                          >
                            {m.name}
                          </span>
                          {showEventBadges &&
                            (attending.length ? (
                              <span className="flex flex-wrap gap-1.5">
                                {attending.map((e) => (
                                  <EventChip key={e.id} event={e} />
                                ))}
                              </span>
                            ) : (
                              <span className="t-fine">—</span>
                            ))}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  {p.code ? (
                    <button
                      type="button"
                      onClick={() => copyCode(p.id, p.code)}
                      title="Click to copy code"
                      className="text-sm tracking-wide cursor-pointer transition-colors"
                      style={{
                        color: "var(--color-gold-dim)",
                        textDecoration: "underline dotted",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {p.code}
                      {copiedId === p.id ? (
                        <span className="ml-1.5" aria-hidden>
                          ✓
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    <span className="t-fine">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge rsvpd={Boolean(p.rsvpStatus)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
