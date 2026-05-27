#!/bin/bash
set -e
set -o pipefail

GREEN='\033[0;32m'; BLUE='\033[0;34m'
RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'

log_step() { echo -e "\n${BLUE}▶ $1${NC}"; }
log_ok()   { echo -e "${GREEN}✓ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
log_err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

log_step "Installation des dépendances Node.js..."
cd /workspace/app
npm ci --prefer-offline 2>/dev/null || npm install
log_ok "Dépendances installées"

log_step "Build Next.js en mode export statique..."
npm run build
[ ! -d "out" ] && log_err "Le dossier out/ n'existe pas. Vérifiez next.config.ts"
log_ok "Build Next.js terminé"

log_step "Ajout de la plateforme Android..."
[ -d "android" ] && log_warn "Ancien android/ détecté, suppression..." && rm -rf android
npx cap add android
log_ok "Plateforme Android ajoutée"

log_step "Synchronisation des assets web vers Android..."
npx cap sync android
log_ok "Synchronisation terminée"

log_step "Compilation de l'APK Android..."
cd /workspace/app/android
chmod +x gradlew
./gradlew assembleDebug \
  --no-daemon \
  --stacktrace \
  -Dorg.gradle.jvmargs="-Xmx2g"
log_ok "Compilation terminée"

log_step "Déplacement de l'APK..."
APK_SOURCE="/workspace/app/android/app/build/outputs/apk/debug/app-debug.apk"
APK_DEST="/workspace/generated/builds/apk"
mkdir -p "$APK_DEST"
cp "$APK_SOURCE" "$APK_DEST/app-debug.apk"
APK_SIZE=$(du -sh "$APK_DEST/app-debug.apk" | cut -f1)
log_ok "APK disponible dans : generated/builds/apk/app-debug.apk"

echo -e "\n${GREEN}══════════════════════════════════${NC}"
echo -e "${GREEN} BUILD TERMINÉ — Taille : $APK_SIZE ${NC}"
echo -e "${GREEN}══════════════════════════════════${NC}"
