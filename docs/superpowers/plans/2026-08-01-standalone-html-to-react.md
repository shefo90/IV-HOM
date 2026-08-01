# Standalone HTML → React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the six standalone HTML pages in `public/pages/` into React routes in the existing Vite app, with page bodies rendering pixel-identically to the originals.

**Architecture:** `App.tsx` becomes a `react-router-dom` shell rendering the shared `Header`/`FooterSection` around a `<Routes>` block. Each page becomes one component wrapping its body in a `.iv-page` div. The pages' original ~780-line stylesheet is reused verbatim but scoped under `.iv-page` so its bare element selectors cannot leak onto the home page. The shared `<script>` becomes seven React hooks that query within the page's ref.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind v4 (home page only), `react-router-dom` (new), `@playwright/test` + `pixelmatch` + `pngjs` (new, dev-only, for the pixel-diff acceptance test).

**Spec:** `docs/superpowers/specs/2026-08-01-standalone-html-to-react-design.md`

## Global Constraints

- **Page bodies must render pixel-identically.** Header and footer are the only permitted visual change (see spec).
- **Never edit `public/pages/*.html`.** They are the reference the tests diff against, and they must keep working at their current URLs.
- Node 24.15.0, npm 11.12.1. Windows host — use forward slashes in JS, and `npx` for local binaries.
- Existing code style: default exports, `.tsx` per component, 2-space indent, `/** @license SPDX-License-Identifier: Apache-2.0 */` header on new source files (match `src/components/*.tsx`).
- `npm run lint` (`tsc --noEmit`) must pass at the end of every task.
- Never widen scope into: rewriting page CSS as Tailwind, splitting pages into section components, deleting the original HTML, changing home-page layout, or building an `/api/contact` backend.

### HTML → JSX transformation rules

Every page task applies exactly these. No other changes to the markup are permitted.

| HTML | JSX |
| --- | --- |
| `class="x"` | `className="x"` |
| `for="x"` (on `<label>`) | `htmlFor="x"` |
| `<img ...>`, `<br>`, `<input ...>`, `<hr>` | self-closed: `<img ... />` |
| `<i class="ti ti-arrow-up-right"></i>` | `<i className="ti ti-arrow-up-right" />` |
| `style="padding:12px 22px;font-size:11px"` | `style={{ padding: '12px 22px', fontSize: '11px' }}` |
| `style="color:var(--gold)"` | `style={{ color: 'var(--gold)' }}` |
| `<!-- comment -->` | `{/* comment */}` |
| `tabindex` | `tabIndex` |
| `data-*`, `aria-*` | unchanged |
| `&nbsp;` | `{' '}` |
| Literal `‑` (U+2011), `—`, `’` | keep verbatim — they are real characters in the source, not entities |
| `<div data-magnetic>` | `<div data-magnetic="">` (bare attributes need a value in JSX) |

**Unclosed `<div>`:** `contact`, `process`, `products` and `projects` each open one more `<div>` than they close. The browser closes it at `</body>`, so in JSX add the missing `</div>` immediately before the closing `</main>`-level wrapper at the end of the body. Verify with the balance check in Task 1 Step 6. `about` and `factory` are already balanced — do not add anything to them.

### Image hash → file map

Sixteen base64 embeds decode to six unique images:

| Hash prefix | Appears in | Approx size |
| --- | --- | --- |
| `c7d46f8733` | about, factory | 1072 KB |
| `57d9ece153` | about, process | 675 KB |
| `81846667f4` | contact, products (×2), projects | 851 KB |
| `0510c03155` | products (×2), projects (×2) | 1005 KB |
| `bb5a6d137b` | products (×2), projects | 893 KB |
| `499e07565d` | products | 589 KB |

### Per-page facts

