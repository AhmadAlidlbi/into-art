# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (http://localhost:4200)
ng serve

# Production build
ng build

# Development build with watch mode
ng build --watch --configuration development

# Run unit tests
ng test

# Generate a new component
ng generate component features/<feature-name>/<component-name>
```

## Architecture Overview

**Angular 20 standalone-component app** — no NgModules. Every component is standalone with explicit imports.

### Feature Structure

All pages live under `src/app/features/`. Each feature is **lazy-loaded** via `loadComponent` in `app.routes.ts`. New features should export a `[FEATURE]_ROUTES: Routes` array from their route file.

**Gate for incomplete features:** `src/app/core/guards/ready-pages.guard.ts` contains a hardcoded set of active route paths. Routes not in this set redirect to `/under-construction`. To enable a new feature, add its path to the `READY_PAGES` set in that guard.

### Internationalization

- **Framework:** `@ngx-translate/core` with HTTP loader
- **Languages:** Arabic (`ar`, default) and English (`en`)
- **Translation files:** `public/assets/i18n/ar.json` and `en.json`
- **Service:** `src/app/core/i18n/i18n.service.ts` — manages language via Angular signals, persists to `localStorage` (key: `intoart_lang`), and sets `document.dir` + `document.lang` dynamically
- **Initialization:** `APP_INITIALIZER` in `app.config.ts` loads translations before bootstrap
- **RTL/LTR transitions:** use the `dir-switching` CSS class to prevent flicker during direction change

All user-facing strings must have entries in both `ar.json` and `en.json`. Use the `translate` pipe in templates.

### Styling

- Global styles in `src/styles.scss` with Angular Material Azure theme
- RTL overrides use `html[dir="rtl"]` selector
- Build budgets: 800KB initial warning / 1.2MB error; 12KB per component style warning / 20KB error

### Data & Services

- **Booking:** `features/booking/services/booking.service.ts` posts `FormData` to a Google Apps Script endpoint (hardcoded URL in the service) which writes to Google Sheets. Also fetches booked time slots per date.
- **Contact:** `features/contact/services/contact.service.ts` is currently a mock (650ms delay, console log).
- **Projects / FAQ:** Static TypeScript data files (`projects.data.ts`, `faq.data.ts`) — no external API.

### State Management

Uses Angular signals throughout. No NgRx or other state library.

### Key Configuration

- Component prefix: `app`
- Strict TypeScript enabled (strict templates, strict injection parameters)
- Prettier: 100-char width, single quotes, Angular parser for HTML (`prettier.config.js`)
- Assets served from `public/` folder

---

## Visual Identity Reference

This section defines the design language of the project. Every page must follow these rules. Individual pages may adapt layout and spacing, but must **never** deviate from the color palette, typography scale, or elevation system below.

### Color Palette

| Role | Value |
|---|---|
| Text primary | `var(--text)` — warm near-black `#161414` |
| Text secondary | `var(--text-2)` — muted warm gray `rgba(22,20,20,0.55)` |
| Surface / card bg | `rgba(255, 255, 255, 0.82–0.92)` — frosted off-white |
| Page alt section bg | `rgba(248, 246, 242, 0.75)` — warm light gray |
| CTA strip bg | `rgba(251, 247, 242, 0.7)` |
| Border / stroke | `rgba(231, 224, 216, 0.95)` — warm beige |
| Accent border (hover) | `rgba(215, 198, 178, 0.55–0.65)` |
| Icon / badge bg | `rgba(215, 198, 178, 0.20–0.28)` — sandy warm tint |
| Icon / badge border | `rgba(215, 198, 178, 0.34–0.40)` |
| Overlay (top-shine) | `inset 0 1px 0 rgba(255, 255, 255, 0.55)` |

All shadow values use the warm dark base `rgba(22, 20, 20, α)` — never cold gray.

### Elevation System

Define on `:host` and reference everywhere:

```scss
:host {
  --elev-1: 0 10px 26px rgba(22, 20, 20, 0.07);   /* resting state */
  --elev-2: 0 14px 34px rgba(22, 20, 20, 0.10);   /* hover state   */
  --stroke: 1px solid rgba(231, 224, 216, 0.95);  /* card border   */
  --shine:  inset 0 1px 0 rgba(255, 255, 255, 0.55); /* top highlight */
}
```

- **Resting:** `box-shadow: var(--shine), var(--elev-1)`
- **Hover:** `box-shadow: var(--shine), var(--elev-2)` + `transform: translateY(-2px)`
- **Transition:** `transform 140ms ease, box-shadow 160ms ease, border-color 160ms ease`

### Typography Scale

