#!/bin/sh
set -e

if [ "$PG_DATABASE" != "postgres" ]; then
  echo "Checking if database $PG_DATABASE exists..."
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$PG_DATABASE'" | grep -q 1 || \
  PGPASSWORD=$PG_PASS psql -h $PG_HOST -U $PG_USER -d postgres -c "CREATE DATABASE $PG_DATABASE"
  echo "Database $PG_DATABASE created or already exists"
fi

# Create node_modules symlink for global modules if needed
if [ ! -d ./node_modules/tsconfig-paths ]; then
  echo "Setting up tsconfig-paths module link..."
  mkdir -p ./node_modules
  ln -sf /usr/local/lib/node_modules/tsconfig-paths ./node_modules/
fi

# Run migration without requiring tsconfig-paths module
echo "Running migrations..."
PGOPTIONS='-c search_path=app,public' node dist/migration.js

# Start the application with path resolution
echo "Starting application..."
NODE_PATH=/usr/local/lib/node_modules NODE_OPTIONS="--require /usr/local/lib/node_modules/tsconfig-paths/register" node dist/app.js
