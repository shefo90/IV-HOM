/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';

test('page stylesheet does not leak onto the home page header', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const nav = page.locator('header nav').first();
  await expect(nav).toHaveCSS('position', 'static');
});

test('home page headings are not recoloured by the page stylesheet', async ({ page }) => {
  await page.goto('/');
  const heading = page.locator('#hero h1, #hero h2').first();
  // NOTE: this heading's own Tailwind classes (`text-brand-accent`) already
  // render it in the exact same brand orange used by the ported stylesheet's
  // `h1,h2,h3,h4{color:var(--gold)}` rule (both are the site's one brand
  // orange, #D46B43 / rgb(212,107,67)), and a class selector always beats
  // that rule's bare-element specificity regardless of scoping — so a
  // `color` assertion here can never distinguish "leaked" from "already
  // orange by design" (verified: it fails identically with the ported
  // stylesheet's <link>/<style> import removed entirely). `font-variation-settings`
  // is set by the ported rule (`"opsz" 96`) but by no Tailwind utility on
  // this element, so it is unset/`normal` unless that rule actually reaches
  // this element — a leak-sensitive check that a coincidental brand-color
  // match cannot spoof.
  await expect(heading).not.toHaveCSS('font-variation-settings', '"opsz" 96');
});
