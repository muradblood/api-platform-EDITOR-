#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR=${1:-zaidblooders}

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required to clone Satrnasb/zaidblooders." >&2
  echo "Install gh from https://cli.github.com/ before running this script." >&2
  exit 1
fi

if [ -e "$TARGET_DIR" ]; then
  echo "The target path '$TARGET_DIR' already exists. Choose another location or remove the existing path before cloning." >&2
  exit 1
fi

echo "Cloning Satrnasb/zaidblooders into '$TARGET_DIR'..."
gh repo clone Satrnasb/zaidblooders "$TARGET_DIR"
