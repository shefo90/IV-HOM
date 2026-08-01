/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';
import { compareMain } from './compare';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
];

test.describe('harness self-check', () => {
  for (const vp of VIEWPORTS) {
    test(`identical URLs diff to zero @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels } = await compareMain(
        page,
        '/pages/IV-about-standalone.html',
        '/pages/IV-about-standalone.html',
        `selfcheck-${vp.name}`,
      );
      expect(diffPixels).toBe(0);
    });
  }
});

test.describe('about', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-about-standalone.html',
        '/about',
        `about-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});

test.describe('contact', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-contact-standalone.html',
        '/contact',
        `contact-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});

test.describe('projects', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-projects-standalone.html',
        '/projects',
        `projects-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});

test.describe('process', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-process-standalone.html',
        '/process',
        `process-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});

test.describe('products', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-products-standalone.html',
        '/products',
        `products-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});

test.describe('factory', () => {
  for (const vp of VIEWPORTS) {
    test(`matches the original @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const { diffPixels, totalPixels } = await compareMain(
        page,
        '/pages/IV-factory-standalone.html',
        '/factory',
        `factory-${vp.name}`,
      );
      // Allow 0.1% for sub-pixel text rendering; anything structural blows past this.
      expect(diffPixels / totalPixels).toBeLessThan(0.001);
    });
  }
});
