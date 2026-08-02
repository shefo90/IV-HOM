/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type SubmissionSummary } from "./api";
import MessageDetail from "./MessageDetail";

const KINDS = [
  { value: "", label: "All kinds" },
  { value: "contact", label: "Contact" },
  { value: "proposal", label: "Proposal" },
  { value: "tour", label: "Factory tour" },
];

const STATUSES = [
  { value: "", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "handled", label: "Handled" },
];

const SELECT =
  "bg-brand-card-dark border border-brand-border-dark text-brand-light px-2 py-1.5 font-mono text-[11px] focus:border-brand-accent";

interface MessagesProps {
  onUnreadChange: (count: number) => void;
}

export default function Messages({ onUnreadChange }: MessagesProps) {
  const [items, setItems] = useState<SubmissionSummary[]>([]);
  const [view, setView] = useState<"inbox" | "trash">("inbox");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { view };
      if (kind) params.kind = kind;
      if (status) params.status_filter = status;
      if (query.trim()) params.q = query.trim();

      const result = await api.listSubmissions(params);
      setItems(result.items);
      onUnreadChange(result.unread);
      setError("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [view, kind, status, query, onUnreadChange]);

  useEffect(() => {
    // Debounced so typing in the search box does not fire a request per key.
    const timer = setTimeout(refresh, 200);
    return () => clearTimeout(timer);
  }, [refresh]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-brand-light">Messages</h1>
        <a
          href="/api/admin/submissions/export.csv"
          className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light transition-colors"
        >
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex">
          {(["inbox", "trash"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setView(tab);
                setSelected(null);
              }}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                view === tab
                  ? "border-brand-accent text-brand-accent"
                  : "border-brand-border-dark text-gray-500 hover:text-brand-light"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select value={kind} onChange={(e) => setKind(e.target.value)} className={SELECT}>
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${SELECT} flex-1 min-w-[180px]`}
        />
      </div>

      {error && <p className="font-sans text-xs text-red-400">{error}</p>}

      {selected !== null && (
        <MessageDetail
          id={selected}
          onChanged={refresh}
          onClose={() => setSelected(null)}
        />
      )}

      {loading && items.length === 0 ? (
        <p className="font-sans text-xs text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-sans text-xs text-gray-500">
          {view === "trash" ? "Trash is empty." : "No messages yet."}
        </p>
      ) : (
        <ul className="border border-brand-border-dark divide-y divide-brand-border-dark">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelected(item.id)}
                className={`w-full text-left px-4 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 hover:bg-brand-card-dark transition-colors ${
                  selected === item.id ? "bg-brand-card-dark" : ""
                }`}
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent w-20 shrink-0">
                  {item.kind}
                </span>
                <span
                  className={`text-sm ${
                    item.status === "unread"
                      ? "text-brand-light font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
                <span className="font-sans text-xs text-gray-500 truncate">{item.email}</span>
                <span className="ml-auto font-mono text-[10px] text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
