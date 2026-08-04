/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, Navigate, useLocation } from "react-router-dom";
import { useContent } from "../content/ContentProvider";
import RichText from "../components/RichText";

/**
 * The confirmation the two contact forms navigate to once the API has accepted
 * a submission. Styled with the Tailwind utilities the home page sections use
 * rather than the `.iv-page` system, and it renders inside the shared header
 * and footer like any other route.
 */

/** Set by the forms via THANK_YOU_STATE; the page is meaningless without it. */
export interface ThankYouState {
  submitted?: boolean;
}

export default function ThankYouPage() {
  const { state } = useLocation();
  const copy = useContent().thankyou;

  // React Router keeps location state on the history entry, so refreshing
  // /thank-you still finds it and the page survives. Only a cold entry — a
  // typed URL, a new tab, a shared link — arrives without it, and that must
  // not render as a confirmation for a message nobody sent.
  if ((state as ThankYouState | null)?.submitted !== true) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="relative bg-brand-dark min-h-[70vh] flex items-center overflow-hidden border-t border-brand-border-dark">
      {/* The same blueprint dot field the home page's contact header carries. */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,107,67,0.015)_1px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center space-y-10 relative z-10">
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-6 bg-brand-accent" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-brand-accent font-semibold uppercase">
              {copy.eyebrow}
            </span>
            <span className="h-[1px] w-6 bg-brand-accent" />
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-none text-brand-accent tracking-tighter">
            <RichText emClass="italic text-brand-light font-normal">{copy.heading}</RichText>
          </h1>
        </div>

        <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          {copy.body}
        </p>

        <p className="font-mono text-[11px] tracking-wider text-brand-accent">{copy.note}</p>

        <div className="pt-2">
          <Link
            to={copy.homeTo}
            className="inline-block bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-xs uppercase tracking-widest px-8 py-4 transition-colors duration-300"
          >
            {copy.homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
