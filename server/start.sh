#!/bin/sh
set -e

if [ "$PG_DATABASE" != "postgres" ]; then
  echo "Checking if database $PG_DATABASE exists..."
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$PG_DATABASE'" | grep -q 1 || \
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -c "CREATE DATABASE $PG_DATABASE"
  echo "Database $PG_DATABASE created or already exists"
fi

npm run db-migrate:prod && npm start
