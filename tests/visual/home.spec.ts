/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';

test('home page still renders its hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
});

test('all six routes resolve to a page with a main element', async ({ page }) => {
  for (const route of ['/about', '/process', '/products', '/factory', '/projects', '/contact']) {
    await page.goto(route);
    // These routes are fully populated pages now, so their <main> has real
    // content and measures a non-zero bounding box — toBeVisible() is the
    // meaningful check here, not just presence in the DOM.
    await expect(page.locator('main'), `${route} should render <main>`).toBeVisible();
  }
});