| Page | Body starts | First `<script>` | Sections | Unique images | Hooks | Unclosed div |
| --- | --- | --- | --- | --- | --- | --- |
| about | 794 | 992 | 5 | `c7d46f8733`, `57d9ece153` | reveal, magnetic, tilt | no |
| contact | 793 | 946 | 2 | `81846667f4` | reveal, magnetic | **yes** |
| projects | 793 | 939 | 3 | `0510c03155`, `81846667f4`, `bb5a6d137b` | reveal, magnetic | **yes** |
| process | 794 | 999 | 5 | `57d9ece153` | reveal, magnetic, counters, timelineFill | **yes** |
| products | 793 | 1002 | 5 | `0510c03155`, `81846667f4`, `bb5a6d137b`, `499e07565d` | reveal, magnetic, tilt | **yes** |
| factory | 797 | 982 | 5 | `c7d46f8733` | reveal, magnetic, warrantyCards | no |

Every page also uses `useScrollProgress`. Body markup runs from "body starts" to "first `<script>` minus 1".

---

## File Structure

**Created:**

```
src/pages/HomePage.tsx              today's App.tsx body, moved verbatim
src/pages/AboutPage.tsx             one component per page, sections inline
src/pages/ContactPage.tsx           + controlled form
src/pages/ProjectsPage.tsx
src/pages/ProcessPage.tsx
src/pages/ProductsPage.tsx
src/pages/FactoryPage.tsx
src/styles/standalone.css           the shared ~780 lines, scoped under .iv-page
src/styles/standalone-process.css   1 override rule
src/styles/standalone-factory.css   5 override rules
src/hooks/useScrollProgress.ts      all 6 pages
src/hooks/useReveal.ts              all 6
src/hooks/useMagnetic.ts            all 6
src/hooks/useTilt.ts                about, products
src/hooks/useCounters.ts            process
src/hooks/useTimelineFill.ts        process
src/hooks/useWarrantyCards.ts       factory
src/assets/images/standalone/       6 extracted images
scripts/extract-images.mjs          one-shot base64 extractor
tests/visual/compare.ts             screenshot + pixelmatch helper
tests/visual/pages.spec.ts          the six diff tests
playwright.config.ts
```

**Modified:** `src/App.tsx` (→ router shell), `src/main.tsx` (→ `BrowserRouter`), `src/components/Header.tsx` (→ route links), `index.html` (→ Tabler CDN), `Dockerfile:17` (→ `serve -s`), `package.json`.

**Never touched:** `public/pages/*.html`.

---

### Task 1: Pixel-diff harness

The acceptance test for every later task. It compares a converted route against its original HTML **live in the same run**, so there are no stored baselines to go stale.

**Files:**
- Create: `playwright.config.ts`, `tests/visual/compare.ts`, `tests/visual/pages.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `compareMain(page, oldUrl, newUrl, label)` → `Promise<{ diffPixels: number; totalPixels: number }>`. Later tasks call it as the page acceptance test.

- [ ] **Step 1: Install the dev dependencies**

```bash
npm install -D @playwright/test pixelmatch pngjs @types/pngjs
npx playwright install chromium
```

- [ ] **Step 2: Add the config**

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port=4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 3: Write the comparison helper**

Create `tests/visual/compare.ts`:

```ts
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
`;

async function shotMain(page: Page, url: string, file: string): Promise<Buffer> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FREEZE_CSS });
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
```

- [ ] **Step 4: Write the self-check test**

The harness must prove it works before it can certify anything. Comparing a page against *itself* must yield zero diff.

Create `tests/visual/pages.spec.ts`:

```ts
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
```

- [ ] **Step 5: Run it — must pass**

```bash
npx playwright test
```

Expected: 3 passed. If any fails, the harness is non-deterministic (usually fonts) — fix before continuing.

- [ ] **Step 6: Record the div-balance check**

Add to `package.json` scripts so page tasks can confirm the expected imbalance:

```json
"check:divs": "node -e \"const fs=require('fs');for(const f of fs.readdirSync('public/pages')){const t=fs.readFileSync('public/pages/'+f,'utf8');const b=t.slice(t.indexOf('<body'),t.indexOf('<script'));const o=(b.match(/<div/g)||[]).length,c=(b.match(/<\\/div>/g)||[]).length;console.log(f,'open',o,'close',c,'delta',o-c);}\""
```

Run `npm run check:divs`. Expected: delta 0 for about and factory, delta 1 for the other four.

- [ ] **Step 7: Ignore test output and commit**

Add to `.gitignore`:

