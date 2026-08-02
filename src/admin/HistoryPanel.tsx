/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type Commit, type EraseResult } from "./api";

/**
 * Every save is a git commit, so this is just `git log` for one page —
 * who changed it, when, and a one-click way back.
 *
 * Restoring writes a new commit rather than rewinding, so the restore itself
 * can be undone the same way. Erasing is the opposite: it rewrites the branch
 * and the version is gone for good, which is why it is admin-only and why the
 * current and original versions have no erase button at all.
 */
export default function HistoryPanel({
  slug,
  isAdmin,
  onRestored,
}: {
  slug: string;
  isAdmin: boolean;
  onRestored: () => void;
}) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [busy, setBusy] = useState("");

  const reload = useCallback(async () => {
    setCommits(await api.history(slug));
  }, [slug]);

  useEffect(() => {
    reload().catch((e: ApiError) => setError(e.message));
  }, [reload]);

  const restore = async (sha: string) => {
    if (!window.confirm("Restore this version? The current text will be replaced.")) return;
    // Keyed by action as well as sha: a row's Restore and Erase buttons would
    // otherwise both light up for whichever one was clicked.
    setBusy(`restore:${sha}`);
    try {
      await api.restore(slug, sha);
      onRestored();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not restore");
    } finally {
      setBusy("");
    }
  };

  const erase = async (key: string, action: () => Promise<EraseResult>) => {
    setBusy(key);
    setError("");
    setWarning("");
    try {
      const result = await action();
      if (!result.backupUpdated) {
        setWarning(
          "Erased here, but the offsite backup could not be updated and still holds it.",
        );
      }
      // A rewrite renumbers every commit after the erased one, so every sha on
      // screen is now suspect. Refetch the list rather than splice it.
      await reload();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not erase");
    } finally {
      setBusy("");
    }
  };

  const eraseOne = (sha: string) => {
    if (!window.confirm("Permanently erase this version? It cannot be recovered.")) return;
    erase(`erase:${sha}`, () => api.eraseVersion(slug, sha));
  };

  const older = Math.max((commits?.length ?? 0) - 2, 0);

  const purge = () => {
    const versions = older === 1 ? "1 older version" : `${older} older versions`;
    if (
      !window.confirm(
        `Permanently erase ${versions} of this page? The current and original ` +
          `versions are kept. This cannot be undone.`,
      )
    )
      return;
    erase("purge", () => api.purgeHistory(slug));
  };

  return (
    <div className="border border-brand-border-dark bg-brand-card-dark/40 p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-brand-accent">
          Change history
        </h2>

        {isAdmin && older > 0 && (
          <button
            type="button"
            disabled={busy !== ""}
            onClick={purge}
            className="shrink-0 border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:text-red-300 hover:border-red-400/60 transition-colors disabled:opacity-40"
          >
            {busy === "purge" ? "Erasing…" : `Clear older · ${older}`}
          </button>
        )}
      </div>

      {error && <p className="font-sans text-xs text-red-400">{error}</p>}
      {warning && <p className="font-sans text-xs text-amber-400 mb-2">{warning}</p>}
      {commits === null && !error && (
        <p className="font-sans text-xs text-gray-500">Loading…</p>
      )}

      <ul className="space-y-2">
        {(commits ?? []).map((commit, index) => {
          const isCurrent = index === 0;
          // Both ends are pinned: the current version is the live page, and the
          // original is kept as a permanent floor.
          const isOriginal = index === (commits?.length ?? 0) - 1;

          return (
            <li
              key={commit.sha}
              className="flex items-center justify-between gap-4 border-b border-brand-border-dark pb-2 last:border-0"
            >
              <div className="min-w-0">
                <p className="font-sans text-xs text-brand-light truncate">
                  {commit.author}
                  {isCurrent && <span className="text-brand-accent"> · current</span>}
                  {isOriginal && !isCurrent && (
                    <span className="text-gray-600"> · original</span>
                  )}
                </p>
                <p className="font-mono text-[10px] text-gray-500">
                  {new Date(commit.when).toLocaleString()} · {commit.sha.slice(0, 8)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {!isCurrent && (
                  <button
                    type="button"
                    disabled={busy !== ""}
                    onClick={() => restore(commit.sha)}
                    className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:text-brand-light hover:border-brand-accent transition-colors disabled:opacity-40"
                  >
                    {busy === `restore:${commit.sha}` ? "Restoring…" : "Restore"}
                  </button>
                )}

                {isAdmin && !isCurrent && !isOriginal && (
                  <button
                    type="button"
                    title="Erase this version permanently"
                    aria-label="Erase this version permanently"
                    disabled={busy !== ""}
                    onClick={() => eraseOne(commit.sha)}
                    className="border border-brand-border-dark text-gray-500 font-mono text-[10px] leading-none px-2.5 py-2 hover:text-red-300 hover:border-red-400/60 transition-colors disabled:opacity-40"
                  >
                    {busy === `erase:${commit.sha}` ? "…" : "×"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
