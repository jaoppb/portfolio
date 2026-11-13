# Quality gate

Lighthouse and axe checks that fail CI when performance, accessibility, SEO or best practices regress ([#45](https://github.com/jaoppb/portfolio/issues/45)). The gate is the `quality` job (`Lighthouse & axe`) in `.github/workflows/ci.yml`. It is part of the required `CI` check, runs on every pull request and on `main`, and needs no secrets, so it also runs on fork pull requests.

## 1. What is audited

- **The static export, in indexable mode.** The job builds the site with `NEXT_PUBLIC_SITE_URL=https://example.com` and **without** `NEXT_PUBLIC_ROBOTS_NOINDEX`. Previews and pre-launch production builds set that flag, which would fail the SEO audits by design; the gate checks what production serves after launch. The noindex output is covered by `apps/web/src/app/seo-export.test.ts`.
- **Served like Cloudflare Pages.** `wrangler pages dev apps/web/out` serves the export on `127.0.0.1:8788`, with the Pages routing (`/en` resolves to `en.html`) and the `_headers` file. It runs offline and needs no Cloudflare credentials.
- **Pages:** `/en` and `/pt` (`quality/targets.json`). The root `/` redirect stub is not audited.

Not covered: the real Cloudflare edge (compression, cache headers, CDN latency) and anything that needs interaction. End-to-end tests are [#52](https://github.com/jaoppb/portfolio/issues/52).

## 2. axe

`quality/axe.mjs` opens each page in the runner's Chrome and runs [axe-core](https://github.com/dequelabs/axe-core) with the WCAG 2.0, 2.1 and 2.2 rules at levels A and AA, plus axe's best practices.

| Dimension | Values |
|---|---|
| Page | `/en`, `/pt` |
| Color scheme (`prefers-color-scheme`) | light, dark |
| Viewport | mobile 390 x 844, desktop 1280 x 800 |

That is 8 runs. **Budget: zero violations.** Results that axe cannot decide ("needs manual review") are counted in the report and do not fail the gate.

The component tests in `apps/web` also run axe, in jsdom. jsdom computes no layout or colors, so contrast and anything that depends on real CSS is only checked here.

## 3. Lighthouse

[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) runs each page 3 times with the default mobile emulation (slow 4G, 4x CPU slowdown). The budgets are in `quality/lighthouserc.cjs`.

Budgets that must hold on **every** run, because they do not depend on the speed of the machine:

| Budget | Limit | Measured (`/en`, `/pt`) | Headroom |
|---|---|---|---|
| Accessibility score | 100 | 100, 100 | none |
| Best practices score | 100 | 100, 100 | none |
| SEO score | 100 | 100, 100 | none |
| SEO audits `is-crawlable`, `canonical`, `hreflang`, `meta-description`, `document-title`, `robots-txt`, `http-status-code` | pass | pass | none |
| JavaScript, transferred | 157 000 B | 142 223 B | 10% |
| Fonts, transferred | 95 000 B | 89 652 B | 6% |
| CSS, transferred | 8 000 B | 5 961 B | 34% |
| HTML document, transferred | 14 000 B | 9 923 B, 10 261 B | 36% |
| Total, transferred | 297 000 B | 269 210 B, 269 532 B | 10% |
| Requests | 22 | 20 | 2 requests |
| Third-party requests | 0 | 0 | none |
| Cumulative Layout Shift | 0.01 | 0 | 0.01 |

Lighthouse validates the SEO tags that the page has: a page with no canonical link, no hreflang links or no `robots.txt` counts as "not applicable" and passes. That those exist in the export is asserted by `apps/web/src/app/seo-export.test.ts`, in the `Test & Typecheck` job.

The byte limits leave room for a small change and stop a new dependency or font. CSS and HTML are small and grow with every section, so they have more room in proportion.

Budgets judged on the **median** of the 3 runs, because timing varies between runs on a shared runner:

| Budget | Limit | Measured on the runner (median of each CI run) | Headroom |
|---|---|---|---|
| Performance score | 90 | 99 to 100 | 9 points |
| Largest Contentful Paint | 2 000 ms | 768 to 785 ms | 2.5x |
| Total Blocking Time | 300 ms | 30 to 95 ms | 3x |

The timing headroom is wide on purpose. Between two CI runs of the same commit the runner's CPU speed differed by a factor of two (Lighthouse benchmark index 4 300 and 2 300) and TBT followed it, and one single run out of twelve had an LCP of 2 504 ms. The median of 3 absorbs one such outlier per page. These limits are there to catch a real regression, such as a render-blocking resource or heavy client-side JavaScript, and the byte budgets catch the small ones exactly.

Measured on `main` at `8e52337` (2026-11-13) with Lighthouse 13.6.0 and Chrome 157 on `ubuntu-latest`. Transferred sizes are with the Brotli compression of `wrangler pages dev`.

## 4. Reading a failure

- **Job summary.** The run's summary page has a table of axe runs with each violation (rule, element selector, how to fix, link to the rule), and the Lighthouse scores with every failed budget (page, audit, expected, actual).
- **Artifact `quality-reports`** (kept 14 days): the full Lighthouse HTML and JSON report of every run under `lighthouse/`, and the raw axe results in `axe/results.json`. Open the HTML report of the failing page to see what Lighthouse suggests.
- Reports are never uploaded to Lighthouse's public storage.

## 5. Running it locally

```sh
just quality
```

It deletes the previous reports, builds the indexable export, then runs both audits and prints the same summaries. Reports go to `quality/reports/` (ignored by git). It needs Chrome: either an installed Google Chrome, or `CHROME_PATH` pointing to a Chrome or Chromium binary. Timing budgets are calibrated for the GitHub runner, so the performance score, LCP and TBT can differ on your machine; everything else is identical.

`pnpm test:quality` runs the unit tests of the report helpers.

## 6. Changing a budget (re-baselining)

Budgets come from measurements, never from guesses.

1. Make sure the change that moved the number is intended (a new section, a dependency you chose). If it is a regression, fix it instead.
2. Take the measured values from the job summary or the `quality-reports` artifact of a CI run of your branch. For timing budgets use at least 3 CI runs (re-run the job) and take the worst median.
3. Set the limit in `quality/lighthouserc.cjs` with the same kind of headroom as in section 3, and update the tables in section 3 (limit, measured value, commit and date) in the same pull request.

## 7. Exemptions

The rule is to fix the problem. An exemption is for a real finding that is too large for the pull request that found it.

1. Open a follow-up issue for the fix.
2. Exempt the narrowest thing possible:
   - **axe:** one rule on one element. Add an entry to `quality/axe-exemptions.json`. `selector` is the element's selector exactly as the report prints it. The exemption applies to that rule on that element in all 8 runs:

     ```json
     [{ "rule": "color-contrast", "selector": ".tag", "issue": 123, "reason": "Tag color fails AA in dark mode" }]
     ```

     Never disable a rule globally.
   - **Lighthouse:** one audit. Lower or switch off that single assertion in `quality/lighthouserc.cjs`, with a comment naming the issue. If the audit belongs to a category gated at 100, lower that category to the score measured with the audit failing, in the same comment.
3. List it in the table below.
4. The follow-up issue removes the exemption. An axe exemption that no longer matches anything fails the gate ("Stale exemptions"), so it cannot be forgotten.

### Known exemptions

| Check | Scope | Issue | Reason |
|---|---|---|---|
| None | | | |

## 8. Versions and drift

`@lhci/cli` (which pins Lighthouse), `axe-core`, `puppeteer-core` and `wrangler` are exact versions in the root `package.json`, locked by `pnpm-lock.yaml`. `puppeteer-core` downloads no browser: the gate uses the Chrome preinstalled on the GitHub runner. That Chrome changes with the runner image, so a score can move without a change in this repository. If that happens, re-baseline (section 6).

## 9. CI time

The job takes about 2 minutes (build 15 s, axe 20 s, Lighthouse 65 s) and runs in parallel with the other jobs. The slowest other job takes about 1 minute, so the `CI` check finishes about 1 minute later than before.
