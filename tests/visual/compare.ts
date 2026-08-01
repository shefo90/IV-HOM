/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Page, expect } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'tests/visual/__output__';

// Reveal animations start at opacity:0 and only settle once the
// IntersectionObserver fires. Neutralising them on BOTH pages equally keeps
// the diff about layout rather than animation timing.
const FREEZE_CSS = `
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
  }
  .reveal, .reveal-stagger { opacity: 1 !important; transform: none !important; }

  /* The site chrome is deliberately NOT part of this comparison: the project
     replaced each page's own nav/footer with the app's shared Header and
     FooterSection, an accepted visual change. Screenshotting <main> was meant
     to exclude it, but the nav is position:fixed and therefore still paints
     over the top of <main> in an element screenshot. Hiding it on both sides
     restores the intended scope. All of these are out of flow, so hiding them
     cannot shift <main>'s own layout. */
  nav#nav, header, .mobile-menu, .scroll-progress { display: none !important; }
`;

// `.counter` and `.wcount` spans run a requestAnimationFrame count-up for
// 1200-1600ms after their own IntersectionObserver fires; that text mutation
// isn't CSS, so FREEZE_CSS doesn't touch it and a screenshot can land on an
// arbitrary intermediate number. This runs in-page (via page.evaluate) for
// BOTH the old and the new URL, right after FREEZE_CSS, so it must be fully
// self-contained (no closures over Node-side state).
//
// Each element is pinned to the value its own script would settle on,
// computed from its own data-* attributes (never hardcoded):
//   - `.counter`  (shared page script): decimals ? value.toFixed(decimals)
//     : Math.round(value).toLocaleString(), decimals from data-decimal
//     (default 0), value from data-target.
//   - `.wcount`   (factory-only script): String(target), no locale
//     formatting.
//
// Setting the text once isn't enough: the element's own IntersectionObserver
// may not have fired yet (or may already be mid-animation) and can go on to
// overwrite our value afterwards. A MutationObserver per element reverts any
// further change back to the settled value, regardless of whether the
// animation is driven by rAF, a timer, or (for the future React routes) a
// framework re-render — so it stays deterministic without depending on how
// the animation is implemented.
export function settleCounters(): void {
  const settledText = (el: Element): string => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    if (el.classList.contains('wcount')) {
      return String(parseInt(el.getAttribute('data-target') || '0', 10));
    }
    const decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    return decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString();
  };

  document.querySelectorAll('.counter, .wcount').forEach((el) => {
    const settled = settledText(el);
    el.textContent = settled;
    new MutationObserver(() => {
      if (el.textContent !== settled) el.textContent = settled;
    }).observe(el, { characterData: true, childList: true, subtree: true });
  });
}

async function shotMain(page: Page, url: string, file: string): Promise<Buffer> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(settleCounters);
  await page.evaluate(() => document.fonts.ready);
  const main = page.locator('main').first();
  await main.waitFor({ state: 'visible' });
  const buf = await main.screenshot();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, file), buf);
  return buf;
}

export async function compareMain(
  page: Page,
  oldUrl: string,
  newUrl: string,
  label: string,
): Promise<{ diffPixels: number; totalPixels: number }> {
  const a = PNG.sync.read(await shotMain(page, oldUrl, `${label}-old.png`));
  const b = PNG.sync.read(await shotMain(page, newUrl, `${label}-new.png`));

  expect(
    { w: b.width, h: b.height },
    `${label}: <main> dimensions differ — layout changed`,
  ).toEqual({ w: a.width, h: a.height });

  const diff = new PNG({ width: a.width, height: a.height });
  const diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  fs.writeFileSync(path.join(OUT, `${label}-diff.png`), PNG.sync.write(diff));

  return { diffPixels, totalPixels: a.width * a.height };
}
