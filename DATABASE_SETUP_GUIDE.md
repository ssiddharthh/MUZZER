# 🗄️ Database Resolution Guide

## ⚠️ Current Status
The MUZZER app is running but cannot connect to the PostgreSQL database.

**Error:** `Can't reach database server at 127.0.0.1:5433`  
**Expected:** `postgresql://postgres:postgres@localhost:5432/muzzer`

---

## Problem Analysis

1. **.env file updated** ✅ - Changed to port 5432
2. **Dev server restarted** ❌ - Still using old cached value (5433)
3. **Root cause** - Next.js caches environment variables at build time

---

## Solution: Complete Restart Required

### Step 1: Kill All Processes
```bash
pkill -f "next dev"
pkill -f "npm run dev"
```

### Step 2: Verify .env Configuration  
```bash
cat /home/sid-linux/Desktop/my-app/.env | grep DATABASE_URL
# Should show: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/muzzer"
```

### Step 3: Clean Build Cache
```bash
cd /home/sid-linux/Desktop/my-app
rm -rf .next node_modules/.cache
```

### Step 4: Start Fresh Dev Server
```bash
cd /home/sid-linux/Desktop/my-app
npm run dev
```

---

## For Immediate Testing

**Option A: Manual PostgreSQL Setup**
```bash
# 1. Create database
export PGPASSWORD=postgres
createdb -h localhost -U postgres muzzer

# 2. Generate Prisma files
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Start server
npm run dev
```

**Option B: Automated Setup**
```bash
bash /home/sid-linux/Desktop/my-app/setup-db.sh
npm run dev
```

---

## Verification Steps

### Check PostgreSQL is Running
```bash
pg_isready -h 127.0.0.1 -p 5432
# Should return: accepting connections
```

### Verify Database Exists
```bash
export PGPASSWORD=postgres
psql -h 127.0.0.1 -U postgres -c "\l" | grep muzzer
```

### Test Prisma Connection
```bash
cd /home/sid-linux/Desktop/my-app
npx prisma db push --skip-generate
```

---

## Expected Success Indicators

✅ Dev server shows: `✓ Ready in XXXms`  
✅ No Prisma P1001 errors  
✅ `/api/streams` returns `200 OK`  
✅ Queue page shows "0 active tracks" (instead of error)  

---

## If Issues Persist

### Debug Environment Variables
```bash
cd /home/sid-linux/Desktop/my-app
node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```

### Check PostgreSQL Service
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

### Verify Port Binding
```bash
netstat -tlnp | grep 5432
# OR
ss -tlnp | grep 5432
```

---

## Summary

**What needs to happen:**
1. Ensure PostgreSQL is listening on port 5432
2. Create the `muzzer` database
3. Fully restart the Next.js dev server (clear cache)
4. Verify DATABASE_URL is loaded correctly

Once complete, the app will connect to the database successfully! 🎉
