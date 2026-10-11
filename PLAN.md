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
- Search input accepts a name or a full domain, with or without scheme, `www.`, path, port or a trailing dot, and in Unicode: `cafe.com` typed with an accent is normalised to its punycode form before it reaches the API, which only accepts ASCII. A trailing dot marks a FQDN, so it is ignored (`miempresa.com.` searches `miempresa.com`) and a name left alone by it is a bare-name search. The resulting name is always a **single label**: a query with more labels than that (`mi.a.com`) is rejected client-side instead of being sent and answered with `invalid_name`. A bare name searches the popular TLDs, and `miempresa.com.uy` is read as name `miempresa` + TLD `com.uy`; `blog.miempresa.com` therefore reads as name `blog` + TLD `miempresa.com` and is answered with `invalid_tld`, because only the backend has the catalogue that would tell a subdomain from a two-level TLD.
- Every error the endpoint can return has an ES/EN message (`network`, `rate_limited`, `invalid_name`, `invalid_tld`, `no_tlds`, `not_configured`, `upstream_unreachable`, `upstream_error`, `generic`); an unknown key falls back to the network text.
- TLDs are never substituted silently: when the request names TLDs (`?tlds=`) and **none** of them is in the store's catalogue, the endpoint answers `422 invalid_tld` instead of returning the popular TLDs, which would have been availability data for a different domain. A bare name (no `tlds`) still searches `default_tlds`, and a mixed request keeps the TLDs the store does sell.
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

## Phase 3: Hosting page — implemented (product data still missing)
- Plan comparison cards (e.g. Starter, Business, Pro) with monthly/annual toggle.
- Feature lists in ES and EN; CTA links to the ResellersPanel order flow.
- Link to the domain search for bundling a domain with hosting.

**Implementation notes (as built)**
- The plan numbers and the order links live in `src/data/hostingPlans.js` (not in i18n: a price is not a translation). `src/utils/pricing.js` holds the pure rules and `tests/pricing.test.mjs` covers them.
- **Missing product data, still to be filled in (no component change needed):**
  - Real prices: `priceMonthly` / `priceAnnual` per plan in `src/data/hostingPlans.js`. Until then both are `0`, and `0` is rendered as the `plans.pricePending` copy ("Precio a confirmar" / "Price to be confirmed"), never as `$0`: the plan button leads to a real order flow, so a published zero would read as "free". Setting the figures is enough to make the page show the formatted USD amount.
  - Features: `plans.items.<plan>.features` in `src/i18n/sections/hosting.js`, empty in both languages. An empty array renders a single `plans.featuresPending` line ("Detalles del plan a confirmar" / "Plan details to be confirmed"). No feature was invented: each bullet is a claim about the service.
  - Order URL: `orderUrl` per plan in `src/data/hostingPlans.js`, empty today. With `''` the card button is a `<Link to="/contact">` with the `plans.orderWithoutUrl` label; with a value it becomes an `<a href target="_blank" rel="noopener noreferrer">` with the `plans.order` label, same pattern as `registerUrl` in `src/pages/Domains.jsx`. No ResellersPanel URL was invented.
- The page keeps the `badge` "Próximamente" / "Coming soon" while the prices are unpublished; see the open question in `project-work/presenciavirtual/project-state.md`.
- Plan names (`Starter`, `Business`, `Pro`) are product names, so they are identical in `es` and `en`.
- The three cards use `FeatureCard` (its first real consumer of `price`/`items`/`children`), grouped in `.hosting-grid` (three fixed columns; `.grid-3` is `auto-fit` and would fit a fourth card).

## Phase 4: Web development page — implemented (case studies still missing)
- Offering tiers (corporate site, e-commerce, web app), process steps (discovery, design, build, launch), stack used.
- Case-study placeholders; CTA to the contact form.

