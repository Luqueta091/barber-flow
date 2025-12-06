#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"

if [[ -z "$BASE_URL" ]]; then
  echo "Usage: $0 <BASE_URL>"
  exit 1
fi

echo "Running smoke tests against $BASE_URL"

curl -fsSL "$BASE_URL/health"
curl -fsSL "$BASE_URL/bff/availability?unitId=u1&serviceId=s1&date=2024-01-02"

echo "Smoke OK"
