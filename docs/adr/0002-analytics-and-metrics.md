# ADR 0002: Web Analytics, Interaction Telemetry, and Privacy Architecture

- **Status:** Accepted
- **Date:** 2026-11-17
- **Deciders:** João Pedro (@jaoppb), Agent Spike #50
- **Technical Story:** Issue [#50](https://github.com/jaoppb/portfolio/issues/50) (`spike: evaluate analytics options (gtag/GA4 vs privacy-friendly), pricing and how they work`)
- **Parent Epic:** Issue [#94](https://github.com/jaoppb/portfolio/issues/94) (`Epic: metrics and analytics`)

---

## 1. Context and Problem Statement

The portfolio (`https://jaoppb.com`) is a Next.js static export (`output: "export"`) served on Cloudflare Pages across two locales (`/en` and `/pt`). It is governed by a strict CI quality gate (`docs/workflows/quality-gate.md`, `quality/lighthouserc.cjs`, and `quality/live-check.mjs`) that enforces:
- **100 / 100** scores on Accessibility, Best Practices, and SEO, plus **≥ 90** on mobile Performance.
- **Transferred JavaScript budget:** `157,000 B` (currently `142,215 B` transferred across the entire site — `14,785 B` headroom).
- **Total transferred budget:** `297,000 B` (currently `~267,899 B` — `~29,101 B` headroom).
- **Third-party requests:** `0` (`resource-summary:third-party:count = 0`).
- **Live HTML integrity:** `quality/live-check.mjs` asserts that the live HTML is never rewritten by Cloudflare edge scripts (`!html.includes("/cdn-cgi/")`).

We need to decide whether and how to collect metrics on the portfolio, evaluating how each candidate works under the hood, what it costs as of **2026-11-17**, what it requires under **LGPD** (Brazil) and **GDPR / ePrivacy** (EU/EEA), how it affects Core Web Vitals and the quality gate, and how it is isolated across environments (**production**, **staging**, **PR previews**, **`*.pages.dev`**, and **localhost**).

---

## 2. Decision Drivers & Owner Requirements (from the Grill)

1. **Questions the Metrics Must Answer (Full Interaction Telemetry):**
   - **Traffic & Acquisition:** Page views per locale (`/en`, `/pt`), referrers / UTM sources, countries, and device/viewport breakdown.
   - **Outbound Link Clicks:** Clicks to GitHub profile (`github.com/jaoppb`), LinkedIn (`linkedin.com/in/joao-pedro-peres-barbosa`), `mailto:` contact link, repository source link in `Footer`, and individual project repository and live demo links in `Projects`.
   - **CV Downloads:** Views and downloads of `/cv-joao-pedro-en.pdf` and `/cv-joao-pedro-pt.pdf` in `Contact` (tracked per locale).
   - **Section Read Tracking:** Which portfolio sections (`#hero`, `#about`, `#projects`, `#experience`, `#skills`, `#contact`) visitors actually scroll into and read (via an `IntersectionObserver` threshold, e.g., ≥ 50% visible for ≥ 1.5s, fired once per section per page load).
2. **Budget & Hosting:**
   - **Strictly $0/month recurring cost**, **no recurring subscription or overage charges**, with full data ownership.
   - Leverage the owner's **Google Cloud Platform (GCP) Always Free `e2-micro` VM** (1 GB RAM, 30 GB standard persistent disk in `us-east1` / `us-west1` / `us-central1`) to self-host the analytics platform under a first-party subdomain (`https://metrics.jaoppb.com` proxied via Cloudflare DNS).
3. **Privacy & Consent Stance:**
   - Prefer a **cookieless, banner-free architecture** under LGPD and GDPR/ePrivacy if the tool is lightweight and supports full custom events; evaluated against Google Analytics 4 (`gtag.js` with Advanced Consent Mode v2 and a custom cookie banner).
4. **Environment Isolation (including Staging):**
   - **Never** send telemetry from localhost, PR previews, or `*.pages.dev` URLs (including `jaoppb-portfolio.pages.dev`).
   - Support a dedicated **staging** environment using a **separate analytics website ID** (`NEXT_PUBLIC_ANALYTICS_ID` per environment) combined with a runtime hostname check against `siteUrl` passed from the Server Component (`window.location.hostname === new URL(siteUrl).hostname`) and Umami's `data-domains` allowlist.

---

## 3. Empirical Script Size Measurements (2026-11-17)

Instead of relying on vendor marketing claims, each vendor's production tracker script was fetched directly via `curl` with `Accept-Encoding: br, gzip` on **2026-11-17**:

| Vendor & Script Endpoint | Uncompressed Size | Compressed Over Wire (`br`/`gzip`) | Share of Current `157 kB` JS Budget |
| :--- | ---: | ---: | ---: |
| **Plausible** (`https://plausible.io/js/script.js`) | `2,841 B` (2.8 kB) | **`1,271 B` (1.3 kB)** | 0.8% |
| **Fathom** (`https://cdn.usefathom.com/script.js`) | `6,981 B` (7.0 kB) | **`2,100 B` (2.1 kB)** | 1.3% |
| **Umami** (`https://cloud.umami.is/script.js`) | `9,246 B` (9.2 kB) | **`4,334 B` (4.3 kB)** | **2.8% (Fits existing budget)** |
| **Simple Analytics** (`https://scripts.simpleanalyticscdn.com/latest.js`) | `9,611 B` (9.6 kB) | **`4,895 B` (4.9 kB)** | 3.1% |
| **Cloudflare Web Analytics** (`https://static.cloudflareinsights.com/beacon.min.js`) | `31,853 B` (31.9 kB) | **`10,264 B` (10.3 kB)** | 6.5% |
| **PostHog** (`https://us-assets.i.posthog.com/static/array.js`) | `380,946 B` (380.9 kB) | **`122,928 B` (122.9 kB)** | 78.3% |
| **Google Analytics 4 (`gtag.js`)** (`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`) | `444,573 B` (444.6 kB) | **`153,793 B` (153.8 kB)** | **98.0% (+108% of current site JS)** |

> [!IMPORTANT]
> **Why `gtag.js` is 153.8 kB compressed (444.6 kB raw):** Even without Google Tag Manager (GTM), Google serves `gtag.js` from `www.googletagmanager.com` wrapped inside the full Tag Manager container runtime, bundling Consent Mode v2, Google Ads conversion linkers, Enhanced Measurement, and E-commerce handlers. Downloading `gtag.js` on initial page load transfers **more JavaScript (`153.8 kB`) than the entire Next.js + React 19 portfolio (`142.2 kB`)**, whereas **Umami's tracker is `4.3 kB` compressed (`9.2 kB` raw) — 35x smaller**.

---

## 4. Candidate Comparison Matrix (Pricing Verified 2026-11-17)

| Option | How It Works & Storage | Free Tier, Pricing & Over-Limit Behavior (as of 2026-11-17) | Account & Card Needed? | Custom Events (Clicks, CV, Sections) | Data Retention & Ownership | Export Options | Ad-Blocker Accuracy | Consent Banner Required? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Umami Self-Hosted on GCP Always Free (`e2-micro`)** **[Selected]** | Client JS (`4.3 kB` br) + `fetch` POST to `/api/collect`. **Cookieless**: computes a daily rotating visitor/session hash on the server from IP + User-Agent + daily salt; never stores raw IP or sets cookies. Runs in Docker (Node.js + PostgreSQL) behind Cloudflare-proxied subdomain (`metrics.jaoppb.com`). | **$0/mo forever** (MIT license + GCP Always Free `e2-micro` VM: 1 GB RAM, 30 GB disk, 1 GB North America egress + free Cloudflare edge caching). **Unlimited events, unlimited websites (prod + staging), unlimited team members.** Over-limit: bounded only by the 30 GB disk (~15–25M+ events). | **No** for Umami software; uses existing GCP account (GCP Always Free requires a verified billing account on file, with $0/mo recurring charge within free tier). | **Yes** (`data-umami-event` attributes + `window.umami.track(name, data)`). Full custom event properties & breakdown reports. | **Unlimited** (stored in own PostgreSQL database on GCP). **100% first-party ownership.** | Full CSV export, direct SQL / PostgreSQL `pg_dump`, and full REST API. | **Very High (~95–99%)**: Served from first-party subdomain (`metrics.jaoppb.com`) with custom `/lib.js` and `/api/collect` paths. | **No** (Cookieless, 100% first-party, zero PII or cross-site tracking; exempt from cookie banner under ePrivacy/GDPR & LGPD). |
| **2. Umami Cloud (Hobby Tier)** | Same `4.3 kB` cookieless script sending to `cloud.umami.is/api/send`. Hosted on Umami US/EU servers. | **Cloud Hobby: $0/mo forever** (100,000 events/mo, **1 website**, 6-month retention). **Over-limit on Hobby:** event ingestion pauses for the remainder of the monthly billing cycle once 100k events are reached until monthly reset or upgrade to **Pro** ($20/mo: 1M events, 20 websites, 2-yr retention, API; Pro overages billed at $0.00003/event). **Business:** $200/mo (10M events, 5-yr retention, $0.00002/extra event). | **Account:** Yes.<br>**Card:** **No** on Hobby tier. | **Yes** (Each pageview, custom event, or stored property counts as 1 event against the 100k/mo cap). | **6 months** on Hobby (Pro: 2 yrs). User-owned, never sold. | Dashboard CSV export on Hobby (REST API requires Pro $20/mo). | **Medium (~70–80%)** on `cloud.umami.is` domain. | **No** (Cookieless). |
| **3. Google Analytics 4 (`gtag.js` direct)** | Client JS (`153.8 kB` br) + HTTP POST beacons to `/g/collect`. Sets first-party cookies (`_ga`, `_ga_<id>`, 2-year expiry). Processed on Google multi-tenant US/global servers. | **$0/mo** (GA4 Standard). Unlimited monthly collection; ad-hoc **Explorations** sample above 10M events/query; 50 event-scoped custom dimensions; 30 key events. (GA4 360 starts at ~$50k/yr). | **Account:** Yes (Google).<br>**Card:** **No** (unless enabling BigQuery storage beyond the 1M events/day free export limit). | **Yes** (`gtag('event', ...)` + Enhanced Measurement). | **2 months default, configurable up to 14 months** for granular Explorations; pre-aggregated standard reports kept indefinitely. | CSV/PDF, Looker Studio, Google Analytics Data API, **free BigQuery export** (up to 1M events/day). | **Low (~55–70%)**: `googletagmanager.com` and `google-analytics.com` are blocked by uBlock Origin, Brave, Firefox ETP, and AdGuard. | **Yes** (Mandatory under GDPR/ePrivacy, LGPD, and Google EU User Consent Policy). |
| **4. Google Tag Manager (GTM) + GA4** | Container loader (`gtm.js`, ~80–110 kB br) that then injects `gtag.js` (`153.8 kB` br) — two cascading scripts. | **$0/mo** (Standard GTM container). Same over-limit and query rules as GA4 Standard. | **Account:** Yes.<br>**Card:** **No**. | **Yes** (DOM triggers in GTM UI or `dataLayer.push`). | Same as GA4 (managed in GA4 property). | Same as GA4. | **Low (~50–65%)**: Blocked by all standard ad/tracker lists. | **Yes** (Mandatory). |
| **5. Cloudflare Web Analytics (& Edge Zone HTTP Logs)** | **Client JS mode:** `10.3 kB` br `beacon.min.js` POSTing to `/cdn-cgi/rum` or `cloudflareinsights.com/cdn-cgi/rum`. **Cookieless** (referrer + User-Agent heuristics).<br>**Edge HTTP log mode:** Zero client JS, counts edge HTTP requests in Cloudflare dashboard, but includes bots/prefetches and has zero client interaction awareness. | **$0/mo forever**, unmetered pageviews, unlimited Cloudflare Pages sites. No overage fees or cutoffs. | **Account:** Yes (Cloudflare).<br>**Card:** **No**. | **No (Dealbreaker)**: Supports pageviews and Core Web Vitals (LCP, INP, CLS) only. **Zero custom events** (cannot track outbound clicks, CV downloads, or section views in either JS or edge mode). | **7 days** raw unsampled data; downsampled (~10% sample) aggregated trends for **6 months** (Edge HTTP logs: 24h–30d on Free/Pro). | GraphQL Analytics API (limited); no simple CSV custom event export. | **Medium (~65–75%)** for `beacon.min.js` (on EasyPrivacy / uBlock lists); auto-injected `/cdn-cgi/` violates `live-check.mjs`. Edge logs are 100% unblockable but include bot noise. | **No** (Cookieless, aggregate only). |
| **6. PostHog Cloud (Free Tier)** | Client SDK (`122.9 kB` br `array.js`) + `/e/` POST beacons. By default sets cookies + `localStorage` (`persistence: 'localStorage+cookie'`), or `persistence: 'memory'` (cookieless session-only). Hosted in US or EU Cloud. | **$0/mo Free Tier**: **1,000,000 Product Analytics events/mo**, 5,000 session replays/mo, 1 project, unlimited seats. **Over-limit:** on Free plan without card, **ingestion halts cleanly at 1M events** until next month. Pay-as-you-go unlocks 6 projects & 7-yr retention with custom dollar billing caps. | **Account:** Yes.<br>**Card:** **No** on Free tier (required only to unlock Pay-as-you-go). | **Yes** (`posthog.capture()`, autocapture, scroll depth, custom properties). | **1 year** on Free plan (7 years on paid). Full data ownership. | CSV/JSON export, SQL insights, API, batch exports. | **Low (~55–70%)** on `*.i.posthog.com` unless proxied. | **Yes** in default cookie mode; **No** if configured with `persistence: 'memory'` and IP anonymization. |
| **7. Simple Analytics (Free Tier)** | Client JS (`4.9 kB` br) + POST to `queue.simpleanalyticscdn.com`. **Cookieless** by design, zero IP storage, EU servers (Netherlands). | **Free plan: $0/mo** (1 user, up to 5 websites, unlimited pageviews under fair use, **requires public Simple Analytics badge on site**; custom event history/exports restricted to paid tiers starting at **$20/mo**). **Over-limit:** email notice under fair-use policy; data older than 30 days auto-deleted. | **Account:** Yes.<br>**Card:** **No** on 14-day trial & Free plan. | Automated outbound/download script exists, but custom events & metadata exploration require paid plans ($20+/mo). | **30 days only** on Free plan (data older than 30 days is permanently deleted). | Paid plans only (CSV / raw export / API). | **Medium (~75%)** on default CDN; higher with custom domain proxy (paid). | **No** (Cookieless, EU-hosted). |
| **8. Plausible Analytics** | Client JS (`1.3 kB` br) + POST to `/api/event`. **Cookieless** daily salted hash (IP + User-Agent), EU-owned infrastructure. | **No free tier** (30-day free trial). **Starter:** **$9/mo** (10k pageviews, 1 site, 3-yr retention). **Growth:** **$14/mo** (3 sites). **Business:** **$19/mo** (10 sites, funnels, custom props, API; scales to $19/$29/$39 at 100k). **Over-limit:** no surprise fee or cutoff on a single spike; prompts to upgrade after 2 consecutive months over limit before locking dashboard. **Self-hosted CE (AGPLv3):** Free software, requires ClickHouse + PostgreSQL (~2–4 GB RAM). | **Account:** Yes.<br>**Card:** **No** for 30-day trial; **Yes** after 30 days ($9+/mo). | **Yes** (`plausible(name, { props })`). | **3 years** on Starter/Growth/Business. 100% user-owned, EU hosted. | CSV export, Stats API (Business), Self-hosted DB. | **Medium (~70–80%)** on `plausible.io`; **High (~95%)** with proxy. | **No** (Cookieless). |
| **9. Fathom Analytics** | Client JS (`2.1 kB` br) + cookieless salted hash on EU/US edge isolation. | **No free tier** (7-day trial). **$15/mo** (up to 100k pageviews, 50 sites), **$25/mo** (200k), **$45/mo** (500k). **Over-limit:** never drops traffic during spikes; contacts owner to upgrade tier if consistently exceeded. | **Account:** Yes.<br>**Card:** **Yes** (Required upfront even for the 7-day trial). | **Yes** (`fathom.trackEvent()`). | Indefinite while subscribed. | CSV export & API included. | **Medium-High**. | **No** (Cookieless). |

---

## 5. Deep-Dive Technical, Privacy, and Performance Analysis

### 5.1 Privacy & Consent: Brazil (LGPD) + EU Visitors (GDPR / ePrivacy)

Because the owner is based in Brazil and the portfolio targets international engineering roles (including EU/EEA visitors):
- **Brazilian LGPD (Lei nº 13.709/2018) & ANPD Cookie Guide (*Guia Orientativo: Cookies e Proteção de Dados Pessoais*, Oct 2022):**
  - Strictly necessary cookies do not require consent.
  - Analytical cookies that identify a device/browser across sessions (such as GA4's `_ga` cookie) are classified as *non-essential* (`cookies analíticos / de desempenho não estritamente necessários`) and require prior opt-in consent and clear disclosure when shared with a third-party processor.
- **EU GDPR (Reg. 2016/679) & ePrivacy Directive (Art. 5(3)):**
  - ePrivacy Art. 5(3) strictly requires prior informed opt-in before reading or writing any non-essential information (cookies or `localStorage` identifiers) on the user's terminal equipment.
  - Furthermore, **Google's EU User Consent Policy** contractually requires any site using GA4 with EU/UK visitors to implement **Google Consent Mode v2** (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) alongside a compliant first-layer consent banner.

#### What a Compliant Cookie Consent Banner Costs in Design, Accessibility, and Performance:
If a cookie-based tool like GA4 (`gtag.js` with Consent Mode v2) were adopted, building a legally compliant banner imposes concrete costs across three dimensions:
1. **Design Cost (`impeccable-design`):**
   - Directly conflicts with **Editorial Restraint** and **Content-First Structure** (`.agent/skills/impeccable-design/SKILL.md` §1) by superimposing a persistent cookie bar over the portfolio on every new visitor's first impression.
   - Legal anti-dark-pattern rules (ANPD & GDPR/EDPB) mandate **equal visual prominence** for "Accept" and "Decline" buttons on the first layer (identical button sizing, border weight, and contrast), plus a permanent **"Privacy / Manage Cookies"** revocation button in `Footer` that deletes `_ga` and `_ga_*` cookies when toggled off.
2. **Accessibility Cost (`area:seo-a11y`, `quality/axe.mjs`, `docs/workflows/launch.md` §5):**
   - **Focus order:** Per `docs/workflows/launch.md` §5 ("Keyboard and focus"), the `<SkipLink href="#main-content">` **must remain the first tab stop** on `/en` and `/pt`. A consent banner cannot trap focus (`aria-modal="true"` is inappropriate for a non-blocking notice) or precede the skip link in DOM order; it must be mounted at the end of the document as a labelled landmark (`<section aria-labelledby="...">` or `role="region"`) so screen-reader and keyboard users can navigate the portfolio unimpeded.
   - **Contrast & Reduced Motion:** Must pass all 8 `quality/axe.mjs` matrix runs (`light`/`dark` × `390×844` mobile / `1280×800` desktop) with zero WCAG AA/AAA violations and honour `motion-reduce:transition-none`.
3. **Performance & Hydration Cost (`react-best-practices`, `quality/lighthouserc.cjs`):**
   - Under `output: "export"`, the server HTML cannot know the visitor's `localStorage` consent state at build time. To prevent React hydration mismatches (`.agent/skills/react-best-practices/SKILL.md` §2), the banner must render `null` during SSR/initial hydration and mount inside `useEffect` after reading `localStorage`.
   - Mounting the banner after hydration must use `fixed bottom-0 inset-x-0 z-50` positioning so it never pushes document flow (`cumulative-layout-shift <= 0.01` budget), and on narrow mobile viewports (`390×844`) it must not obscure the primary Hero heading (`LCP` element).

#### Why Self-Hosted Umami Requires Zero Cookie Banner:
1. **Zero client storage:** Umami sets **no cookies** and writes **nothing** to `localStorage`, `sessionStorage`, or `IndexedDB`.
2. **No fingerprinting or raw IP storage:** On the server, Umami computes a transient daily rotating hash (`hash(daily_salt + website_id + ip + user_agent)`) to distinguish unique daily sessions, and never stores raw IP addresses. A visitor cannot be tracked across days or across websites.
3. **100% first-party processing:** Because Umami is self-hosted by João Pedro on his own GCP instance (`metrics.jaoppb.com`), zero visitor data is shared with third-party ad networks or external data brokers.
4. **Result under ePrivacy Art. 5(3), GDPR Art. 6(1)(f), and LGPD Art. 7(IX):** Because no terminal storage is accessed and only anonymized, strictly first-party aggregate metrics are recorded, **no cookie consent banner is required**. A concise, transparent privacy note in the site footer satisfies transparency obligations under LGPD Art. 9 and GDPR Art. 13 without interrupting visitors.

---

### 5.2 Technical Fit & Impact on the Quality Gate (`quality/lighthouserc.cjs` & `quality/live-check.mjs`)

Currently, `quality/lighthouserc.cjs` enforces these hard assertions on `/en` and `/pt`:
- `resource-summary:third-party:count`: **`0`** (enforced on both CI gate and live site)
- `resource-summary:script:size`: **`157,000 B`** (current measured: `142,215 B` → `14,785 B` headroom)
- `resource-summary:total:size`: **`297,000 B`** (current measured: `267,899 B` → `29,101 B` headroom)
- `resource-summary:total:count`: **`22`** (current measured: `20` → `2` requests headroom)

Comparing the impact of our top 3 candidates on the quality gate:

| Metric / Gate Assertion | Current Baseline (`main`) | **1. Umami Self-Hosted (`metrics.jaoppb.com`, `4.3 kB`)** | **2. GA4 (`gtag.js` Advanced Consent Mode, `153.8 kB`)** | **3. Cloudflare Web Analytics (`10.3 kB`)** |
| :--- | :--- | :--- | :--- | :--- |
| **Custom Events Support** | N/A | **Full** (`umami.track(...)`) | **Full** (`gtag('event', ...)`) | **None (Fails requirement)** |
| **Added Compressed JS** | `0 B` | **`+4,334 B` (+4.3 kB)** | **`+153,793 B` (+153.8 kB)** | `+10,264 B` (+10.3 kB) |
| **Total Script Size vs `157 kB` Budget** | `142.2 kB` (PASS) | **`~146.5 kB` (PASSES within existing 157 kB budget!)** | `~296.0 kB` (FAILS by ~139 kB) | `~152.5 kB` (PASSES within 157 kB) |
| **Total Page Size vs `297 kB` Budget** | `267.9 kB` (PASS) | **`~272.2 kB` (PASSES within existing 297 kB budget!)** | `~422.5 kB` (FAILS by ~125 kB) | `~278.2 kB` (PASSES within 297 kB) |
| **Third-Party Requests (`max: 0`)** | `0` (PASS) | **`0` (Same root domain `*.jaoppb.com` counts as first-party in Lighthouse!)** | `2` (`googletagmanager.com` + `google-analytics.com`) — FAILS | `2` (`cloudflareinsights.com`) — FAILS |
| **TBT / Main-Thread Parse Impact** | `30–95 ms` | **`< 3 ms`** (`9.2 kB` uncompressed JS) | `+40–90 ms` (`444.6 kB` uncompressed JS) | `< 5 ms` (`31.9 kB` uncompressed JS) |
| **Consent Banner UI Required?** | No | **No** | **Yes** | No |

> [!TIP]
> **First-Party Subdomain Bonus in Lighthouse:** Lighthouse classifies third-party requests by registrable root domain (eTLD+1, i.e., `jaoppb.com`). Because our self-hosted Umami instance lives at `https://metrics.jaoppb.com` (same eTLD+1 as `https://jaoppb.com`), Lighthouse treats both the `/lib.js` script request and the `/api/collect` beacon as **first-party requests**. Consequently, **`resource-summary:third-party:count` remains `0`** on both the CI gate (`just quality`) and the live production audit (`just quality-production indexable`), and the `4.3 kB` script fits inside the existing `157 kB` script budget and `22` total request budget without loosening a single assertion in `quality/lighthouserc.cjs`!

---

### 5.3 Self-Hosting Architecture on GCP Always Free (`e2-micro`) + Cloudflare

1. **Compute & Database (`e2-micro` VM in `us-east1`, `us-west1`, or `us-central1`):**
   - **Instance:** 1x `e2-micro` (2 shared vCPUs, **1 GB RAM**, 30 GB Standard Persistent Disk) — 100% covered by GCP's Always Free tier ($0/month).
   - **Swap configuration:** Configure a `1 GB`–`2 GB` swapfile on the persistent disk so container startup and Prisma migrations never trigger OOM on 1 GB RAM.
   - **Containers (Docker Compose):**
     - `postgres:16-alpine` tuned for low memory (`shared_buffers=128MB`, `work_mem=4MB` — ~60–90 MB RSS).
     - `ghcr.io/umami-software/umami:postgresql-latest` (Next.js standalone server — ~110–160 MB RSS).
     - Combined steady-state memory footprint is **~250–350 MB**, well inside the `e2-micro`'s 1 GB RAM. *(By contrast, Plausible CE requires ClickHouse + PostgreSQL and consumes ~2–4 GB RAM, making Umami uniquely suited for `e2-micro`.)*
   - **Custom Tracker & Collect Endpoints (Ad-Blocker Resilience):**
     - Configure Umami environment variables:
       - `TRACKER_SCRIPT_NAME=lib.js` (avoids generic `/script.js` filter rules).
       - `COLLECT_API_ENDPOINT=/api/collect` (avoids `/api/send` filter rules).
       - `DISABLE_TELEMETRY=1` (disables Umami's own outbound version-check ping).
2. **DNS & TLS via Cloudflare (`terraform/main.tf`):**
   - Add a proxied `A` record for `metrics.jaoppb.com` pointing to the GCP `e2-micro` external IP in `terraform/main.tf`.
   - Cloudflare terminates edge TLS, caches `https://metrics.jaoppb.com/lib.js` at the edge (reducing VM egress to near zero, well within GCP's 1 GB/month free egress allowance), and forwards `/api/collect` requests with `CF-Connecting-IP` and `CF-IPCountry` headers (`CLIENT_IP_HEADER=cf-connecting-ip` in Umami so country/city geolocation works automatically at the edge without needing a heavy MaxMind GeoIP database on the VM!).

---

### 5.4 Multi-Environment Isolation Architecture (Prod, Staging, Previews, `*.pages.dev`, Localhost)

As documented in `docs/workflows/launch.md`, the production build in `deploy-production.yml` is deployed to Cloudflare Pages project `jaoppb-portfolio`, which serves the exact same static HTML bundle on both `https://jaoppb.com` and `https://jaoppb-portfolio.pages.dev` (plus `<hash>.jaoppb-portfolio.pages.dev`).

#### How Each Evaluated Option Is Switched Off Outside Production / Staging:
- **Umami (Selected):** Supports a native `data-domains="jaoppb.com"` script attribute (which instructs Umami's client tracker to short-circuit if `window.location.hostname` is not in the comma-separated allowlist), reinforced by our Two-Gate check below so the `<Script>` tag is not even requested on `*.pages.dev`, previews, or localhost.
- **Plausible / Fathom / Simple Analytics:** Plausible automatically ignores `localhost` and checks `data-domain="jaoppb.com"`; Fathom supports `data-included-domains="jaoppb.com"`; Simple Analytics supports `data-hostname="jaoppb.com"`, combined with build-time `NEXT_PUBLIC_*` gating.
- **Google Analytics 4 (`gtag.js`) & GTM:** Gated by omitting `NEXT_PUBLIC_GA_MEASUREMENT_ID` on preview/local builds, checking `window.location.hostname` before injecting `gtag.js` (or setting `window['ga-disable-G-XXXXXXXXXX'] = true` before script execution), and configuring GA4 Data Stream hostname filters.
- **PostHog:** Gated by skipping `posthog.init()` (or calling `posthog.opt_out_capturing()`) when `NEXT_PUBLIC_POSTHOG_KEY` is unset or `window.location.hostname` does not match the canonical host.
- **Cloudflare Web Analytics:** Requires **disabling** Cloudflare's "Automatic setup" on the Pages project and Zone (otherwise Cloudflare auto-injects the beacon on `*.pages.dev` and rewrites HTML with `/cdn-cgi/` scripts, violating `quality/live-check.mjs`), and instead manually rendering `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "..."}'>` behind build-time + runtime host gates.

#### The Two-Gate Isolation Pattern (for our `<Analytics />` Component)

1. **Gate 1 — Build-Time Environment Variables (`NEXT_PUBLIC_ANALYTICS_ID` & `NEXT_PUBLIC_ANALYTICS_HOST`):**
   - **Localhost (`pnpm dev` / local build) & CI (`ci.yml`):** `NEXT_PUBLIC_ANALYTICS_ID` is unset (`undefined`). The `<Analytics />` component renders `null`.
   - **PR Previews (`deploy-preview.yml`):** `NEXT_PUBLIC_ANALYTICS_ID` is unset (`undefined`). Zero analytics markup is emitted.
   - **Staging (`deploy-staging.yml` / staging environment):** `NEXT_PUBLIC_SITE_URL` is set to the staging URL (e.g., `https://staging.jaoppb.com`) and `NEXT_PUBLIC_ANALYTICS_ID` is set to the dedicated **`portfolio-staging` website UUID** created in our self-hosted Umami instance.
   - **Production (`deploy-production.yml`):** `NEXT_PUBLIC_SITE_URL=https://jaoppb.com`, `NEXT_PUBLIC_ANALYTICS_HOST=https://metrics.jaoppb.com`, and `NEXT_PUBLIC_ANALYTICS_ID` is set to the **`portfolio-prod` website UUID**.

2. **Gate 2 — Runtime Hostname Verification + `next/script` Strategy:**
   - **Important Next.js Client Bundle Rule:** In `apps/web/src/shared/config/site.ts`, `siteConfig.url` is computed via `resolveSiteUrl(process.env)`. Because Next.js only inlines static literal property reads (`process.env.NEXT_PUBLIC_SITE_URL`) in `'use client'` bundles and replaces dynamic `process.env` objects with `{}`, a `'use client'` component must **either** receive `siteUrl={siteConfig.url}` as a prop from its parent Server Component (`apps/web/src/app/[lang]/page.tsx`) **or** read `process.env.NEXT_PUBLIC_SITE_URL` directly via literal property access.
   - Inside `apps/web/src/features/analytics/components/analytics.tsx` (`'use client'`), on mount (`useEffect`), the component checks:
     ```ts
     const expectedHost = new URL(siteUrl).hostname;
     if (window.location.hostname !== expectedHost) return;
     ```
   - When verified, it renders `next/script` with **`strategy="afterInteractive"`** (or `strategy="lazyOnload"`), `src={`${analyticsHost}/lib.js`}`, `data-website-id={analyticsId}`, and `data-domains={expectedHost}`:
     - `strategy="afterInteractive"` loads and executes `lib.js` (`4.3 kB`) asynchronously after hydration completes, ensuring zero render blocking and zero impact on FCP/LCP.
     - When anyone visits `https://jaoppb-portfolio.pages.dev` or `https://<hash>.jaoppb-portfolio.pages.dev`, `window.location.hostname` (`*.pages.dev`) does not match `expectedHost` (`jaoppb.com`), so **not even the `<Script>` request is made and zero events are dispatched**.

---

### 5.5 Event Schema, Fallow Boundaries & React App Router Architecture (`react-best-practices`)

Per `.agent/skills/react-best-practices/SKILL.md` and `docs/adr/0001-boundary-enforcement-fallow.md` (`.fallowrc.jsonc`):
- **Fallow Boundary Compliance (`app/` Composition, Never Cross-Feature Imports):**
  - Per `.fallowrc.jsonc` (`from: "features", allow: ["shared", "components-ui"]`), sibling feature slices under `apps/web/src/features/*` **cannot import one another** (so `features/shell` must never import `features/analytics`).
  - Instead, `<Analytics locale={locale} siteUrl={siteConfig.url} />` (`apps/web/src/features/analytics/components/analytics.tsx`, `'use client'`) is mounted at the **`app/` composition root** inside `apps/web/src/app/[lang]/page.tsx` right alongside `<PersonJsonLd locale={locale} dict={dict} />` as a child passed into `<SiteShell>`.
  - All pages (`apps/web/src/app/[lang]/page.tsx`) and layouts (`apps/web/src/app/[lang]/layout.tsx`) **remain 100% Server Components**.
- **Declarative Event Delegation (Zero Client Component Bloat in Feature Slices):**
  Instead of converting `<Hero />`, `<Projects />`, `<Experience />`, `<Contact />`, or `<Footer />` into Client Components just to attach `onClick` handlers, Server Components render semantic `data-analytics-*` attributes on native `<a>` and `<section>` elements:

| Event Name | Trigger Mechanism | Properties Recorded | Target Server Components & Elements |
| :--- | :--- | :--- | :--- |
| `pageview` | Automatic on route load via Umami tracker (`lib.js`) | `url` (`/en`, `/pt`), `referrer`, `language`, `country` (`CF-IPCountry`), `device` | `/en` and `/pt` pages |
| `cv_download` | Delegated `click` on `a[data-analytics-event="cv_download"]` | `{ locale: "en" \| "pt", action: "view" \| "download", file: "cv-joao-pedro-en.pdf" \| "cv-joao-pedro-pt.pdf" }` | CV view & download links in `Contact` (`apps/web/src/features/contact/components/contact.tsx`) |
| `outbound_click` | Delegated `click` on `a[data-analytics-event="outbound_click"]` | `{ target: "github" \| "linkedin" \| "email" \| "source_repo" \| "project_repo" \| "project_live", label: string, locale: "en" \| "pt" }` | Profile & email links in `Contact`, source repository link in `Footer` (`features/shell`), and project repo/demo links in `Projects` (`project-card.tsx`) |
| `section_view` | Single `IntersectionObserver` (`threshold: 0.5`, `1500ms` dwell timer, fired once per section per page load) | `{ section: "hero" \| "about" \| "projects" \| "experience" \| "skills" \| "contact", locale: "en" \| "pt" }` | `<section id="...">` landmarks across the portfolio |

- **Headers (`apps/web/public/_headers`):**
  - Set `Referrer-Policy: strict-origin-when-cross-origin` (sends origin on cross-origin navigation and full path on same-origin navigation).
  - If a `Content-Security-Policy` header is added (tracked separately), allow `script-src 'self' https://metrics.jaoppb.com` and `connect-src 'self' https://metrics.jaoppb.com`.

---

## 6. Decision Outcome

**Verdict: Adopt Self-Hosted Umami on GCP Always Free (`e2-micro`) behind `https://metrics.jaoppb.com`.**

### Consequences

- **Positive:**
  - **Ultra-lightweight (`4.3 kB` compressed vs `153.8 kB` for `gtag.js`):** Fits inside the existing `157,000 B` JS budget, `297,000 B` total byte budget, and `22` request budget without loosening any Lighthouse CI limit.
  - **Zero third-party requests (`third-party:count = 0`):** Serving from `metrics.jaoppb.com` (same eTLD+1 root domain `jaoppb.com`) satisfies Lighthouse's first-party check on both CI (`just quality`) and live production audits (`just quality-production indexable`), and bypasses third-party domain blocklists.
  - **Zero cookie banner required:** Cookieless, anonymized daily session hashing with zero client storage and 100% first-party data ownership satisfies LGPD and GDPR/ePrivacy without degrading the portfolio's editorial design (`impeccable-design`) or keyboard skip-link focus order.
  - **Full custom event telemetry:** Captures pageviews per locale, referrers, countries (via Cloudflare `CF-IPCountry`), outbound clicks, CV downloads, and section-read depth.
  - **Unlimited websites & retention at $0/month:** Dedicated `portfolio-prod` and `portfolio-staging` websites with unlimited historical retention on the GCP Always Free `e2-micro` VM.
- **Negative / Operational Trade-offs:**
  - Requires provisioning and maintaining a small Docker Compose stack (`umami` + `postgres:16-alpine`) on a GCP `e2-micro` VM and adding a Cloudflare DNS `A` record for `metrics.jaoppb.com` in Terraform.

---

## 7. Rejected Options

1. **Google Analytics 4 (`gtag.js` Direct + Consent Mode v2):**
   - *Reason for rejection:* `gtag.js` transfers **`153.8 kB` compressed (`444.6 kB` raw)** — more than doubling the portfolio's entire JavaScript bundle (`142.2 kB`), breaking the `157 kB` JS budget, `297 kB` total byte budget, and `0` third-party request budget, while also requiring a bilingual cookie consent banner that clutters the UI and loses ~40–70% of developer visitors who decline cookies or use ad blockers.
2. **Google Tag Manager (`gtm.js` + `gtag.js`):**
   - *Reason for rejection:* Adds an extra ~80–110 kB container runtime on top of `153.8 kB` `gtag.js` (~240+ kB compressed third-party JS total) for tag-management UI features unnecessary when events can be dispatched cleanly via a 50-line TypeScript leaf component.
3. **Cloudflare Web Analytics (`beacon.min.js`, `10.3 kB`):**
   - *Reason for rejection:* Does **not** support custom events (`outbound_click`, `cv_download`, `section_view`). Additionally, only retains raw data for 7 days (downsampled to 10% for 6 months), and automatic zone injection rewrites HTML with `/cdn-cgi/` scripts which violates `quality/live-check.mjs`.
4. **Umami Cloud (Hobby $0 Tier):**
   - *Reason for rejection as primary host:* Capped at 1 website and 6-month retention on the free tier (pausing ingestion above 100k events/mo), and `cloud.umami.is` is a third-party domain (breaking `third-party:count = 0` and blocked by stricter ad-block lists). Kept as a zero-ops fallback if the GCP VM is ever decommissioned.
5. **PostHog Cloud (`array.js`, `122.9 kB`):**
   - *Reason for rejection:* Generous free tier (1M events/mo, no card), but the client SDK is `122.9 kB` compressed (`380.9 kB` raw) — built for heavy SaaS product analytics, session replay, and feature flags rather than a lean static portfolio.
6. **Simple Analytics (Free Plan):**
   - *Reason for rejection:* Free plan deletes all data after **30 days**, requires placing a promotional Simple Analytics badge on the portfolio (violating `impeccable-design`), and gates custom event reporting/exports behind the $20/month plan.
7. **Plausible Cloud & Fathom Cloud (and Plausible CE):**
   - *Reason for rejection:* No permanent $0 cloud tier ($9/month and $15/month respectively; Fathom requires a credit card upfront even for the 7-day trial). Plausible Community Edition requires both ClickHouse and PostgreSQL (~2–4 GB RAM), which exceeds the 1 GB RAM of a GCP Always Free `e2-micro` VM.

---

## 8. Follow-Up Issues under Epic #94

To implement this decision cleanly across infrastructure, frontend telemetry, and documentation, the following stories have been filed under Epic [#94](https://github.com/jaoppb/portfolio/issues/94) (`Milestone: v0.3.0`):

1. **[`chore: provision self-hosted Umami on GCP e2-micro and metrics.jaoppb.com DNS (#104)`](https://github.com/jaoppb/portfolio/issues/104)** (`type:chore`, `area:tooling`, Milestone `v0.3.0`, Priority `P3`, Effort `5`)
   - Document and codify the Docker Compose stack (`umami:postgresql-latest` + `postgres:16-alpine` tuned for 1 GB RAM + swapfile, `CLIENT_IP_HEADER=cf-connecting-ip`, `TRACKER_SCRIPT_NAME=lib.js`, `COLLECT_API_ENDPOINT=/api/collect`, `DISABLE_TELEMETRY=1`) and add the proxied Cloudflare DNS record for `metrics.jaoppb.com` in `terraform/` (or document operator setup in `docs/workflows/`).
   - Create `portfolio-prod` and `portfolio-staging` websites in Umami and configure `NEXT_PUBLIC_ANALYTICS_ID` / `NEXT_PUBLIC_ANALYTICS_HOST` in GitHub Actions environments.
2. **[`feat: integrate Umami analytics client leaf and declarative interaction events (#105)`](https://github.com/jaoppb/portfolio/issues/105)** (`type:feat`, `area:ui`, `area:tooling`, `area:seo-a11y`, Milestone `v0.3.0`, Priority `P3`, Effort `3`)
   - Implement `apps/web/src/features/analytics/components/analytics.tsx` (`'use client'`) mounted from `apps/web/src/app/[lang]/page.tsx` (preserving Fallow cross-feature boundaries), with two-gate environment isolation (`NEXT_PUBLIC_ANALYTICS_ID` + runtime `window.location.hostname === new URL(siteUrl).hostname` check and `data-domains` allowlist so previews, localhost, and `*.pages.dev` never fire) and `next/script` `strategy="afterInteractive"`.
   - Add delegated click tracking (`cv_download` in `Contact`, `outbound_click` in `Contact`, `Footer`, and `Projects`) and `IntersectionObserver` section-read tracking (`section_view` on `#hero`, `#about`, `#projects`, `#experience`, `#skills`, `#contact`) plus `data-analytics-*` attributes on Server Components.
   - Add `Referrer-Policy: strict-origin-when-cross-origin` in `apps/web/public/_headers` and unit/integration tests for the analytics leaf and environment gates.
3. **[`feat: add cookieless privacy transparency note to the portfolio footer (#106)`](https://github.com/jaoppb/portfolio/issues/106)** (`type:feat`, `area:content`, `area:ui`, Milestone `v0.3.0`, Priority `P3`, Effort `1`)
   - Add a concise, editorial-restraint bilingual (`/en` and `/pt`) privacy note in the footer or dictionary explaining that the site uses first-party, cookieless, anonymized metrics with zero cross-site tracking or personal data collection (satisfying LGPD/GDPR transparency without a banner).
