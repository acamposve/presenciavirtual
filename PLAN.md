# Plan: Domains, Hosting, Web Development, AI Consulting (ES/EN)

## Decisions
- **Billing:** ResellersPanel billing and order forms. No in-site payments.
- **Backend:** keep PHP (same shared hosting as `public/contact-send.php`) as an API proxy.
- **Domain scope (v1):** search and availability only. Checkout redirects to the ResellersPanel order form.
- **Languages:** every string must exist in both Spanish (`es`) and English (`en`).

## Key constraint
The ResellersPanel Reseller API v2.0 requires credentials, so it must be called **server-side only**. The React app talks to our PHP endpoint, never to ResellersPanel directly.

## Phase 1: Foundation (i18n and routing)
- Add routes `/domains`, `/hosting`, `/web-development`, `/ai-consulting` in `src/App.jsx`.
- Add nav links in `Header.jsx` and `Footer.jsx`, with keys in both `es` and `en`.
- Split `src/i18n/translations.js` into one file per section to keep it maintainable.
- Add shared components: page hero, pricing/feature card.
- Header: add a mobile menu or "Services" dropdown (8 links will not fit).
- Per-route and per-language `<title>` and meta tags.

## Phase 2: Domain registration (main feature)
**Design reference:** screenshot of the [hostgator.uy](https://www.hostgator.uy/) hero. What we copy:
- A single, very wide, rounded white search bar on a dark background, placed directly under the header.
- Magnifier icon on the left, large placeholder text ("Encuentra tu dominio" / "Find your domain") with the key word emphasized.
- A solid blue "Buscar" / "Search" button inside the bar, on the right.
- A small promo badge next to the bar (theirs: "Dominio gratis por 1 año"). We only add one if we have a real offer.
- Our palette is navy/teal, so the button uses `--accent` instead of blue, and the hero keeps the existing navy gradient.

**Shared component** (`src/components/DomainSearch.jsx`)
- One reusable component, used on **Home (hero)** and on `/domains`, so behavior and translations live in one place.
- Search bar as in the reference: magnifier icon, large text box with placeholder ("Encuentra tu dominio" / "Find your domain"), and the "Buscar" / "Search" button inside the bar on the right. The TLD is typed with the name (e.g. `tuempresa.com`); if omitted, search the popular TLDs.
- Full-width on desktop; on mobile the button drops below the input.
- Under the bar: popular TLD chips with yearly price (.com, .net, .org, .uy, .com.uy, .io). Clicking a chip selects that TLD.
- Props: `variant="hero" | "page"`.
- On Home, submitting navigates to `/domains?q=<name>&tld=<tld>`, which runs the search and shows results.
- Client-side validation (valid characters, length, no spaces, IDN/punycode); accepts a full domain (`name.com`) or just a name.

**Page** (`src/pages/Domains.jsx`)
- Renders `DomainSearch` (page variant) and reads `q` and `tld` from the query string to auto-search.
- Results list: domain, available/taken, yearly price, "Register" button; for taken domains, suggest alternative TLDs.
- Loading, error and empty states; `aria-live` for results.
- Short explainer below the results: what a domain is, how hosting relates (as on hostgator.uy), with a link to `/hosting`.

**Backend** (`public/api/domain-check.php`)
- Calls the ResellersPanel API; credentials stored outside the web root or in a non-committed config file.
- Input validation, strict TLD allow-list, per-IP rate limiting, short-lived result caching.
- Normalized JSON response: `{ domain, available, price, currency }`.

**Checkout**
- "Register" redirects to the ResellersPanel order form with the domain pre-filled (confirm the URL format with ResellersPanel).

**Dev experience**
- Vite proxy for `/api` to a local PHP server, or a mock response for local development.

**Implementation notes (as built)**
- ResellersPanel API (official PDF v2.4.1), host `https://api.duoservers.com`, store `pvirtual`: single endpoint with `auth_username`/`auth_password`. Serialized responses are wrapped under index `1`.
- **Verified against the live API (store `pvirtual`, USD):** the response shapes below were confirmed with real calls, so the earlier "unverified parsing" caveat no longer applies:
  - `domains/check` returns `result: [tld => 0|1]` where **1 = registered, 0 = available**; a TLD the store does not sell (e.g. `uy`) is omitted from `result` entirely.
  - `products/get_registerdomains` returns 167 TLDs keyed by name (`academy`, `com`, ...), each with a scalar 12-month `prices` value once `currencies[]=USD&periods[]=12` is sent (without `periods` it returns a `period_NN` map instead), plus a `promotions` array whose entries carry `promo_type` (`register`), `price_type`, `period` (`12`) and a `prices` string.
  - Multi-level keys in `registerdomains` are `_`-separated (`com_uy`) and are converted to dotted TLDs.
  - Prices move: `.org` was 15.99 and `.io` 67.99 when this was verified, so treat `vite.config.js` MOCK_PRICES and any figure below as snapshots, not constants.
- Prices come from the API (cached 1h; first-year promo price shown with the regular price struck through). `.uy` / `.com.uy` are not offered by the store, so they are not shown.
- "Register" links to the store's own search page: `https://pvirtual.duoservers.com/dominios/resultados/?sld={name}` (takes the name only and runs its own search). Configurable via `order_url`. The placeholder is `{name}`, not `{domain}`.
- Search input accepts a name or a full domain, with or without scheme, `www.`, path, port or a trailing dot, and in Unicode or punycode: `cafe.com` typed with an accent is normalised to its punycode form before it reaches the API, which only accepts ASCII. A bare name searches the popular TLDs, and `miempresa.com.uy` is read as name `miempresa` + TLD `com.uy`.
- Every error the endpoint can return has an ES/EN message (`network`, `rate_limited`, `invalid_name`, `invalid_tld`, `no_tlds`, `not_configured`, `upstream_unreachable`, `upstream_error`, `generic`); an unknown key falls back to the network text.
- When the requested domain is taken, the results page lists up to three available alternatives for the same name with price and register link.
- Chips under the hero bar are informational only (no prices, not clickable).
- Dev: `vite.config.js` mocks `/api/domain-check.php` (names containing "taken" are reported as registered).

**Routing and deployment files (required, not optional)**
- `public/.htaccess` is the front controller: it serves real files and directories (`/assets/*`, `/api/*.php`, images) and sends every other path to `index.html`. Without it the host answers 404 for `/domains`, `/hosting`, `/contact` and every other deep link, because Apache looks for a file that does not exist. If the site is ever served from a subdirectory, set `RewriteBase` there and `base` in `vite.config.js` to the same prefix.
- `public/api/ping.php` is a diagnostic endpoint: it reports whether the config file is present and readable, plus PHP/OpenSSL/`allow_url_fopen`/`flock` availability, and never returns credentials. Compare it with `domain-check.php` to tell "the `/api/` directory never reached the server" (both 404) from "the config is missing" (ping 200 with `config_present: false`) or "the registrar is failing upstream".
- `src/pages/NotFound.jsx` renders for unknown routes, so a mistyped URL shows a way back instead of a blank page; `RouteMeta` falls back to the `notFound` title for those paths.
- `public/robots.txt` and `public/sitemap.xml` cover the public routes; keep the sitemap in step with `src/App.jsx`.

**Tests and checks**
- `npm run verify` runs `check:i18n` (ES/EN key-tree parity across every section), `npm test` and the production build.
- `tests/domain.test.mjs` covers the input parser and the alternative-TLD helper, including IDN, two-level TLDs and length boundaries.

## Phase 3: Hosting page
- Plan comparison cards (e.g. Starter, Business, Pro) with monthly/annual toggle.
- Feature lists in ES and EN; CTA links to the ResellersPanel order flow.
- Link to the domain search for bundling a domain with hosting.

## Phase 4: Web development page
- Offering tiers (corporate site, e-commerce, web app), process steps (discovery, design, build, launch), stack used.
- Case-study placeholders; CTA to the contact form.

## Phase 5: AI consulting page
- Reuse existing AI messaging (agents, RAG, document intelligence).
- Engagement types: audit, roadmap, pilot; CTA to book the free first consultation.
- Avoid duplicating the Solutions page; link to it or merge the overlap.

## Phase 6: Forms and leads
- Add a `topic` field (domain, hosting, web, AI) to `contact-send.php` and use it in the email subject.
- Add a topic selector in `Contact.jsx`, pre-selected via query string from each service page.

## Phase 7: Home page
- Add a "What we offer" section with the four services.
- Place the `DomainSearch` hero variant (defined in Phase 2) on Home as the primary conversion hook, directly under the hero headline, with the existing "Talk about your project" CTA as secondary.
- All Home domain-search strings (headline, placeholder, button, TLD chips, validation errors) in both `es` and `en`.

## Phase 8: QA and launch
- Translation key parity: done, as `npm run check:i18n` (plus `npm test` and the build under `npm run verify`).
- Behavior when the API is down: every endpoint error has an ES/EN message, and `available: null` renders as "could not verify" with a contact fallback.
- Responsiveness: checked by eye at 360/768/1200 px; accessibility still needs a pass with a screen reader and keyboard only.
- Still open on the server, and the real launch blockers: `public/.htaccess` must be uploaded, `public/api/config.php` must exist with the live credentials, and `/api/domain-check.php` must answer. `public/api/ping.php` tells which of the three is missing.
- `npm run build`, then deploy `dist/` together with the PHP files. The FTP workflow uploads `dist/` only, so anything that lives in `public/` reaches the server through the build.

## Risks
- API credentials must never reach the client or the repo. They currently live in `public/api/config.php`, which is gitignored but is copied into `dist/` by the build, so every deploy artifact contains them.
- `.uy` domains have local-registry rules and may need manual handling; the store does not sell them, so they are simply absent from results.
- Domain search needs rate limiting and caching to prevent abuse and slowness (both implemented; the rate limiter holds one exclusive lock across read/check/write).
- Terms, refund and privacy pages are needed before selling hosting and domains.
- Pricing must be kept in sync with ResellersPanel: the API is the source of truth at runtime (1 h cache), but the dev mock and any figure written in docs go stale.
- The contact form has no rate limiting and no CAPTCHA beyond a honeypot, and it does not log a failed `mail()`.
- Routing depends on `public/.htaccess`; without it every route except `/` returns 404.