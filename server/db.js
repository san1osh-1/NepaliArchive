import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import Database from "better-sqlite3"
import { songs as seedSongData } from "../src/data/songs.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "data", "archive.db")

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    year TEXT,
    duration INTEGER NOT NULL DEFAULT 0,
    youtube_id TEXT,
    spotify_url TEXT,
    sort_order INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_songs_sort ON songs (sort_order);
`)

// Seed once on first boot — the archive catalog is small, and seeding is
// idempotent, so the database stays populated across fresh deploys.
const seedSongs = db.transaction(() => {
  const { n } = db.prepare("SELECT COUNT(*) AS n FROM songs").get()
  if (n > 0) return

  const insert = db.prepare(`
    INSERT INTO songs (title, artist, year, duration, youtube_id, spotify_url, sort_order)
    VALUES (@title, @artist, @year, @duration, @youtubeId, @spotifyUrl, @sortOrder)
  `)

  seedSongData.forEach((song, index) => {
    insert.run({
      title: song.title,
      artist: song.artist,
      year: song.year ?? null,
      duration: Number(song.duration) || 0,
      youtubeId: song.youtubeId ?? null,
      spotifyUrl: song.spotifyUrl ?? null,
      sortOrder: index,
    })
  })
})

seedSongs()

function rowToSong(row) {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    year: row.year,
    duration: row.duration,
    youtubeId: row.youtube_id,
    spotifyUrl: row.spotify_url,
    sortOrder: row.sort_order,
  }
}

export function listSongs() {
  return db
    .prepare(
      `SELECT id, title, artist, year, duration, youtube_id, spotify_url, sort_order
       FROM songs ORDER BY sort_order ASC`
    )
    .all()
    .map(rowToSong)
}

export function getSongById(id) {
  const row = db
    .prepare(
      `SELECT id, title, artist, year, duration, youtube_id, spotify_url, sort_order
       FROM songs WHERE id = ?`
    )
    .get(id)
  return row ? rowToSong(row) : null
}