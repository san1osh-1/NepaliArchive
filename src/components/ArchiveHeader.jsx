/**
 * Top header: brand on the left, and on the right quick links to open the
 * current recording on Spotify (when a real link exists) and on YouTube.
 */
export default function ArchiveHeader({ song }) {
  const youtubeHref = song?.youtubeId
    ? `https://www.youtube.com/watch?v=${song.youtubeId}`
    : null
  const spotifyHref = song?.spotifyUrl || null

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-6 px-5 py-5 sm:px-10 sm:py-8">
      <span className="pointer-events-auto whitespace-nowrap font-mono text-[29.5px] tracking-[0.18em] text-cream/80 transition-colors hover:text-cream xs:text-[10px] sm:text-xs sm:tracking-[0.28em]">
        नेपाली गीत–संग्रह
      </span>

      {song && (
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {spotifyHref && (
            <a
              href={spotifyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-cream/55 transition-colors hover:text-cream sm:text-[11px]"
            >
              <SpotifyIcon />
              <span className="hidden sm:inline">SPOTIFY</span>
            </a>
          )}

          {youtubeHref && (
            <a
              href={youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-cream/55 transition-colors hover:text-cream sm:text-[11px]"
            >
              <YouTubeIcon />
              <span className="hidden sm:inline">YOUTUBE</span>
            </a>
          )}
        </div>
      )}
    </header>
  )
}

function SpotifyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34a.75.75 0 0 1-1.03.25c-2.82-1.73-6.38-2.12-10.56-1.16a.75.75 0 1 1-.33-1.46c4.55-1.04 8.48-.6 11.63 1.34.36.22.47.67.29 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.55-1.8c4.33-1.32 9.72-.68 13.42 1.58.44.27.58.85.39 1.31zm.13-3.4C14.53 8.42 8.5 8.25 4.79 9.38a1.12 1.12 0 1 1-.65-2.15c4.22-1.29 10.87-1.09 15.21 1.4a1.12 1.12 0 0 1-1.23 1.88z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 24 17" fill="currentColor" aria-hidden="true">
      <path d="M23.5 2.95A3.02 3.02 0 0 0 21.36.8C19.49.25 12 .25 12 .25S4.51.25 2.64.8A3.02 3.02 0 0 0 .5 2.95 31.5 31.5 0 0 0 0 8.4c0 1.84.17 3.68.5 5.45A3.02 3.02 0 0 0 2.64 16c1.87.55 9.36.55 9.36.55s7.49 0 9.36-.55a3.02 3.02 0 0 0 2.14-2.15c.33-1.77.5-3.61.5-5.45 0-1.84-.17-3.68-.5-5.45zM9.6 11.7V5.1l6.25 3.3L9.6 11.7z" />
    </svg>
  )
}