```
tests/visual/__output__/
test-results/
playwright-report/
```

```bash
git add playwright.config.ts tests/ package.json package-lock.json .gitignore
git commit -m "test: add pixel-diff harness for HTML-to-React conversion"
```

---

### Task 2: Extract the base64 images

**Files:**
- Create: `scripts/extract-images.mjs`, `src/assets/images/standalone/*.jpg`

**Interfaces:**
- Produces: six `.jpg` files in `src/assets/images/standalone/`, plus `manifest.json` mapping hash prefix → filename. Page tasks import from here.

- [ ] **Step 1: Write the extractor**

Create `scripts/extract-images.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'public/pages';
const OUT = 'src/assets/images/standalone';
const RE = /data:image\/([a-z]+);base64,([A-Za-z0-9+/=]+)/g;

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.html'))) {
  const text = fs.readFileSync(path.join(SRC, file), 'utf8');
  for (const [, ext, b64] of text.matchAll(RE)) {
    const hash = crypto.createHash('md5').update(b64).digest('hex').slice(0, 10);
    if (manifest[hash]) {
      if (!manifest[hash].pages.includes(file)) manifest[hash].pages.push(file);
      continue;
    }
    const name = `img-${hash}.${ext === 'jpeg' ? 'jpg' : ext}`;
    fs.writeFileSync(path.join(OUT, name), Buffer.from(b64, 'base64'));
    manifest[hash] = { file: name, pages: [file] };
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Extracted ${Object.keys(manifest).length} unique images`);
```

- [ ] **Step 2: Run it**

```bash
node scripts/extract-images.mjs
```

Expected output: `Extracted 6 unique images`

- [ ] **Step 3: Verify the count and total size**

```bash
ls -la src/assets/images/standalone/
```

Expected: 6 `.jpg` files plus `manifest.json`, totalling roughly 5 MB (down from 18 MB of base64).

- [ ] **Step 4: Rename descriptively**

Read each extracted image to see what it depicts, then rename to a descriptive kebab-case name (e.g. `img-c7d46f8733.jpg` → `factory-floor.jpg`). Update `manifest.json`'s `file` values to match. Descriptive names are what page tasks will import.

- [ ] **Step 5: Commit**

```bash
git add scripts/extract-images.mjs src/assets/images/standalone/
git commit -m "feat: extract 16 base64 embeds to 6 deduplicated image files"
```

---

### Task 3: Router shell

Splits `App.tsx` into a shell plus `HomePage`, points the header at routes, and fixes SPA fallback in Docker. The home page must be visually unchanged by this task.

**Files:**
- Create: `src/pages/HomePage.tsx`
- Modify: `src/main.tsx`, `src/App.tsx`, `src/components/Header.tsx`, `index.html`, `Dockerfile:17`, `package.json`
- Test: `tests/visual/home.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: routes `/`, `/about`, `/process`, `/products`, `/factory`, `/projects`, `/contact`. Page components are default exports taking no props.

- [ ] **Step 1: Capture the home page baseline before changing anything**

```bash
npm run build && npx vite preview --port=4173 &
npx playwright screenshot --viewport-size=1440,1000 --full-page http://localhost:4173/ tests/visual/__output__/home-before.png
```

- [ ] **Step 2: Install the router**

```bash
npm install react-router-dom
```

- [ ] **Step 3: Write the failing route test**

Create `tests/visual/home.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('home page still renders its hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
});

test('all six routes resolve to a page with a main element', async ({ page }) => {
  for (const route of ['/about', '/process', '/products', '/factory', '/projects', '/contact']) {
    await page.goto(route);
    await expect(page.locator('main'), `${route} should render <main>`).toBeVisible();
  }
});
```

- [ ] **Step 4: Run it to verify it fails**

```bash
npx playwright test tests/visual/home.spec.ts
```

Expected: the six-routes test FAILS — the routes do not exist yet.

- [ ] **Step 5: Move the home body into `HomePage.tsx`**

