#!/usr/bin/env bash
# Stop stale Next.js dev servers and clear the .next cache before starting fresh.
# Use when you see errors like "Cannot find module './NNN.js'" or missing webpack packs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

for port in 3000 3001; do
  pid="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "$pid" ]; then
    kill $pid 2>/dev/null || true
    echo "Stopped process on port $port (PID $pid)"
  fi
done

sleep 0.5
rm -rf "$ROOT/.next"
echo "Cleared .next cache"

cd "$ROOT"
ulimit -n 10240 2>/dev/null || true
exec npm run dev -- -p 3000
