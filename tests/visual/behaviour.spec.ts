/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';

// compare.ts's FREEZE_CSS forces `.reveal`/`.reveal-stagger` to
// `opacity:1!important` and pins `.counter`/`.wcount` text to their settled
// values, so a page that omitted its `useReveal` / `useCounters` /
// `useWarrantyCards` hook call would still report 0 differing pixels against
// the pixel-diff gate — every reveal block would simply be invisible in
// production. These tests deliberately do NOT apply that freeze CSS: they
// exercise the real IntersectionObserver-driven code path, so a missing hook
// call genuinely fails them.

const ROUTES = ['/about', '/process', '/products', '/factory', '/projects', '/contact'];

for (const route of ROUTES) {
  test(`${route}: a .reveal element animates in via IntersectionObserver`, async ({ page }) => {
    await page.goto(route);
    // The last `.reveal` in document order is below the fold on every one of
    // these pages (the CTA section on five of them; the contact form on
    // /contact, which has no CTA section), so this genuinely exercises the
    // scroll-triggered observer rather than an element already in view at load.
    const reveal = page.locator('.reveal').last();
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS('opacity', '1', { timeout: 8000 });
    const classAttr = (await reveal.getAttribute('class')) ?? '';
    expect(classAttr.split(/\s+/)).toContain('in');
  });
}

test('/process: the quality counter counts up to 0.4 on its own', async ({ page }) => {
  await page.goto('/process');
  const counter = page.locator('.counter[data-target="0.4"]');
  await counter.scrollIntoViewIfNeeded();
  // No manual wait for a settled value — the rAF count-up in useCounters
  // drives this itself; toHaveText polls until it lands on "0.4".
  await expect(counter).toHaveText('0.4', { timeout: 8000 });
});

// The home page's logo marquee translates by a percentage, which resolves
// against the animated element's OWN width. The element is a flex row inside an
// `overflow-hidden` strip, so without `w-max` it measures the viewport instead
// of its content and the logos crawl one screen per cycle — worst on a phone,
// where the viewport is narrowest. Nothing about the declared animation looks
// wrong when that happens, so these assert the two facts the motion depends on:
// the track is content-sized, and it holds two identical halves so a -50% cycle
// lands on a visually identical frame.
test('/: the logo marquee is content-sized and scrolls at a usable rate', async ({ page }) => {
  await page.setViewportSize({ width: 414, height: 900 });
  await page.goto('/');

  const track = page.locator('div[class*="animate-\\[marquee"]').first();
  await track.waitFor();

  const shape = await track.evaluate((el) => {
    const halves = Array.from(el.children) as HTMLElement[];
    return {
      halfCount: halves.length,
      widths: halves.map((h) => h.getBoundingClientRect().width),
      trackWidth: el.getBoundingClientRect().width,
    };
  });

  expect(shape.halfCount).toBe(2);
  expect(shape.widths[0]).toBeCloseTo(shape.widths[1], 1);
  // The whole point: content width, not the 414px viewport.
  expect(shape.trackWidth).toBeCloseTo(shape.widths[0] * 2, 1);

  const xOf = () =>
    track.evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  const before = await xOf();
  await page.waitForTimeout(2000);
  const travelled = before - (await xOf());

  // ~150px/s by design; the bounds are wide enough for frame-timing jitter but
  // still catch the old ~7px/s crawl.
  expect(travelled).toBeGreaterThan(200);
  expect(travelled).toBeLessThan(400);
});

test('/factory: warranty cards and counts animate in via IntersectionObserver', async ({ page }) => {
  await page.goto('/factory');
  await page.locator('.warranty-cards-grid').scrollIntoViewIfNeeded();

  const cards = page.locator('.wcard');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveClass(/\bwcard-in\b/, { timeout: 8000 });
  await expect(cards.nth(1)).toHaveClass(/\bwcard-in\b/, { timeout: 8000 });
  await expect(cards.nth(2)).toHaveClass(/\bwcard-in\b/, { timeout: 8000 });

  const counts = page.locator('.wcount');
  await expect(counts.nth(0)).toHaveText('5', { timeout: 8000 });
  await expect(counts.nth(1)).toHaveText('72', { timeout: 8000 });
});
