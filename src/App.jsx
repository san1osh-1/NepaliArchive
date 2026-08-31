import ArchiveBackdrop from "./components/ArchiveBackdrop"
import ArchiveHeader from "./components/ArchiveHeader"
import ArchiveCenter from "./components/ArchiveCenter"
import MusicPlayer from "./components/MusicPlayer"
import YouTubeSource from "./components/YouTubeSource"
import { useMusicPlayer } from "./hooks/useMusicPlayer"

export default function App() {
  const player = useMusicPlayer()

  return (
    <div className="relative min-h-screen w-full">
      <ArchiveBackdrop />

      <ArchiveHeader song={player.currentSong} />

      <main className="flex min-h-screen w-full items-center justify-center px-6 pb-40 pt-28 sm:pb-48">
        <ArchiveCenter />
      </main>

      {player.loadError && (
        <p className="fixed inset-x-0 bottom-5 z-20 text-center font-mono text-[11px] tracking-[0.15em] text-rust/90">
          {player.loadError}
        </p>
      )}

      {!player.isLoading && (
        <>
          <MusicPlayer
            song={player.currentSong}
            index={player.currentSongIndex}
            isPlaying={player.isPlaying}
            progress={player.progress}
            duration={player.duration}
            error={player.playerError}
            onPlayPause={player.handlePlayPause}
            onNext={player.handleNext}
            onPrevious={player.handlePrevious}
            onSeek={player.handleSeek}
          />

          <YouTubeSource
            videoId={player.currentSong?.youtubeId ?? null}
            isPlaying={player.isPlaying}
            restoreTo={player.restoreTo}
            seekVersion={player.seekRequest.version}
            seekTo={player.seekRequest.time}
            onReady={player.handleReady}
            onTimeUpdate={player.handleTimeUpdate}
            onEnded={player.handleEnded}
            onError={player.handleError}
          />
        </>
      )}
    </div>
  )
}
