#!/usr/bin/env bash
set -euo pipefail

REPO="jaoppb/portfolio"

# Fetch open issues in JSON format
ISSUES_JSON=$(gh issue list --repo "$REPO" --state open --limit 100 --json number,title,labels,milestone)

if [ "$ISSUES_JSON" = "[]" ] || [ -z "$ISSUES_JSON" ]; then
  echo "No open issues found. OK."
  exit 0
fi

ERRORS=0

# Valid type labels
VALID_TYPES=("type:feat" "type:fix" "type:chore" "type:docs" "type:refactor" "type:spike")

# Parse issues using jq or python
# Since python3 is standard on linux, let's use python3 to inspect the JSON reliably
python3 - "$ISSUES_JSON" << 'EOF'
import sys, json

issues = json.loads(sys.argv[1])
valid_types = {"type:feat", "type:fix", "type:chore", "type:docs", "type:refactor", "type:spike"}
errors = 0

for issue in issues:
    num = issue["number"]
    title = issue["title"]
    labels = [l["name"] for l in issue.get("labels", [])]
    milestone = issue.get("milestone")

    is_epic = "epic" in labels
    type_labels = [l for l in labels if l.startswith("type:")]
    area_labels = [l for l in labels if l.startswith("area:")]

    # Rule 1: Type label (or epic)
    if is_epic:
        if len(type_labels) > 1:
            print(f"#{num} rule: epic has multiple type: labels ({', '.join(type_labels)})")
            errors += 1
    else:
        if len(type_labels) == 0:
            print(f"#{num} rule: missing type: label")
            errors += 1
        elif len(type_labels) > 1:
            print(f"#{num} rule: issue has multiple type: labels ({', '.join(type_labels)})")
            errors += 1
        elif type_labels[0] not in valid_types:
            print(f"#{num} rule: invalid type label '{type_labels[0]}'")
            errors += 1

    # Rule 2: Area label
    if len(area_labels) == 0:
        print(f"#{num} rule: missing area: label")
        errors += 1

    # Rule 3: Milestone
    if not milestone or not milestone.get("title"):
        print(f"#{num} rule: missing milestone")
        errors += 1

if errors > 0:
    print(f"\nissues-check failed: {errors} violation(s) found.")
    sys.exit(1)
else:
    print(f"issues-check passed: {len(issues)} open issue(s) verified.")
    sys.exit(0)
EOF
