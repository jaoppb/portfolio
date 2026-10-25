# Issue Workflow Guide

This document describes the issue organization, taxonomy, and development lifecycle for the Portfolio repository, adapted and simplified from [`jaoppb/cosmo`](https://github.com/jaoppb/cosmo). The core rules are defined in [AGENTS.md](../../AGENTS.md).

---

## 1. Issue Hierarchy

Work is organized into:
1. **Epics (`epic`)**: Large, closeable milestones or thematic outcomes (e.g., initial bootstrap, projects showcase, interactive playground). Epics contain child stories/tasks linked via GitHub's native sub-issues feature.
2. **Standalone Issues / Stories**: The primary unit of work (`feat`, `fix`, `chore`, `docs`, `refactor`, `spike`). Unlike Cosmo's strict rule requiring an epic parent for every single issue, portfolio allows standalone issues for independent tasks, fixes, and quick enhancements.
3. **Tasks / Sub-issues**: Smaller execution steps beneath an epic or complex story.

---

## 2. Labels Taxonomy

### Meta Labels
| Label | Color | Description |
|---|---|---|
| `epic` | `#b60205` | A closeable outcome made of stories or tasks |
| `accessibility` | `#f143ab` | Barrier affecting people with disabilities |

### Type Labels (Exactly one per standard issue)
| Label | Color | Description |
|---|---|---|
| `type:feat` | `#1d76db` | New behaviour or capability |
| `type:fix` | `#d73a4a` | Something is broken |
| `type:chore` | `#8b949e` | Tooling, CI, housekeeping, dependencies |
| `type:docs` | `#0075ca` | Documentation, guides, copy, ADRs |
| `type:refactor` | `#5319e7` | Restructure without changing behaviour |
| `type:spike` | `#fbca04` | Time-boxed research that answers a question |

### Area Labels (At least one per issue)
| Label | Color | Description |
|---|---|---|
| `area:ui` | `#2ea44f` | Components, layout, and user interface |
| `area:content` | `#0e8a16` | Copy, projects, resume, and markdown content |
| `area:design` | `#f143ab` | Visual design, theme, typography, styling |
| `area:tooling` | `#2ea44f` | Build tools, CI/CD, deployment, automation |
| `area:seo-a11y` | `#0e8a16` | SEO, performance, metadata, accessibility |

---

## 3. Milestones

Every open issue must belong to a release milestone:
- **`v0`**: Project bootstrap (tooling, issue workflow, base repository setup, walking skeleton).
- **`v1`**: MVP launch (initial portfolio live on custom domain, core sections, responsive layout).
- **`v1.1`+**: Post-launch iterations, content additions, interactive demos.

---

## 4. Priority and Effort

### Priority
- **`P0`**: Urgent blocker or critical production defect.
- **`P1`**: Must-have deliverable for the milestone.
- **`P2`**: Should-have feature, off the critical path.
- **`P3`**: Nice-to-have or future polish.

### Effort
Effort is measured in Fibonacci points: `1`, `2`, `3`, `5`, `8`, `13`.
- `1`–`3`: Small, straightforward changes (minor tweaks, typo fixes, simple component edits).
- `5`–`8`: Substantial features or refactors requiring multiple files or careful coordination.
- `13`: Upper limit for a single story. Any issue reaching `13` should be split into smaller sub-issues.

---

## 5. Development Lifecycle & Git Flow

1. **Branching**:
   - Create a branch off `main`: `<type>/<issue>-<slug>`.
   - Examples: `chore/1-bootstrap-issue-workflow`, `feat/10-project-card-component`.

2. **Commits**:
   - Commit titles follow: `type: subject (#issue)`.
   - Use `Refs #issue` in intermediate commit messages if referencing a parent epic.
   - Use `Closes #issue` only on the commit that finishes the issue.

3. **Pull Requests**:
   - PR title matches: `type: subject (#issue)`.
   - PR body follows `.github/pull_request_template.md` with `Closes #issue`.
   - **Merge method**: Merge commit only (`--merge`). Squash and rebase are avoided so that all commit history reaches `main`.

---

## 6. Tooling and Auditing

- **Auditing Open Issues**:
  ```bash
  just issues-check
  ```
  Runs `scripts/issues-check.py` to check that every open issue has a valid `type:*` (or `epic`), at least one `area:*`, and a milestone.

- **Provisioning Labels (One-time setup)**:
  ```bash
  ./scripts/setup-labels.sh
  ```
