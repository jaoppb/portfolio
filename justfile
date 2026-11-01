# Portfolio task recipes

default:
    @just --list

# Audit open GitHub issues against repository workflow rules
issues-check:
    issues-check

# Audit GitHub repository settings, labels, and milestones against tools.toml
repo-check:
    repo-sync --check

# Synchronize all GitHub repository configuration (settings, labels, milestones) to match tools.toml
repo-sync:
    repo-sync

# Synchronize GitHub repository settings only to match tools.toml
settings-sync:
    repo-sync --settings

# Synchronize GitHub repository labels only to match tools.toml
labels-sync:
    repo-sync --labels

# Synchronize GitHub repository milestones only to match tools.toml
milestones-sync:
    repo-sync --milestones

# Bootstrap and reconcile all repository configuration (settings, labels, milestones)
repo-bootstrap: repo-sync

# Run Biome linter across workspace
lint:
    pnpm exec biome lint .

# Format all files across workspace with Biome
format:
    pnpm exec biome format --write .

# Check architectural boundaries and import cycles
architecture:
    pnpm exec fallow architecture

# Check for unused exports and dead code
dead-code:
    pnpm exec fallow dead-code

# Verify architecture, dead code, formatting, linting, and imports across workspace
check: architecture dead-code
    pnpm exec biome check .