**Implementation notes (as built)**
- `src/pages/WebDevelopment.jsx` is its own page now: it no longer renders `ServicePage` (which is still used by `/ai-consulting`). Sections, in order: hero without `badge` (`PageHero`), tiers, process, stack, case studies, CTA. Styles live in `src/pages/WebDevelopment.css` (new).
- Tiers and process reuse `FeatureCard` and `src/i18n/sections/webDevelopment.js`. The three tiers are the existing `highlights`, unchanged; the process is the new `process` array in both languages.
- **Stack: no technology was invented.** `stack` lists only capabilities already published in `src/i18n/sections/services.js` (`APIs`, `Integrations`, `Automation`, `Cloud architecture`, `Security`, `Observability`). No language, framework or vendor is named — not even the ones the site is actually built with (React, Vite) — because naming them would state something about the service that nobody has confirmed. The section links back to `/services` (`stackLink`) instead of repeating the pillars, which Phase 5 also asks for the AI page. If the stack should name real technologies, the owner has to publish them first.
- **Missing product data, still to be filled in (no component change needed):** case studies. `cases.items` in `src/i18n/sections/webDevelopment.js` is empty in both languages, and the page renders the `casesPending` note ("Estamos preparando los primeros casos de estudio…") instead of the grid. The cards appear on their own as soon as `items` has entries, each with `{ title, desc }`; `cases.title` / `cases.subtitle` are the section headings. `check:i18n` compares arrays index by index, so entries must be added to `es` and `en` in the same order and the same number. While `items` is empty, no card is rendered: an empty grid or an invented client would both be worse than the note.
- The page carries no plans and no prices: its only CTA is the `/contact` form, same as the other service pages.

## Phase 5: AI consulting page
- Reuse existing AI messaging (agents, RAG, document intelligence).
- Engagement types: audit, roadmap, pilot; CTA to book the free first consultation.
- Avoid duplicating the Solutions page; link to it or merge the overlap.

**Implementation notes (as built)**
- `src/pages/AiConsulting.jsx` is its own page now: neither service page renders `ServicePage` anymore. Sections, in order: hero (`PageHero`), engagement types (`engagements` in a 3-step structured `<ol>` with deliverable tags), AI capabilities (`capabilities`: agents, RAG, document intelligence reusing messaging from `services.js`), link to full technical architecture on the Solutions page (`solutionsLink`), engineering principles (pragmatism over hype, privacy & data security, measurable impact), and consultation CTA. Styles live in `src/pages/AiConsulting.css` (new).
- The three engagement types (Audit, Roadmap, Pilot) match the original scoping with explicit deliverable badges on each step.
- AI messaging reuses the capabilities published in `src/i18n/sections/services.js` (`AI Agents & Workflows`, `RAG & enterprise assistants`, `Document intelligence`). No external vendor or unconfirmed LLM provider was invented.
- Avoids duplication with `/services` by providing a direct link (`solutionsLink`) to the full architecture diagram and comprehensive use cases.
- CTA leads to `/contact` for the free initial consultation.

## Phase 6: Forms and leads — implemented
- Add a `topic` field (domain, hosting, web, AI) to `contact-send.php` and use it in the email subject.
- Add a topic selector in `Contact.jsx`, pre-selected via query string from each service page.

**Implementation notes (as built)**
- `public/contact-send.php` validates `topic` against an explicit allowlist (`domain`, `hosting`, `web`, `ai`, and `general` as fallback). The sanitized label is injected into the UTF-8 subject line (`Nuevo mensaje [Tema] — Nombre`) and email body.
- Pure rules extracted to `src/utils/contact.js` (`VALID_TOPICS` and `resolveTopic`), covered by `tests/contact.test.mjs`. The test suite asserts that PHP `$valid_topics`, frontend `VALID_TOPICS`, and i18n dictionary keys match 100%, and verifies that all service CTAs pass valid parameters.
- `src/pages/Contact.jsx` uses `useSearchParams()` to read `?topic=...`, defaulting safely to `general` if omitted or unknown. The `<select>` element is populated from `t.contact.topics` and resets to the initial query topic upon submission.
- Form styles in `src/pages/Contact.css` include `<select>` with consistent borders, focus rings, background colors, and disabled states.
- Service pages (`Domains.jsx`, `Hosting.jsx`, `WebDevelopment.jsx`, `AiConsulting.jsx`) updated so their CTAs lead directly to `/contact?topic=<service>`.
- Dev: `vite.config.js` includes `mockContactApi()` so local form submissions succeed with JSON `{ ok: true }` instead of failing with Vite 404s.

## Phase 7: Home page — implemented
- Add a "What we offer" section with the four services.
- Place the `DomainSearch` hero variant (defined in Phase 2) on Home as the primary conversion hook, directly under the hero headline, with the existing "Talk about your project" CTA as secondary.
- All Home domain-search strings (headline, placeholder, button, TLD chips, validation errors) in both `es` and `en`.

