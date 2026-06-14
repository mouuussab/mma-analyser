#!/usr/bin/env bash
set -euo pipefail

# dev_start.sh — start backend and frontend for local development
# Backend: uv run rivus-ai --dev
# Frontend: yarnpkg start

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

LOG_DIR="$ROOT_DIR/.dev_logs"
mkdir -p "$LOG_DIR"

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_PID_FILE="$LOG_DIR/backend.pid"
FRONTEND_PID_FILE="$LOG_DIR/frontend.pid"

echo "Starting RIVUS backend and frontend (logs -> $LOG_DIR)"

# Start backend (prefer uv)
if command -v uv >/dev/null 2>&1; then
  echo "Starting backend with: uv run rivus-ai --dev"
  nohup uv run rivus-ai --dev >"$BACKEND_LOG" 2>&1 &
  echo $! >"$BACKEND_PID_FILE"
else
  echo "uv not found; trying python -m rivus_ai.app --dev"
  nohup python -m rivus_ai.app --dev >"$BACKEND_LOG" 2>&1 &
  echo $! >"$BACKEND_PID_FILE"
fi

# Start frontend (yarnpkg start)
if command -v yarnpkg >/dev/null 2>&1; then
  echo "Starting frontend with: yarnpkg start"
  nohup yarnpkg start >"$FRONTEND_LOG" 2>&1 &
  echo $! >"$FRONTEND_PID_FILE"
elif command -v yarn >/dev/null 2>&1; then
  echo "yarnpkg not found; starting with yarn start"
  nohup yarn start >"$FRONTEND_LOG" 2>&1 &
  echo $! >"$FRONTEND_PID_FILE"
else
  echo "Error: yarnpkg (or yarn) not found in PATH. Install dependencies with 'yarn' first." >&2
fi

sleep 1

if [ -f "$BACKEND_PID_FILE" ]; then
  echo "Backend started (PID=$(cat $BACKEND_PID_FILE)). Tail logs with: tail -f $BACKEND_LOG"
fi
if [ -f "$FRONTEND_PID_FILE" ]; then
  echo "Frontend started (PID=$(cat $FRONTEND_PID_FILE)). Tail logs with: tail -f $FRONTEND_LOG"
fi

echo "To stop both: $ROOT_DIR/dev_stop.sh"
