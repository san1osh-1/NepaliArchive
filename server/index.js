import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import { getSongById, listSongs } from "./db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.get("/api/songs", (_req, res) => {
  res.json({ songs: listSongs() })
})

app.get("/api/songs/:id", (req, res) => {
  const id = Number(req.params.id)
  const song = Number.isInteger(id) ? getSongById(id) : null
  if (!song) {
    res.status(404).json({ error: "Recording not found" })
    return
  }
  res.json(song)
})

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" })
})

// In production the built frontend lives in dist/ — serve it alongside the API.
const distDir = path.join(__dirname, "..", "dist")
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"))
  })
}

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`Nepali Archive listening on :${port}`)
})