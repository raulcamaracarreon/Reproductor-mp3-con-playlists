import React, { useEffect, useState, useCallback } from 'react'
import AudioPlayer from './components/AudioPlayer'
import PlaylistManager from './components/PlaylistManager'
import TrackList from './components/TrackList'
import AddTrackForm from './components/AddTrackForm'
import DarkModeSwitch from './components/DarkModeSwitch'

const LOCAL_STORAGE_KEY = 'audio-player-playlists'
const LOCAL_STORAGE_DARK_MODE = 'audio-player-dark-mode'
const LOCAL_STORAGE_SELECTED_PLAYLIST = 'audio-player-selected-playlist'

const App = () => {
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_SELECTED_PLAYLIST) || (playlists[0]?.id ?? null)
  })
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DARK_MODE)
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlists))
  }, [playlists])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DARK_MODE, darkMode)
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_PLAYLIST, selectedPlaylistId)
  }, [selectedPlaylistId])

  const selectedPlaylist = playlists.find((pl) => pl.id === selectedPlaylistId)

  const handleCreatePlaylist = (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: []
    }
    setPlaylists((prev) => [...prev, newPlaylist])
    setSelectedPlaylistId(newPlaylist.id)
    setCurrentTrackIndex(0)
    setIsPlaying(false)
  }

  const handleDeletePlaylist = (id) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id))
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(playlists.length > 1 ? playlists.find((pl) => pl.id !== id)?.id : null)
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }

  const handleSelectPlaylist = (id) => {
    setSelectedPlaylistId(id)
    setCurrentTrackIndex(0)
    setIsPlaying(false)
  }

  const handleAddTrack = (track) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === selectedPlaylistId ? { ...pl, tracks: [...pl.tracks, track] } : pl
      )
    )
  }

  const handleRemoveTrack = (trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === selectedPlaylistId
          ? { ...pl, tracks: pl.tracks.filter((t) => t.id !== trackId) }
          : pl
      )
    )
    if (currentTrackIndex >= (selectedPlaylist?.tracks.length ?? 0) - 1) {
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index)
    setIsPlaying(true)
  }

  const handleEnded = useCallback(() => {
    if (!selectedPlaylist || selectedPlaylist.tracks.length === 0) return

    if (isLoop) {
      // replay same track
      setIsPlaying(true)
    } else if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * selectedPlaylist.tracks.length)
      setCurrentTrackIndex(nextIndex)
      setIsPlaying(true)
    } else {
      if (currentTrackIndex + 1 < selectedPlaylist.tracks.length) {
        setCurrentTrackIndex(currentTrackIndex + 1)
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }
  }, [currentTrackIndex, isLoop, isShuffle, selectedPlaylist])

  return (
    <div className="app-container">
      <DarkModeSwitch darkMode={darkMode} onToggle={() => setDarkMode((d) => !d)} />
      <h1>Reproductor de Audio con Playlists</h1>
      <PlaylistManager
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onSelectPlaylist={handleSelectPlaylist}
        selectedPlaylistId={selectedPlaylistId}
      />
      {selectedPlaylist && (
        <>
          <TrackList
            tracks={selectedPlaylist.tracks}
            onRemoveTrack={handleRemoveTrack}
            onSelectTrack={handleSelectTrack}
            currentTrackIndex={currentTrackIndex}
          />
          <AddTrackForm onAddTrack={handleAddTrack} />
          <AudioPlayer
            tracks={selectedPlaylist.tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackChange={setCurrentTrackIndex}
            isLoop={isLoop}
            isShuffle={isShuffle}
            onEnded={handleEnded}
            onPlayPause={setIsPlaying}
            isPlaying={isPlaying}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={() => setIsLoop((l) => !l)}
              style={{ backgroundColor: isLoop ? '#e94e77' : undefined }}
              title="Loop"
            >
              🔁
            </button>
            <button
              onClick={() => setIsShuffle((s) => !s)}
              style={{ backgroundColor: isShuffle ? '#e94e77' : undefined }}
              title="Shuffle"
            >
              🔀
            </button>
          </div>
        </>
      )}
      {!selectedPlaylist && <p>No hay playlists. Crea una para empezar.</p>}
    </div>
  )
}

export default App
