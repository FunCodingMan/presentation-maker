#!/usr/bin/env bash
#
# Парсер .ts / .tsx файлов.
# Выводит содержимое всех найденных файлов в формате:
#
#   Путь к файлу: relative/path/to/file.tsx
#   <код файла>
#
# Использование:
#   ./parse-ts.sh <относительный_путь> [опции]
#
# Опции:
#   -o, --out <файл>       сохранить результат в файл (по умолчанию stdout)
#   -e, --ext <list>       расширения через запятую (по умолчанию ts,tsx)
#   -x, --exclude <list>   папки для пропуска (по умолчанию node_modules,.git,dist,build)
#   -h, --help             показать справку
#
# Примеры:
#   ./parse-ts.sh ./src
#   ./parse-ts.sh ./src -o dump.txt
#   ./parse-ts.sh ./packages/ui -e tsx -x node_modules,storybook-static
#
set -euo pipefail

TARGET="."
OUT=""
EXTS="ts,tsx"
EXCLUDE="node_modules,.git,dist,build"

usage() {
  sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

# --- разбор аргументов ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--out)       OUT="$2"; shift 2 ;;
    -e|--ext)       EXTS="$2"; shift 2 ;;
    -x|--exclude)   EXCLUDE="$2"; shift 2 ;;
    -h|--help)      usage 0 ;;
    -*)             echo "Неизвестная опция: $1" >&2; usage 1 ;;
    *)              TARGET="$1"; shift ;;
  esac
done

if [[ ! -d "$TARGET" ]]; then
  echo "Ошибка: директория '$TARGET' не найдена" >&2
  exit 1
fi

# --- собираем find-выражение для исключений ---
IFS=',' read -r -a EXCLUDE_ARR <<< "$EXCLUDE"
EXCLUDE_EXPR=()
first=1
for ex in "${EXCLUDE_ARR[@]}"; do
  ex="$(echo "$ex" | xargs)" # trim
  [[ -z "$ex" ]] && continue
  if [[ $first -eq 1 ]]; then
    EXCLUDE_EXPR+=( -name "$ex" )
    first=0
  else
    EXCLUDE_EXPR+=( -o -name "$ex" )
  fi
done

# --- собираем find-выражение для расширений ---
IFS=',' read -r -a EXT_ARR <<< "$EXTS"
EXT_EXPR=()
first=1
for ext in "${EXT_ARR[@]}"; do
  ext="$(echo "$ext" | xargs)"
  [[ -z "$ext" ]] && continue
  [[ "$ext" != .* ]] && ext=".$ext"
  if [[ $first -eq 1 ]]; then
    EXT_EXPR+=( -name "*$ext" )
    first=0
  else
    EXT_EXPR+=( -o -name "*$ext" )
  fi
done

if [[ ${#EXT_EXPR[@]} -eq 0 ]]; then
  echo "Ошибка: не заданы расширения" >&2
  exit 1
fi

# --- нормализуем базовый путь для относительных путей в выводе ---
TARGET="${TARGET%/}"

# --- функция-генератор вывода ---
generate() {
  local find_args=( "$TARGET" )
  find_args+=( -type d \( "${EXCLUDE_EXPR[@]}" \) -prune -o -type f \( "${EXT_EXPR[@]}" \) -print0 )

  find "${find_args[@]}" | sort -z | while IFS= read -r -d '' file; do
    local rel="${file#"$TARGET"/}"
    [[ "$rel" == "$file" ]] && rel="$file"
    printf 'Путь к файлу: %s\n' "$rel"
    cat -- "$file"
    # гарантируем перевод строки между файлами
    [[ -n "$(tail -c1 -- "$file")" ]] && printf '\n'
    printf '\n'
  done
}

if [[ -n "$OUT" ]]; then
  generate > "$OUT"
  echo "Готово. Результат: $OUT" >&2
else
  generate
fi