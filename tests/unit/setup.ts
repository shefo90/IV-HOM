/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Registers toBeInTheDocument and friends, and their types.
import "@testing-library/jest-dom/vitest";

/**
 * jsdom implements no IntersectionObserver, and the reveal/counter hooks that
 * every routed page mounts construct one unconditionally. Nothing under test
 * asserts on reveal behaviour — that is the Playwright suite's job — so this
 * only has to exist and never fire.
 */
if (!("IntersectionObserver" in globalThis)) {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = NoopIntersectionObserver;
}
