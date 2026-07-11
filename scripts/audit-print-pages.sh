#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

chrome=${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}
pdfinfo_bin=${PDFINFO_BIN:-$(command -v pdfinfo || true)}
pdftotext_bin=${PDFTOTEXT_BIN:-$(command -v pdftotext || true)}

if ! test -x "$chrome"; then
  echo "error: Chrome not found at $chrome (set CHROME_BIN to override)" >&2
  exit 1
fi
if ! test -x "$pdfinfo_bin" || ! test -x "$pdftotext_bin"; then
  echo "error: pdfinfo and pdftotext are required (set PDFINFO_BIN/PDFTOTEXT_BIN to override)" >&2
  exit 1
fi

npm run build:pages

temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/story-stage-print-audit.XXXXXX")
preview_log="$temporary_root/preview.log"
preview_pid=""

cleanup() {
  if test -n "$preview_pid"; then
    kill "$preview_pid" >/dev/null 2>&1 || true
    wait "$preview_pid" >/dev/null 2>&1 || true
  fi
  rm -rf "$temporary_root"
}
trap cleanup EXIT HUP INT TERM

npx vite preview --config vite.pages.config.ts --host 127.0.0.1 --port 4179 >"$preview_log" 2>&1 &
preview_pid=$!

attempt=0
until curl --fail --silent http://127.0.0.1:4179/english-study/ >/dev/null; do
  attempt=$((attempt + 1))
  if test "$attempt" -ge 50; then
    echo "error: preview server did not start" >&2
    cat "$preview_log" >&2
    exit 1
  fi
  sleep 0.1
done

story_ids="moonlight-picnic missing-lunchbox secret-tree-house busy-morning class-talent-show cloud-postman"
expected_pages=17

pack_count=0

for players in 2 3; do
for story_id in $story_ids; do
  pdf="$temporary_root/$story_id-$players-players.pdf"
  profile="$temporary_root/chrome-$story_id-$players-players"
  "$chrome" --headless=new --disable-gpu --no-pdf-header-footer \
    --user-data-dir="$profile" \
    --print-to-pdf="$pdf" \
    "http://127.0.0.1:4179/english-study/?print=$story_id&players=$players" >/dev/null 2>&1 &
  chrome_pid=$!

  attempt=0
  while ! test -s "$pdf"; do
    attempt=$((attempt + 1))
    if test "$attempt" -ge 100; then
      kill "$chrome_pid" >/dev/null 2>&1 || true
      echo "error: PDF generation timed out for $story_id with $players players" >&2
      exit 1
    fi
    sleep 0.1
  done
  kill "$chrome_pid" >/dev/null 2>&1 || true
  wait "$chrome_pid" >/dev/null 2>&1 || true

  pages=$($pdfinfo_bin "$pdf" | awk '/^Pages:/ { print $2 }')
  if test "$pages" != "$expected_pages"; then
    echo "error: $story_id with $players players rendered $pages pages, expected $expected_pages" >&2
    exit 1
  fi

  text_file="$temporary_root/$story_id-$players-players.txt"
  "$pdftotext_bin" "$pdf" "$text_file"
  if ! grep -q "1 / $expected_pages" "$text_file" || ! grep -q "$expected_pages / $expected_pages" "$text_file"; then
    echo "error: $story_id with $players players is missing the first or final learning-pack marker" >&2
    tail -20 "$text_file" >&2
    exit 1
  fi
  pack_count=$((pack_count + 1))
  printf 'ok: %-24s %s players · %s A4 pages\n' "$story_id" "$players" "$pages"
done
done

total_pages=$((pack_count * expected_pages))

word_bank_pdf="$temporary_root/word-bank.pdf"
"$chrome" --headless=new --disable-gpu --no-pdf-header-footer \
  --user-data-dir="$temporary_root/chrome-word-bank" \
  --print-to-pdf="$word_bank_pdf" \
  "http://127.0.0.1:4179/english-study/?wordbank=1" >/dev/null 2>&1 &
chrome_pid=$!
attempt=0
while ! test -s "$word_bank_pdf"; do
  attempt=$((attempt + 1))
  if test "$attempt" -ge 100; then
    kill "$chrome_pid" >/dev/null 2>&1 || true
    echo "error: cumulative word-bank PDF generation timed out" >&2
    exit 1
  fi
  sleep 0.1
done
kill "$chrome_pid" >/dev/null 2>&1 || true
wait "$chrome_pid" >/dev/null 2>&1 || true

word_bank_pages=$($pdfinfo_bin "$word_bank_pdf" | awk '/^Pages:/ { print $2 }')
if test "$word_bank_pages" != "2"; then
  echo "error: cumulative word bank rendered $word_bank_pages pages, expected 2" >&2
  exit 1
fi
"$pdftotext_bin" "$word_bank_pdf" "$temporary_root/word-bank.txt"
if ! grep -q "1 / 2" "$temporary_root/word-bank.txt" || ! grep -q "2 / 2" "$temporary_root/word-bank.txt"; then
  echo "error: cumulative word bank is missing its first or final page marker" >&2
  exit 1
fi
printf 'ok: %-24s %s A4 pages\n' "six-story-word-bank" "$word_bank_pages"

total_pages=$((total_pages + word_bank_pages))
echo "Print audit passed: $pack_count learning packs plus the word bank, $total_pages A4 pages total."
