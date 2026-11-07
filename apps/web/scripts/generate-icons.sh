#!/usr/bin/env bash
# One-time generator for the raster icons. The outputs are committed; re-run only
# when the mark changes (keep the paths in sync with src/app/icon.svg).
# Needs rsvg-convert and ImageMagick (`magick`).
set -euo pipefail
cd "$(dirname "$0")/.."

# Rasters use the light-mode variant (neutral-950 tile, neutral-50 mark) with plain
# attributes, because rsvg-convert does not apply the SVG's embedded stylesheet.
mark='<path d="M25 17v21a8 8 0 0 1-8 8h-2"/><path d="M36 46V17h8a8.5 8.5 0 0 1 0 17h-8"/>'
svg() { # $1 = tile extra attributes
	printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0c0e13" %s/><g fill="none" stroke="#f7f8fa" stroke-width="6" stroke-linejoin="miter">%s</g></svg>' "$1" "$mark"
}

rounded=$(mktemp --suffix=.svg)
square=$(mktemp --suffix=.svg)
tmp=$(mktemp -d)
trap 'rm -rf "$rounded" "$square" "$tmp"' EXIT
svg 'rx="14"' >"$rounded"
svg '' >"$square" # iOS applies its own mask to apple-icon

rsvg-convert -w 192 -h 192 "$rounded" -o public/icons/icon-192.png
rsvg-convert -w 512 -h 512 "$rounded" -o public/icons/icon-512.png
rsvg-convert -w 180 -h 180 "$square" -o src/app/apple-icon.png
for s in 16 32 48; do rsvg-convert -w $s -h $s "$rounded" -o "$tmp/$s.png"; done
magick "$tmp/16.png" "$tmp/32.png" "$tmp/48.png" src/app/favicon.ico
