#!/usr/bin/env bash
# Crea el remoto wika-labss/wika-studio y publica el scaffold local.
# Requiere: gh auth con permiso createRepository en la org wika-labss.
set -euo pipefail

ORG="${WIKA_GITHUB_ORG:-wika-labss}"
REPO_NAME="wika-studio"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STUDIO_DIR="$(cd "$SCRIPT_DIR/../wika-studio" && pwd)"

if [[ ! -d "$STUDIO_DIR/.git" ]]; then
  echo "No existe $STUDIO_DIR/.git — clona o genera el scaffold primero." >&2
  exit 1
fi

cd "$STUDIO_DIR"

if gh repo view "${ORG}/${REPO_NAME}" >/dev/null 2>&1; then
  echo "Repo ${ORG}/${REPO_NAME} ya existe; configurando remote y push."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/${ORG}/${REPO_NAME}.git"
  git push -u origin main
  exit 0
fi

gh repo create "${ORG}/${REPO_NAME}" \
  --public \
  --description "WIKA Studio — consola web y BFF para orquestar el SCOS WIKA" \
  --source=. \
  --remote=origin \
  --push

echo "Listo: https://github.com/${ORG}/${REPO_NAME}"
