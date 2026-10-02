#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"
if [[ ! -f .env ]]; then echo "Missing broadcast-worker/.env"; exit 1; fi
docker compose build --pull
docker compose up -d --remove-orphans
docker compose ps
curl --fail --silent --show-error http://127.0.0.1:8788/health
echo
echo "VITALOS broadcast worker is running."
