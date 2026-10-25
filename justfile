# Portfolio task recipes

default:
    @just --list

# Audit open GitHub issues against repository workflow rules
issues-check:
    ./scripts/issues-check.py
