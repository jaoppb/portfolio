# Deploy credentials

How the Cloudflare Pages deploy is isolated from the rest of the account ([#24](https://github.com/jaoppb/portfolio/issues/24)). The deploy workflows are `.github/workflows/deploy-production.yml` and `.github/workflows/deploy-preview.yml`. The Terraform pipeline and its broader credentials are described in [terraform-pipeline.md](terraform-pipeline.md).

## 1. Environments and secrets

Deploy secrets live only in environments. No deploy credential exists at repository level.

| Environment | Used by | Branch rule | Approval | Secrets |
|---|---|---|---|---|
| `production` | `deploy-production.yml` job `deploy-production` | `main` only | None | `CLOUDFLARE_API_TOKEN` (Pages-only), `CLOUDFLARE_ACCOUNT_ID` |
| `preview` | `deploy-preview.yml` job `deploy-preview` | Any | None | `CLOUDFLARE_API_TOKEN` (Pages-only, separate token), `CLOUDFLARE_ACCOUNT_ID` |

Neither environment holds the Terraform apply token (DNS and R2 scopes). That token lives in `terraform-apply`, and the read-only plan token lives in `terraform-plan`.

Rules that keep the credentials contained:

- `deploy-preview.yml` stays on the `pull_request` trigger. Never use `pull_request_target` for deploys: it runs with secrets in the context of the base branch while checking out untrusted code.
- Fork pull requests get no environment secrets, so the preview step skips itself when the token is empty.
- The `preview` job runs the pull request's own code (`pnpm install`, `pnpm exec wrangler`) with the preview token, so any same-repository branch author can read that token. This is accepted: the token is Pages-only, separate from production, and expires in 90 days. Only grant write access to people you trust.
- Actions setting "Require approval for all outside collaborators" is enabled, so a workflow run from an outside contributor waits for a maintainer.
- Every `uses:` is pinned to a commit SHA (section 4) and `wrangler` is an exact version in `package.json`.

## 2. Token scopes

Create the tokens in the Cloudflare dashboard under My Profile, API Tokens, Create Custom Token.

Both deploy tokens have exactly one permission:

- Account: Cloudflare Pages: Edit, limited to the account that holds the `jaoppb-portfolio` project

No Zone, DNS, R2, or other account permissions. Create two separate tokens and name them `portfolio-pages-deploy-production` and `portfolio-pages-deploy-preview`, so one can be revoked without touching the other. Set an expiry of 90 days.

## 3. Rotation

Rotate by hand every 90 days (the token expiry is the reminder), and immediately if a token may have leaked (for example a workflow log, a compromised dependency, or a lost laptop).

1. In the Cloudflare dashboard, create the new token with the scopes from section 2. Do not delete the old one yet.
2. In GitHub, Settings, Environments, open `production` (or `preview`) and replace the `CLOUDFLARE_API_TOKEN` secret with the new value.
3. Re-run the latest successful deploy workflow (or open a pull request for `preview`) and check that the deploy step succeeds.
4. Delete the old token in the Cloudflare dashboard.
5. Check the Cloudflare audit log for use of the old token after step 2. Any use means it leaked.

Rotation is manual on purpose. Automated rotation is out of scope.

## 4. Pinning

Third-party code that runs in a credentialed job is pinned so it cannot change underneath us.

- **Actions.** Every `uses:` in `.github/workflows/*.yml` has the form `owner/repo@<40-character-commit-sha> # vN`, where `vN` is the major version tag the SHA belongs to. Use the latest major version. To update, resolve the new tag to its commit (for annotated tags, the commit the tag points to, not the tag object) and replace both the SHA and the comment:

  ```sh
  gh api repos/<owner>/<repo>/git/ref/tags/<tag> --jq '.object'
  # if "type" is "tag", dereference it:
  gh api repos/<owner>/<repo>/git/tags/<sha> --jq '.object.sha'
  ```

- **Wrangler.** `wrangler` is a root `devDependency` at an exact version (no caret), run with `pnpm exec wrangler`. The pnpm lockfile pins it and its transitive dependencies, and the install runs with `--frozen-lockfile`. To update, run `pnpm add -Dw --save-exact wrangler@<version>` and review the lockfile diff. The install scripts of its `esbuild` and `workerd` dependencies are disabled in `pnpm-workspace.yaml` (`allowBuilds`), since their binaries come from platform packages.

## 5. One-time setup checklist

These settings are not in code. They must be in place before the pull request that introduces them merges, otherwise deploys or the Terraform apply break.

1. Create the two Pages-only tokens (section 2).
2. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in `production` and in `preview`. Remove any other secrets from `production`.
3. Create the `terraform-apply` environment with the repository owner as required reviewer, and move `TF_CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` there from `production`.
4. Restrict `production` deployment branches to `main`, and remove its required reviewer.
5. Check that there are no repository-level secrets (Settings, Secrets and variables, Actions).
6. Enable Settings, Actions, General, "Require approval for all outside collaborators".
