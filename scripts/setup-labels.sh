#!/usr/bin/env bash
set -euo pipefail

REPO="jaoppb/portfolio"

echo "Configuring labels for $REPO..."

# 1. Delete default GitHub labels if they exist
DEPRECATED_LABELS=(
  "bug"
  "documentation"
  "duplicate"
  "enhancement"
  "good first issue"
  "help wanted"
  "invalid"
  "question"
  "wontfix"
)

for label in "${DEPRECATED_LABELS[@]}"; do
  if gh label list --repo "$REPO" | grep -Fwq "$label"; then
    echo "Deleting default label: $label"
    gh label delete "$label" --repo "$REPO" --yes || true
  fi
done

# 2. Define desired labels: name | color | description
LABELS=(
  # Meta
  "accessibility|f143ab|Barrier affecting people with disabilities"
  "epic|b60205|A closeable outcome made of stories or tasks"

  # Types
  "type:feat|1d76db|New behaviour or capability"
  "type:fix|d73a4a|Something is broken"
  "type:chore|8b949e|Tooling, CI, housekeeping, dependencies"
  "type:docs|0075ca|Documentation, guides, copy, ADRs"
  "type:refactor|5319e7|Restructure without changing behaviour"
  "type:spike|fbca04|Time-boxed research that answers a question"

  # Areas
  "area:ui|2ea44f|Components, layout, and user interface"
  "area:content|0e8a16|Copy, projects, resume, and markdown content"
  "area:design|f143ab|Visual design, theme, typography, styling"
  "area:tooling|2ea44f|Build tools, CI/CD, deployment, automation"
  "area:seo-a11y|0e8a16|SEO, performance, metadata, accessibility"
)

# 3. Create or update labels
for item in "${LABELS[@]}"; do
  IFS="|" read -r name color desc <<< "$item"
  if gh label list --repo "$REPO" | grep -Fwq "$name"; then
    echo "Updating label: $name"
    gh label edit "$name" --repo "$REPO" --color "$color" --description "$desc"
  else
    echo "Creating label: $name"
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc"
  fi
done

echo "Labels setup complete!"
