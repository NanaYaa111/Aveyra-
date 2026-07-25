#!/usr/bin/env bash
# Apply schema and policies to a Postgres database using psql.
# Usage: DATABASE_URL=postgres://user:pass@host:port/db ./scripts/apply-sql.sh

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL must be set to the database connection string." >&2
  echo "Get the connection string from Supabase Project → Settings → Database → Connection string (URI)." >&2
  exit 1
fi

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
SCHEMA_FILE="$ROOT_DIR/infra/supabase/schema.sql"
POLICIES_FILE="$ROOT_DIR/infra/supabase/policies.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "Missing $SCHEMA_FILE" >&2
  exit 1
fi
if [ ! -f "$POLICIES_FILE" ]; then
  echo "Missing $POLICIES_FILE" >&2
  exit 1
fi

echo "Applying schema: $SCHEMA_FILE"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SCHEMA_FILE"

echo "Applying policies: $POLICIES_FILE"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$POLICIES_FILE"

echo "SQL applied successfully."
