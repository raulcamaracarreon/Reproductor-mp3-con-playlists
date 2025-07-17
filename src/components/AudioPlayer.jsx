import React, { useEffect, useRef, useState } from 'react'

const AudioPlayer = ({
  tracks,
  currentTrackIndex,
  onTrackChange,
  isLoop,
  isShuffle,
  onEnded,
  onPlayPause,
  isPlaying
}) => {
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrackIndex, isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress(audio.currentTime)
    }

    const setAudioDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', setAudioDuration)
    const handleEnded = () => {
      onEnded()
    }
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', setAudioDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [onEnded])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      onPlayPause(true)
    } else {
      audioRef.current.pause()
      onPlayPause(false)
    }
  }

  const stop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    onPlayPause(false)
  }

  const forward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration)
  }

  const rewind = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
  }

  const seek = (e) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = e.target.value
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div>
      <audio ref={audioRef}>
        {tracks.length > 0 && <source src={tracks[currentTrackIndex]?.url} type="audio/mpeg" />}
      </audio>
      <div className="track-info">
        <h3>{tracks.length > 0 ? tracks[currentTrackIndex]?.title : 'No track selected'}</h3>
        <p>{tracks.length > 0 ? tracks[currentTrackIndex]?.artist : ''}</p>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={progress}
        onChange={seek}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="audio-controls">
        <button onClick={rewind} title="Rewind 10s">⏪</button>
        <button onClick={togglePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button onClick={stop} title="Stop">⏹</button>
        <button onClick={forward} title="Forward 10s">⏩</button>
      </div>
    </div>
  )
}

export default AudioPlayer
