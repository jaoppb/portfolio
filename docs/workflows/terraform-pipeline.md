# Terraform pipeline

How Cloudflare infrastructure changes are planned and applied from GitHub Actions ([#23](https://github.com/jaoppb/portfolio/issues/23)). The workflow is `.github/workflows/terraform.yml`. What already existed in the account before the first apply is recorded in [cloudflare-import.md](cloudflare-import.md).

## 1. How it works

| Trigger | Job | Environment | Credentials |
|---|---|---|---|
| Pull request touching `terraform/**` (or the workflow file) | `plan`: `terraform plan`, result posted as a single PR comment that is updated on every push | `terraform-plan` (no approval) | Read-only |
| Push to `main` touching `terraform/**` or the workflow file | `apply`: `terraform apply -auto-approve` | `terraform-apply` (approval required) | Full access |

- The `apply` job plans and applies in one step. The approver sees the plan comment from the pull request, not the exact change set of the run. If the plan on `main` differs from the PR comment (a stale plan, or a manual change in Cloudflare), the approver cannot tell before approving. Review the PR comment, and re-check the run log if `main` moved in between.
- Plan runs for a branch cancel each other, so only the latest push is planned. Applies are serialized in the `terraform-apply` concurrency group and are never cancelled. A newer apply waits for the running one.
- Plans do not run for pull requests from forks, because forks get no environment secrets.
- The `plan` job runs the code in the PR. That is why it only gets the read-only credentials of `terraform-plan` and never the apply token.
- The backend is the R2 bucket `jaoppb-portfolio-tf-state`. The S3 backend config sets no lock table, so state is not locked. The `terraform-apply` concurrency group is what prevents two applies from overlapping.
- The account ID is passed as `TF_VAR_cloudflare_account_id` and the R2 endpoint as `-backend-config`, because `*.tfvars` files are git-ignored.
- The workflow uses the latest Terraform release, like the CI job, with `-lockfile=readonly` so provider versions come from the committed `terraform/.terraform.lock.hcl`.

## 2. Environments and secrets

Both Terraform environments are created in the repository settings. Secrets are set per environment, not at repository level.

**`terraform-plan`** (no protection rules):

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Read-only Cloudflare token (scopes in section 3) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `AWS_ACCESS_KEY_ID` | R2 S3 key ID, read-only on the state bucket |
| `AWS_SECRET_ACCESS_KEY` | R2 S3 secret, read-only on the state bucket |

**`terraform-apply`** (must have the repository owner as required reviewer, otherwise apply runs without approval). Only the Terraform apply job uses this environment. `deploy-production.yml` and `deploy-preview.yml` use their own `production` and `preview` environments, which hold only a Pages-only token (see [deploy-credentials.md](deploy-credentials.md)), so deploys do not wait for this approval and cannot read the apply token.

| Secret | Value |
|---|---|
| `TF_CLOUDFLARE_API_TOKEN` | Cloudflare token with the apply scopes (section 3). Mapped to `CLOUDFLARE_API_TOKEN` inside the job. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `AWS_ACCESS_KEY_ID` | R2 S3 key ID, read and write on the state bucket |
| `AWS_SECRET_ACCESS_KEY` | R2 S3 secret, read and write on the state bucket |

The deploy tokens (`CLOUDFLARE_API_TOKEN` in `production` and `preview`) stay limited to Cloudflare Pages Edit. Do not widen them: the deploy job installs npm dependencies and runs `wrangler`, and it should not hold DNS or zone rights.

Each job fails at the first step with the name of the missing secret if one is not set.

## 3. Cloudflare token scopes

Create the tokens in the dashboard under My Profile, API Tokens.

**Plan token** (`terraform-plan` / `CLOUDFLARE_API_TOKEN`):

- Account: Cloudflare Pages: Read
- Zone: Zone: Read, DNS: Read, Single Redirect: Read, Zone Settings: Read, limited to `jaoppb.com`

**Apply token** (`terraform-apply` / `TF_CLOUDFLARE_API_TOKEN`):

- Account: Cloudflare Pages: Edit
- Zone: Zone: Read, DNS: Edit, Single Redirect: Edit, Zone Settings: Edit, limited to `jaoppb.com`

What each zone permission is for:

| Permission | Resource in `terraform/main.tf` |
|---|---|
| Zone: Read | `data.cloudflare_zone.selected` |
| DNS | `cloudflare_record.*` |
| Single Redirect | `cloudflare_ruleset.redirects` (the `www` to apex redirect, [#47](https://github.com/jaoppb/portfolio/issues/47)) |
| Zone Settings | `cloudflare_zone_settings_override.zone` (Email Address Obfuscation off, #47) |

Zone Settings has no narrower form: Edit covers every setting of the zone, not only the one managed here. Edit a token in place (My Profile, API Tokens, Edit): the token value does not change, so the GitHub secrets stay as they are. A resource whose permission is missing makes the plan or the apply fail with an authentication error that names the API route.

**R2 S3 keys** (state backend): create an R2 API token under R2, Manage API Tokens, limited to the bucket `jaoppb-portfolio-tf-state`. Use Object Read only for `terraform-plan` and Object Read & Write for `terraform-apply`. How to derive the key pair from the token is described in [cloudflare-import.md](cloudflare-import.md#4-credentials). Rotate the keys by hand.

## 4. First-time setup

1. **Bootstrap the state bucket (manual, once).** `terraform/bootstrap` creates the R2 bucket that stores the state, so it cannot be managed by that state. Run `just tf-bootstrap apply` locally. The bucket `jaoppb-portfolio-tf-state` already exists, so this is done.
2. **Create the tokens and R2 keys** from section 3.
3. **Set the secrets** from section 2 in `terraform-plan` and `terraform-apply`, and add the repository owner as required reviewer of `terraform-apply`.
4. **Open a pull request touching `terraform/**`** (or this workflow) and check that the plan comment appears.
5. **Run the first apply before the first production deploy.** `deploy-production.yml` runs `wrangler pages deploy` against the project `jaoppb-portfolio`, and Terraform creates that project, so the deploy fails until the first apply has succeeded. The apply runs on a push to `main` that touches `terraform/**` or the workflow file, so merging the pull request that adds the pipeline starts it. Approve the `terraform-apply` deployment. Every later change to the workflow file also asks for an approval, and the apply is then a no-op if nothing changed.
6. **Then run the deploy.** Follow the cutover steps in [cloudflare-import.md](cloudflare-import.md#6-cutover-decided-in-25): the site is down until the deploy finishes.

After the first apply the ordering problem does not come back, because the Pages project exists.

## 5. Troubleshooting

- **Plan fails with an auth error on init.** Check that the R2 key pair in `terraform-plan` is the derived pair (token ID and SHA-256 of the token value), not the raw token.
- **Apply waits and never starts.** The `terraform-apply` approval is pending, or another apply holds the `terraform-apply` group.
- **Apply fails on a resource that already exists.** Something was created by hand after the inventory in `cloudflare-import.md`. Import it into the state and run the apply again.
- **Apply fails on `cloudflare_ruleset.redirects` because a ruleset already exists.** A zone has one ruleset per phase. If a redirect rule was ever created in the dashboard (Rules, Redirect Rules), the zone already has the `http_request_dynamic_redirect` ruleset and the plan does not see it. Import it (`terraform import cloudflare_ruleset.redirects zone/<zone_id>/<ruleset_id>`, run locally with the credentials of [cloudflare-import.md](cloudflare-import.md#4-credentials)) or delete the dashboard rules, then run the apply again. After that the resource owns the whole phase: a redirect rule added in the dashboard is removed by the next apply, so add rules in `terraform/main.tf`.
- **Apply fails on `cloudflare_zone_settings_override.zone`.** The provider reads every zone setting when it creates and refreshes this resource, not only the one it manages. If the error names a missing permission, check Zone Settings on the token. If it names a setting the plan of the zone does not have, this resource changed nothing (other resources of the same apply may already be in place): report it in the issue instead of retrying.
