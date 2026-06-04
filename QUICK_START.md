# 🚀 Quick Start Guide - Auto-Play Features

## Overview
This guide walks you through testing the newly implemented auto-play functionality in MUZZER.

---

## Prerequisites

✅ Node.js (v20+)  
✅ npm installed  
✅ PostgreSQL running (or Docker ready)  

---

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd /home/sid-linux/Desktop/my-app
npm install
```

### 2. Start PostgreSQL Database
**Option A: Local PostgreSQL**
```bash
# Make sure PostgreSQL is running on port 5433
psql -U sid-linux -h localhost -p 5433
```

**Option B: Docker (Recommended)**
```bash
docker run --name muzz-db \
  -e POSTGRES_USER=sid-linux \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5433:5432 \
  -d postgres
```

### 3. Configure Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Testing Auto-Play

### Test Case 1: YouTube Auto-Play
1. Sign in with Google
2. Go to Dashboard → Add track
3. Paste a YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Submit and wait for it to load
5. Click **Auto-play ON** button
6. Watch video play automatically
7. When video ends, next video should auto-play

### Test Case 2: Queue Polling
1. Open the app in **two browser windows**
2. In Window A: Vote on a track
3. In Window B: Within 3 seconds, you should see the vote count change
4. This confirms the 3-second polling is working

### Test Case 3: Auto-Play Toggle
1. Click **Auto-play ON** button to disable
2. Button should change to **Auto-play OFF** (subdued)
3. Play a YouTube video to completion
4. Video should NOT auto-advance (since it's off)
5. Click button again to re-enable
6. Next video should auto-play

### Test Case 4: Error Handling
1. Try adding an invalid YouTube URL
2. Should see a friendly error message
3. Error should not crash the app
4. Queue should continue functioning

---

## Key Features to Explore

### 🎵 Auto-Play Toggle
Located at the top of the "Now playing" card:
- **Green highlight** = Auto-play enabled
- **Subdued button** = Auto-play disabled
- Click to toggle

### 📊 Real-Time Polling
Watch the queue update in real-time:
- Vote on a track
- See vote count change instantly
- Open multiple windows to see synchronized updates

### 📹 YouTube Integration
- Click play on YouTube videos
- Video plays directly in embedded player
- Auto-plays next video when current ends

---

## Debugging

### Enable Debug Logs
Uncomment in `app/lib/auto-play-errors.ts`:
```typescript
// Development mode logging
if (process.env.NODE_ENV === 'development') {
  console.error(`[AutoPlay ${type}]`, message);
}
```

### Check Server Logs
Look for:
- ✅ `Compiled in XXms` = Good
- ✅ `GET /api/streams 200` = Queue fetching
- ❌ `Can't reach database` = DB not running
- ❌ `5xx` errors = Check API routes

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Look for:
   - Regular `/api/streams` requests (polling)
   - YouTube video loads
   - Error responses

---

## Common Issues & Fixes

### Issue: "Can't reach database server at 127.0.0.1:5433"

**Solution:** Start PostgreSQL
```bash
# Docker
docker start muzz-db

# Or local PostgreSQL
pg_ctl start -D /usr/local/var/postgres
```

### Issue: YouTube videos don't auto-play

**Solution:** 
1. Check browser console for errors
2. Verify YouTube video ID is valid
3. Ensure auto-play is toggled ON (green button)
4. Try a different YouTube video

### Issue: Queue not syncing between windows

**Solution:**
1. Check if `use-streams.ts` polling is active
2. Verify network requests in DevTools
3. Clear browser cache and refresh
4. Check for API errors in console

### Issue: TypeScript errors after changes

**Solution:**
```bash
npx tsc --noEmit  # Check for errors
npm run dev        # Hot reload should fix
```

---

## Performance Testing

### Measure Polling Performance
Add this to `use-streams.ts`:
```typescript
const startTime = performance.now();
const nextStreams = await fetchStreams();
const duration = performance.now() - startTime;
console.log(`Polling took ${duration}ms`);
```

### Check Memory Usage
1. Open DevTools → Memory tab
2. Take heap snapshot before auto-play
3. Let app run for 30 seconds
4. Take another snapshot
5. Compare memory usage

Expected: Minimal increase (<5MB)

---

## Feature Checklist

- [x] YouTube auto-play on video end
- [x] Queue polling every 3 seconds
- [x] Auto-play toggle button
- [x] Real-time vote synchronization
- [x] Error handling and recovery
- [x] TypeScript type safety
- [x] Memory cleanup on unmount
- [ ] Spotify auto-play (future)
- [ ] WebSocket real-time (future)
- [ ] Admin skip controls (future)

---

## Next Steps

After testing, consider:
1. **Deploy to staging** environment
2. **Load test** with multiple concurrent users
3. **Monitor** error rates and performance
4. **Gather feedback** from testers
5. **Implement feedback** for v0.3.0

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review `POLISH_IMPROVEMENTS.md` for technical details
3. Check server logs for backend errors
4. Verify database is running

---

## Version Info

**Current Version:** 0.2.0 - Auto-Play Release  
**Release Date:** 2026-06-04  
**Status:** ✅ Stable  

Last Updated: 2026-06-04