**Implementation notes (as built)**
- "What we offer" section added to `src/pages/Home.jsx`, rendering a responsive 4-column grid (`.home-services-grid`) of `FeatureCard` components for the four pillars: Domain registration (`/domains`), Web hosting (`/hosting`), Web development (`/web-development`), and AI consulting (`/ai-consulting`).
- Each card includes an icon, title, description, and link to the dedicated service page with accessible link text.
- Hero conversion hierarchy established: `DomainSearch` (hero variant) acts as the primary conversion hook directly under the hero headline and subtitle. The secondary CTA ("Hablemos de tu proyecto" / "Let's talk about your project") is styled as `.btn-secondary` on the dark hero background with translucent glass styling.
- Home domain search copy is completely localized through `t.domains.search`, covering placeholders, buttons, labels, TLD chips, and client-side validation errors in both `es` and `en`.
- Contract tests in `tests/home.test.mjs` verify that all 4 services are mapped in both languages with valid route targets and that the hero conversion components render as expected.

## Phase 8: QA and launch
- Translation key parity: done, as `npm run check:i18n` (plus `npm test` and the build under `npm run verify`).
- Behavior when the API is down: every endpoint error has an ES/EN message, and `available: null` renders as "could not verify" with a contact fallback.
- Responsiveness: checked by eye at 360/768/1200 px; accessibility still needs a pass with a screen reader and keyboard only.
- Still open on the server, and the real launch blockers: `public/.htaccess` must be uploaded, `public/api/config.php` must exist with the live credentials, and `/api/domain-check.php` must answer. `public/api/ping.php` tells which of the three is missing.
- Deployment is by hand, for the reason and the steps recorded under `## Deploy` below.

## Deploy

Publishing is manual. The hosting refuses FTP connections from CI runners, so the
GitHub Actions deploy step uploaded to a directory that never served the domain
while reporting success. The workflow was removed instead of left pretending.

1. On `main`, run `npm run verify` (i18n parity, tests and the production build).
2. Upload the **whole** `dist/` tree into the domain's Document Root
   (`public_html/`), keeping the layout: `.htaccess`, `robots.txt`,
   `sitemap.xml`, `assets/`, the images and `api/`. Everything that lives in
   `public/` reaches the server through the build, so `dist/api/config.php`
   (git-ignored, holds the live credentials) is part of the upload: keep `dist/`
   private and never publish or share it.
3. Verify from outside, in this order:
   - `/api/ping.php` -> `config_present: true`. A 404 means `api/` did not
     arrive; `false` means `config.php` is missing. The endpoint reports which.
   - `/api/domain-check.php?name=presenciavirtual` -> 200 with `results` and prices.
   - `/domains?q=presenciavirtual.com` -> the results page with real prices.
   - `/domains` typed directly -> the app, not a 404: proof the front controller runs.
   - `/api/config.php` -> 403: proof `api/.htaccess` is enforced.
4. If deep links still 404, the host is not applying the `.htaccess`: check
   `AllowOverride`, `mod_rewrite`, and the `Options +FollowSymLinks` the rewrite
   engine needs in per-directory context.
5. Line endings: `.gitattributes` forces LF on `.htaccess` and `*.php` because a
   Windows working tree hands the upload CRLF, which Apache can misread. If a
   file misbehaves only after uploading, check this before anything else.

## Risks
- API credentials must never reach the client or the repo. They currently live in `public/api/config.php`, which is gitignored but is copied into `dist/` by the build, so every deploy artifact contains them.
- `.uy` domains have local-registry rules and may need manual handling; the store does not sell them, so they are simply absent from results.
- Domain search needs rate limiting and caching to prevent abuse and slowness (both implemented; the rate limiter holds one exclusive lock across read/check/write).
- Terms, refund and privacy pages are needed before selling hosting and domains.
- Pricing must be kept in sync with ResellersPanel: the API is the source of truth at runtime (1 h cache), but the dev mock and any figure written in docs go stale.
- The contact form has no rate limiting and no CAPTCHA beyond a honeypot, and it does not log a failed `mail()`.
- Routing depends on `public/.htaccess`; without it every route except `/` returns 404.
