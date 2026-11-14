# Portfolio

João Pedro's personal portfolio website and project showcase. A statically exported [Next.js](https://nextjs.org) (App Router) site in English and Portuguese, deployed to Cloudflare Pages with infrastructure managed by Terraform.

[Português (pt-BR)](README.pt-BR.md)

- **Design:** [Figma file](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=0-1)
- **Rules for humans and agents:** [AGENTS.md](AGENTS.md)

## Setup

The toolchain is pinned by a [Nix](https://nixos.org) flake and loaded automatically by [direnv](https://direnv.net). You need Nix (with flakes enabled) and direnv.

```sh
git clone https://github.com/jaoppb/portfolio.git
cd portfolio
direnv allow        # loads the flake dev shell (see .envrc)
pnpm install        # also installs the lefthook git hooks
pnpm --filter web dev
```

Without direnv, run `nix develop` instead of `direnv allow`, then continue with `pnpm install`.

The dev shell provides `just`, `gh`, Node.js, pnpm and the [`jaoppb/tools`](https://github.com/jaoppb/tools) helpers (`issues-check`, `repo-sync`, `project-sync`). pnpm switches to the version pinned in `package.json`'s `packageManager` field.

> **Known gap:** the dev shell does not provide `terraform`. The `just` recipes that call it (`tf`, `tf-bootstrap`, `tf-check`, `tf-fmt`, and therefore `check` and `format`) only work if Terraform is already installed on your machine. See [#56](https://github.com/jaoppb/portfolio/issues/56).

## pnpm scripts

Run from the repository root. `build`, `test` and `typecheck` run in every workspace package that defines them.

| Script | What it does |
|--------|--------------|
| `pnpm check` | Biome check (lint, format, imports) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format, writing changes |
| `pnpm typecheck` | `tsc --noEmit` in each package |
| `pnpm test` | Vitest in each package |
| `pnpm build` | Static export of the site (`apps/web/out`) |

Run a script in the site only with `pnpm --filter web <script>`, for example `dev` or `test:watch`.

## just recipes

`just` (no arguments) lists every recipe. The main groups:

| Recipe | What it does |
|--------|--------------|
| `just check` | Architecture, dead code, Terraform checks, and Biome check |
| `just lint`, `just format` | Biome lint; Biome and Terraform formatting |
| `just architecture` | Boundary and import-cycle checks with [Fallow](docs/adr/0001-boundary-enforcement-fallow.md) |
| `just dead-code` | Unused exports and dead code with Fallow |
| `just quality` | Lighthouse and axe [quality gate](docs/workflows/quality-gate.md) on a fresh build (needs Chrome) |
| `just tf <args>`, `just tf-bootstrap <args>` | Run Terraform in `terraform/` or `terraform/bootstrap` |
| `just tf-check`, `just tf-fmt` | Validate or format the Terraform configuration |
| `just issues-check` | Audit open GitHub issues against the workflow rules |
| `just repo-check`, `just repo-sync` | Audit or apply repository settings, labels and milestones from `tools.toml` |

The `issues-check` and `repo-*` recipes need an authenticated `gh`.

## Project structure

```
apps/web/             Next.js site (static export)
  src/app/            Routes: (root) redirect and [lang] localized pages
  src/features/       Feature-first modules, each with its own components
  src/components/ui/  Shared UI primitives
  src/shared/         Config, dictionaries (en, pt) and utilities
  src/assets/         Fonts
packages/             Shared workspace packages (none yet)
quality/              Lighthouse and axe quality gate (config and scripts)
terraform/            Cloudflare infrastructure (plus bootstrap/)
docs/                 ADRs and workflow runbooks
.github/              CI, deploy workflows and issue templates
```

Code is organised by feature first. Import boundaries are enforced by Fallow (`just architecture`, also run on pre-push).

## Documentation

- [AGENTS.md](AGENTS.md): issue workflow, branch, commit and PR conventions, agent skills
- [docs/workflows/issues.md](docs/workflows/issues.md): issue hierarchy, labels and lifecycle
- [docs/workflows/terraform-pipeline.md](docs/workflows/terraform-pipeline.md): how infrastructure changes are planned and applied
- [docs/workflows/deploy-credentials.md](docs/workflows/deploy-credentials.md): Cloudflare Pages deploy isolation
- [docs/workflows/cloudflare-import.md](docs/workflows/cloudflare-import.md): resources imported into Terraform state
- [docs/workflows/quality-gate.md](docs/workflows/quality-gate.md): Lighthouse and axe budgets that fail CI
- [docs/adr/0001-boundary-enforcement-fallow.md](docs/adr/0001-boundary-enforcement-fallow.md): why Fallow enforces boundaries

## Contributing

Work starts from an issue. Branches are `<type>/<issue>-<slug>`, commits and PR titles are `type: subject (#issue)`, and PRs are merged with a merge commit. Details are in [AGENTS.md](AGENTS.md).

## License

See [LICENSE](LICENSE).
