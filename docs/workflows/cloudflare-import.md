# Importing existing Cloudflare resources into Terraform state

Runbook for [#25](https://github.com/jaoppb/portfolio/issues/25). It records what already existed in the Cloudflare account before the first CI `terraform apply` ([#23](https://github.com/jaoppb/portfolio/issues/23)), and how to repeat the inventory. Inventory date: 2026-11-06.

## 1. Identifiers

| Item | Value |
|---|---|
| Account | `jaoppb` (`71daa8b2f38c727567dd65b820f05e46`) |
| Zone | `jaoppb.com` (`aad5415c1034bacc0170728a182d7d5f`), active |
| State bucket | `jaoppb-portfolio-tf-state` (R2), created 2026-11-05 by running `terraform/bootstrap` |
| State key | `portfolio/terraform.tfstate` |

## 2. Inventory result

| Resource | Exists? | Action |
|---|---|---|
| R2 state bucket `jaoppb-portfolio-tf-state` | Yes | Nothing to import into the main state. Its state is the local `terraform.tfstate` from `terraform/bootstrap` (no backend block). |
| R2 bucket `portfolio` (2025) | Yes | Out of scope, not in Terraform. |
| Pages project `jaoppb-portfolio` | No | Created by the first apply. |
| Pages domains `jaoppb.com`, `www.jaoppb.com` | No | Created by the first apply. |
| DNS apex `A jaoppb.com` | Yes, conflicted | Deleted on 2026-11-06 (see section 6). |
| DNS `CNAME www` | Yes, conflicted | Deleted on 2026-11-06 (see section 6). |
| `r2` CNAME, DMARC, DKIM, SPF, `_vercel` TXT | Yes | Not managed by Terraform. Leave untouched. |

Nothing needed `terraform import`. The remote state is empty, and `terraform plan` shows `5 to add, 0 to change, 0 to destroy`. The plan does not check DNS conflicts, so the apply would have failed on the apex and `www` records. They were deleted on 2026-11-06 and the plan was re-run: still `5 to add, 0 to change, 0 to destroy`, with nothing left in the zone to conflict.

## 3. DNS export (rollback reference)

Full record list of zone `jaoppb.com` taken on 2026-11-06, before the cutover. To roll back, recreate the apex A record and the `www` CNAME exactly as listed.

| Type | Name | Content | Proxied | TTL | Record ID |
|---|---|---|---|---|---|
| A | `jaoppb.com` | `216.198.79.1` | no | 600 | `a7627cf401c7c55b8bed56f09e4dfca1` |
| CNAME | `r2.jaoppb.com` | `public.r2.dev` | yes | 1 | `2eb666a276f87f3efca7cca7d8d5e087` |
| CNAME | `www.jaoppb.com` | `jaoppb.com` | no | 1 | `52ff38b02f7f8753aa95c9d37005c0e1` |
| TXT | `_dmarc.jaoppb.com` | `"v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:7b82826a32414e4fac1d15b87910be3d@dmarc-reports.cloudflare.net;"` | no | 1 | `3bf05e0821e468c93ad1ae5a513e1c93` |
| TXT | `*._domainkey.jaoppb.com` | `"v=DKIM1; p="` | no | 1 | `83dea97da45654d901097691715a0afb` |
| TXT | `jaoppb.com` | `"v=spf1 -all"` | no | 1 | `de1c32144a7d2ebcb6ab06572d68cb51` |
| TXT | `_vercel.jaoppb.com` | `"vc-domain-verify=jaoppb.com,b95d2d0e5841f6b0894e,dc"` | no | 600 | `b273d63e06cb9760dafa82c1ea4c6b01` |

TTL `1` means automatic.

## 4. Credentials

Two separate credentials are used.

**Cloudflare API token** (`CLOUDFLARE_API_TOKEN`): Zone Read, DNS Read and Cloudflare Pages Read are enough for the inventory and `plan`. The apply in #23 needs write access to DNS and Pages.

**R2 S3 keys for the state backend** (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`): create an API token in the dashboard (R2, Manage API Tokens) with Object Read & Write limited to `jaoppb-portfolio-tf-state`. The S3 key pair is derived from that token:

- Access Key ID: the token ID.
- Secret Access Key: the SHA-256 hex digest of the token value.

For an account-owned token, get the ID with `GET /accounts/<account_id>/tokens/verify`. Do not print or commit any of these values. The keys are not created by Terraform: they would land in plaintext in the local bootstrap state, and the bootstrap token would need permission to create tokens. Rotate them by hand.

## 5. Reproduce the inventory and plan

Read-only, from a scratch directory so the repository stays clean:

```bash
export CLOUDFLARE_ACCOUNT_ID=<account_id>
pnpm exec wrangler whoami
pnpm exec wrangler pages project list
pnpm exec wrangler r2 bucket list

export CLOUDFLARE_API_TOKEN=<read-only token>
# cf-terraforming needs an initialised directory with the provider (~> 4.0)
cf-terraforming generate --terraform-binary-path=/usr/bin/terraform \
  --terraform-install-path=<scratch dir> \
  --resource-type cloudflare_record --zone <zone_id>
cf-terraforming import --terraform-binary-path=/usr/bin/terraform \
  --terraform-install-path=<scratch dir> \
  --resource-type cloudflare_record --zone <zone_id>
```

Notes:

- `cf-terraforming` does not support `cloudflare_pages_project`, `cloudflare_pages_domain` or `cloudflare_r2_bucket`. Use wrangler and the API for those.
- Without `--terraform-binary-path` it tries to download Terraform and fails on an expired signing key.
- Its generated HCL targets a newer provider than `~> 4.0`. Write imports against `terraform/main.tf`, not the generated output.

Plan against the remote state:

```bash
export AWS_ACCESS_KEY_ID=<token id>
export AWS_SECRET_ACCESS_KEY=<sha256 of token value>
cd terraform
terraform init -backend-config="endpoints={s3=\"https://<account_id>.r2.cloudflarestorage.com\"}"
terraform plan -var cloudflare_account_id=<account_id>
```

## 6. Cutover (decided in #25)

Decision: cut over in one apply and accept downtime. `jaoppb.com` currently serves from the apex A record (`216.198.79.1`, with a `_vercel` verification record, so most likely Vercel).

1. Save section 3 (done).
2. Delete `A jaoppb.com` and `CNAME www` (done on 2026-11-06 with the owner's explicit approval, by record ID after checking each one matched the export). The site has been down since.
3. Run the first apply (#23). It creates the Pages project, both Pages domains and the proxied CNAMEs.
4. Run the deploy workflow so the project gets a build.
5. Check `https://jaoppb.com` and `https://www.jaoppb.com`.

The site is down from step 2 until step 4 finishes, and custom-domain validation can add delay. Rollback is manual: remove the Terraform-created CNAMEs and recreate the two records from section 3.
