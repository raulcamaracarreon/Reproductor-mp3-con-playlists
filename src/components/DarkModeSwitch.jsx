import React from 'react'

const DarkModeSwitch = ({ darkMode, onToggle }) => {
  return (
    <div className="switch-container">
      <label className="switch-label" title="Modo oscuro">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={onToggle}
        />
        {darkMode ? '🌙' : '☀️'}
      </label>
    </div>
  )
}

export default DarkModeSwitch