Create `src/pages/HomePage.tsx` containing everything currently returned by `App.tsx` **except** `<Header>`, `<FooterSection>` and `<ProposalModal>`, plus the scroll-spy `useEffect` from `App.tsx:30-50` and the `openProposal` helper. It takes no props.

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ChapterOneSection from "../components/ChapterOneSection";
import WhatWeBuildSection from "../components/WhatWeBuildSection";
import ChoreographySection from "../components/ChoreographySection";
import SelectedWorkSection from "../components/SelectedWorkSection";
import ContactHeaderSection from "../components/ContactHeaderSection";
import ContactFormSection from "../components/ContactFormSection";

interface HomePageProps {
  onActiveSectionChange: (id: string) => void;
}

export default function HomePage({ onActiveSectionChange }: HomePageProps) {
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "products", "process", "projects", "contact"];
      const scrollPosition = window.scrollY + 160; // offset for header

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            onActiveSectionChange(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onActiveSectionChange]);

  const openProposal = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSection onOpenProposal={openProposal} />
      <ChapterOneSection />
      <WhatWeBuildSection onSelectCategory={() => openProposal()} />
      <ChoreographySection />
      <SelectedWorkSection onSelectProject={() => openProposal()} />
      <ContactHeaderSection />
      <ContactFormSection />
    </>
  );
}
```

- [ ] **Step 6: Rewrite `App.tsx` as the shell**

Replace the whole file:

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import FooterSection from "./components/FooterSection";
import ProposalModal from "./components/ProposalModal";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProcessPage from "./pages/ProcessPage";
import ProductsPage from "./pages/ProductsPage";
import FactoryPage from "./pages/FactoryPage";
import ProjectsPage from "./pages/ProjectsPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const [proposalOpen, setProposalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  // On the home page the active nav item follows the scroll position; on the
  // other routes there is nothing to spy on, so it follows the route instead.
  const active = isHome ? activeSection : location.pathname.slice(1);

  const openProposal = useCallback(() => {
    if (isHome) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/contact");
    }
  }, [isHome, navigate]);

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-accent selection:text-brand-dark overflow-x-hidden">
      <Header onOpenProposal={openProposal} activeSection={active} />

      <Routes>
        <Route path="/" element={<HomePage onActiveSectionChange={setActiveSection} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/factory" element={<FactoryPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <FooterSection />

      <ProposalModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
        initialType="proposal"
      />
    </div>
  );
}
```

- [ ] **Step 7: Create six placeholder pages so the shell compiles**

