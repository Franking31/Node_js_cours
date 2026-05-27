#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo ""
echo "══════════════════════════════════"
echo "  BUILD ANDROID — Docker local   "
echo "══════════════════════════════════"
echo ""

if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker n'est pas démarré."
  exit 1
fi
echo "✓ Docker est actif"

[ -f ".env" ] && export $(grep -v '^#' .env | xargs) && echo "✓ Variables .env chargées"

mkdir -p generated/builds/apk generated/source/android

echo ""
echo "▶ Lancement du build Docker..."
echo ""

docker compose -f docker/docker-compose.yml up \
  --build \
  --abort-on-container-exit \
  --exit-code-from android-builder

echo ""
echo "✅ APK disponible dans : generated/builds/apk/app-debug.apk"