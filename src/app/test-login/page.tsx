"use client";

// Test-only helper page that signs in with a token and redirects.
// Only rendered when NEXT_PUBLIC_ENABLE_TEST_LOGIN=true.

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/instant/db";

export default function TestLoginPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Signing in…");

  const enabled = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === "true";

  useEffect(() => {
    if (!enabled) {
      setStatus("Test login disabled.");
      return;
    }
    const token = params.get("token");
    const redirect = params.get("redirect") ?? "/schedule";
    if (!token) {
      setStatus("Missing token parameter.");
      return;
    }
    db.auth.signInWithToken(token)
      .then(() => {
        setStatus("Signed in. Redirecting…");
        router.replace(redirect);
      })
      .catch((err: unknown) => {
        setStatus(`Sign-in failed: ${err instanceof Error ? err.message : String(err)}`);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <p>{status}</p>
    </div>
  );
}
