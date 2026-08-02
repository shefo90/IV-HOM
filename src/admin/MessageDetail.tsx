/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { api, ApiError, type SubmissionDetail } from "./api";

const FIELD_LABELS: Record<string, string> = {
  company: "Company",
  interest: "Interested in",
  message: "Message",
  project_type: "Project category",
  size: "Approximate size",
  timeframe: "Timeframe",
  details: "Details",
  tour_date: "Preferred date",
  tour_time: "Time slot",
};

/** The modal labels this field "PHONE / WHATSAPP", so the link is worth having. */
function whatsappHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

interface MessageDetailProps {
  id: number;
  onChanged: () => void;
  onClose: () => void;
}

export default function MessageDetail({ id, onChanged, onClose }: MessageDetailProps) {
  const [item, setItem] = useState<SubmissionDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItem(null);
    api
      .getSubmission(id)
      // Opening marks it read server-side, so the unread badge must refresh.
      .then((detail) => {
        setItem(detail);
        onChanged();
      })
      .catch((e: ApiError) => setError(e.message));
    // onChanged is stable enough here; re-running on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const act = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      onChanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Action failed");
    }
  };

  if (error) return <p className="font-sans text-xs text-red-400">{error}</p>;
  if (!item) return <p className="font-sans text-xs text-gray-500">Loading…</p>;

  const wa = whatsappHref(item.phone);

  return (
    <div className="border border-brand-border-dark bg-brand-card-dark/40 p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-brand-light">{item.name}</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-brand-accent mt-1">
            {item.kind} · {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:text-brand-light"
        >
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${item.email}`}
          className="border border-brand-accent text-brand-light font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:bg-brand-accent hover:text-brand-dark transition-colors"
        >
          Email {item.email}
        </a>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="border border-brand-border-dark text-gray-300 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:text-brand-light hover:border-brand-accent transition-colors"
          >
            WhatsApp {item.phone}
          </a>
        )}
      </div>

      <dl className="space-y-3">
        {Object.entries(item.payload)
          .filter(([, value]) => value)
          .map(([key, value]) => (
            <div key={key}>
              <dt className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
                {FIELD_LABELS[key] ?? key}
              </dt>
              <dd className="font-sans text-sm text-brand-light whitespace-pre-wrap">{value}</dd>
            </div>
          ))}
      </dl>

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-brand-border-dark">
        {item.status !== "handled" && (
          <button
            type="button"
            onClick={() => act(() => api.setSubmissionStatus(item.id, "handled"))}
            className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-[10px] uppercase tracking-widest px-4 py-2 transition-colors"
          >
            Mark handled
          </button>
        )}
        <button
          type="button"
          onClick={() => act(() => api.setSubmissionStatus(item.id, "unread"))}
          className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light transition-colors"
        >
          Mark unread
        </button>

        {item.deletedAt ? (
          <button
            type="button"
            onClick={() => act(() => api.restoreSubmission(item.id))}
            className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light transition-colors"
          >
            Restore
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              act(async () => {
                await api.deleteSubmission(item.id);
                onClose();
              })
            }
            className="border border-brand-border-dark text-gray-500 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-red-400 hover:border-red-400/50 transition-colors"
          >
            Delete
          </button>
        )}
        {/* Deletion is soft: it moves to Trash for 30 days, so a mis-click
            cannot lose a real enquiry. */}
        <span className="font-sans text-[10px] text-gray-600">
          Deleted messages stay in Trash for 30 days.
        </span>
      </div>
    </div>
  );
}
