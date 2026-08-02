/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef, useState } from "react";

/**
 * Posting the three public forms to the inbox.
 *
 * All three shapes — the contact form (which appears on both the home and
 * contact pages), a proposal request, and a factory tour booking — go to one
 * endpoint discriminated by `kind`.
 *
 * Two anti-spam fields travel with every submission and are never stored:
 * `website` is a honeypot, and `elapsed_ms` is how long the form was on
 * screen. Neither is a strong control on its own; they sit in front of the
 * server's rate limiting, which is.
 */

export type SubmissionKind = "contact" | "proposal" | "tour";

export type SubmitState = "idle" | "sending" | "sent" | "error";

interface BaseFields {
  kind: SubmissionKind;
  name: string;
  email: string;
  phone?: string;
}

export type SubmissionBody = BaseFields & Record<string, unknown>;

/**
 * Tracks how long the form has been on screen. A person cannot read a form
 * and type their name in under two seconds; a bot posts instantly.
 */
export function useElapsed() {
  const mountedAt = useRef(Date.now());
  return useCallback(() => Date.now() - mountedAt.current, []);
}

export function useSubmitForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const elapsed = useElapsed();

  const submit = useCallback(
    async (body: SubmissionBody, honeypot: string) => {
      setState("sending");
      try {
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            website: honeypot,
            elapsed_ms: elapsed(),
          }),
        });
        if (!response.ok) throw new Error(`submit failed: ${response.status}`);
        setState("sent");
        return true;
      } catch {
        // The API container being down must not leave a spinner running
        // forever — the caller shows an error with a mailto fallback.
        setState("error");
        return false;
      }
    },
    [elapsed],
  );

  const reset = useCallback(() => setState("idle"), []);

  return { submit, state, reset };
}
