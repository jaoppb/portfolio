# Portfolio task recipes

default:
    @just --list

# Set up or update GitHub labels
setup-labels:
    ./scripts/setup-labels.sh

# Audit open GitHub issues against repository workflow rules
issues-check:
    ./scripts/issues-check.sh
