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
