"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Step = "rollNumber" | "login" | "claim";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("rollNumber");
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!rollNumber.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/account/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber }),
      });
      const data = await res.json();
      if (!data.found) {
        setError("That roll number isn't on the class roster. Double-check it, or ask your CR to add you.");
        setLoading(false);
        return;
      }
      setName(data.name);
      setStep(data.claimed ? "login" : "claim");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      rollNumber,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect password. Try again.");
      return;
    }
    window.location.href = "/";
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      const signInRes = await signIn("credentials", { rollNumber, password, redirect: false });
      setLoading(false);
      if (signInRes?.error) {
        setError("Account created, but login failed. Please try logging in.");
        setStep("login");
        return;
      }
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function reset() {
    setStep("rollNumber");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-50 px-4 py-10 dark:bg-stone-950">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-600 text-sm font-bold text-white dark:bg-accent-500">
            AU
          </span>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-white">MSCS Weekend · Fall 26</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Air University class portal</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {step === "rollNumber" && (
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                  Your roll number
                </label>
                <input
                  autoFocus
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. AU-MSCS-01"
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-accent-950/50"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                disabled={loading}
                className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white transition hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
              >
                {loading ? "Checking…" : "Continue"}
              </button>
            </form>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Welcome back, <span className="font-medium text-stone-900 dark:text-white">{name}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">Password</label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-accent-950/50"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                disabled={loading}
                className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white transition hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
              >
                {loading ? "Logging in…" : "Log in"}
              </button>
              <button type="button" onClick={reset} className="w-full text-center text-xs text-stone-400 hover:text-stone-600">
                Not you? Go back
              </button>
            </form>
          )}

          {step === "claim" && (
            <form onSubmit={handleClaim} className="space-y-4">
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Welcome, <span className="font-medium text-stone-900 dark:text-white">{name}</span> — first time
                here. Set a password to finish setting up your account.
              </p>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">New password</label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-accent-950/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:focus:ring-accent-950/50"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                disabled={loading}
                className="w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white transition hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
              >
                {loading ? "Setting up…" : "Create account & log in"}
              </button>
              <button type="button" onClick={reset} className="w-full text-center text-xs text-stone-400 hover:text-stone-600">
                Not you? Go back
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
