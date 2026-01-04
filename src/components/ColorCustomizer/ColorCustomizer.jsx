import './ColorCustomizer.css'

function ColorCustomizer({ theme, onThemeChange }) {
  const updateColor = (colorKey, value) => {
    onThemeChange({ ...theme, [colorKey]: value })
  }

  const colors = [
    { key: 'primary', label: 'Primary Color' },
    { key: 'secondary', label: 'Secondary Color' },
    { key: 'background', label: 'Background Color' },
    { key: 'surface', label: 'Surface Color' },
    { key: 'text', label: 'Text Color' },
    { key: 'muted', label: 'Muted Text Color' }
  ]

  return (
    <div className="color-customizer" role="group" aria-labelledby="customize-colors-title">
      <h3 id="customize-colors-title" className="customizer-title">Customize Colors</h3>
      <div className="color-grid">
        {colors.map(({ key, label }) => (
          <div key={key} className="color-field">
            <label htmlFor={`color-${key}`}>{label}</label>
            <div className="color-input-wrapper">
              <input
                id={`color-${key}`}
                type="color"
                value={theme[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                aria-label={`${label} picker`}
              />
              <input
                type="text"
                value={theme[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="color-hex-input"
                aria-label={`${label} hex value`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColorCustomizer
