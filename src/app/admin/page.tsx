"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AdminShell = dynamic(
  () => import("@/components/admin/AdminShell").then((m) => m.AdminShell),
  { ssr: false, loading: () => null },
);

function LoginScreen({
  onLogin,
  error,
}: {
  onLogin: (password: string) => void;
  error: string;
}) {
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(password);
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mb-12 text-center">
        <h1
          className="text-5xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-gold)",
            fontWeight: 400,
          }}
        >
          Admin
        </h1>
        <div
          className="mx-auto mt-5 h-px w-24"
          style={{ backgroundColor: "var(--color-border-gold)" }}
        />
      </div>

      <div
        className="w-full max-w-sm rounded-lg px-8 py-10"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border-gold)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Enter admin password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-4 py-3 text-sm"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border-gold)",
                color: "var(--color-text)",
              }}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm" style={{ color: "var(--color-red)" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="mt-2 rounded px-6 py-3 text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--color-gold)",
              color: "var(--color-bg)",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored === ADMIN_PASSWORD) {
      setAuthenticated(true);
    }
    setInitialized(true);
  }, [ADMIN_PASSWORD]);

  if (!initialized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          className="text-sm tracking-widest uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <LoginScreen
        onLogin={(password) => {
          if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem("admin_token", password);
            setAuthenticated(true);
          } else {
            setLoginError("Incorrect password");
          }
        }}
        error={loginError}
      />
    );
  }

  function handleSignOut() {
    sessionStorage.removeItem("admin_token");
    setAuthenticated(false);
  }

  return <AdminShell onSignOut={handleSignOut} />;
}