| Use | Size | Weight | Letter-spacing |
|---|---|---|---|
| Hero title | `54px` (clamp down on mobile) | `950` | `-0.9px` |
| Page section title (`h1`) | `clamp(34px, 5vw, 58px)` | `950` | `-0.8px` |
| Section title (`h2`) | `30px` | `950` | `-0.3px` |
| CTA title | `28px` | `950` | `-0.2px` |
| Card / item title | inherit (≈16px) | `950` | `-0.2px` |
| Sub-section title (`h3`) | `20px` | `950` | `-0.2px` |
| Body / description | `14–16px` | `650` | normal |
| Secondary body | `13–14px` | `650–800` | normal |
| Eyebrow / kicker label | `12px` | `950` | `0.7px` |
| Small label / meta | `12–13px` | `800` | normal |

- Line-height for body copy: `1.8–1.9`
- Eyebrow/kicker: `text-transform: uppercase`
- All headings: color `var(--text)`, no font-family override (inherits global)
- Secondary text: color `var(--text-2)`

### Card & Component Anatomy

Every card-like surface (service card, feature block, procedure step, review card, catalog card) follows this structure:

```scss
.card {
  border-radius: 18–20px;
  border: var(--stroke);
  background: rgba(255, 255, 255, 0.82–0.92);
  box-shadow: var(--shine), var(--elev-1);
  padding: 16–20px;
  transition: transform 140ms ease, box-shadow 160ms ease, border-color 160ms ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shine), var(--elev-2);
  border-color: rgba(215, 198, 178, 0.55);
}
```

Icon/badge inside a card:

```scss
.icon-badge {
  width: 44–46px; height: 44–46px;
  border-radius: 14–16px;
  background: rgba(215, 198, 178, 0.20–0.28);
  border: 1px solid rgba(215, 198, 178, 0.34–0.40);
  display: grid; place-items: center;
  font-weight: 950;
}
```

Arrow badge (bottom-right of card, flipped in RTL):

```scss
.arrow-badge {
  width: 38–40px; height: 38–40px;
  border-radius: 13–14px;
  background: rgba(215, 198, 178, 0.20–0.24);
  border: 1px solid rgba(215, 198, 178, 0.30–0.34);
  font-weight: 950;
}
:host-context(html[dir='rtl']) .arrow-badge { transform: scaleX(-1); }
```

### Section Layout Conventions

- **Default section padding:** `46px 0` (services pattern); home uses `30px 0`
- **Tight section:** `padding: 0–28px 0`
- **Alt section bg:** add `.section--alt` with `background: rgba(248, 246, 242, 0.75)`
- **Section kicker/eyebrow:** always above `h2`, centered or left-aligned per page
- **Grid columns:** `repeat(3, minmax(0, 1fr))` for card grids, `gap: 14px`
- **Responsive breakpoint:** `@media (max-width: 980px)` → collapse to `grid-template-columns: 1fr`
- **Max content width:** controlled by global `.container`

### CTA Strip

Shared across all pages, always at the bottom before the footer:

```scss
.cta {
  padding: 56px 0;
  background: rgba(251, 247, 242, 0.7);
  border-top: 1px solid rgba(231, 224, 216, 0.85);
  box-shadow: 0 -10px 28px rgba(22, 20, 20, 0.04);
}
```

Layout: `display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px`

### RTL Rules

- Always use `:host-context(html[dir='rtl'])` for RTL overrides (not `[dir='rtl']` alone)
- Flip directional arrows with `transform: scaleX(-1)`
- Swap `right`/`left` positioning values
- Swap horizontal padding (`padding-left` ↔ `padding-right`) on inputs
- Keep marquees/sliders in `direction: ltr` and restore inner content to `direction: rtl`

### Buttons

Global `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost` live in `src/styles.scss`. On any page:

```scss
/* CTA & hero buttons */
.btn { transition: transform 140ms ease, box-shadow 140ms ease; will-change: transform; }
.btn:hover  { transform: translateY(-2px); box-shadow: 0 22px 56px rgba(22,20,20,0.14); }
.btn:active { transform: translateY(0px); }
```

### Page-Specific Adaptation Rules

When building or updating a page, keep the above tokens and rules fixed, and only adapt:

1. **Hero / page-head type** — hero with full-bleed image (home), or centered text header (services, contact, etc.)
2. **Section padding** — adjust tightness per content density
3. **Grid column count** — 1, 2, or 3 columns as layout requires; always collapses to 1 on mobile
4. **Card padding** — tighter (`14–16px`) for dense lists, looser (`20–34px`) for feature cards
5. **Animations** — enter animations and counters only where they add value (hero, metrics); avoid on every element
