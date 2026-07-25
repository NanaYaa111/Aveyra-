#!/usr/bin/env bash
# Helper: update Vercel environment variables using Vercel CLI
# Usage:
# VERCEL_TOKEN=... VERCEL_PROJECT=... ./scripts/update-vercel-env.sh NEXT_PUBLIC_SUPABASE_ANON_KEY "newanonkey" production

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <VAR_NAME> <VALUE> <environment>"
  exit 1
fi

VAR_NAME="$1"
VALUE="$2"
ENVIRONMENT="$3" # production|preview|development

if [ -z "$VERCEL_TOKEN" ] || [ -z "$VERCEL_PROJECT" ]; then
  echo "Set VERCEL_TOKEN and VERCEL_PROJECT in your environment before running."
  exit 1
fi

# This script uses the Vercel CLI non-interactively where possible. It may
# still open interactive prompts for some use cases; treat as a template.

echo "Updating Vercel env var $VAR_NAME for project $VERCEL_PROJECT (env: $ENVIRONMENT)"

auth_header="Authorization: Bearer $VERCEL_TOKEN"
# Use Vercel API to create or update an environment variable
# Reference: https://vercel.com/docs/rest-api#api-basics/authentication

# Create the variable
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.vercel.com/v9/projects/${VERCEL_PROJECT}/env" \
  -H "Content-Type: application/json" \
  -H "$auth_header" \
  -d "{\"key\": \"${VAR_NAME}\", \"value\": \"${VALUE}\", \"target\": [\"${ENVIRONMENT}\"] }")

if [ "$response" = "200" ] || [ "$response" = "201" ]; then
  echo "Environment variable set successfully."
else
  echo "API responded with status $response. You may need to update via the Vercel web UI or CLI."
  exit 1
fi
