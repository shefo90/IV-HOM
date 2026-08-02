/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Kept separate from vite.config.ts so the dev server's proxy and HMR settings
 * play no part in a test run, and so `include` cannot collide with the
 * Playwright suite in tests/visual — those need a real browser and are run by
 * `npx playwright test`, not this.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // Only for Testing Library's automatic cleanup between tests; the test
    // files still import describe/it/expect explicitly.
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.tsx"],
  },
});
