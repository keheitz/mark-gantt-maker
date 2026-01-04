import { useEffect } from 'react'
import ThemeSelector from './ThemeSelector'
import ColorCustomizer from '../ColorCustomizer/ColorCustomizer'
import './ThemeSelector.css' // We can reuse or add to this

function ThemeModal({ isOpen, onClose, theme, setTheme }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    
    // Simple focus trapping - find first button and focus it
    const timer = setTimeout(() => {
      const firstButton = document.querySelector('.modal-content button')
      if (firstButton) firstButton.focus()
    }, 100)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="theme-modal-title">Theme Settings</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close theme settings"
          >
            &times;
          </button>
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
          <button 
            className="primary-btn" 
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemeModal

