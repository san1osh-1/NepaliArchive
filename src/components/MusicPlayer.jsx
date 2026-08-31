import FloatingControls from "./FloatingControls"

/**
 * Bottom music player dock — sits a little above the very bottom edge of
 * the screen. Shows the current recording's title/artist/year plus the
 * transport controls and seek bar.
 */
export default function MusicPlayer({
  song,
  index,
  isPlaying,
  progress,
  duration,
  error,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) {
  const isUnavailable = !song?.youtubeId

  return (
    <div className="fixed inset-x-0 bottom-5 z-20 sm:bottom-7">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6">
        {error && !isUnavailable && (
          <p className="font-mono text-[11px] tracking-[0.15em] text-rust/90">{error}</p>
        )}

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-[9px] tracking-[0.3em] text-cream/40 sm:text-[10px]">
            RECORDING NO. {String(index + 1).padStart(2, "0")}
          </p>
          <p className="font-display text-lg font-medium text-cream sm:text-2xl">
            {song?.title}
          </p>
          <p className="font-sans text-xs text-cream-dim sm:text-sm">
            {song?.artist}
            {song?.year && (
              <span className="ml-2 font-mono text-[10px] tracking-[0.15em] text-gold/70">
                {song.year}
              </span>
            )}
          </p>
        </div>

        {isUnavailable && (
          <p className="font-mono text-[10px] tracking-[0.15em] text-rust/90">
            UNAVAILABLE — this reel could not be sourced
          </p>
        )}

        <FloatingControls
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          disabled={isUnavailable}
          onPlayPause={onPlayPause}
          onNext={onNext}
          onPrevious={onPrevious}
          onSeek={onSeek}
        />
      </div>
    </div>
  )
}
