"use client";

import { useMemo, useState } from "react";
import {
  AdminEvent,
  AdminGuest,
  Card,
  Divider,
  SearchInput,
  SectionTitle,
  Select,
} from "./shared";
import { PartyTable, PartyRow } from "./PartyTable";

export function GuestView({
  events,
  guests,
  query,
  onQueryChange,
}: {
  events: AdminEvent[];
  guests: AdminGuest[];
  query: string;
  onQueryChange: (q: string) => void;
}) {
  const [sideFilter, setSideFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const eventById = useMemo(() => {
    const map: Record<string, AdminEvent> = {};
    for (const ev of events) map[ev.id] = ev;
    return map;
  }, [events]);

  const partyRows: PartyRow[] = useMemo(
    () =>
      guests
        .map((g) => ({
          id: g.id,
          party: g.name,
          side: g.side,
          code: g.code,
          contactEmail: g.contactEmail,
          rsvpStatus: g.rsvpStatus,
          invitedEvents: (g.invitedEvents ?? [])
            .map((e) => eventById[e.id])
            .filter((e): e is AdminEvent => Boolean(e))
            .sort((a, b) => events.indexOf(a) - events.indexOf(b)),
          members: g.invitees.map((inv) => ({
            id: inv.id,
            name: inv.name,
            attendingEvents: (inv.attendingEvents ?? [])
              .map((a) => eventById[a.id])
              .filter((e): e is AdminEvent => Boolean(e))
              .sort((a, b) => events.indexOf(a) - events.indexOf(b)),
          })),
        }))
        .sort((a, b) => a.party.localeCompare(b.party)),
    [guests, events, eventById],
  );

  const filteredPartyRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partyRows.filter((p) => {
      if (
        q &&
        ![
          p.party,
          p.code,
          p.contactEmail,
          ...p.members.map((m) => m.name),
        ].some((v) => (v ?? "").toLowerCase().includes(q))
      )
        return false;
      if (sideFilter !== "all" && p.side !== sideFilter) return false;
      if (statusFilter === "rsvpd" && !p.rsvpStatus) return false;
      if (statusFilter === "notyet" && p.rsvpStatus) return false;
      return true;
    });
  }, [partyRows, query, sideFilter, statusFilter]);

  return (
    <section id="guest-view">
      <SectionTitle>Guest view</SectionTitle>
      <Card>
        <div className="px-6 py-5 flex flex-col gap-4">
          <SearchInput
            id="guest-search"
            value={query}
            onChange={onQueryChange}
            placeholder="Search by name, party, email, or code…"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
            >
              <option value="all">Any side</option>
              <option value="groom">Groom&apos;s side</option>
              <option value="bride">Bride&apos;s side</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Any RSVP status</option>
              <option value="rsvpd">RSVP&apos;d</option>
              <option value="notyet">Not yet</option>
            </Select>

            <span className="t-fine ml-auto">
              {filteredPartyRows.length} of {partyRows.length} parties
            </span>
          </div>
        </div>

        <Divider />

        {filteredPartyRows.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="t-fine">
              No guests match the current search and filters.
            </p>
          </div>
        ) : (
          <PartyTable rows={filteredPartyRows} eventOrder={events} />
        )}
      </Card>
    </section>
  );
}
