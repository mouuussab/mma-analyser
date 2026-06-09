#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/.dev_logs"
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"

echo "Stopping RIVUS dev processes (if running)..."

if [ -f "$BACKEND_PID_FILE" ]; then
  PID=$(cat "$BACKEND_PID_FILE")
  if kill -0 "$PID" >/dev/null 2>&1; then
    echo "Killing backend PID $PID"
    kill "$PID" || true
  fi
  rm -f "$BACKEND_PID_FILE"
fi

if [ -f "$FRONTEND_PID_FILE" ]; then
  PID=$(cat "$FRONTEND_PID_FILE")
  if kill -0 "$PID" >/dev/null 2>&1; then
    echo "Killing frontend PID $PID"
    kill "$PID" || true
  fi
  rm -f "$FRONTEND_PID_FILE"
fi

echo "Stopped. Check logs in $LOG_DIR if needed." 
