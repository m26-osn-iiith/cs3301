#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
lecdir="$root/src/content/lectures"
slidedir="$root/static/slides/lec"
ostep="$root/scripts/ostep.json"
base="https://pages.cs.wisc.edu/~remzi/OSTEP"

command -v jq >/dev/null || { echo "need jq" >&2; exit 1; }
command -v fzf >/dev/null || { echo "need fzf" >&2; exit 1; }

slides="" title="" week="" date=""
while getopts "s:t:w:d:h" opt; do
  case $opt in
    s) slides=$OPTARG ;;
    t) title=$OPTARG ;;
    w) week=$OPTARG ;;
    d) date=$OPTARG ;;
    h) sed -n '2,4p' "$0"; exit 0 ;;
    *) exit 1 ;;
  esac
done

last=$(find "$lecdir" -name '[0-9][0-9].md' -exec basename {} .md \; | sort -n | tail -1)
num=$(printf '%02d' $((10#${last:-0} + 1)))
md="$lecdir/$num.md"
[ -e "$md" ] && { echo "$md already exists" >&2; exit 1; }

[ -n "$title" ] || read -rp "title: " title
[ -n "$week" ]  || read -rp "week: " week
[ -n "$date" ]  || read -rp "date [$(date +%F)]: " date
date=${date:-$(date +%F)}
read -rp "summary (optional): " summary
[ -n "$slides" ] || read -rp "slides pdf path (optional): " slides

if [ -n "$slides" ]; then
  [ -f "$slides" ] || { echo "no such file: $slides" >&2; exit 1; }
  mkdir -p "$slidedir"
  cp "$slides" "$slidedir/$num.pdf"
  echo "copied slides -> static/slides/lec/$num.pdf"
fi

readings=()
if [ -t 0 ]; then
  picks=$(jq -r '.[] | "Chapter \(.ch) - \(.title)\t\(.file)"' "$ostep" \
    | fzf --multi --with-nth=1 --delimiter='\t' \
          --prompt="ostep readings > " --header="tab to select, enter to confirm, esc for none" \
    || true)
  while IFS=$'\t' read -r label file; do
    [ -n "${file:-}" ] || continue
    readings+=("[OSTEP $label]($base/$file.pdf)")
  done <<< "$picks"
fi

{
  echo "---"
  echo "title: $title"
  echo "week: $week"
  echo "date: \"$date\""
  echo "summary: \"$summary\""
  echo "---"
  echo
  if [ -n "$slides" ]; then
    echo "### Slides"
    echo "[Slides - $title](/slides/lec/$num.pdf)"
    echo
  fi
  if [ ${#readings[@]} -gt 0 ]; then
    echo "### Readings"
    for i in "${!readings[@]}"; do
      if [ $((i + 1)) -lt ${#readings[@]} ]; then
        echo "${readings[$i]}<br>"
      else
        echo "${readings[$i]}"
      fi
    done
  fi
} > "$md"

echo "wrote $md"
