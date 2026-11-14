# Production launch

How `https://jaoppb.com` goes from deployed but hidden to public and indexable ([#47](https://github.com/jaoppb/portfolio/issues/47)), how to check it, and how to undo it. The decisions behind each rule are in the issue.

## 1. What each host answers

| Host | Answer | Where it is configured |
|---|---|---|
| `https://jaoppb.com` | The site. The only indexable host and the canonical URL of every page | `NEXT_PUBLIC_SITE_URL` in `deploy-production.yml` |
| `https://jaoppb.com/` | 302 to `/en` | `apps/web/public/_redirects` |
| `https://www.jaoppb.com/*` | 301 to the same path and query on the apex | `cloudflare_ruleset.redirects` in `terraform/main.tf` |
| `http://` on both hosts | 301 to `https://` | Cloudflare, not in Terraform |
| `https://jaoppb-portfolio.pages.dev` | The production deploy, with `X-Robots-Tag: noindex` | `apps/web/public/_headers` |
| `https://<branch or hash>.jaoppb-portfolio.pages.dev` | A preview or a single deploy, with `X-Robots-Tag: noindex` | Cloudflare Pages for previews, `apps/web/public/_headers` for all of them |

Notes:

- **Root.** The redirect is fixed, because `_redirects` cannot redirect by language. Negotiating by `Accept-Language` is #81. It is a 302 so that browsers do not cache it before then. The stub page of `app/(root)` stays in the export for hosts that do not read `_redirects`.
- **`www`.** The `www` DNS record and Pages domain stay, so the request reaches Cloudflare with a valid certificate. The redirect rule answers before Pages does. It skips `/.well-known/`, in case the renewal of the `www` certificate (it expires on 2027-02-04) is validated over HTTP.
- **`pages.dev`.** `_headers` matches by host, so the header is sent only there and never on `jaoppb.com`. The production deploy on `pages.dev` has the same HTML as `jaoppb.com`, including the canonical link to `jaoppb.com`. Cloudflare Pages already sends the header on preview deploys. The rule is what covers the production deploy, on the project host and on its hash URL.
- **Email link.** `cloudflare_zone_settings_override.zone` turns off Email Address Obfuscation. With it on, Cloudflare rewrites the contact `mailto:` link into a `/cdn-cgi/l/email-protection` link that needs an injected script. That only happens on the zone, so neither the CI gate nor a preview shows it.
- **404 pages** are noindex in every state.

## 2. The launch switch

`NEXT_PUBLIC_ROBOTS_NOINDEX: "1"` in the `Build site` step of `deploy-production.yml` keeps production hidden: `robots.txt` disallows everything, the sitemap is empty and every page carries `noindex, nofollow`. Removing that line is the launch. The next production deploy is indexable.

Previews always set the flag (`deploy-preview.yml`), so they stay hidden.

The launch is two pull requests:

1. **Everything except the switch.** Redirects, headers, Terraform, the audit tooling and this document. After the merge, the owner approves the `terraform-apply` deployment, and the live state is checked while the site is still hidden (section 4, state `noindex`).
2. **The switch alone.** One commit that removes the line. It is opened only after the owner says go, and after #74, #75, #76 and #77 are merged.

### Rollback

Revert the switch commit and let `Deploy Production` run. The deploy starts after the `CI` run of the revert on `main` succeeds, so the pages carry `noindex` again about five minutes after the merge. `robots.txt` is served with a four-hour browser cache by the zone, so a crawler that just fetched it can keep the old one for that long; the same delay applies right after the switch. A revert does not undo what crawlers fetched in between: pages that were indexed stay in results until the crawler sees the `noindex` again, which can take days. That is why the switch needs the owner's go.

## 3. Prerequisites

Set by the owner, by hand, before the first pull request is merged:

1. **Token permissions.** Add Single Redirect and Zone Settings to the plan token (Read) and to the apply token (Edit), as listed in [terraform-pipeline.md](terraform-pipeline.md#3-cloudflare-token-scopes). A passing plan on the pull request does not prove the tokens are ready: the two resources are new, so that plan has nothing to read. The apply after the merge needs Edit, and every later plan needs Read.
2. **Search Console property.** Create the Domain property (section 6, steps 1 and 2). Its TXT value is `cloudflare_record.google_site_verification` in `terraform/main.tf`, so the same apply creates the record.

## 4. Checking the live site

```sh
just quality-production noindex     # before the switch
just quality-production indexable   # after the switch
```

The same audit runs on GitHub from Actions, `Quality Production`, `Run workflow`, with the state as input. It can run once the workflow file is on `main`. Prefer that run for the evidence in section 7: a local machine under load lowers the performance score.

It is separate from the quality gate in [quality-gate.md](quality-gate.md). The gate audits the build of a pull request on a local server, so it is repeatable and required. This audit reads the live hosts, so it depends on the network and on what is deployed: it is a workflow of its own, started by hand, outside the required `CI` check. It uses no secrets and no environment.

What it checks (`quality/live-check.mjs`, then axe and Lighthouse with `QUALITY_TARGET=production`):

| Check | Before the switch | After the switch |
|---|---|---|
| `/` | 302 to `/en` | same |
| `www` | 301 to the apex, path and query kept | same |
| `http://` on both hosts | 301 or 308 to `https://`, on the same host or on the apex | same |
| `/en`, `/pt` | 200, canonical, hreflang, Person JSON-LD, OG image is a PNG served as `image/png`, no `X-Robots-Tag`, no `/cdn-cgi/` rewrite | same |
| Every link of both pages | Links to the site (CV PDFs, the other locale) answer 200 and PDFs are real PDFs. Links to other sites answer 2xx after redirects; one that refuses automated requests is listed as not checked | same |
| Robots meta on `/en`, `/pt` | `noindex, nofollow` | none |
| `robots.txt` | disallows everything | allows everything, names the sitemap |
| `sitemap.xml` | empty | `https://jaoppb.com/en`, `https://jaoppb.com/pt` |
| Unknown paths | 404, noindex | same |
| `pages.dev` | 200 with `X-Robots-Tag: noindex`, canonical on `jaoppb.com` | same |
| axe, 8 runs | zero violations | same |
| Lighthouse accessibility, best practices | 100 on every run | same |
| Lighthouse SEO and its audits | not asserted (a hidden site fails them by design) | 100 on every run |
| Lighthouse performance | 90 on the median | same |
| Lighthouse third-party requests, layout shift | 0 requests, CLS at most 0.01 | same |

Bytes, LCP and TBT on the real edge are in the reports as evidence. They are not asserted, because they depend on the network.

A preview host has no fixed name, so check one by hand on a pull request's preview:

```sh
curl -sI https://<branch>.jaoppb-portfolio.pages.dev/en | grep -i x-robots-tag
```

### Preview deploys

A preview is built with its branch alias (`https://<branch>.jaoppb-portfolio.pages.dev`) as `NEXT_PUBLIC_SITE_URL`, so its canonical, hreflang and OG URLs point at itself and an OG card can be tested on a pull request. The alias is computed before the build from the branch name. Cloudflare documents only part of the rule, so the deploy step compares it with the alias that wrangler reports and fails the job if they differ. If that happens the preview is already deployed (and hidden) with the wrong URLs: fix the rule in the `Resolve preview URL` step, or rename the branch.

## 5. Manual passes

Done by the owner on `https://jaoppb.com` before the switch. Tick each one in the pull request of the switch.

- **Keyboard.** On `/en` and `/pt`, at a phone width and at a desktop width: Tab through the whole page. The skip link is first and works, focus is always visible, the order follows the reading order, the language switcher and every link work with Enter, nothing traps focus.
- **Screen reader.** One reader (Orca, NVDA or VoiceOver) on `/en` and `/pt`: the page language is announced correctly, headings form one outline, landmarks and the navigation are named, links make sense out of context, and links that open a new tab say so.
- **Proofreading.** Every string in both languages. The copy lives in:
  - `apps/web/src/shared/dictionaries/en.ts` and `pt.ts`
  - `apps/web/src/features/portfolio-showcase/projects.ts` (project summaries)
  - `apps/web/public/cv-joao-pedro-en.pdf` and `cv-joao-pedro-pt.pdf`

  Read them on the rendered pages too, including the 404 page (`/en/x`, `/pt/x`) and the OG images (`/en/opengraph-image`, `/pt/opengraph-image`). Copy fixes are separate issues.

## 6. Search engines

Done by the owner. Steps 1 to 3 can happen before the switch; submit the sitemap only after it.

1. Open [Google Search Console](https://search.google.com/search-console), add a property and choose **Domain**. Enter `jaoppb.com`. A Domain property covers the apex, `www`, `http` and `https`.
2. Search Console shows a TXT record of the form `google-site-verification=<value>`. Do not add it in the Cloudflare dashboard: it is `cloudflare_record.google_site_verification` in `terraform/main.tf`. If Search Console ever shows a different value, change it there. It is not a secret (anyone can read a TXT record) and it only proves ownership for the Google account that asked for it.
3. After the Terraform apply, press **Verify** in Search Console. Check the record first with `dig +short TXT jaoppb.com`.
4. After the switch is deployed, open Sitemaps, enter `https://jaoppb.com/sitemap.xml` and submit. The status should become "Success" with 2 discovered pages.
5. In URL inspection, inspect `https://jaoppb.com/en` and `https://jaoppb.com/pt` and request indexing for each.
6. Open [Bing Webmaster Tools](https://www.bing.com/webmasters), choose **Import from Google Search Console** and import `jaoppb.com`. The sitemap comes with it; check it under Sitemaps.

The zone's other TXT records (SPF, DMARC, DKIM, `_vercel`) are not managed by Terraform. Leave them. The verification record sits next to the SPF record on the apex; a name can hold several TXT records.

## 7. Evidence

Each run of section 4 is recorded here with its date and commit.

### 2026-11-14, before the first pull request (`8bc1b24` deployed)

Read-only baseline, from a local machine. It is the state the first pull request changes.

| Check | Result |
|---|---|
| TLS | Valid certificates for `jaoppb.com` and `www.jaoppb.com` (Google Trust Services, valid until 2027-02-04) |
| `http://` | 301 to `https://` on both hosts |
| `/` | 200, the stub page with a meta refresh (not yet a redirect) |
| `www` | 200, a copy of the site (not yet a redirect) |
| `/en`, `/pt` | 200, canonical, hreflang and JSON-LD correct, `noindex, nofollow` |
| Email link | Rewritten to `/cdn-cgi/l/email-protection` by Email Address Obfuscation (found by the live check) |
| OG images | 200, `image/png`, PNG signature, on both locales. This closes the check that #43 left open |
| CV PDFs | 200, `application/pdf`, both |
| `robots.txt`, `sitemap.xml` | Disallow everything, empty sitemap |
| Unknown paths | 404, in the language of the path, noindex |
| `pages.dev` | 200, no `X-Robots-Tag` (not yet set) |
| axe on `jaoppb.com` | 0 violations in all 8 runs |
| Lighthouse on `jaoppb.com` (median of 3, local machine) | Performance 92, accessibility 100, best practices 100 on both pages. SEO 66, as expected while hidden |
