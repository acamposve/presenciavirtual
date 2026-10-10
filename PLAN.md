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
- Script to verify the `es` and `en` translation key trees match.
- Test responsiveness, accessibility, and behavior when the API is down.
- Test against ResellersPanel sandbox/test mode if available.
- `npm run build`, then deploy `dist/` together with the PHP files.

## Risks
- API credentials must never reach the client or the repo.
- `.uy` domains have local-registry rules and may need manual handling.
- Domain search needs rate limiting and caching to prevent abuse and slowness.
- Terms, refund and privacy pages are needed before selling hosting and domains.
- Pricing must be kept in sync with ResellersPanel.
