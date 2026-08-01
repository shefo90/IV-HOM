# Converting the standalone HTML pages to React

**Date:** 2026-08-01
**Branch:** `convert-standalone-pages-to-react`

## Goal

Convert the six standalone HTML pages in `public/pages/` into React pages inside the
existing Vite + React + TypeScript app, so the whole site is one React application.

**The page bodies must render identically to the current HTML.** The header and footer
are the single deliberate exception — see [Decisions](#decisions).

## Current state

Each standalone page is one self-contained HTML document in three layers:

| Layer | Lines | Notes |
| --- | --- | --- |
| `<head>` + `<style>` | 1–~790 | ~780 lines of hand-written CSS with its own variables (`--ink`, `--gold`, `--cream`) |
| Body markup | ~791–~990 | `<nav>` → `<main>` with 2–5 `<section>`s → `<footer>` |
| `<script>` | ~992–~1150 | ~150 lines, **byte-identical across 5 of the 6 pages** |

Sizes on disk total 18 MB because 16 images are base64-inlined:

| Page | Size | Sections | Embedded images |
| --- | --- | --- | --- |
| `IV-about-standalone.html` | 2.4 MB | 5 | 2 |
| `IV-contact-standalone.html` | 1.2 MB | 2 | 1 |
| `IV-factory-standalone.html` | 1.5 MB | 5 | 1 |
| `IV-process-standalone.html` | 965 KB | 5 | 1 |
| `IV-products-standalone.html` | 7.5 MB | 5 | 7 |
| `IV-projects-standalone.html` | 4.3 MB | 3 | 4 |

The React app (`src/`) is a single-page site: `index.html` → `main.tsx` → `App.tsx`,
composing 15 components. It styles with **Tailwind v4** via `@tailwindcss/vite`, with
brand tokens in an `@theme` block in `src/index.css`. **No router is installed.**

The two styling systems are unrelated. They resolve to the same hex values
(`--gold` `#D46B43` = `--color-brand-accent`), but one is hand-written CSS with semantic
classes and the other is Tailwind utilities.

Today `src/components/Header.tsx` links out to `/pages/IV-about-standalone.html` and
friends, so moving between the home page and an inner page is a full browser page load.

## Decisions

These were settled during brainstorming.

1. **Keep the page CSS verbatim.** The ~780-line block moves into real `.css` files
   unchanged. Rewriting it into Tailwind would mean hand-translating ~780 rules, which
   makes layout drift near-certain. Verbatim CSS is the only option that actually
   guarantees the layout constraint.
2. **Use `react-router-dom` for client-side routes.** Pages become `/about`, `/process`,
   `/products`, `/factory`, `/projects`, `/contact`.
3. **Extract the base64 images to files.** Same image bytes, served as cacheable assets.
4. **Keep the original HTML files** in `public/pages/` as reference. They stay on disk and
   keep shipping in the build; that is accepted.
5. **One component per page.** Sections stay inline rather than being split into ~25
   section components, keeping a close 1:1 mapping to the source for verification.
6. **Unify the chrome on the main page's `Header.tsx` / `FooterSection.tsx`** — see below.

### The chrome change is intentional

The standalone nav/footer and the React `Header`/`FooterSection` are different designs.
Adopting the React ones changes how the top and bottom of the six pages look:

| | Standalone (current) | Main React page (adopted) |
| --- | --- | --- |
| Bar padding | `18px 56px`, shrinks to `14px` on scroll | `py-4 px-6 md:px-12`, static |
| Width | full-bleed | `max-w-7xl` (1280px, centered) |
| Logo mark | 44×44 | 36×36 |
| Nav links | mono 11.5px, gap 44px, underline grows on hover | sans 11px, gap 40px, underline only when active |
| Active link | white | orange (`brand-accent`) |
| CTA | `.btn` + arrow icon, magnetic cursor-follow | plain button |
| Mobile | 2-bar hamburger → full-screen overlay | lucide icon → dropdown drawer |
| Footer links | 6, including Factory | 5, no Factory |
| Footer extras | — | giant outlined "IV" watermark, radial dots |

Consequently these behaviours are **dropped on purpose**: nav scroll-shrink, magnetic nav
CTA, hover-grow underline, full-screen mobile overlay, the footer's Factory link, and the
page's own Cairo clock (`Header` already owns one).

**Page bodies — everything between header and footer — do not change.**

## Architecture

### Routing

`App.tsx` becomes a shell. Today's home-page body moves verbatim into `HomePage.tsx`.

```
main.tsx     <BrowserRouter>
App.tsx      <Header/> + <Routes> + <FooterSection/> + <ProposalModal/>
               /          HomePage.tsx      ← today's App body, unchanged
               /about     AboutPage.tsx
               /process   ProcessPage.tsx
               /products  ProductsPage.tsx
               /factory   FactoryPage.tsx
               /projects  ProjectsPage.tsx
               /contact   ContactPage.tsx
```

Three consequences for `Header.tsx`:

- `navItems` hrefs change from `/pages/IV-*.html` to route paths, rendered as `NavLink`.
  The `isExternal` branch and its `handleNavClick` early-return are deleted.
- `activeSection` is currently driven by the home-page scroll listener in
  `App.tsx:30-50`. That listener only makes sense on `/`. On the other routes the active
  item derives from `useLocation()` instead.
- The `GET PROPOSAL` button calls `openProposal`, which scrolls to `#contact`
  (`App.tsx:52-55`). No `#contact` exists on the new routes, so off-home it navigates to
  `/contact`.

### Deployment

`Dockerfile:17` runs `serve dist -l 3000`. Without SPA fallback, a hard refresh or direct
hit on `/about` returns 404. It must become `serve dist -s -l 3000`.

### CSS scoping

This is the highest-risk part of the conversion.

The standalone stylesheet uses bare element selectors. Loaded globally into the SPA they
would leak onto the home page. The worst case: `nav{position:fixed;padding:18px 56px;
background:rgba(11,10,9,.92)}` would match the `<nav>` inside `Header.tsx:81` and break
the home page header. `h1,h2,h3,h4{color:var(--gold)}` would recolour every home heading.

Every rule is therefore scoped under a `.iv-page` wrapper that each page component
renders. The wrapper sits **inside** the route, wrapping only that page's body — `Header`
and `FooterSection` are rendered by the `App` shell outside `<Routes>`, so no scoped rule
can reach them:

```jsx
<Header … />                    ← outside .iv-page, unaffected
<Routes>
  <Route path="/about" element={
    <div className="iv-page">   ← every standalone rule applies only in here
      <main> …page body… </main>
    </div>
  } />
</Routes>
<FooterSection />               ← outside .iv-page, unaffected
```

| Original selector | Scoped form |
| --- | --- |
| `*{margin:0;padding:0;box-sizing:border-box}` | `.iv-page *{...}` |
| `body{font-family,background,color,overflow-x}` | `.iv-page{...}` |
| `body::before` (noise/grain overlay) | `.iv-page::before` — stays `position:fixed` |
| `img`, `a`, `em`, `h1,h2,h3,h4` | `.iv-page img`, `.iv-page a`, … |
| `::selection` | `.iv-page ::selection` |
| `nav{...}`, `footer{...}` | `.iv-page nav`, `.iv-page footer` (dead after the chrome change, kept scoped rather than deleted) |
| `html{scroll-behavior:smooth}` | dropped — `src/index.css:22` already sets it |
| `:root{--ink,--gold,…}` | left in `:root`; custom properties apply nothing by themselves |

Because *every* rule gains exactly one class of specificity, their precedence relative to
each other is unchanged. That is what preserves the layout. Page bodies use no Tailwind
utilities, so there is no interaction with Tailwind inside `.iv-page`.

The wrapper must not introduce `transform`, `filter`, or `perspective`, or the
`position:fixed` noise overlay and scroll progress bar would be re-anchored to it.

### Stylesheet files

The six style blocks are nearly identical:

| Page | Delta from the products/projects baseline |
| --- | --- |
| products, projects | baseline (byte-identical to each other) |
| about | one blank line — no effect |
| contact | a leading space before `:root` — no effect |
| process | **+1 rule:** `.quality h2 em{color:var(--text-dark);}` |
| factory | **+5 rules:** `.subhero h1 .orange-dot`, `.numbers-head` and `.numbers-head h2` modified, `.numbers-head .lead` added, `.process-head h2 em` added |

So the result is:

```
src/styles/standalone.css          the shared ~780 lines, scoped
src/styles/standalone-process.css  1 rule
src/styles/standalone-factory.css  5 rules
```

### Scripts → hooks

The shared `<script>` is byte-identical on about, contact, process, products and
projects; factory carries one extra block. It decomposes into eight hooks plus one
factory-specific hook.

Each hook takes the page wrapper's ref and queries within it rather than against
`document`. This matters in an SPA: `document.querySelectorAll` at module scope would run
before mount and would leak observers across client-side navigations. Every hook
registers its listeners and `IntersectionObserver`s in `useEffect` and disconnects them on
unmount.

| Hook | Targets | Used by |
| --- | --- | --- |
| `useScrollProgress` | `#scrollProgress` width from scroll position | all 6 |
| `useReveal` | `.reveal`, `.reveal-stagger` → adds `.in` | all 6 |
| `useMagnetic` | `[data-magnetic]` mousemove translate | all 6 |
| `useParallax` | `[data-parallax]` translateY on scroll | all 6 |
| `useTilt` | `[data-tilt]` rotateX/rotateY on mousemove | all 6 |
| `useTimelineFill` | `#ptimeline-fill` → width 100% on intersect | all 6 |
| `useSplitText` | `#heroHeadline .split-word` staggered 80ms | where present |
| `useCounters` | `.counter[data-target]` ease-out count-up | process |
| `useWarrantyCards` | `.wcard`, `.wcount`, `.wquote-block` | factory |

The nav-scroll (`.scrolled`), mobile-menu and Cairo-clock portions of the original script
are not ported — they belong to the chrome being replaced.

### Images

Sixteen base64 blobs decode to **six unique images** — `IV-products-standalone.html`
embeds three of them twice each. They are decoded to
`src/assets/images/standalone/` and imported normally, matching how existing components
reference assets. Deduplication takes the payload from 18 MB to roughly 5 MB with no
visual change.

## Pre-existing bugs the conversion exposes

- **Unclosed `<div>` on four pages.** `contact`, `process`, `products` and `projects` each
  open one more `<div>` than they close; browsers silently close it at `</body>`. JSX
  cannot express this, so each is closed at the point the browser closes it, reproducing
  the rendered DOM rather than the literal source. `about` and `factory` are balanced.
- **`Header.tsx:104-105` renders an empty div.** `cairoTime` is computed and never
  displayed on desktop. Out of scope; left as-is.
- **`Header.tsx:70`** calls `handleNavClick(e, "#hero")` with two arguments against a
  three-parameter signature. It works because the missing `isExternal` is falsy. The
  router rewrite removes the parameter entirely.

## Verification

The acceptance test is a screenshot diff of each original HTML file against its new route
at **375 / 768 / 1440 px**, comparing **`<main>` only** — header and footer are excluded
because those changes are intended.

This runs per page as that page is converted, not once at the end. A page is not done
until its diff is clean.

`npm run lint` (`tsc --noEmit`) must pass, and `npm run build` must succeed.

## Order of work

1. Extract and deduplicate the six images.
2. Add `react-router-dom`; split `App.tsx` into the router shell and `HomePage.tsx`;
   rewrite `Header.tsx` nav to routes; fix the Dockerfile `serve -s` flag. Confirm the
   home page is unchanged.
3. Create the scoped `standalone.css` plus the two override files.
4. Write the nine hooks.
5. Convert pages one at a time, screenshot-diffing each: **about** first as the pilot
   (5 sections, balanced markup, validates the whole pattern), then contact → projects →
   process → products → factory (its extra script last).

## Out of scope

- Rewriting the page CSS into Tailwind.
- Splitting pages into per-section components.
- Deleting the original HTML files.
- Changing the home page's layout.
- Fixing the empty Cairo-clock div.
