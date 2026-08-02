/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment, type ReactNode } from "react";

/**
 * Renders the restricted inline markdown the CMS stores for headings.
 *
 * The design hand-wrote three patterns into JSX that a non-technical editor
 * should never have to type:
 *
 *   *text*     the italic run        ->  <em>
 *   **text**   the gold run          ->  <span class="gold">
 *   ***text*** gold and italic       ->  <em><span class="gold">
 *   a period   the oversized dot     ->  <span class="orange-dot">.</span>
 *
 * The triple form exists because one heading nests a gold span inside its
 * emphasis. It has to stay nested rather than becoming <em class="gold">:
 * `.iv-page em` sets a colour and outranks a bare `.gold` on the same
 * element, so the gold has to sit on a child to win.
 *
 * The period is detected rather than authored, so the editor just types a
 * normal sentence.
 *
 * Detection rule: a period becomes a dot when it ends a run, ignoring any
 * trailing space. That is what the originals do, and it gets three awkward
 * cases right at once:
 *
 *   "Three signatures. *One standard.*"   two dots, one mid-heading
 *   "*to an Industry 4.0 factory.*"       dots the last period, not the 4.0
 *   "**craft**, *built for scale*."       dot lands outside the italics
 *
 * That last distinction is worth keeping: the originals put the dot inside
 * the emphasis on some headings and outside it on others, which changes
 * whether the period itself is italic.
 *
 * The design is not consistent about this, though — "Three signatures." golds
 * its mid-heading period while "Seven disciplines." leaves it plain — so no
 * positional rule reproduces both. Write `\.` to force an ordinary period.
 * Pass dot={false} to switch the rule off for a whole field.
 *
 * A newline renders as <br>, for the headings set on two lines.
 */

type Segment = { kind: "text" | "em" | "gold" | "goldEm"; text: string };

// Longest marker first, so *** beats ** beats *. All non-greedy, so
// `*a* and *b*` stays two runs instead of collapsing into one.
const INLINE = /\*\*\*([\s\S]+?)\*\*\*|\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*/g;

// Head, then the final period, then any trailing space we must put back.
// The lazy head still anchors to the LAST period: on "Industry 4.0 factory."
// the short match fails the `\s*$` and backtracks to the right one.
const TRAILING_PERIOD = /^([\s\S]*?)\.(\s*)$/;

// `\.` becomes this sentinel before scanning, so an escaped period is
// invisible to TRAILING_PERIOD, and is restored on the way out. U+0000 never
// appears in real copy, so it cannot collide.
const SENTINEL = "\u0000";

function tokenize(source: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of source.matchAll(INLINE)) {
    const start = match.index;
    if (start > cursor) {
      segments.push({ kind: "text", text: source.slice(cursor, start) });
    }
    if (match[1] !== undefined) {
      segments.push({ kind: "goldEm", text: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ kind: "gold", text: match[2] });
    } else {
      segments.push({ kind: "em", text: match[3] });
    }
    cursor = start + match[0].length;
  }

  if (cursor < source.length) {
    segments.push({ kind: "text", text: source.slice(cursor) });
  }
  return segments;
}

/** Restores escaped periods and turns newlines into line breaks. */
function plain(text: string, keyBase: string): ReactNode {
  const restored = text.split(SENTINEL).join(".");
  const lines = restored.split("\n");
  if (lines.length === 1) return restored;

  return lines.map((line, i) => (
    <Fragment key={`${keyBase}-${i}`}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

function withDot(text: string, enabled: boolean, keyBase: string): ReactNode {
  const match = enabled ? TRAILING_PERIOD.exec(text) : null;
  if (!match) return plain(text, keyBase);

  return (
    <>
      {plain(match[1], keyBase)}
      <span className="orange-dot">.</span>
      {match[2]}
    </>
  );
}

interface RichTextProps {
  children: string;
  /** Set false where the periods should all stay ordinary. */
  dot?: boolean;
  /**
   * Classes for italic runs. The `.iv-page` routes style bare <em> in CSS and
   * pass nothing; the Tailwind-styled home sections pass their utilities here.
   */
  emClass?: string;
  /** Classes for gold runs. Defaults to the `.gold` rule in index.css. */
  goldClass?: string;
}

export default function RichText({
  children,
  dot = true,
  emClass,
  goldClass = "gold",
}: RichTextProps) {
  const source = (children ?? "").replace(/\\\./g, SENTINEL);

  return (
    <>
      {tokenize(source).map((segment, i) => {
        const body = withDot(segment.text, dot, String(i));

        if (segment.kind === "em") {
          return (
            <em className={emClass} key={i}>
              {body}
            </em>
          );
        }
        if (segment.kind === "goldEm") {
          return (
            <em className={emClass} key={i}>
              <span className={goldClass}>{body}</span>
            </em>
          );
        }
        if (segment.kind === "gold") {
          return (
            <span className={goldClass} key={i}>
              {body}
            </span>
          );
        }
        return <Fragment key={i}>{body}</Fragment>;
      })}
    </>
  );
}