Each is a stub that later tasks replace. Create all six now — `src/pages/AboutPage.tsx`, `ProcessPage.tsx`, `ProductsPage.tsx`, `FactoryPage.tsx`, `ProjectsPage.tsx`, `ContactPage.tsx` — each with its own name substituted:

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function AboutPage() {
  return (
    <div className="iv-page">
      <main />
    </div>
  );
}
```

- [ ] **Step 8: Wrap the app in `BrowserRouter`**

Replace `src/main.tsx`:

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

Keep whatever import order and root-element handling the existing `main.tsx` uses; only the `BrowserRouter` wrapper is new.

- [ ] **Step 9: Point the header at routes**

In `src/components/Header.tsx`, import `NavLink` from `react-router-dom`, and replace `navItems` (lines 43-51) and the two `<a>` blocks:

```tsx
const navItems = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "PROCESS", to: "/process" },
  { label: "PRODUCTS", to: "/products" },
  { label: "FACTORY", to: "/factory" },
  { label: "PROJECTS", to: "/projects" },
  { label: "CONTACT", to: "/contact" },
];
```

Delete `handleNavClick` and its `isExternal` branch entirely. Render desktop nav items as:

```tsx
{navItems.map((item) => {
  const isActive = activeSection === item.to.slice(1) || (item.to === "/" && activeSection === "hero");
  return (
    <NavLink
      key={item.label}
      to={item.to}
      className={`font-sans text-[11px] tracking-[0.2em] font-medium transition-colors relative py-1 ${
        isActive ? "text-brand-accent" : "text-gray-400 hover:text-brand-light"
      }`}
    >
      {item.label}
      {isActive && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-accent" />}
    </NavLink>
  );
})}
```

Apply the same `NavLink` swap in the mobile drawer, keeping its existing className and adding `onClick={() => setMobileMenuOpen(false)}`. Change the logo `<a href="#hero">` to `<NavLink to="/">`, keeping its className and children exactly.

- [ ] **Step 10: Load the Tabler icon font**

The page bodies contain 20 `<i className="ti ti-arrow-up-right" />` elements. `index.html` does not load that stylesheet, so without this they render blank and the diff fails. Add to `<head>` in `index.html`, matching the original pages:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css">
```

- [ ] **Step 11: Fix SPA fallback in Docker**

`Dockerfile:17` currently 404s on a direct hit to `/about`. Change:

```dockerfile
CMD ["serve","dist","-s","-l","3000"]
```

- [ ] **Step 12: Run the tests**

```bash
npm run lint && npx playwright test tests/visual/home.spec.ts
```

Expected: lint clean, both tests PASS.

- [ ] **Step 13: Confirm the home page is visually unchanged**

Re-screenshot the home page and compare against `home-before.png` from Step 1. They must be identical apart from anti-aliasing noise. If the header shifted, Step 9 changed markup it should not have.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add react-router shell and route the header to page paths"
```

---

### Task 4: Scoped stylesheet

**Files:**
- Create: `src/styles/standalone.css`, `src/styles/standalone-process.css`, `src/styles/standalone-factory.css`
- Modify: `src/main.tsx`
- Test: `tests/visual/scoping.spec.ts`

**Interfaces:**
- Produces: `.iv-page` scope class. Every page component's root div uses it.

- [ ] **Step 1: Write the failing scoping test**

This guards the specific collision the spec identified: `nav{position:fixed}` from the page stylesheet must never reach the header's `<nav>`.

Create `tests/visual/scoping.spec.ts`:

```ts
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
  await expect(heading).not.toHaveCSS('color', 'rgb(212, 107, 67)');
});
```

- [ ] **Step 2: Run it to verify it passes for the wrong reason**

```bash
npx playwright test tests/visual/scoping.spec.ts
```

Expected: PASS — the stylesheet does not exist yet. This test only becomes meaningful after Step 3; it exists to catch the leak the moment the CSS lands.

- [ ] **Step 3: Create the scoped stylesheet**

Copy lines 12–789 of `public/pages/IV-products-standalone.html` (the `<style>` contents, excluding the tags) into `src/styles/standalone.css` **verbatim**, then apply only these selector rewrites:

| Original | Becomes |
| --- | --- |
| `:root{ --serif … --ease-2 }` | keep as `:root{…}` unchanged — custom properties apply nothing on their own |
| `*{margin:0;padding:0;box-sizing:border-box;}` | `.iv-page *{margin:0;padding:0;box-sizing:border-box;}` |
| `html{scroll-behavior:smooth;}` | **delete** — `src/index.css:22` already sets it globally |
| `body{font-family:…;background:…;color:…;overflow-x:hidden;-webkit-font-smoothing:antialiased;}` | `.iv-page{…same declarations…}` |
| `@media(hover:none){body{cursor:auto;}}` | `@media(hover:none){.iv-page{cursor:auto;}}` |
| `img{display:block;max-width:100%;}` | `.iv-page img{…}` |
| `a{color:inherit;text-decoration:none;}` | `.iv-page a{…}` |
| `::selection{…}` | `.iv-page ::selection{…}` |
| `body::before{…noise/grain…}` | `.iv-page::before{…}` — keep `position:fixed` |
| `h1,h2,h3,h4{…color:var(--gold);}` | `.iv-page h1,.iv-page h2,.iv-page h3,.iv-page h4{…}` |
| `em{…}` | `.iv-page em{…}` |
| `nav{…}`, `nav.scrolled{…}`, `footer{…}` | `.iv-page nav{…}` etc. — dead after the chrome change, kept scoped rather than deleted |
| every other selector (`.wrap`, `.section`, `.btn`, `.eyebrow`, `.subhero`, …) | prefix with `.iv-page ` |
| `@keyframes` blocks | unchanged — they are not selectors |
| selectors inside `@media` blocks | prefixed the same way |

Do not reorder, reformat, merge or drop any declaration. Every rule gains exactly one class of specificity, which is what preserves their relative precedence.

- [ ] **Step 4: Create the two override files**

`src/styles/standalone-process.css`:

```css
.iv-page .quality h2 em { color: var(--text-dark); }
```

`src/styles/standalone-factory.css`:

```css
/* Make the subhero/title trailing dot slightly larger on factory page */
.iv-page .subhero h1 .orange-dot { font-size: 1.6em; color: var(--gold); }
.iv-page .numbers-head { position: relative; z-index: 2; max-width: 960px; }
.iv-page .numbers-head h2 { font-size: clamp(52px,6.5vw,96px); margin-top: 24px; font-weight: 300; font-variation-settings: "opsz" 144; line-height: 1.05; }
.iv-page .numbers-head .lead { font-size: clamp(16px,1.4vw,20px); color: var(--text-light-mute); line-height: 1.75; max-width: 660px; margin-top: 36px; font-weight: 300; }
.iv-page .process-head h2 em { color: var(--text-dark) !important; }
```

- [ ] **Step 5: Import the shared stylesheet globally**

In `src/main.tsx`, after `import "./index.css"`:

```tsx
import "./styles/standalone.css";
```

The two override files are imported by their own page components, so their rules land after the shared ones.

- [ ] **Step 6: Run the scoping tests — now meaningful**

```bash
npm run lint && npx playwright test tests/visual/scoping.spec.ts
```

Expected: both PASS. A failure here means a selector was not scoped.

- [ ] **Step 7: Confirm the home page is still pixel-identical**

Re-screenshot `/` at 1440×1000 and compare with `home-before.png` from Task 3 Step 1. Any difference means a leak the two assertions did not catch — find and scope the offending selector.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/main.tsx tests/visual/scoping.spec.ts
git commit -m "feat: add page stylesheet scoped under .iv-page"
```

