import { useEffect, useRef } from "react"
import { loadYouTubeApi } from "../lib/loadYouTubeApi"

/**
 * Headless-ish wrapper around a single YouTube IFrame player instance.
 * The iframe is visually hidden — the custom React UI is the real interface.
 *
 * Props:
 *  - videoId:     current YouTube video id (string | null)
 *  - isPlaying:   whether playback should be active
 *  - restoreTo:   seconds to seek to once on initial load (0 to skip)
 *  - seekVersion: bump this number to trigger a seekTo(seekTo, true)
 *  - seekTo:      seconds to seek to when seekVersion changes
 *  - onReady:     (durationSeconds) => void, fired once metadata is known
 *  - onTimeUpdate:(currentSeconds) => void, fired on a light polling loop
 *  - onEnded:     () => void
 *  - onError:     (message) => void
 */
export default function YouTubeSource({
  videoId,
  isPlaying,
  restoreTo = 0,
  seekVersion,
  seekTo,
  onReady,
  onTimeUpdate,
  onEnded,
  onError,
}) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const pollRef = useRef(null)
  const isReadyRef = useRef(false)
  const loadedVideoIdRef = useRef(null)
  const restoreAppliedRef = useRef(false)
  const lastSeekVersionRef = useRef(seekVersion)

  // Keep latest callbacks/state in refs so the player's own event
  // handlers (created once) never close over stale values.
  const callbacksRef = useRef({})
  callbacksRef.current = { onReady, onTimeUpdate, onEnded, onError, isPlaying }

  // --- create the player exactly once -----------------------------------
  useEffect(() => {
    let cancelled = false

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !containerRef.current) return

        playerRef.current = new YT.Player(containerRef.current, {
          height: "1",
          width: "1",
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            fs: 0,
          },
          events: {
            onReady: () => {
              isReadyRef.current = true
              if (videoId) {
                playerRef.current.cueVideoById(videoId)
              }
            },
            onStateChange: (event) => {
              const YTState = window.YT.PlayerState
              if (event.data === YTState.PLAYING) {
                const duration = playerRef.current.getDuration()
                if (duration) callbacksRef.current.onReady?.(duration)
                startPolling()
              }
              if (event.data === YTState.PAUSED || event.data === YTState.BUFFERING) {
                // no-op: React state already drives play/pause intent
              }
              if (event.data === YTState.ENDED) {
                stopPolling()
                callbacksRef.current.onEnded?.()
              }
            },
            onError: () => {
              callbacksRef.current.onError?.(
                "This recording couldn't be played back."
              )
            },
          },
        })
      })
      .catch(() => {
        callbacksRef.current.onError?.("The archive player failed to load.")
      })

    function startPolling() {
      stopPolling()
      pollRef.current = window.setInterval(() => {
        const player = playerRef.current
        if (!player || typeof player.getCurrentTime !== "function") return
        callbacksRef.current.onTimeUpdate?.(player.getCurrentTime())
      }, 400)
    }

    function stopPolling() {
      if (pollRef.current) {
        window.clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    return () => {
      cancelled = true
      stopPolling()
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
      }
      playerRef.current = null
      isReadyRef.current = false
      restoreAppliedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- load a new video whenever videoId changes -------------------------
  useEffect(() => {
    const player = playerRef.current
    if (!player || !isReadyRef.current || !videoId) return
    if (loadedVideoIdRef.current === videoId) return

    loadedVideoIdRef.current = videoId
    if (callbacksRef.current.isPlaying) {
      player.loadVideoById(videoId)
    } else {
      player.cueVideoById(videoId)
    }
    if (!restoreAppliedRef.current && restoreTo > 0) {
      restoreAppliedRef.current = true
      player.seekTo(restoreTo, true)
    }
  }, [videoId, restoreTo])

  // --- sync play / pause intent from React state --------------------------
  useEffect(() => {
    const player = playerRef.current
    if (!player || !isReadyRef.current || typeof player.playVideo !== "function") return

    if (isPlaying) {
      player.playVideo()
    } else {
      player.pauseVideo()
    }
  }, [isPlaying, videoId])

  // --- seek on demand -------------------------------------------------------
  useEffect(() => {
    if (seekVersion === lastSeekVersionRef.current) return
    lastSeekVersionRef.current = seekVersion
    const player = playerRef.current
    if (!player || !isReadyRef.current || typeof player.seekTo !== "function") return
    player.seekTo(seekTo, true)
  }, [seekVersion, seekTo])

  return <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" ref={containerRef} />
}
