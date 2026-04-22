"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/instant/db";

export function MagicLinkForm() {
  const router = useRouter();
  const [weddingCode, setWeddingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!weddingCode.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: weddingCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(
          data.error ||
            "Invalid code. Please check your invitation and try again.",
        );
      }
      await db.auth.signInWithToken(data.token);
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Your code"
        value={weddingCode}
        onChange={(e) => setWeddingCode(e.target.value.toUpperCase())}
        required
        maxLength={20}
        className="w-full rounded px-4 py-3 text-center tracking-wider outline-none transition-colors uppercase"
        style={{
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border-gold)",
          color: "var(--color-text)",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.15em",
        }}
      />

      {error && (
        <p
          className="text-sm text-center"
          style={{ color: "var(--color-red-hover)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !weddingCode.trim()}
        className="w-full rounded px-6 py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-red)",
          color: "var(--color-text)",
        }}
      >
        {isSubmitting ? "Signing in…" : "Enter"}
      </button>
    </form>
  );
}
