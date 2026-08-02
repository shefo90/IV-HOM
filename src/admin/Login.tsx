/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from "react";
import { api, ApiError, type Session } from "./api";

interface LoginProps {
  onSignedIn: (session: Session) => void;
}

export default function Login({ onSignedIn }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSignedIn(await api.login(email, password));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-brand-accent/60 flex items-center justify-center">
            <span className="font-serif text-sm tracking-widest text-brand-light font-bold">IV</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-brand-accent font-semibold">
            Content editor
          </span>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-accent mb-2">
              Email
            </span>
            <input
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-card-dark border border-brand-border-dark text-brand-light px-3 py-2.5 text-sm focus:border-brand-accent transition-colors"
            />
          </label>

          <label className="block">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-accent mb-2">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-card-dark border border-brand-border-dark text-brand-light px-3 py-2.5 text-sm focus:border-brand-accent transition-colors"
            />
          </label>
        </div>

        {error && <p className="font-sans text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-xs uppercase tracking-widest px-6 py-3 transition-colors disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
