"use client";

import { useState } from "react";
import { RSVPTab } from "./RSVPTab";
import { ScheduleTab } from "./ScheduleTab";
import { PhotosTab } from "./PhotosTab";

type Tab = "rsvp" | "schedule" | "photos";

interface AdminShellProps {
  onSignOut: () => void;
}

export function AdminShell({ onSignOut }: AdminShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("rsvp");

  const tabs: { id: Tab; label: string }[] = [
    { id: "rsvp", label: "RSVP" },
    { id: "schedule", label: "Schedule" },
    { id: "photos", label: "Photos" },
  ];

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <aside
        className="w-56 flex-shrink-0 flex flex-col py-8 px-4"
        style={{
          backgroundColor: "var(--color-surface)",
          borderRight: "1px solid var(--color-border-gold)",
        }}
      >
        <h1
          className="text-2xl px-4 mb-8"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Admin
        </h1>

        <nav className="flex-1 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="w-full text-left px-4 py-3 rounded text-sm tracking-wide transition-all"
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "var(--color-surface-alt)"
                    : "transparent",
                color:
                  activeTab === tab.id
                    ? "var(--color-gold)"
                    : "var(--color-text-muted)",
                borderLeft:
                  activeTab === tab.id
                    ? "3px solid var(--color-gold)"
                    : "3px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onSignOut}
          className="mt-auto rounded px-4 py-2 text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
          style={{
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "rsvp" && <RSVPTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "photos" && <PhotosTab />}
      </main>
    </div>
  );
}
