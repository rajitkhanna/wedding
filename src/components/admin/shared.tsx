export type AdminEvent = {
  id: string;
  title: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
  informational?: boolean;
};

export type AdminInvitee = {
  id: string;
  name: string;
  sortOrder?: number;
  attendingEvents?: Array<{ id: string }>;
};

export type AdminGuest = {
  id: string;
  name: string;
  email?: string;
  code?: string;
  rsvpStatus?: string;
  rsvpSubmittedAt?: number;
  contactEmail?: string;
  side?: string;
  isAdmin?: boolean;
  invitees: AdminInvitee[];
};

export type Attendee = {
  id: string;
  name: string;
  household: string;
  side?: string;
};

export function dayLabel(day?: string) {
  if (!day) return "";
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function StatusBadge({ rsvpd }: { rsvpd: boolean }) {
  return (
    <span
      className="inline-block rounded px-2.5 py-1 text-xs tracking-wider uppercase"
      style={{
        backgroundColor: rsvpd
          ? "var(--color-gold-light)"
          : "var(--color-surface-alt)",
        color: rsvpd ? "var(--color-text)" : "var(--color-text-dim)",
        border: "1px solid var(--color-border)",
      }}
    >
      {rsvpd ? "RSVP'd" : "Not yet"}
    </span>
  );
}

export function SideBadge({ side }: { side?: string }) {
  if (!side) return null;
  const isGroom = side === "groom";
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[0.65rem] tracking-wider uppercase whitespace-nowrap"
      style={{
        backgroundColor: isGroom
          ? "var(--color-overlay-medium)"
          : "var(--color-overlay-soft)",
        color: isGroom ? "var(--color-text-muted)" : "var(--color-gold-dim)",
        border: `1px solid ${
          isGroom ? "var(--color-border-gold)" : "var(--color-gold-dim)"
        }`,
      }}
    >
      {isGroom ? "Groom" : "Bride"}
    </span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="t-label mb-4" style={{ color: "var(--color-text-muted)" }}>
      {children}
    </p>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return (
    <div
      style={{
        height: "1px",
        margin: "0 1.5rem",
        backgroundColor: "var(--color-border)",
      }}
    />
  );
}

const chevron = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 4.5l3.5 3.5 3.5-3.5' fill='none' stroke='%237aaa90' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="rounded px-4 py-2.5 text-sm outline-none transition-colors cursor-pointer"
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border-gold)",
        color: "var(--color-text)",
        appearance: "none",
        backgroundImage: chevron,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "12px",
        paddingRight: "2.25rem",
      }}
    >
      {children}
    </select>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  id?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded px-4 py-2.5 text-sm outline-none transition-colors ${className}`}
      style={{
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border-gold)",
        color: "var(--color-text)",
      }}
    />
  );
}
