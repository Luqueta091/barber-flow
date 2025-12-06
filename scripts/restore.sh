#!/usr/bin/env bash
set -euo pipefail

# Example restore script for Postgres using pg_restore/psql
# Usage: ./scripts/restore.sh <DB_URL> <BACKUP_FILE>
# DB_URL format: postgresql://user:pass@host:port/dbname

DB_URL="${1:-}"
BACKUP_FILE="${2:-}"

if [[ -z "$DB_URL" || -z "$BACKUP_FILE" ]]; then
  echo "Usage: $0 <DB_URL> <BACKUP_FILE>"
  exit 1
fi

echo "Restoring from $BACKUP_FILE to $DB_URL"
pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DB_URL" "$BACKUP_FILE"
echo "Restore completed"
