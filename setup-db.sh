#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")" || exit 1

echo "🔧 Setting up PostgreSQL for MUZZER..."

if [ -f .env ]; then
  echo "📄 Loading .env"
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi

DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/muzzer}"

echo "Using DATABASE_URL=$DATABASE_URL"

# Parse DATABASE_URL into environment variables.
eval "$(node <<'NODE'
const url = new URL(process.env.DATABASE_URL);
const get = (value) => value === null ? '' : value;
const user = get(url.username) || 'postgres';
const password = get(url.password) || '';
const host = get(url.hostname) || 'localhost';
const port = get(url.port) || '5432';
const db = url.pathname.replace(/^\//, '') || 'muzzer';
console.log(`PGUSER=${JSON.stringify(user)}`);
console.log(`PGPASSWORD=${JSON.stringify(password)}`);
console.log(`PGHOST=${JSON.stringify(host)}`);
console.log(`PGPORT=${JSON.stringify(port)}`);
console.log(`PGDATABASE=${JSON.stringify(db)}`);
NODE
)"

export PGUSER PGPASSWORD PGHOST PGPORT PGDATABASE

echo "Using DB host=$PGHOST user=$PGUSER db=$PGDATABASE"

function run_psql() {
  PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c 'SELECT 1' >/dev/null 2>&1
}

function run_sudo_psql() {
  sudo -u postgres bash -lc 'cd /tmp && psql -c "SELECT 1"' >/dev/null 2>&1
}

function run_sudo_command() {
  local sql="$1"
  sudo -u postgres bash -lc "cd /tmp && psql -c '$sql'"
}

if run_psql; then
  echo "✅ Direct PostgreSQL access works."
else
  echo "⚠️ Direct PostgreSQL access failed. Trying local postgres socket via sudo..."
  if run_sudo_psql; then
    echo "✅ Local postgres socket access OK."
    if [ "$PGUSER" = 'postgres' ] && [ -n "$PGPASSWORD" ]; then
      echo "🔐 Setting postgres password for host connections..."
      run_sudo_command "ALTER USER postgres WITH PASSWORD '$PGPASSWORD';"
    fi
  else
    echo "❌ Unable to access postgres via sudo."
    echo "Please make sure PostgreSQL is installed and you can run 'sudo -u postgres psql'."
    exit 1
  fi

  if ! run_psql; then
    echo "❌ Cannot connect using DATABASE_URL after password fix."
    exit 1
  fi
fi

echo "📦 Creating database '$PGDATABASE' if it does not exist..."
if PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" | grep -q 1; then
  echo "✅ Database '$PGDATABASE' already exists."
else
  echo "➕ Creating database '$PGDATABASE'..."
  if run_psql; then
    PGPASSWORD="$PGPASSWORD" psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -c "CREATE DATABASE \"$PGDATABASE\";"
  else
    run_sudo_command "CREATE DATABASE \"$PGDATABASE\";"
  fi
  echo "✅ Database '$PGDATABASE' created."
fi

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "📊 Pushing database schema..."
npx prisma db push

echo "✨ Database setup complete!"
