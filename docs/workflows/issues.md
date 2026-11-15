# Issue Workflow Guide

This document describes the issue organization, taxonomy, and development lifecycle for the Portfolio repository, adapted and simplified from [`jaoppb/cosmo`](https://github.com/jaoppb/cosmo) and powered by [`jaoppb/tools`](https://github.com/jaoppb/tools). The canonical rules are defined in [AGENTS.md](../../AGENTS.md).

---

## 1. Issue Hierarchy

Work is organized into:
1. **Epics (`type:epic`)**: Large, closeable milestones or thematic outcomes (e.g., initial bootstrap, projects showcase, interactive playground). Epics contain child stories/tasks linked via GitHub's native sub-issues feature.
2. **Standalone Issues / Stories**: The primary unit of work (`feat`, `fix`, `chore`, `docs`, `refactor`, `spike`). Unlike Cosmo's strict rule requiring an epic parent for every single issue, portfolio allows standalone issues for independent tasks, fixes, and quick enhancements.
3. **Tasks / Sub-issues**: Smaller execution steps beneath an epic or complex story.

---

## 2. Labels Taxonomy

### Meta Labels
| Label | Color | Description |
|---|---|---|
| `accessibility` | `#f143ab` | Barrier affecting people with disabilities |

### Type Labels (Exactly one per issue)
| Label | Color | Description |
|---|---|---|
| `type:epic` | `#b60205` | A closeable outcome made of stories or tasks |
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

Every open issue must belong to a release milestone following SemVer:
- **`v0.1.0`**: Project bootstrap (tooling, issue workflow, base repository setup, walking skeleton).
- **`v0.2.0`**: MVP launch (initial portfolio live on custom domain, core sections, responsive layout).
- **`v0.3.0`+, `v1.0.0`**: Post-launch iterations, content additions, interactive demos.

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

### Where the fields live

Priority and Effort are fields on the [Portfolio GitHub Project](https://github.com/users/jaoppb/projects/6). They are the **only** source of truth: do not write `Priority:` or `Effort:` lines in issue bodies. `just issues-check` cannot see project fields, so nothing in the repo enforces them.

- **`Priority`**: single select `P0`–`P3`. Set on every open issue, epics included.
- **`Effort`**: single select `1, 2, 3, 5, 8, 13`. Set on every open issue except epics, which are not estimated.
- **`Status`**: `Triage` (default on add), `Todo`, `In Progress`, `Done`.

New issues are added to the project automatically with Status `Triage`. Pull requests are not added. Two views list untriaged items: **Needs Triage (Priority)** (`is:open no:priority`) and **Needs Triage (Effort)** (`is:open no:effort -label:type:epic`). Triage means filling those fields and moving the item to `Todo`.

Views: a board grouped by Status, a table grouped by Milestone, and the two Needs Triage views. All filter on `is:open`.

Reading and setting the fields from the CLI (requires the `project` token scope):

```bash
# Read: Priority and Effort are not in `gh issue view`
gh project item-list 6 --owner jaoppb --format json \
  -q '.items[] | {n: .content.number, priority, effort, status}'

# Write: look up ids once, then edit the item
gh project field-list 6 --owner jaoppb --format json
gh project item-edit --id <item-id> --project-id PVT_kwHOA6x_Is4BroOj \
  --field-id <field-id> --single-select-option-id <option-id>
```

### Project setup (manual)

`tools.toml` has no project schema, so the project is configured by hand and is not drift-checked yet. To recreate it:

1. `gh project create --owner jaoppb --title Portfolio`, then `gh project link <n> --owner jaoppb --repo jaoppb/portfolio`.
2. Create the `Priority` and `Effort` single-select fields with the options above, and add a `Triage` option to `Status`.
3. In the project UI, Workflows: enable **Auto-add to project** with filter `is:issue is:open repo:jaoppb/portfolio`, and **Item added to project** setting Status to `Triage`. Neither workflow can be configured through the API.
4. Create the four views above (view layout and filters are also UI-only).

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

The workflow tooling is distributed via Nix Flake from [`jaoppb/tools`](https://github.com/jaoppb/tools) and configured in `tools.toml`.

- **Auditing Open Issues**:
  ```bash
  just issues-check
  ```
  Runs `issues-check` against repository rules and open issues.

- **Checking Repository Drift**:
  ```bash
  just repo-check
  ```
  Verifies that GitHub repository settings, labels, and milestones match `tools.toml`.

- **Reconciling Repository Configuration**:
  ```bash
  just repo-sync
  ```
  Applies settings, label changes/pruning, and milestone renames to GitHub.
