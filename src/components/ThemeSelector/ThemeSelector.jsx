import { defaultThemes } from '../../data/defaultThemes'
import './ThemeSelector.css'

function ThemeSelector({ currentTheme, onThemeChange }) {
  // Helper to find the key of the current theme if it matches a default one
  const currentThemeKey = Object.keys(defaultThemes).find(
    key => JSON.stringify(defaultThemes[key]) === JSON.stringify(currentTheme)
  ) || 'custom'

  return (
    <div className="theme-selector">
      <label className="theme-label">Pre-defined Themes:</label>
      <div className="theme-options">
        {Object.keys(defaultThemes).map(key => (
          <button
            key={key}
            className={`theme-option-btn ${currentThemeKey === key ? 'active' : ''}`}
            onClick={() => onThemeChange(defaultThemes[key])}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
          >
            <div 
              className="theme-preview" 
              style={{ 
                backgroundColor: defaultThemes[key].background,
                borderColor: defaultThemes[key].primary
              }}
            >
              <div 
                className="theme-preview-color" 
                style={{ backgroundColor: defaultThemes[key].primary }} 
              />
            </div>
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector
