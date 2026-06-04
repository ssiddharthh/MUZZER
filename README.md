# MUZZER

Crowd-powered music queue for YouTube and Spotify. Listeners upvote tracks; the highest-voted item plays next.

## Frontend pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Google sign-in |
| `/queue` | Live queue, voting, media preview |
| `/dashboard` | Overview and stats |
| `/dashboard/streams/new` | Submit a track URL |
| `/dashboard/queue` | Your submitted tracks |
| `/admin/streams` | Admin view (requires `Streamer` role in DB) |

## Frontend structure

```
app/
  components/
    layout/     # Navbar, footer, dashboard shell
    streams/    # Queue, cards, voting, player, form
    ui/         # Button, card, input, spinner, etc.
  hooks/        # useStreams, useUser
  lib/          # api-client, stream-display
  types/        # StreamItem types
  page.tsx      # Landing
  login/ queue/ dashboard/ admin/
```

## Run locally

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment (create `.env`, do not commit)

```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
# Optional Spotify integration
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."
```

- Google OAuth redirect URI: `http://localhost:3000/api/auth/callback/google`
- Spotify OAuth redirect URI: `http://localhost:3000/api/auth/callback/spotify`

If you want Spotify login and queue control, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to your `.env` and restart the app.

## Upload to GitHub later

Upload the project folder **without**:

- `node_modules/`
- `.next/`
- `.env` (secrets)

`origin` is already set to: `https://github.com/ssiddharthh/MUZZER.git`

```bash
git push -u origin main
```

Use a [Personal Access Token](https://github.com/settings/tokens) as the password when prompted.
