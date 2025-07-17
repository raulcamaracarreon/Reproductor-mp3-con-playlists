import React, { useState } from 'react'

const AddTrackForm = ({ onAddTrack }) => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUrl('') // Clear URL input if file selected
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')) // Default title from filename without extension
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    if (file) {
      // Create local URL for the file
      const fileUrl = URL.createObjectURL(file)
      onAddTrack({
        id: Date.now().toString(),
        title: title.trim(),
        artist: artist.trim(),
        url: fileUrl,
        fileObject: file // optional, if you want to keep reference
      })
    } else if (url.trim()) {
      onAddTrack({
        id: Date.now().toString(),
        title: title.trim(),
        artist: artist.trim(),
        url: url.trim()
      })
    } else {
      // Neither file nor URL provided
      return
    }

    setTitle('')
    setArtist('')
    setUrl('')
    setFile(null)
    e.target.reset() // reset file input
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Añadir pista</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artista"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL del archivo MP3"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
          if (e.target.value) setFile(null) // Clear file if URL typed
        }}
        disabled={file !== null}
      />
      <input
        type="file"
        accept="audio/mp3,audio/mpeg"
        onChange={handleFileChange}
        disabled={url.trim() !== ''}
      />
      <button type="submit">Añadir</button>
    </form>
  )
}

export default AddTrackForm
