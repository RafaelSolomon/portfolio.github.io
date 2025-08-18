#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# Static Landing Page Cleanup
# -----------------------------
# - Realign to:
#   /
#   ├─ public/ (favicon.ico, headshot.png, cv.pdf, data/)
#   ├─ src/    (index.html, styles.css, scripts.js)
#   └─ scripts/update-cv.js (optional)
#
# - Patches index.html paths to use /public assets + /src files
# - Writes a static vercel.json that serves src/ + public/
# - Updates .gitignore
#
# Dry run by default (prints actions only).
# Use --apply to actually change files.
#
# Safe: destructive actions move to ./_backup_<timestamp>/

DRY_RUN=1
[[ "${1:-}" == "--apply" ]] && DRY_RUN=0

timestamp="$(date +%Y%m%d_%H%M%S)"
BACKUP_DIR="_backup_${timestamp}"

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[DRY] $*"
  else
    echo "[DO ] $*"
    eval "$@"
  fi
}

ensure_dir() {
  local d="$1"
  if [[ ! -d "$d" ]]; then
    run "mkdir -p '$d'"
  fi
}

backup_path() {
  local p="$1"
  ensure_dir "$BACKUP_DIR"
  run "mv -f '$p' '$BACKUP_DIR/'"
}

move_if_exists() {
  local src="$1" dst="$2"
  if [[ -e "$src" ]]; then
    ensure_dir "$(dirname "$dst")"
    run "mv -f '$src' '$dst'"
  fi
}

remove_if_exists() {
  local p="$1"
  if [[ -e "$p" ]]; then
    backup_path "$p"
  fi
}

# ---- 0) basic sanity
if [[ ! -f "package.json" ]]; then
  echo "Error: run this at the repo root (package.json not found)."
  exit 1
fi

# ---- 1) ensure target dirs
ensure_dir "public"
ensure_dir "public/data"
ensure_dir "src"
ensure_dir "scripts"

# ---- 2) move data from Credentials -> public/data
if [[ -f "Credentials/cv.json" ]]; then
  move_if_exists "Credentials/cv.json" "public/data/cv.json"
fi

# Optionally remove now-empty Credentials; or back it up wholesale.
if [[ -d "Credentials" ]]; then
  remove_if_exists "Credentials"
fi

# ---- 3) keep only the single source of truth for code
# Prefer non-minified files for static-first phase
remove_if_exists "styles.min.css"
remove_if_exists "scripts.min.js"

# Optional dev config not needed on Vercel
remove_if_exists "live-server.config.js"

# ---- 4) static phase: no API (back it up).
if [[ -d "api" ]]; then
  remove_if_exists "api"
fi

# ---- 5) make sure required public assets are present (do not overwrite if they exist)
# (You already have these in public/ from your tree; if not, script will just skip.)
for f in "public/favicon.ico" "public/headshot.png" "public/cv.pdf"; do
  if [[ ! -f "$f" ]]; then
    echo "[WARN] Missing $f (add it manually)."
  fi
done

# ---- 6) ensure src files exist (skip creation; assume you already have them)
for f in "src/index.html" "src/styles.css" "src/scripts.js"; do
  if [[ ! -f "$f" ]]; then
    echo "[WARN] Missing $f (add it or adjust the script)."
  fi
done

# ---- 7) patch index.html to static paths and visible CV/headshot
if [[ -f "src/index.html" ]]; then
  # backup before in-place edit
  run "cp 'src/index.html' '${BACKUP_DIR}/index.html.bak'"

  # 7a) normalize stylesheet/script/icon paths
  run "sed -i -E 's|href=[\"'\\'']/?styles\\.css[\"'\\'']|href=\"/src/styles.css\"|g' src/index.html"
  run "sed -i -E 's|src=[\"'\\'']/?scripts\\.js[\"'\\'']|src=\"/src/scripts.js\"|g' src/index.html"
  run "sed -i -E 's|href=[\"'\\''][^\"'\\'']*favicon\\.ico[\"'\\'']|href=\"/favicon.ico\"|g' src/index.html"

  # 7b) set headshot IMG to static file and keep alt/class
  run \"perl -0777 -pe 's|<img[^>]*id=[\\\"\\']headshot[\\\"\\'][^>]*>|<img id=\\\"headshot\\\" class=\\\"profile-img\\\" src=\\\"/headshot.png\\\" alt=\\\"Headshot\\\" />|g' -i src/index.html\"

  # 7c) set CV link to static file and make sure it’s visible (remove 'hidden')
  run \"perl -0777 -pe 's|<a[^>]*id=[\\\"\\']cv-link[\\\"\\'][^>]*>.*?</a>|<a id=\\\"cv-link\\\" class=\\\"btn btn-primary\\\" href=\\\"/cv.pdf\\\" download>��� Download CV</a>|gs' -i src/index.html\"
fi

# ---- 8) write a static vercel.json (backup existing)
if [[ -f "vercel.json" ]]; then
  run "cp 'vercel.json' '${BACKUP_DIR}/vercel.json.bak'"
fi

read -r -d '' NEW_VERCEL_JSON <<'JSON'
{
  "version": 2,
  "builds": [
    { "src": "src/index.html", "use": "@vercel/static" },
    { "src": "src/styles.css", "use": "@vercel/static" },
    { "src": "src/scripts.js", "use": "@vercel/static" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/src/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)\\.(js|css|mp4|pdf|png|jpg|jpeg|webp|ico)$",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
JSON

if [[ "$DRY_RUN" -eq 0 ]]; then
  echo "$NEW_VERCEL_JSON" > vercel.json
else
  echo "[DRY] would write vercel.json:"
  echo "$NEW_VERCEL_JSON" | sed 's/^/[DRY] /'
fi

# ---- 9) update .gitignore to prevent junk from being tracked
if [[ -f ".gitignore" ]]; then
  run "cp '.gitignore' '${BACKUP_DIR}/.gitignore.bak'"
fi

# ensure lines exist exactly once
append_ignore() {
  local pat="$1"
  if [[ -f ".gitignore" ]] && grep -qxF "$pat" .gitignore; then
    echo "[SKIP] .gitignore already has $pat"
  else
    if [[ "$DRY_RUN" -eq 0 ]]; then
      echo "$pat" >> .gitignore
      echo "[DO ] appended $pat to .gitignore"
    else
      echo "[DRY] would append $pat to .gitignore"
    fi
  fi
}

append_ignore "node_modules/"
append_ignore ".vercel/"
append_ignore ".DS_Store"
append_ignore "_backup_*/"

echo
if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run complete. Review the plan above."
  echo "Apply changes with:  ./cleanup-static.sh --apply"
else
  echo "Cleanup applied. Backup of changed/removed items: $BACKUP_DIR"
  echo "Next:"
  echo "  git status"
  echo "  git add -A && git commit -m \"chore: realign to static structure\""
  echo "  vercel --prod    # or your deploy command"
fi
