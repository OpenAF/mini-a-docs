#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.jekyll.pid"
LOG_FILE="$ROOT_DIR/.jekyll.log"
PORT="${JEKYLL_PORT:-4000}"
HOST="${JEKYLL_HOST:-0.0.0.0}"

export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
export HOME="$ROOT_DIR/.home"
export GEM_HOME="$ROOT_DIR/.gem"
export GEM_PATH="$ROOT_DIR/.gem"
export BUNDLE_PATH="$ROOT_DIR/vendor/bundle"

running_pid() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "$pid"
      return 0
    fi
  fi
  return 1
}

start() {
  if pid="$(running_pid)"; then
    echo "Jekyll is already running (pid: $pid)."
    exit 0
  fi

  mkdir -p "$HOME" "$GEM_HOME" "$BUNDLE_PATH"
  cd "$ROOT_DIR"

  bundle check >/dev/null || bundle install >/dev/null
  nohup bundle exec jekyll serve --host "$HOST" --port "$PORT" >"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "$pid" >"$PID_FILE"
  sleep 1

  if kill -0 "$pid" 2>/dev/null; then
    echo "Started Jekyll (pid: $pid)."
    echo "URL: http://$HOST:$PORT/mini-a-docs/"
    echo "Log: $LOG_FILE"
  else
    echo "Failed to start Jekyll. Check log: $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
}

stop() {
  if ! pid="$(running_pid)"; then
    rm -f "$PID_FILE"
    echo "Jekyll is not running."
    exit 0
  fi

  kill "$pid" 2>/dev/null || true
  for _ in {1..20}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      break
    fi
    sleep 0.2
  done

  if kill -0 "$pid" 2>/dev/null; then
    kill -9 "$pid" 2>/dev/null || true
  fi

  rm -f "$PID_FILE"
  echo "Stopped Jekyll (pid: $pid)."
}

status() {
  if pid="$(running_pid)"; then
    echo "Jekyll is running (pid: $pid)."
    echo "URL: http://$HOST:$PORT/mini-a-docs/"
    echo "Log: $LOG_FILE"
  else
    echo "Jekyll is not running."
    exit 1
  fi
}

case "${1:-}" in
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 2
    ;;
esac
