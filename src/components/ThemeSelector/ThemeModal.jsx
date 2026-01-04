import ThemeSelector from './ThemeSelector'
import ColorCustomizer from '../ColorCustomizer/ColorCustomizer'
import './ThemeSelector.css' // We can reuse or add to this

function ThemeModal({ isOpen, onClose, theme, setTheme }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Theme Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <ThemeSelector 
            currentTheme={theme} 
            onThemeChange={setTheme} 
          />
          <ColorCustomizer 
            theme={theme} 
            onThemeChange={setTheme} 
          />
        </div>
        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}

export default ThemeModal

