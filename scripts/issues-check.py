#!/usr/bin/env python3
import json
import subprocess
import sys

REPO = "jaoppb/portfolio"
VALID_TYPES = {
    "type:feat",
    "type:fix",
    "type:chore",
    "type:docs",
    "type:refactor",
    "type:spike",
}


def main() -> int:
    cmd = [
        "gh",
        "issue",
        "list",
        "--repo",
        REPO,
        "--state",
        "open",
        "--limit",
        "100",
        "--json",
        "number,title,labels,milestone",
    ]

    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error querying GitHub issues via gh: {e.stderr}", file=sys.stderr)
        return 2
    except FileNotFoundError:
        print("Error: 'gh' CLI tool is not found in PATH.", file=sys.stderr)
        return 2

    raw_output = res.stdout.strip()
    if not raw_output or raw_output == "[]":
        print("No open issues found. OK.")
        return 0

    try:
        issues = json.loads(raw_output)
    except json.JSONDecodeError as e:
        print(f"Failed to parse issues JSON: {e}", file=sys.stderr)
        return 2

    errors = 0

    for issue in issues:
        num = issue["number"]
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
            elif type_labels[0] not in VALID_TYPES:
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
        return 1

    print(f"issues-check passed: {len(issues)} open issue(s) verified.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
