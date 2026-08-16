"use client";

import { useMemo, useState } from "react";
import { DAY_DISPLAY_SHORT } from "@/lib/schedule/dateRange";
import {
  AdminEvent,
  AdminGuest,
  Card,
  SectionTitle,
  Select,
  dayLabel,
} from "./shared";
import { PartyRow, PartyTable } from "./PartyTable";

type EventFilter = { query: string; side: string };

function EventPartyTable({
  rows,
  events,
  query,
  side,
  onQueryChange,
  onSideChange,
}: {
  rows: PartyRow[];
  events: AdminEvent[];
  query: string;
  side: string;
  onQueryChange: (q: string) => void;
  onSideChange: (s: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((p) => {
      if (side !== "all" && p.side !== side) return false;
      if (
        q &&
        ![p.party, p.code, ...p.members.map((m) => m.name)].some((v) =>
          (v ?? "").toLowerCase().includes(q),
        )
      )
        return false;
      return true;
    });
  }, [query, side, rows]);

  return (
    <div className="px-6 pb-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search party or guest…"
          className="w-full sm:flex-1 rounded px-4 py-2.5 text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border-gold)",
            color: "var(--color-text)",
          }}
        />
        <Select value={side} onChange={(e) => onSideChange(e.target.value)}>
          <option value="all">Any side</option>
          <option value="groom">Groom</option>
          <option value="bride">Bride</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="t-fine mt-4">
          {query.trim()
            ? `No matches for “${query}”.`
            : side !== "all"
              ? "No parties match this side."
              : "No parties coming yet."}
        </p>
      ) : (
        <div className="mt-4">
          <PartyTable
            rows={filtered}
            eventOrder={events}
            showEventBadges={false}
          />
        </div>
      )}
    </div>
  );
}

export function EventView({
  events,
  guests,
}: {
  events: AdminEvent[];
  guests: AdminGuest[];
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, EventFilter>>({});

  const eventPartyRows = useMemo(() => {
    const map: Record<string, PartyRow[]> = {};
    for (const ev of events) map[ev.id] = [];
    for (const g of guests) {
      for (const inv of g.invitees) {
        for (const att of inv.attendingEvents ?? []) {
          const bucket = map[att.id];
          if (!bucket) continue;
          let row = bucket.find((r) => r.id === g.id);
          if (!row) {
            row = {
              id: g.id,
              party: g.name,
              side: g.side,
              code: g.code,
              rsvpStatus: g.rsvpStatus,
              rsvpSubmittedAt: g.rsvpSubmittedAt,
              members: [],
            };
            bucket.push(row);
          }
          if (!row.members.some((m) => m.id === inv.id)) {
            row.members.push({ id: inv.id, name: inv.name });
          }
        }
      }
    }
    for (const id of Object.keys(map)) {
      map[id].sort(
        (a, b) =>
          (b.rsvpSubmittedAt ?? 0) - (a.rsvpSubmittedAt ?? 0) ||
          a.party.localeCompare(b.party),
      );
    }
    return map;
  }, [guests, events]);

  const filteredRows = useMemo(() => {
    const m: Record<string, PartyRow[]> = {};
    for (const id of Object.keys(eventPartyRows)) {
      const f = filters[id] ?? { query: "", side: "all" };
      const q = f.query.trim().toLowerCase();
      m[id] = eventPartyRows[id].filter((p) => {
        if (f.side !== "all" && p.side !== f.side) return false;
        if (
          q &&
          ![p.party, p.code, ...p.members.map((m) => m.name)].some((v) =>
            (v ?? "").toLowerCase().includes(q),
          )
        )
          return false;
        return true;
      });
    }
    return m;
  }, [eventPartyRows, filters]);

  const updateFilter = (id: string, patch: Partial<EventFilter>) =>
    setFilters((f) => ({
      ...f,
      [id]: { ...(f[id] ?? { query: "", side: "all" }), ...patch },
    }));

  return (
    <section>
      <SectionTitle>Event view</SectionTitle>
      <div className="flex flex-col gap-4">
        {events.map((ev) => {
          const rows = eventPartyRows[ev.id] ?? [];
          const matched = filteredRows[ev.id] ?? [];
          const people = rows.reduce((n, r) => n + r.members.length, 0);
          const matchedPeople = matched.reduce(
            (n, r) => n + r.members.length,
            0,
          );
          const filter = filters[ev.id] ?? { query: "", side: "all" };
          const filterActive =
            filter.query.trim() !== "" || filter.side !== "all";
          const isExpanded = Boolean(expanded[ev.id]);
          return (
            <Card key={ev.id}>
              <button
                type="button"
                onClick={() =>
                  setExpanded((e) => ({ ...e, [ev.id]: !e[ev.id] }))
                }
                className="w-full text-left cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="px-6 pt-5 pb-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0">
                      <p
                        className="text-xs tracking-[0.2em] uppercase"
                        style={{ color: "var(--color-gold-dim)" }}
                      >
                        {dayLabel(ev.day)}
                        {DAY_DISPLAY_SHORT[ev.day?.toLowerCase() ?? ""]
                          ? ` ${DAY_DISPLAY_SHORT[ev.day!.toLowerCase()]}`
                          : ""}
                      </p>
                      <h3
                        className="mt-1 leading-snug"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-xl)",
                          color: "var(--color-text)",
                          fontWeight: 400,
                        }}
                      >
                        {ev.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:shrink-0">
                      <div>
                        <p
                          className="text-2xl"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-gold)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {filterActive
                            ? `${matchedPeople} of ${people}`
                            : people}
                        </p>
                        <p className="t-fine">
                          {filterActive
                            ? people === 1
                              ? "person"
                              : "people"
                            : people === 1
                              ? "person"
                              : "people"}
                        </p>
                      </div>
                      <span
                        className="rounded-full px-3 py-1.5 text-xs"
                        style={{
                          border: "1px solid var(--color-border-gold)",
                          color: "var(--color-text-muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          whiteSpace: "nowrap",
                          minWidth: "7rem",
                        }}
                      >
                        {isExpanded ? "Hide guests" : "See guests"}
                        <span
                          style={{
                            transform: isExpanded
                              ? "rotate(0deg)"
                              : "rotate(-90deg)",
                            transition: "transform 200ms ease",
                            display: "inline-block",
                          }}
                        >
                          ▾
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <EventPartyTable
                  rows={rows}
                  events={events}
                  query={filter.query}
                  side={filter.side}
                  onQueryChange={(q) => updateFilter(ev.id, { query: q })}
                  onSideChange={(s) => updateFilter(ev.id, { side: s })}
                />
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
