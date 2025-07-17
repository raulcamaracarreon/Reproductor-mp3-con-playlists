import React, { useState } from 'react'

const PlaylistManager = ({
  playlists,
  onCreatePlaylist,
  onDeletePlaylist,
  onSelectPlaylist,
  selectedPlaylistId
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('')

  const handleCreate = () => {
    const trimmed = newPlaylistName.trim()
    if (trimmed) {
      onCreatePlaylist(trimmed)
      setNewPlaylistName('')
    }
  }

  return (
    <div>
      <h2>Playlists</h2>
      <input
        type="text"
        placeholder="Nueva playlist"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
      />
      <ul className="playlist-list">
        {playlists.map((pl) => (
          <li key={pl.id}>
            <span
              style={{
                cursor: 'pointer',
                fontWeight: pl.id === selectedPlaylistId ? 'bold' : 'normal'
              }}
              onClick={() => onSelectPlaylist(pl.id)}
            >
              {pl.name}
            </span>
            <button onClick={() => onDeletePlaylist(pl.id)} title="Eliminar playlist">✖</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PlaylistManager
