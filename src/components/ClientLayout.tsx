"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlobalAuthGate } from "@/components/auth/GlobalAuthGate";
import { db } from "@/lib/instant/db";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mode = window.localStorage.getItem("surface-mode");
    if (mode) document.documentElement.dataset.surface = mode;
  }, []);

  const { isLoading, user } = db.useAuth();

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
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

  if (!user) {
    return <GlobalAuthGate />;
  }

  return (
    <>
      <Navigation />
      <div className="flex flex-col flex-1">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
