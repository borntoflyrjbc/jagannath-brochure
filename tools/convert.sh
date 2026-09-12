#!/usr/bin/env bash
# ==============================================================================
# PDF → FLIPBOOK WEBP CONVERTER (CLI Pipeline)
# Prerequisites: poppler-utils (pdftoppm) + libwebp (cwebp)
# macOS: brew install poppler webp
# Ubuntu/Debian: sudo apt-get install poppler-utils webp
# Windows: choco install poppler webp
# ==============================================================================

set -euo pipefail

INPUT_PDF="${1:-brochure.pdf}"
OUTPUT_DESKTOP_DIR="../assets/pages"
OUTPUT_MOBILE_DIR="../assets/pages/mobile"

if [ ! -f "$INPUT_PDF" ]; then
  echo "Error: PDF file '$INPUT_PDF' not found."
  echo "Usage: ./convert.sh <path-to-pdf>"
  exit 1
fi

mkdir -p "$OUTPUT_DESKTOP_DIR"
mkdir -p "$OUTPUT_MOBILE_DIR"
TMP_DIR="./_tmp_raw_pages"
mkdir -p "$TMP_DIR"

echo "Step 1: Extracting raw pages from $INPUT_PDF..."
pdftoppm -r 220 -png "$INPUT_PDF" "$TMP_DIR/page"

echo "Step 2: Encoding Desktop WebP (1600px long edge, quality 82)..."
PAGE_NUM=1
for f in $(ls "$TMP_DIR"/page-*.png | sort -V); do
  cwebp -q 82 -resize 0 1600 "$f" -o "$OUTPUT_DESKTOP_DIR/page-${PAGE_NUM}.webp"
  echo "  -> Saved $OUTPUT_DESKTOP_DIR/page-${PAGE_NUM}.webp"
  PAGE_NUM=$((PAGE_NUM + 1))
done

echo "Step 3: Encoding Mobile WebP (1100px long edge, quality 80)..."
PAGE_NUM=1
for f in $(ls "$TMP_DIR"/page-*.png | sort -V); do
  cwebp -q 80 -resize 0 1100 "$f" -o "$OUTPUT_MOBILE_DIR/page-${PAGE_NUM}.webp"
  echo "  -> Saved $OUTPUT_MOBILE_DIR/page-${PAGE_NUM}.webp"
  PAGE_NUM=$((PAGE_NUM + 1))
done

# Cleanup raw temp images
rm -rf "$TMP_DIR"

echo "Done! All pages converted successfully to assets/pages/ and assets/pages/mobile/"

# ==============================================================================
# ALTERNATIVE: ImageMagick (if poppler/cwebp are unavailable)
# ==============================================================================
# magick -density 200 -background white -alpha remove -alpha off brochure.pdf \
#   -resize "x1600>" -quality 82 "../assets/pages/page-%d.webp"
#
# Mobile variant:
# magick -density 150 -background white -alpha remove -alpha off brochure.pdf \
#   -resize "x1100>" -quality 80 "../assets/pages/mobile/page-%d.webp"
# ==============================================================================
