import { useCallback, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "nepali-archive:player"

function readSavedState(songs) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    const index = Number(saved.currentSongIndex)
    if (!Number.isInteger(index) || !songs[index]?.youtubeId) return null
    const song = songs[index]
    const progress = Number(saved.progress)
    return {
      currentSongIndex: index,
      isPlaying: Boolean(saved.isPlaying),
      progress:
        Number.isFinite(progress) && progress > 0
          ? Math.min(progress, song.duration || progress)
          : 0,
    }
  } catch {
    return null
  }
}

function findNextIndex(songs, fromIndex, direction) {
  const total = songs.length
  for (let step = 1; step <= total; step += 1) {
    const candidate = (fromIndex + direction * step + total * 10) % total
    if (songs[candidate]?.youtubeId) return candidate
  }
  // no playable song at all — just move one slot so the UI still advances
  return (fromIndex + direction + total) % total
}

export function useMusicPlayer() {
  const [songs, setSongs] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [restoreTo, setRestoreTo] = useState(0)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seekRequest, setSeekRequest] = useState({ version: 0, time: 0 })
  const [playerError, setPlayerError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/songs")
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data.songs) ? data.songs : []
        const saved = readSavedState(list)
        const firstPlayable = list.findIndex((s) => s.youtubeId)
        setSongs(list)
        setCurrentSongIndex(saved?.currentSongIndex ?? (firstPlayable !== -1 ? firstPlayable : 0))
        setIsPlaying(saved?.isPlaying ?? false)
        setProgress(saved?.progress ?? 0)
        setRestoreTo(saved?.progress ?? 0)
        setIsLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        setLoadError(error?.message || "Failed to load the archive.")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isLoading) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentSongIndex, isPlaying, progress })
      )
    } catch {
      // storage unavailable — nothing to do
    }
  }, [currentSongIndex, isPlaying, progress, isLoading])

  const currentSong = songs?.[currentSongIndex]

  const goTo = useCallback((index) => {
    setCurrentSongIndex(index)
    setProgress(0)
    setDuration(0)
    setPlayerError(null)
  }, [])

  const handlePlayPause = useCallback(() => {
    if (!currentSong?.youtubeId) return
    setIsPlaying((prev) => !prev)
  }, [currentSong])

  const handleNext = useCallback(() => {
    if (!songs?.length) return
    goTo(findNextIndex(songs, currentSongIndex, 1))
  }, [songs, currentSongIndex, goTo])

  const handlePrevious = useCallback(() => {
    if (!songs?.length) return
    goTo(findNextIndex(songs, currentSongIndex, -1))
  }, [songs, currentSongIndex, goTo])

  const handleSelect = useCallback(
    (index) => {
      if (!songs?.[index]) return
      if (index === currentSongIndex) {
        if (songs[index]?.youtubeId) setIsPlaying(true)
        return
      }
      goTo(index)
      if (songs[index]?.youtubeId) setIsPlaying(true)
    },
    [songs, currentSongIndex, goTo]
  )

  const handleReady = useCallback((durationSeconds) => {
    setDuration(durationSeconds)
  }, [])

  const handleTimeUpdate = useCallback((seconds) => {
    setProgress(seconds)
  }, [])

  const handleEnded = useCallback(() => {
    if (!songs?.length) return
    const next = findNextIndex(songs, currentSongIndex, 1)
    goTo(next)
    setIsPlaying(true)
  }, [songs, currentSongIndex, goTo])

  const handleSeek = useCallback((seconds) => {
    setProgress(seconds)
    setSeekRequest((prev) => ({ version: prev.version + 1, time: seconds }))
  }, [])

  const handleError = useCallback((message) => {
    setPlayerError(message)
    setIsPlaying(false)
  }, [])

  return useMemo(
    () => ({
      songs,
      isLoading,
      loadError,
      currentSong,
      currentSongIndex,
      isPlaying,
      progress,
      duration: duration || currentSong?.duration || 0,
      seekRequest,
      playerError,
      restoreTo,
      handlePlayPause,
      handleNext,
      handlePrevious,
      handleSelect,
      handleReady,
      handleTimeUpdate,
      handleEnded,
      handleSeek,
      handleError,
    }),
    [
      songs,
      isLoading,
      loadError,
      currentSong,
      currentSongIndex,
      isPlaying,
      progress,
      duration,
      seekRequest,
      playerError,
      restoreTo,
      handlePlayPause,
      handleNext,
      handlePrevious,
      handleSelect,
      handleReady,
      handleTimeUpdate,
      handleEnded,
      handleSeek,
      handleError,
    ]
  )
}