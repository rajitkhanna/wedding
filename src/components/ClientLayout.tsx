"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlobalAuthGate } from "@/components/auth/GlobalAuthGate";
import { db } from "@/lib/instant/db";
import { usePathname } from "next/navigation";

const TEST_PATHS = ["/test-rsvp", "/test-login"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTestPath =
    process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === "true" &&
    TEST_PATHS.some((p) => pathname.startsWith(p));

  const { isLoading, user } = db.useAuth();

  if (!isTestPath && isLoading) {
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

  if (!isTestPath && !user) {
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
