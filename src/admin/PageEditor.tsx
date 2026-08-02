/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type DocumentSchema } from "./api";
import FieldList from "./FieldRenderer";
import HistoryPanel from "./HistoryPanel";
import MediaLibrary from "./MediaLibrary";

type Doc = Record<string, unknown>;

/** "subhero.heading: required" -> { "subhero.heading": "required" } */
function indexErrors(messages: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const message of messages) {
    const at = message.indexOf(": ");
    if (at > 0) map[message.slice(0, at)] = message.slice(at + 2);
  }
  return map;
}

interface PageEditorProps {
  schema: DocumentSchema;
}

export default function PageEditor({ schema }: PageEditorProps) {
  const [saved, setSaved] = useState<Doc | null>(null);
  const [draft, setDraft] = useState<Doc | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [picker, setPicker] = useState<{ current: string; apply: (url: string) => void } | null>(
    null,
  );

  const load = useCallback(async () => {
    const page = await api.getPage(schema.slug);
    setSaved(page);
    setDraft(page);
    setErrors({});
    setNotice("");
  }, [schema.slug]);

  useEffect(() => {
    load().catch((e: ApiError) => setNotice(e.message));
  }, [load]);

  const dirty = draft !== null && JSON.stringify(draft) !== JSON.stringify(saved);

  // A half-finished edit is easy to lose by clicking away; the browser prompt
  // is the only reliable guard against it.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setErrors({});
    setNotice("");
    try {
      const result = await api.putPage(schema.slug, draft);
      setSaved(draft);
      setNotice(result.changed ? "Saved and published." : "No changes to save.");
    } catch (e) {
      if (e instanceof ApiError && e.errors.length) {
        setErrors(indexErrors(e.errors));
        setNotice(`${e.errors.length} field(s) need attention.`);
      } else {
        setNotice(e instanceof ApiError ? e.message : "Could not save.");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!draft) {
    return <p className="font-sans text-xs text-gray-500">{notice || "Loading…"}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 sticky top-0 bg-brand-dark py-3 z-20 border-b border-brand-border-dark">
        <div>
          <h1 className="font-serif text-2xl text-brand-light">{schema.label}</h1>
          {notice && (
            <p
              className={`mt-1 font-sans text-xs ${
                Object.keys(errors).length ? "text-red-400" : "text-brand-accent"
              }`}
            >
              {notice}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light transition-colors"
          >
            History
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setDraft(saved)}
            className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light transition-colors disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={busy || !dirty}
            onClick={save}
            className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-[10px] uppercase tracking-widest px-5 py-2 transition-colors disabled:opacity-40"
          >
            {busy ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      {showHistory && (
        <HistoryPanel
          slug={schema.slug}
          onRestored={() => {
            setShowHistory(false);
            load();
          }}
        />
      )}

      <FieldList
        fields={schema.fields}
        value={draft}
        onChange={setDraft}
        path=""
        errors={errors}
        onPickImage={(current, apply) => setPicker({ current, apply })}
      />

      {picker && (
        <MediaLibrary
          current={picker.current}
          onSelect={picker.apply}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
