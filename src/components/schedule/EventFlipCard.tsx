"use client";

import Link from "next/link";
import { getEventInfo } from "./eventInfoData";

type EventShape = {
  id: string;
  title: string;
  day: string;
  startTime: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  dressCode?: string;
  description?: string;
  informational?: boolean;
  sortOrder: number;
};

export function EventFlipCard({
  event,
  names,
  isSingle,
}: {
  event: EventShape;
  names: string[];
  isSingle: boolean;
}) {
  const info = getEventInfo(event.title);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderLeft: `4px solid ${event.informational ? "var(--color-border-gold)" : "var(--color-gold)"}`,
      }}
    >
      <div className="flex flex-col gap-3 px-5 py-4">
        {/* Title */}
        <p
          className="leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-xl)",
            color: "var(--color-text)",
            fontWeight: 400,
          }}
        >
          {event.title}
        </p>

        {/* Meta stack: time → attire → location */}
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "var(--color-gold-dim)" }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {event.startTime}{event.endTime && <><span aria-hidden> –</span> {event.endTime}</>}
          </p>

          {event.description && (
            <div className="flex flex-col gap-0.5">
              {event.description.split("\\n").map((line, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {event.location && (
            <p className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <svg width="9" height="12" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, color: "var(--color-gold-dim)" }}>
                <path d="M6 0C3.79 0 2 1.79 2 4c0 3 4 8.5 4 8.5S10 7 10 4c0-2.21-1.79-4-4-4zm0 5.5C5.17 5.5 4.5 4.83 4.5 4S5.17 2.5 6 2.5 7.5 3.17 7.5 4 6.83 5.5 6 5.5z" fill="currentColor" />
              </svg>
              {event.locationUrl ? (
                <a href={event.locationUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-gold)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-muted)"; }}
                >
                  {event.location}
                </a>
              ) : event.location}
            </p>
          )}
        </div>

        {/* Attendee chips */}
        {!isSingle && names.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {names.map((name) => (
              <span
                key={name}
                className="rounded-full px-3 py-1 text-xs"
                style={{
                  backgroundColor: "var(--color-gold-dim)",
                  color: "var(--color-surface)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Learn more link */}
        {/* {info && ( */}
        {/*   <Link */}
        {/*     href={`/events/${info.slug}`} */}
        {/*     className="self-start inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-70" */}
        {/*     style={{ color: "var(--color-gold-dim)" }} */}
        {/*   > */}
        {/*     Guest guide */}
        {/*     <svg */}
        {/*       width="10" */}
        {/*       height="10" */}
        {/*       viewBox="0 0 24 24" */}
        {/*       fill="none" */}
        {/*       aria-hidden */}
        {/*     > */}
        {/*       <path */}
        {/*         d="M5 12h14M13 6l6 6-6 6" */}
        {/*         stroke="currentColor" */}
        {/*         strokeWidth="1.5" */}
        {/*         strokeLinecap="round" */}
        {/*         strokeLinejoin="round" */}
        {/*       /> */}
        {/*     </svg> */}
        {/*   </Link> */}
        {/* )} */}
      </div>
    </div>
  );
}