---

### Task 5: The seven hooks

**Files:**
- Create: `src/hooks/useScrollProgress.ts`, `useReveal.ts`, `useMagnetic.ts`, `useTilt.ts`, `useCounters.ts`, `useTimelineFill.ts`, `useWarrantyCards.ts`

**Interfaces:**
- Produces: each hook has the signature `(ref: RefObject<HTMLElement | null>) => void`, except `useScrollProgress` which takes no argument. Page components call them at the top of the component body, passing the ref attached to their `.iv-page` root.

Each hook scopes its queries to the ref rather than `document`, and disconnects observers on unmount — without that, client-side navigation between routes leaks listeners.

- [ ] **Step 1: `useScrollProgress`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const bar = ref.current?.querySelector<HTMLElement>("#scrollProgress");
    if (!bar) return;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
}
```

- [ ] **Step 2: `useReveal`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    root.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}
```

- [ ] **Step 3: `useMagnetic`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useMagnetic(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      };
      const onLeave = () => {
        btn.style.transform = "";
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}
```

- [ ] **Step 4: `useTilt`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const inner = el.querySelector<HTMLElement>(".about-img") ?? el;
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      };
      const onLeave = () => {
        inner.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}
```

- [ ] **Step 5: `useCounters`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useCounters(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.target ?? "0");
          const decimals = parseInt(el.dataset.decimal ?? "0", 10);
          const dur = 1600;
          const start = performance.now();

          const step = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = eased * target;
            el.textContent = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    root.querySelectorAll(".counter").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [ref]);
}
```

- [ ] **Step 6: `useTimelineFill`**

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useTimelineFill(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const fill = root.querySelector<HTMLElement>("#ptimeline-fill");
    const track = root.querySelector("#ptimeline");
    if (!fill || !track) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            fill.style.width = "100%";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    obs.observe(track);
    return () => obs.disconnect();
  }, [ref]);
}
```

- [ ] **Step 7: `useWarrantyCards`**

Ports the factory page's extra script block (`IV-factory-standalone.html:982-1024`).

```ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

function countUp(el: HTMLElement, target: number, duration: number) {
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(ease * target));
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = String(target);
  };
  requestAnimationFrame(step);
}

export default function useWarrantyCards(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const grid = root.querySelector<HTMLElement>(".warranty-cards-grid");
    if (!grid) return;
    const quote = root.querySelector<HTMLElement>(".wquote-block");
    const timers: number[] = [];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          grid.querySelectorAll(".wcard").forEach((card) => card.classList.add("wcard-in"));

          grid.querySelectorAll<HTMLElement>(".wcount").forEach((el) => {
            const target = parseInt(el.dataset.target ?? "0", 10);
            const card = el.closest(".wcard");
            const delay =
              (card ? parseFloat(getComputedStyle(card).transitionDelay) : 0) * 1000 + 400;
            timers.push(window.setTimeout(() => countUp(el, target, 1200), delay));
          });

          if (quote) timers.push(window.setTimeout(() => quote.classList.add("wquote-in"), 600));
          obs.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    obs.observe(grid);
    return () => {
      obs.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [ref]);
}
```

- [ ] **Step 8: Verify they compile**

```bash
npm run lint
```

Expected: clean. Unused-hook warnings are fine — page tasks consume them.

- [ ] **Step 9: Commit**

```bash
git add src/hooks/
git commit -m "feat: port standalone page scripts to seven scoped React hooks"
```

---

### Tasks 6–11: Convert the pages

**These six tasks are structurally identical.** Do them in this order — `about` first because it is the simplest with balanced markup, so it validates the whole pattern before the harder pages:

| Task | Page | Source file | Body lines | Hooks | Extra |
| --- | --- | --- | --- | --- | --- |
| 6 | about | `IV-about-standalone.html` | 794–991 | scrollProgress, reveal, magnetic, tilt | — |
| 7 | contact | `IV-contact-standalone.html` | 793–945 | scrollProgress, reveal, magnetic | controlled form; **close 1 div** |
| 8 | projects | `IV-projects-standalone.html` | 793–938 | scrollProgress, reveal, magnetic | **close 1 div** |
| 9 | process | `IV-process-standalone.html` | 794–998 | scrollProgress, reveal, magnetic, counters, timelineFill | imports `standalone-process.css`; **close 1 div** |
| 10 | products | `IV-products-standalone.html` | 793–1001 | scrollProgress, reveal, magnetic, tilt | **close 1 div** |
| 11 | factory | `IV-factory-standalone.html` | 797–981 | scrollProgress, reveal, magnetic, warrantyCards | imports `standalone-factory.css` |

**Files (per task):**
- Modify: `src/pages/<Name>Page.tsx` (replacing the Task 3 stub)
- Modify: `tests/visual/pages.spec.ts`

**Interfaces:**
- Consumes: the hooks from Task 5, the images from Task 2, `.iv-page` from Task 4.
- Produces: a default-exported component taking no props.

Run these steps for each page, substituting from the table.

- [ ] **Step 1: Add the failing diff test**

Append to `tests/visual/pages.spec.ts` (example shown for `about` — substitute route, source filename and label):

```ts
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
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npx playwright test tests/visual/pages.spec.ts -g "about"
```

Expected: FAIL — the stub renders an empty `<main>`, so the dimension assertion trips first with "`<main>` dimensions differ".

- [ ] **Step 3: Port the markup**

Read the body line range from the table. Convert it to JSX applying **only** the transformation rules in Global Constraints. Structure:

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from "react";
import useScrollProgress from "../hooks/useScrollProgress";
import useReveal from "../hooks/useReveal";
import useMagnetic from "../hooks/useMagnetic";
import useTilt from "../hooks/useTilt";
import aboutImage from "../assets/images/standalone/<name>.jpg";

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);

  useScrollProgress(ref);
  useReveal(ref);
  useMagnetic(ref);
  useTilt(ref);

  return (
    <div className="iv-page" ref={ref}>
      <div className="scroll-progress" id="scrollProgress" />
      <main>
        {/* ...ported sections, verbatim... */}
      </main>
    </div>
  );
}
```

Rules specific to this step:
- **Omit the page's own `<nav>` and `<footer>`.** The shell renders `Header` and `FooterSection` — that is the accepted chrome change. Omit `#hamburger` and `#mobileMenu` too.
- **Keep `<div class="scroll-progress" id="scrollProgress">`** — it sits above `<main>` and `useScrollProgress` drives it.
- Replace each `src="data:image/jpeg;base64,…"` with the imported binding for that hash (see the hash map in Global Constraints).
- Import the page's override stylesheet if the table lists one.
- If the table says "close 1 div", add the missing `</div>` at the end of the body content, where the browser closes it.

