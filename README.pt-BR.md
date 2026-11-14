# Portfolio

Site de portfólio e vitrine de projetos de João Pedro. Um site [Next.js](https://nextjs.org) (App Router) exportado estaticamente, em inglês e português, publicado no Cloudflare Pages com a infraestrutura gerenciada por Terraform.

[English](README.md)

- **Design:** [arquivo no Figma](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=0-1)
- **Regras para pessoas e agentes:** [AGENTS.md](AGENTS.md) (em inglês)

## Configuração

As ferramentas são fixadas por um flake do [Nix](https://nixos.org) e carregadas automaticamente pelo [direnv](https://direnv.net). É preciso ter Nix (com flakes habilitados) e direnv.

```sh
git clone https://github.com/jaoppb/portfolio.git
cd portfolio
direnv allow        # carrega o shell do flake (veja .envrc)
pnpm install        # também instala os hooks do lefthook
pnpm --filter web dev
```

Sem direnv, rode `nix develop` no lugar de `direnv allow` e continue com `pnpm install`.

O shell fornece `just`, `gh`, Node.js, pnpm e os utilitários do [`jaoppb/tools`](https://github.com/jaoppb/tools) (`issues-check`, `repo-sync`, `project-sync`). O pnpm troca para a versão fixada no campo `packageManager` do `package.json`.

> **Lacuna conhecida:** o shell não fornece o `terraform`. As receitas do `just` que o usam (`tf`, `tf-bootstrap`, `tf-check`, `tf-fmt` e, portanto, `check` e `format`) só funcionam se o Terraform já estiver instalado na sua máquina. Veja [#56](https://github.com/jaoppb/portfolio/issues/56).

## Scripts do pnpm

Execute na raiz do repositório. `build`, `test` e `typecheck` rodam em todos os pacotes do workspace que os definem.

| Script | O que faz |
|--------|-----------|
| `pnpm check` | Biome check (lint, formatação e imports) |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format, gravando as alterações |
| `pnpm typecheck` | `tsc --noEmit` em cada pacote |
| `pnpm test` | Vitest em cada pacote |
| `pnpm build` | Exportação estática do site (`apps/web/out`) |

Para rodar um script só no site, use `pnpm --filter web <script>`, por exemplo `dev` ou `test:watch`.

## Receitas do just

`just` (sem argumentos) lista todas as receitas. Os principais grupos:

| Receita | O que faz |
|---------|-----------|
| `just check` | Arquitetura, código morto, checagens do Terraform e Biome check |
| `just lint`, `just format` | Biome lint; formatação com Biome e Terraform |
| `just architecture` | Limites e ciclos de import com o [Fallow](docs/adr/0001-boundary-enforcement-fallow.md) |
| `just dead-code` | Exports não usados e código morto com o Fallow |
| `just quality` | [Quality gate](docs/workflows/quality-gate.md) de Lighthouse e axe sobre um build novo (exige o Chrome) |
| `just quality-production <state>` | As mesmas auditorias mais checagens de URL no site em produção, para o [lançamento](docs/workflows/launch.md) (`noindex` ou `indexable`; exige o Chrome) |
| `just tf <args>`, `just tf-bootstrap <args>` | Roda o Terraform em `terraform/` ou `terraform/bootstrap` |
| `just tf-check`, `just tf-fmt` | Valida ou formata a configuração do Terraform |
| `just issues-check` | Audita as issues abertas contra as regras de workflow |
| `just repo-check`, `just repo-sync` | Audita ou aplica configurações, labels e milestones do repositório a partir de `tools.toml` |

As receitas `issues-check` e `repo-*` exigem o `gh` autenticado.

## Estrutura do projeto

```
apps/web/             Site Next.js (exportação estática)
  src/app/            Rotas: redirecionamento (root) e páginas localizadas [lang]
  src/features/       Módulos organizados por feature, cada um com seus componentes
  src/components/ui/  Primitivas de UI compartilhadas
  src/shared/         Configuração, dicionários (en, pt) e utilitários
  src/assets/         Fontes
packages/             Pacotes compartilhados do workspace (ainda nenhum)
quality/              Quality gate de Lighthouse e axe (configuração e scripts)
terraform/            Infraestrutura na Cloudflare (mais bootstrap/)
docs/                 ADRs e guias de workflow
.github/              CI, workflows de deploy e templates de issue
```

O código é organizado primeiro por feature. Os limites de import são verificados pelo Fallow (`just architecture`, também executado no pre-push).

## Documentação

A documentação está em inglês.

- [AGENTS.md](AGENTS.md): workflow de issues, convenções de branch, commit e PR, skills de agentes
- [docs/workflows/issues.md](docs/workflows/issues.md): hierarquia de issues, labels e ciclo de vida
- [docs/workflows/terraform-pipeline.md](docs/workflows/terraform-pipeline.md): como mudanças de infraestrutura são planejadas e aplicadas
- [docs/workflows/deploy-credentials.md](docs/workflows/deploy-credentials.md): isolamento do deploy no Cloudflare Pages
- [docs/workflows/cloudflare-import.md](docs/workflows/cloudflare-import.md): recursos importados para o state do Terraform
- [docs/workflows/quality-gate.md](docs/workflows/quality-gate.md): orçamentos de Lighthouse e axe que reprovam o CI
- [docs/workflows/launch.md](docs/workflows/launch.md): lançamento em produção, checagens no site publicado e rollback
- [docs/adr/0001-boundary-enforcement-fallow.md](docs/adr/0001-boundary-enforcement-fallow.md): por que o Fallow garante os limites

## Contribuindo

O trabalho começa por uma issue. Branches seguem `<type>/<issue>-<slug>`, commits e títulos de PR seguem `type: subject (#issue)`, e PRs são mergeados com merge commit. Detalhes no [AGENTS.md](AGENTS.md).

## Licença

Veja [LICENSE](LICENSE).
