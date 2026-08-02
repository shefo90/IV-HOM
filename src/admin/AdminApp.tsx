/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type Session, type SiteSchema } from "./api";
import Login from "./Login";
import Messages from "./Messages";
import PageEditor from "./PageEditor";

/**
 * The admin shell.
 *
 * Lives inside the public SPA but is lazy-loaded, so none of this ships to a
 * visitor who never opens /admin. It reads its whole form structure from
 * /api/schema, which is the same file the API validates against.
 */
export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [schema, setSchema] = useState<SiteSchema | null>(null);
  const [active, setActive] = useState<string>("messages");
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");

  // Resuming an existing cookie session, so a refresh does not log you out.
  useEffect(() => {
    api
      .me()
      .then(setSession)
      .catch(() => undefined)
      .finally(() => setChecked(true));
  }, []);

  useEffect(() => {
    if (!session) return;
    api
      .schema()
      .then(setSchema)
      .catch((e: ApiError) => setError(e.message));
    api
      .listSubmissions({ view: "inbox", status_filter: "unread" })
      .then((r) => setUnread(r.unread))
      .catch(() => undefined);
  }, [session]);

  const signOut = useCallback(async () => {
    await api.logout().catch(() => undefined);
    setSession(null);
    setSchema(null);
  }, []);

  if (!checked) {
    return <div className="min-h-screen bg-brand-dark" />;
  }

  if (!session) {
    return <Login onSignedIn={setSession} />;
  }

  const current = schema?.documents.find((d) => d.slug === active);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-brand-border-dark p-5 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-brand-accent/60 flex items-center justify-center">
            <span className="font-serif text-xs font-bold">IV</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-brand-accent">
            Content editor
          </span>
        </div>

        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => setActive("messages")}
            className={`w-full text-left px-3 py-2 font-sans text-sm flex items-center justify-between transition-colors ${
              active === "messages"
                ? "bg-brand-card-dark text-brand-light"
                : "text-gray-400 hover:text-brand-light"
            }`}
          >
            Messages
            {/* With no email notifications, this badge is the only signal a
                lead has arrived — so it stays prominent. */}
            {unread > 0 && (
              <span className="ml-2 bg-brand-accent text-brand-dark font-mono text-[10px] px-1.5 py-0.5 rounded-sm">
                {unread}
              </span>
            )}
          </button>

          <p className="pt-4 pb-1 px-3 font-mono text-[9px] uppercase tracking-widest text-gray-600">
            Pages
          </p>
          {(schema?.documents ?? []).map((doc) => (
            <button
              key={doc.slug}
              type="button"
              onClick={() => setActive(doc.slug)}
              className={`w-full text-left px-3 py-2 font-sans text-sm transition-colors ${
                active === doc.slug
                  ? "bg-brand-card-dark text-brand-light"
                  : "text-gray-400 hover:text-brand-light"
              }`}
            >
              {doc.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-brand-border-dark space-y-2">
          <p className="font-sans text-xs text-gray-500">
            {session.name}
            <span className="block font-mono text-[10px] text-gray-600">{session.role}</span>
          </p>
          <div className="flex gap-2">
            <a
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-light"
            >
              View site
            </a>
            <button
              type="button"
              onClick={signOut}
              className="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-light"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-8 max-w-4xl">
        {error && <p className="font-sans text-xs text-red-400 mb-4">{error}</p>}

        {active === "messages" ? (
          <Messages onUnreadChange={setUnread} />
        ) : current ? (
          <PageEditor key={current.slug} schema={current} isAdmin={session.role === "admin"} />
        ) : (
          <p className="font-sans text-xs text-gray-500">Loading…</p>
        )}
      </main>
    </div>
  );
}
