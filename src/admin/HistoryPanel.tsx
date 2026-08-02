/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { api, ApiError, type Commit } from "./api";

/**
 * Every save is a git commit, so this is just `git log` for one page —
 * who changed it, when, and a one-click way back.
 *
 * Restoring writes a new commit rather than rewinding, so the restore itself
 * can be undone the same way.
 */
export default function HistoryPanel({
  slug,
  onRestored,
}: {
  slug: string;
  onRestored: () => void;
}) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    api
      .history(slug)
      .then(setCommits)
      .catch((e: ApiError) => setError(e.message));
  }, [slug]);

  const restore = async (sha: string) => {
    if (!window.confirm("Restore this version? The current text will be replaced.")) return;
    setBusy(sha);
    try {
      await api.restore(slug, sha);
      onRestored();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not restore");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="border border-brand-border-dark bg-brand-card-dark/40 p-4">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-brand-accent mb-3">
        Change history
      </h2>

      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
      {commits === null && !error && (
        <p className="font-sans text-xs text-gray-500">Loading…</p>
      )}

      <ul className="space-y-2">
        {(commits ?? []).map((commit, index) => (
          <li
            key={commit.sha}
            className="flex items-center justify-between gap-4 border-b border-brand-border-dark pb-2 last:border-0"
          >
            <div className="min-w-0">
              <p className="font-sans text-xs text-brand-light truncate">
                {commit.author}
                {index === 0 && <span className="text-brand-accent"> · current</span>}
              </p>
              <p className="font-mono text-[10px] text-gray-500">
                {new Date(commit.when).toLocaleString()} · {commit.sha.slice(0, 8)}
              </p>
            </div>

            {index > 0 && (
              <button
                type="button"
                disabled={busy === commit.sha}
                onClick={() => restore(commit.sha)}
                className="shrink-0 border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:text-brand-light hover:border-brand-accent transition-colors disabled:opacity-40"
              >
                {busy === commit.sha ? "Restoring…" : "Restore"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
