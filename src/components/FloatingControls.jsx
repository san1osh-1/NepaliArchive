import { useCallback, useRef, useState } from "react"

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00"
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

function PrevIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 1v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.5 1.5 3.8 7l8.7 5.5V1.5Z" fill="currentColor" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11 1v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M1.5 1.5 10.2 7l-8.7 5.5V1.5Z" fill="currentColor" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4.5 2.5v13L15 9 4.5 2.5Z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="4" y="2.5" width="3.2" height="13" fill="currentColor" />
      <rect x="10.8" y="2.5" width="3.2" height="13" fill="currentColor" />
    </svg>
  )
}

export default function FloatingControls({
  isPlaying,
  progress,
  duration,
  disabled,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) {
  const trackRef = useRef(null)
  const [hoverRatio, setHoverRatio] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const ratioFromEvent = useCallback((event) => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const clientX =
      "touches" in event && event.touches.length
        ? event.touches[0].clientX
        : event.clientX
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }, [])

  const commitSeek = useCallback(
    (seconds) => {
      if (!duration) return
      onSeek(seconds)
    },
    [duration, onSeek]
  )

  const handlePointerMove = useCallback(
    (event) => {
      const ratio = ratioFromEvent(event)
      setHoverRatio(ratio)
      if (isDragging && duration) commitSeek(ratio * duration)
    },
    [ratioFromEvent, isDragging, duration, commitSeek]
  )

  const handlePointerDown = useCallback(
    (event) => {
      const ratio = ratioFromEvent(event)
      setIsDragging(true)
      if (duration) commitSeek(ratio * duration)
    },
    [ratioFromEvent, duration, commitSeek]
  )

  const endDrag = useCallback(() => setIsDragging(false), [])

  const playedRatio = duration ? Math.min(1, progress / duration) : 0
  const hoverTime = hoverRatio !== null ? (hoverRatio * duration).toFixed(0) : null

  return (
    <div className="flex w-full max-w-xl items-center gap-3 sm:gap-5">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous recording"
        className="shrink-0 text-cream/60 transition-all hover:scale-105 hover:text-cream disabled:opacity-30 disabled:hover:scale-100"
      >
        <PrevIcon />
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        disabled={disabled}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/35 text-cream transition-all hover:border-gold hover:text-gold hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:border-cream/35 disabled:hover:text-cream sm:h-14 sm:w-14"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next recording"
        className="shrink-0 text-cream/60 transition-all hover:scale-105 hover:text-cream disabled:opacity-30 disabled:hover:scale-100"
      >
        <NextIcon />
      </button>

      <span className="w-8 shrink-0 text-right font-mono text-[9px] tracking-[0.05em] text-cream/50 sm:w-9 sm:text-[11px] sm:tracking-[0.08em]">
        {formatTime(progress)}
      </span>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(progress)}
        tabIndex={0}
        onMouseMove={handlePointerMove}
        onMouseDown={handlePointerDown}
        onMouseLeave={() => {
          setHoverRatio(null)
          endDrag()
        }}
        onMouseUp={endDrag}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={endDrag}
        className="group relative h-4 flex-1 cursor-pointer touch-none"
      >
        <div className="absolute inset-y-1/2 left-0 right-0 h-px -translate-y-1/2 bg-cream/20 transition-colors group-hover:bg-cream/30" />
        <div
          className="absolute inset-y-1/2 left-0 h-px -translate-y-1/2 bg-gold"
          style={{ width: `${playedRatio * 100}%` }}
        />
        {hoverRatio !== null && (
          <div
            className="absolute inset-y-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border border-gold bg-charcoal-deep/80"
            style={{ left: `${hoverRatio * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-cream/80">
              {hoverTime != null ? formatTime(Number(hoverTime)) : ""}
            </span>
          </div>
        )}
        <div
          className="absolute inset-y-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-gold opacity-0 transition-opacity group-hover:opacity-100"
          style={{ left: `${playedRatio * 100}%` }}
        />
      </div>

      <span className="w-8 shrink-0 font-mono text-[9px] tracking-[0.05em] text-cream/50 sm:w-9 sm:text-[11px] sm:tracking-[0.08em]">
        {formatTime(duration)}
      </span>
    </div>
  )
}
