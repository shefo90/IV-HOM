/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: {
      // Chrome picks grayscale vs subpixel (LCD) text antialiasing based on
      // whether the text sits in a composited layer. The original pages get a
      // composited <body>; the React route's nested .iv-page div does not, so
      // identical text rasterises differently and swamps the pixel diff with
      // colour fringing that has nothing to do with layout. Disabling LCD text
      // makes both sides render grayscale, so the diff measures layout and
      // content — which is what it is for.
      args: ['--disable-lcd-text'],
    },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port=4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
