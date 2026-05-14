#!/bin/bash
set -e
python3 scripts/install-gallery-nav.py || true
python3 scripts/build-gallery-data.py
open gallery.html 2>/dev/null || true
echo "Gallery installed. Open gallery.html or commit and push to GitHub Pages."
