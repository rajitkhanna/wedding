"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { VisitorPill } from "@/components/presence/VisitorPill";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="pt-16 flex flex-col flex-1">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <VisitorPill />
    </>
  );
}
