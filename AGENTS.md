# Portfolio agent rules

This repository is João Pedro's personal portfolio website and project showcase. This file is the canonical rulebook for humans and agents. Operational project setup details live in [docs/workflows/issues.md](docs/workflows/issues.md).

## 1. Issue workflow

- **Hierarchy.** Epics and standalone issues, using native GitHub sub-issues when an outcome is broken down.
  - Epics are optional grouping outcomes for major phases, milestones, or thematic features.
  - Standalone issues are fully supported for individual features, fixes, chores, docs, refactors, and spikes without requiring a parent epic.
  - Sub-issues are used when an epic or larger story is split across multiple focused units of work.
- **Milestones.** Every open issue must belong to a release milestone following SemVer:
  - `v0.1.0`: Bootstrap (tooling, setup, issue workflows, skeleton).
  - `v0.2.0`: MVP release and launch.
  - `v0.3.0`, `v1.0.0`, etc.: Iterations, new sections, and post-launch improvements.
- **Labels.**
  - Exactly one `type:` label on every issue: `type:feat`, `type:fix`, `type:chore`, `type:docs`, `type:refactor`, `type:spike`, or `type:epic`.
  - At least one `area:` label: `area:ui`, `area:content`, `area:design`, `area:tooling`, or `area:seo-a11y`.
- **Creation and Triage.** File issues using the corresponding template from `.github/ISSUE_TEMPLATE/`. Upon creation or triage:
  - Set the appropriate `area:` label.
  - Assign the target milestone (`v0.1.0`, `v0.2.0`, etc.).
  - Set Priority (`P0`–`P3`) and Effort (Fibonacci points: `1`, `2`, `3`, `5`, `8`, `13`).
  - Link dependencies using native GitHub blocked-by links and list them under `## Depends on`.
  - Link parent epic if the issue is part of an epic.
- **Priority.**
  - `P0`: Critical blocker, urgent fix, or deployment failure.
  - `P1`: Must-have for the target milestone.
  - `P2`: Should-have, off the critical path.
  - `P3`: Nice-to-have, low priority polish.
- **Effort.**
  - Fibonacci scale: `1`, `2`, `3`, `5`, `8`, `13`.
  - Measures task size/complexity. Epics are not estimated. A story estimated above `13` must be split before work begins.
- **Branches, Commits, and Pull Requests.**
  - Branch naming: `<type>/<issue>-<slug>` (e.g., `chore/1-bootstrap-issue-workflow`, `feat/12-hero-section`).
  - Commit title: `type: subject (#issue)` (e.g., `feat: add hero section (#12)`).
  - Pull request title: `type: subject (#issue)`.
  - Closing keywords: Use `Closes #issue` in the PR body and the branch's final commit. Use `Refs #issue` for parent epics or intermediate commits.
  - Merge method: **Merge commit only**. Rebase and squash are disabled; every commit reaches `main`.

| Issue workflow rule | Enforcer | Status |
|---------------------|----------|--------|
| Labels (`type:*`, `area:*`) and SemVer milestones on open issues | `just issues-check` (`jaoppb/tools`) | Enforced |
| Repository settings, label taxonomy, and milestones drift | `just repo-check` (`jaoppb/tools`) | Enforced |
| Form structure | `.github/ISSUE_TEMPLATE/*.yml` with `blank_issues_enabled: false` | Enforced |
| Merge method (merge commit only) | GitHub repository settings & PR review | Enforced |

## 2. Agent skills

Persistent domain guidance and quality standards are codified under `.agent/skills/`. Agents working on this repository must consult the corresponding skill before planning, proposing, implementing, or reviewing code in that domain.

| Skill | Trigger & Mandatory Scope | Location |
|-------|---------------------------|----------|
| `impeccable-design` | **Required** before proposing, implementing, or reviewing visual styling, UI components, typography, layout, themes, or micro-motion (`area:design`, `area:ui`). | [.agent/skills/impeccable-design/SKILL.md](.agent/skills/impeccable-design/SKILL.md) |
| `react-best-practices` | **Required** before proposing, implementing, or reviewing React components, Next.js App Router structure, hooks, state management, or static export architecture (`area:ui`). | [.agent/skills/react-best-practices/SKILL.md](.agent/skills/react-best-practices/SKILL.md) |

### Usage rules during development turns

1. **Pre-turn consultation**: Read the relevant `SKILL.md` in full before writing plans or editing code.
2. **Strict adherence to design principles**: All UI work must adhere to editorial restraint, accessibility (WCAG AA/AAA), `prefers-reduced-motion`, and the explicit anti-slop rules codified in `impeccable-design`.
3. **Static export alignment**: All React components must conform to Next.js static export (`output: 'export'`) constraints, leaf-isolated Client Components, and hook purity codified in `react-best-practices`.
4. **Review verification**: Multi-agent review rounds must cross-examine changes against both skills' checklists before approval.