- [ ] **Step 4: Run the diff test**

```bash
npx playwright test tests/visual/pages.spec.ts -g "about"
```

Expected: 3 PASS (mobile, tablet, desktop).

If it fails, open `tests/visual/__output__/about-<vp>-diff.png` — the highlighted pixels point at the offending element. Common causes: a dropped wrapper `<div>`, a `style` string converted with the wrong camelCase key, or a missing image import.

- [ ] **Step 5: Lint**

```bash
npm run lint
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AboutPage.tsx tests/visual/pages.spec.ts
git commit -m "feat: convert the about page to React"
```

---

### Task 12: Full-suite verification

**Files:** none created — this is the final gate.

- [ ] **Step 1: Run everything**

```bash
npm run lint && npm run build && npx playwright test
```

Expected: lint clean, build succeeds, all tests pass (3 self-check + 2 route + 2 scoping + 18 page diffs = 25).

- [ ] **Step 2: Confirm the originals still work**

The spec keeps `public/pages/*.html` reachable. Visit `/pages/IV-about-standalone.html` in the preview server and confirm it still renders as it always did — the tests depend on it, and it must not have been edited.

```bash
git diff --stat main -- public/pages/
```

Expected: **no output.** Any change here is a bug — those files are the reference.

- [ ] **Step 3: Check the bundle shrank**

```bash
du -sh dist/
```

The 18 MB of base64 should now be ~5 MB of deduplicated image assets.

- [ ] **Step 4: Verify the Docker SPA fallback**

```bash
docker build -t iv-test . && docker run --rm -p 3000:3000 iv-test
```

Then hard-refresh `http://localhost:3000/about`. It must render the About page, not a 404. This is what the `-s` flag in Task 3 Step 11 fixes.

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A && git commit -m "chore: final verification pass"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
| --- | --- |
| Keep page CSS verbatim | 4 |
| `.iv-page` scoping, rule-by-rule table | 4 (Step 3) |
| `react-router-dom`, seven routes | 3 |
| `App.tsx` → shell + `HomePage.tsx` | 3 (Steps 5–6) |
| `Header.tsx` nav → routes, `isExternal` deleted | 3 (Step 9) |
| `activeSection` from `useLocation` off-home | 3 (Step 6) |
| `GET PROPOSAL` → `/contact` off-home | 3 (Step 6) |
| `Dockerfile` `serve -s` | 3 (Step 11), verified 12 (Step 4) |
| Extract + dedupe base64 → 6 images | 2 |
| Seven hooks, scoped to ref, cleaned up | 5 |
| Dead behaviours not ported | 5 (absent by construction) |
| Contact form preserved incl. failing endpoint | 7 |
| Unclosed div on four pages | Global Constraints + 6–11 Step 3 |
| One component per page | 6–11 |
| Originals kept untouched | Global Constraints, verified 12 (Step 2) |
| Screenshot diff, 3 viewports, `<main>` only | 1, then 6–11 Step 1 |
| Chrome unified on Header/FooterSection | 3, and 6–11 Step 3 omits page nav/footer |

Two items in the plan are **not** in the spec, both discovered while planning: the Tabler icon stylesheet (Task 3 Step 10) — without it 20 icons render blank and the diff fails — and the `check:divs` script (Task 1 Step 6).

**Placeholder scan:** none. Every code step carries complete code. The page tasks (6–11) deliberately reference source line ranges rather than transcribing ~1,300 lines of markup; the transformation rules that govern that port are fully enumerated in Global Constraints, and the pixel diff is what proves the port correct.

**Type consistency:** all seven hooks share `(ref: RefObject<HTMLElement | null>) => void` and are default exports. `HomePage` takes `onActiveSectionChange: (id: string) => void`, supplied by `App`. The other six page components take no props. `compareMain(page, oldUrl, newUrl, label)` returns `{ diffPixels, totalPixels }`, matching every call site in Tasks 6–11.
