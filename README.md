# Nepali Archive

An immersive, editorial-style listening room for old Nepali folk & pop
recordings — full-screen artwork, minimal navigation, and a custom player
built on the real YouTube IFrame API. Visual language inspired by
saloon.wtf (no code, assets, or copy taken from it).

## Run it locally

The app needs both the API and the Vite dev server:

```bash
npm install
npm run dev:all
```

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/songs (also `/api/health`)

Or run them in separate terminals with `npm run dev` (Vite) and
`npm run dev:api` (Express + SQLite).

Build for production and run the combined server:

```bash
npm run build
npm start
```
The Express server serves the built frontend from `dist/` and the API on the
same port (default 4000, or `PORT`).

## Where the songs live now

The catalog lives in a **SQLite database** (`server/data/archive.db`), seeded
automatically the first time the server starts from `src/data/songs.js`. The
React app never imports the catalog directly — it fetches it from
`GET /api/songs`.

To add or edit a song: edit `src/data/songs.js`, delete `server/data/` and
restart the server to re-seed. (Or run SQL against the DB once you have a
schema tool.) Each entry needs a real `youtubeId` — leave it `null` if you
don't have one yet; the UI marks that track "Unavailable" and Next/Previous
skip over it.

## Deploying (Render)

1. Push this project to a GitHub repo.
2. In Render: **New → Blueprint**, connect the repo.
3. Render reads `render.yaml`, installs, builds, and starts the service.
4. Open the `*.onrender.com` URL it gives you.

> The free plan's filesystem is ephemeral — new instances auto-seed the DB,
> and old data is lost on redeploy. If you later edit songs through the DB and
> want them to persist, attach a [Render Disk] and set `DB_PATH` to a file on it.

[Render Disk]: https://render.com/docs/disks

## Structure

```
src/
├── components/
│   ├── ArchiveBackdrop.jsx   full-screen artwork + grain + overlays
│   ├── ArchiveHeader.jsx     small editorial header (Archive/About/Index)
│   ├── MusicPlayer.jsx       title, artist, year + transport controls
│   ├── FloatingControls.jsx  play/pause/next/prev + seekable progress line
│   ├── ArchiveCenter.jsx     the hero headline panel
│   ├── AboutPanel.jsx        small about overlay
│   └── YouTubeSource.jsx     wraps the YouTube IFrame Player API
├── hooks/
│   └── useMusicPlayer.js     fetches the catalog + all playback state
├── lib/
│   └── loadYouTubeApi.js     loads the YouTube IFrame API exactly once
├── data/
│   └── songs.js              the seed catalog (seeded into SQLite on boot)
└── App.jsx
server/
├── index.js                  Express app: API + serves dist/
└── db.js                     SQLite setup, seeding, queries
render.yaml                   Render.com blueprint
```
