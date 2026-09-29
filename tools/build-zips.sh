#!/usr/bin/env bash
# Rebuild the per-skill ZIPs and the practice-data ZIP. Run from the build-day folder.
#
# SKILL.md sits at the ROOT of each zip, not inside a folder. Claude's "Upload a skill"
# reads the name from the frontmatter, and a wrapping folder makes the upload fail.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p zips
for dir in skills/*/; do
  name=$(basename "$dir")
  rm -f "zips/${name}.zip"
  ( cd "$dir" && zip -rq "../../zips/${name}.zip" . -x "*.DS_Store" -x "__pycache__/*" )
  echo "built zips/${name}.zip"
done
rm -f "zips/ClaimFox practice data (fictional).zip"
( cd sample-data && zip -rq "../zips/ClaimFox practice data (fictional).zip" . -x "*.DS_Store" )
echo "built zips/ClaimFox practice data (fictional).zip"
