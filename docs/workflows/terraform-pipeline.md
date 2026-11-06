# Terraform pipeline

How Cloudflare infrastructure changes are planned and applied from GitHub Actions ([#23](https://github.com/jaoppb/portfolio/issues/23)). The workflow is `.github/workflows/terraform.yml`. What already existed in the account before the first apply is recorded in [cloudflare-import.md](cloudflare-import.md).

## 1. How it works

| Trigger | Job | Environment | Credentials |
|---|---|---|---|
| Pull request touching `terraform/**` (or the workflow file) | `plan`: `terraform plan`, result posted as a single PR comment that is updated on every push | `terraform-plan` (no approval) | Read-only |
| Push to `main` touching `terraform/**` | `apply`: `terraform apply -auto-approve` | `production` (approval required) | Full access |
| Manual run (`workflow_dispatch`) on `main` | `apply`, same as above | `production` | Full access |

- The `apply` job plans and applies in one step. The approver sees the plan comment from the pull request, not the exact change set of the run. If the plan on `main` differs from the PR comment (a stale plan, or a manual change in Cloudflare), the approver cannot tell before approving. Review the PR comment, and re-check the run log if `main` moved in between.
- Plan runs for a branch cancel each other, so only the latest push is planned. Applies are serialized in the `terraform-apply` concurrency group and are never cancelled. A newer apply waits for the running one.
- Plans do not run for pull requests from forks, because forks get no environment secrets.
- The `plan` job runs the code in the PR. That is why it only gets the read-only credentials of `terraform-plan` and never the apply token.
- The backend is the R2 bucket `jaoppb-portfolio-tf-state`. The S3 backend config sets no lock table, so state is not locked. The `terraform-apply` concurrency group is what prevents two applies from overlapping.
- The account ID is passed as `TF_VAR_cloudflare_account_id` and the R2 endpoint as `-backend-config`, because `*.tfvars` files are git-ignored.
- The workflow uses the latest Terraform release, like the CI job, with `-lockfile=readonly` so provider versions come from the committed `terraform/.terraform.lock.hcl`.

## 2. Environments and secrets

Both environments are created in the repository settings. Secrets are set per environment, not at repository level.

**`terraform-plan`** (no protection rules):

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Read-only Cloudflare token (scopes in section 3) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `AWS_ACCESS_KEY_ID` | R2 S3 key ID, read-only on the state bucket |
| `AWS_SECRET_ACCESS_KEY` | R2 S3 secret, read-only on the state bucket |

**`production`** (must have the repository owner as required reviewer, otherwise apply runs without approval). `deploy.yml` also uses this environment, so every production deploy waits for the same approval. It already holds `CLOUDFLARE_API_TOKEN` for `deploy.yml`. Add:

| Secret | Value |
|---|---|
| `TF_CLOUDFLARE_API_TOKEN` | Cloudflare token with the apply scopes (section 3). Mapped to `CLOUDFLARE_API_TOKEN` inside the job. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID. Also read by `deploy.yml`. |
| `AWS_ACCESS_KEY_ID` | R2 S3 key ID, read and write on the state bucket |
| `AWS_SECRET_ACCESS_KEY` | R2 S3 secret, read and write on the state bucket |

The deploy token (`CLOUDFLARE_API_TOKEN` in `production`) stays limited to Cloudflare Pages Edit. Do not widen it: the deploy job installs npm dependencies and runs `wrangler`, and it should not hold DNS or zone rights.

Each job fails at the first step with the name of the missing secret if one is not set.

## 3. Cloudflare token scopes

Create the tokens in the dashboard under My Profile, API Tokens.

**Plan token** (`terraform-plan` / `CLOUDFLARE_API_TOKEN`):

- Account: Cloudflare Pages: Read
- Zone: Zone: Read, DNS: Read, limited to `jaoppb.com`

**Apply token** (`production` / `TF_CLOUDFLARE_API_TOKEN`):

- Account: Cloudflare Pages: Edit
- Zone: Zone: Read, DNS: Edit, limited to `jaoppb.com`

**R2 S3 keys** (state backend): create an R2 API token under R2, Manage API Tokens, limited to the bucket `jaoppb-portfolio-tf-state`. Use Object Read only for `terraform-plan` and Object Read & Write for `production`. How to derive the key pair from the token is described in [cloudflare-import.md](cloudflare-import.md#4-credentials). Rotate the keys by hand.

## 4. First-time setup

1. **Bootstrap the state bucket (manual, once).** `terraform/bootstrap` creates the R2 bucket that stores the state, so it cannot be managed by that state. Run `just tf-bootstrap apply` locally. The bucket `jaoppb-portfolio-tf-state` already exists, so this is done.
2. **Create the tokens and R2 keys** from section 3.
3. **Set the secrets** from section 2 in `terraform-plan` and `production`, and add the repository owner as required reviewer of `production`.
4. **Open a pull request touching `terraform/**`** (or this workflow) and check that the plan comment appears.
5. **Run the first apply before the first production deploy.** `deploy.yml` runs `wrangler pages deploy` against the project `jaoppb-portfolio`, and Terraform creates that project, so the deploy fails until the first apply has succeeded. A merge that only changes the workflow does not trigger the apply, so start it manually: Actions, Terraform, Run workflow on `main`, then approve the `production` deployment.
6. **Then run the deploy.** Follow the cutover steps in [cloudflare-import.md](cloudflare-import.md#6-cutover-decided-in-25): the site is down until the deploy finishes.

After the first apply the ordering problem does not come back, because the Pages project exists.

## 5. Troubleshooting

- **Plan fails with an auth error on init.** Check that the R2 key pair in `terraform-plan` is the derived pair (token ID and SHA-256 of the token value), not the raw token.
- **Apply waits and never starts.** The `production` approval is pending, or another apply holds the `terraform-apply` group.
- **Apply fails on a resource that already exists.** Something was created by hand after the inventory in `cloudflare-import.md`. Import it into the state and run the apply again.
