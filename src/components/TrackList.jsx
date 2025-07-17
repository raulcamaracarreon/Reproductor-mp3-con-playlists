import React from 'react'

const TrackList = ({ tracks, onRemoveTrack, onSelectTrack, currentTrackIndex }) => {
  return (
    <div>
      <h2>Pistas</h2>
      {tracks.length === 0 && <p>No hay pistas en esta playlist.</p>}
      <ul className="playlist-tracks">
        {tracks.map((track, index) => (
          <li
            key={track.id}
            style={{
              fontWeight: index === currentTrackIndex ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => onSelectTrack(index)}
          >
            <span>{track.title} - {track.artist}</span>
            <button onClick={(e) => { e.stopPropagation(); onRemoveTrack(track.id) }} title="Eliminar pista">✖</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TrackList
