"use client";

import { useMemo } from "react";
import Link from "next/link";
import { db } from "@/lib/instant/db";
import { useLotusBackground } from "@/lib/useLotusBackground";
import { HIDDEN_EVENT_IDS } from "@/lib/schedule/hiddenEvents";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { AdminEvent, AdminGuest } from "@/components/admin/shared";

const DAY_ORDER = ["thursday", "friday", "saturday", "sunday"];

export default function AdminPage() {
  const { user } = db.useAuth();
  const lotusBg = useLotusBackground();

  const { isLoading: meLoading, data: meData } = db.useQuery(
    user ? { guests: { $: { where: { email: user.email! } } } } : null,
  );
  const me = meData?.guests?.[0];
  const isAdmin = Boolean(me?.isAdmin);

  const { isLoading: dataLoading, data } = db.useQuery(
    isAdmin
      ? {
          guests: { invitees: { attendingEvents: {} }, invitedEvents: {} },
          scheduleEvents: {},
        }
      : null,
  );

  const events = useMemo(() => {
    const list = (data?.scheduleEvents ?? []).filter(
      (e) => !HIDDEN_EVENT_IDS.has(e.id) && !e.informational,
    );
    return [...list].sort((a, b) => {
      const da = DAY_ORDER.indexOf(a.day ?? "");
      const db2 = DAY_ORDER.indexOf(b.day ?? "");
      if (da !== db2) return da - db2;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }) as AdminEvent[];
  }, [data]);

  const guests = useMemo(
    () =>
      (data?.guests ?? []).map((g) => ({
        ...g,
        invitees: [...(g.invitees ?? [])].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        ),
      })) as AdminGuest[],
    [data],
  );

  const heroBackground = lotusBg
    ? [
        "linear-gradient(to bottom, rgba(8,28,22,0.55) 0%, rgba(8,28,22,0.55) 75%, rgba(8,28,22,0.85) 100%)",
        `url('${lotusBg}')`,
      ].join(", ")
    : "linear-gradient(to bottom, rgba(8,28,22,1) 0%, rgba(8,28,22,1) 100%)";

  if (meLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-solid"
          style={{
            borderColor: "var(--color-gold-dim)",
            borderTopColor: "var(--color-gold)",
          }}
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="w-full max-w-md rounded-lg px-8 py-10 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border-gold)",
          }}
        >
          <p
            className="t-label mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Meghana &amp; Rajit
          </p>
          <h1
            className="t-sub mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            This area is private.
          </h1>
          <p className="t-body mb-6" style={{ color: "var(--color-text-dim)" }}>
            Only the couple&apos;s households can view the RSVP dashboard.
          </p>
          <Link
            href="/"
            className="t-label inline-block rounded px-6 py-3"
            style={{
              backgroundColor: "var(--color-gold)",
              color: "var(--color-bg)",
            }}
          >
            Back to the wedding
          </Link>
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-solid"
          style={{
            borderColor: "var(--color-gold-dim)",
            borderTopColor: "var(--color-gold)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full pb-24"
      style={{
        backgroundImage: heroBackground,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-4xl px-5 pt-24 sm:pt-32">
        <header className="mb-12 text-center">
          <p
            className="mb-3 text-xs tracking-[0.3em] uppercase font-medium"
            style={{
              color: "rgba(255,255,255,0.75)",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            November 27–29, 2026 · Boston
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}
          >
            Admin
          </h1>
          <div
            className="mx-auto mt-5 h-px w-24"
            style={{ backgroundColor: "var(--color-gold-dim)", opacity: 0.6 }}
          />
          <p
            className="mt-5 text-sm"
            style={{
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            }}
          >
            RSVP overview for Meghana &amp; Rajit
          </p>
          <button
            type="button"
            onClick={() => {
              document
                .getElementById("guest-view")
                ?.scrollIntoView({ behavior: "smooth" });
              window.setTimeout(() => {
                document.getElementById("guest-search")?.focus();
              }, 500);
            }}
            className="mt-6 inline-block w-full rounded px-6 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80 cursor-pointer sm:w-auto"
            style={{
              backgroundColor: "var(--color-gold)",
              color: "var(--color-bg)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            Search all guests
          </button>
        </header>
      </div>

      <div className="mx-auto max-w-4xl px-5">
        <AdminDashboard events={events} guests={guests} />
      </div>
    </div>
  );
}
