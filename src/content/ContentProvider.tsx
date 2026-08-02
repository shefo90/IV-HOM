/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import fallbackJson from "./fallback.json";
import type { Content } from "./types";

/**
 * Supplies the editable copy to the whole app.
 *
 * `/content.json` is a static file: the API regenerates it on every save and
 * nginx serves it straight off the content volume, so the read path never
 * touches Python and keeps working with the API container stopped.
 *
 * `fallback.json` is the copy baked into the bundle at build time. It is used
 * only when the fetch fails — in `npm run dev`, in `vite preview` (which is
 * what the visual suite exercises), and in production if the volume is
 * unreadable. That makes a blank page impossible.
 *
 * First paint: index.html preloads /content.json, so the browser has it in
 * cache before the JS bundle finishes parsing. Waiting for the fetch therefore
 * costs nothing in practice, and it avoids the alternative — painting stale
 * baked-in copy and then visibly swapping it for the client's edits on every
 * single page load.
 */

const FALLBACK = fallbackJson as unknown as Content;

const ContentContext = createContext<Content>(FALLBACK);

export function useContent(): Content {
  return useContext(ContentContext);
}

export default function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    let cancelled = false;

    // No explicit cache mode: nginx sends `Cache-Control: no-cache` for this
    // file, so the browser revalidates on its own and the preloaded response
    // is still eligible for reuse.
    fetch("/content.json")
      .then((response) => {
        if (!response.ok) throw new Error(`content.json: ${response.status}`);
        return response.json();
      })
      .then((live) => {
        // Merged per document rather than replaced, so a payload that is
        // missing a page still renders that page from the baked copy.
        if (!cancelled) setContent({ ...FALLBACK, ...live });
      })
      .catch(() => {
        if (!cancelled) setContent(FALLBACK);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!content) return null;

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}
