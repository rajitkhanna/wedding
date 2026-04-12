"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";

export function HeroPresence() {
  const [joinedAt] = useState(() => Date.now());
  const room = db.room("wedding-visitors");
  const { peers } = db.rooms.usePresence(room, {
    initialPresence: { joinedAt, page: "home" },
  });

  const count = 1 + Object.keys(peers).length;

  if (count < 2) return null;

  return (
    <>
      <p
        className="text-sm tracking-widest animate-fade-in"
        style={{
          color: "var(--color-text-muted)",
          animation: "fadeIn 1s ease 0.5s both",
        }}
      >
        ✦ {count} people are here with you
      </p>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
