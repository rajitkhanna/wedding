"use client";

import { useState } from "react";
import { db } from "@/lib/instant/db";

type Step = "email" | "code" | "done";

export function MagicLinkForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setSentTo(email.trim());
      setStep("code");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send code. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code: code.trim() });
      setStep("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid code. Please check your email and try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <p
        className="text-center text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        Signed in — loading your schedule…
      </p>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <p className="text-sm text-center" style={{ color: "var(--color-text-muted)" }}>
          We sent a 6-digit code to{" "}
          <span style={{ color: "var(--color-gold)" }}>{sentTo}</span>.
          Enter it below.
        </p>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={8}
          className="w-full rounded px-4 py-3 text-center text-lg tracking-[0.4em] outline-none transition-colors"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border-gold)",
            color: "var(--color-text)",
            fontFamily: "var(--font-display)",
          }}
          autoFocus
        />

        {error && (
          <p className="text-sm text-center" style={{ color: "var(--color-red-hover)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !code.trim()}
          className="w-full rounded px-6 py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-40"
          style={{
            backgroundColor: "var(--color-red)",
            color: "var(--color-text)",
          }}
        >
          {isSubmitting ? "Verifying…" : "Verify Code"}
        </button>

        <button
          type="button"
          onClick={() => { setStep("email"); setCode(""); setError(null); }}
          className="text-xs text-center underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--color-text-muted)" }}
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded px-4 py-3 outline-none transition-colors"
        style={{
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border-gold)",
          color: "var(--color-text)",
        }}
      />

      {error && (
        <p className="text-sm text-center" style={{ color: "var(--color-red-hover)" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className="w-full rounded px-6 py-3 text-sm tracking-widest uppercase transition-opacity disabled:opacity-40"
        style={{
          backgroundColor: "var(--color-red)",
          color: "var(--color-text)",
        }}
      >
        {isSubmitting ? "Sending…" : "Send Magic Link"}
      </button>
    </form>
  );
}
