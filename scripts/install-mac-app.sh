#!/bin/bash
# Bouwt Aurora.app in /Applications — dubbelklik start de dev-server en opent het portaal.
# Herbruikbaar: opnieuw uitvoeren overschrijft de bestaande .app.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_NAME="Aurora"
APP_DIR="/Applications/${APP_NAME}.app"
ICON_SVG="${PROJECT_DIR}/public/aurora-icon.svg"

echo "→ Project:  ${PROJECT_DIR}"
echo "→ App pad:  ${APP_DIR}"

# --- 1. Icoon genereren uit SVG ---------------------------------------------
WORK_DIR="$(mktemp -d)"
trap "rm -rf ${WORK_DIR}" EXIT

echo "→ Icoon renderen uit SVG…"
qlmanage -t -s 1024 -o "${WORK_DIR}" "${ICON_SVG}" > /dev/null
BASE_PNG="${WORK_DIR}/$(basename "${ICON_SVG}").png"

ICONSET="${WORK_DIR}/AppIcon.iconset"
mkdir -p "${ICONSET}"

declare -a SIZES=(16 32 128 256 512)
for size in "${SIZES[@]}"; do
  double=$((size * 2))
  sips -z "${size}"  "${size}"  "${BASE_PNG}" --out "${ICONSET}/icon_${size}x${size}.png"      > /dev/null
  sips -z "${double}" "${double}" "${BASE_PNG}" --out "${ICONSET}/icon_${size}x${size}@2x.png" > /dev/null
done

iconutil -c icns "${ICONSET}" -o "${WORK_DIR}/AppIcon.icns"

# --- 2. App bundle structuur ------------------------------------------------
echo "→ App bundle bouwen…"
rm -rf "${APP_DIR}"
mkdir -p "${APP_DIR}/Contents/MacOS"
mkdir -p "${APP_DIR}/Contents/Resources"

cp "${WORK_DIR}/AppIcon.icns" "${APP_DIR}/Contents/Resources/AppIcon.icns"

# --- 3. Info.plist ----------------------------------------------------------
cat > "${APP_DIR}/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>Aurora</string>
    <key>CFBundleDisplayName</key>
    <string>Aurora</string>
    <key>CFBundleIdentifier</key>
    <string>com.mikeimmortel.aurora</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleExecutable</key>
    <string>Aurora</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSUIElement</key>
    <true/>
</dict>
</plist>
PLIST

# --- 4. Launcher script -----------------------------------------------------
cat > "${APP_DIR}/Contents/MacOS/Aurora" <<LAUNCHER
#!/bin/bash
# Aurora launcher — start dev-server als die nog niet draait, opent portaal.

PROJECT_DIR="${PROJECT_DIR}"
PORT=5173
LOG_FILE="\${HOME}/Library/Logs/Aurora.log"
PID_FILE="\${HOME}/Library/Application Support/Aurora/server.pid"

mkdir -p "\$(dirname "\${PID_FILE}")"

# Homebrew node op Apple Silicon + Intel, en nvm paden toevoegen
export PATH="/opt/homebrew/bin:/usr/local/bin:\${PATH}"
if [ -s "\${HOME}/.nvm/nvm.sh" ]; then
  export NVM_DIR="\${HOME}/.nvm"
  . "\${NVM_DIR}/nvm.sh" > /dev/null 2>&1
fi

cd "\${PROJECT_DIR}"

is_running() {
  # Check of er iets op poort 5173 luistert en het is onze node
  if lsof -i :\${PORT} -sTCP:LISTEN -t > /dev/null 2>&1; then
    return 0
  fi
  return 1
}

start_server() {
  echo "[\$(date)] Starting Aurora dev server" >> "\${LOG_FILE}"
  nohup npm run dev >> "\${LOG_FILE}" 2>&1 &
  echo \$! > "\${PID_FILE}"

  # Wacht tot server antwoordt (max 30 sec)
  for i in {1..60}; do
    if curl -s http://127.0.0.1:\${PORT} > /dev/null 2>&1; then
      return 0
    fi
    sleep 0.5
  done
  return 1
}

if ! is_running; then
  if ! start_server; then
    osascript -e 'display alert "Aurora" message "Server kon niet starten. Check ~/Library/Logs/Aurora.log voor details."'
    exit 1
  fi
fi

# Open het portaal in de default browser
open "http://127.0.0.1:\${PORT}"
LAUNCHER

chmod +x "${APP_DIR}/Contents/MacOS/Aurora"

# --- 5. LaunchServices cache refresh (zodat icoon meteen klopt) -------------
touch "${APP_DIR}"
/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister \
  -f "${APP_DIR}" 2>/dev/null || true

echo ""
echo "✅ Aurora.app geïnstalleerd in /Applications"
echo "   Dubbelklik start de server en opent http://127.0.0.1:5173"
echo ""
echo "Via Tailscale bereikbaar op:"
TS_IP="$(tailscale ip -4 2>/dev/null | head -1 || echo 'onbekend')"
TS_NAME="$(scutil --get LocalHostName 2>/dev/null || echo 'onbekend')"
echo "   http://${TS_IP}:5173"
echo "   http://${TS_NAME}:5173  (via MagicDNS)"
