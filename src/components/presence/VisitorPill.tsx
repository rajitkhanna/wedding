"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";

export function VisitorPill() {
  const [joinedAt] = useState(() => Date.now());
  const room = db.room("wedding-visitors");
  const { peers } = db.rooms.usePresence(room, {
    initialPresence: { joinedAt },
  });

  const count = 1 + Object.keys(peers).length;

  if (count < 2) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm opacity-0"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-gold)",
        color: "var(--color-text-muted)",
        animation: "fadeIn 0.5s ease 1s forwards",
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: "var(--color-gold)",
          animation: "pulse 2s infinite",
        }}
      />
      <span style={{ color: "var(--color-gold)", fontWeight: 500 }}>
        {count}
      </span>
      <span>people here</span>

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
