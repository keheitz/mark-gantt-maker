import { defaultThemes } from '../../data/defaultThemes'
import './ThemeSelector.css'

function ThemeSelector({ currentTheme, onThemeChange }) {
  // Helper to find the key of the current theme if it matches a default one
  const currentThemeKey = Object.keys(defaultThemes).find(
    key => JSON.stringify(defaultThemes[key]) === JSON.stringify(currentTheme)
  ) || 'custom'

  return (
    <div className="theme-selector" role="group" aria-labelledby="predefined-themes-label">
      <label id="predefined-themes-label" className="theme-label">Pre-defined Themes:</label>
      <div className="theme-options" role="radiogroup" aria-labelledby="predefined-themes-label">
        {Object.keys(defaultThemes).map(key => {
          const themeName = key.charAt(0).toUpperCase() + key.slice(1)
          const isActive = currentThemeKey === key
          
          return (
            <button
              key={key}
              type="button"
              className={`theme-option-btn ${isActive ? 'active' : ''}`}
              onClick={() => onThemeChange(defaultThemes[key])}
              title={themeName}
              role="radio"
              aria-checked={isActive}
              aria-label={`${themeName} theme`}
            >
              <div 
                className="theme-preview" 
                style={{ 
                  backgroundColor: defaultThemes[key].background,
                  borderColor: defaultThemes[key].primary
                }}
                aria-hidden="true"
              >
                <div 
                  className="theme-preview-color" 
                  style={{ backgroundColor: defaultThemes[key].primary }} 
                />
              </div>
              <span aria-hidden="true">{themeName}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeSelector
