import { useState, useEffect } from 'react'
import { defaultThemes } from '../data/defaultThemes'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('gantt-theme')
    return saved ? JSON.parse(saved) : defaultThemes.default
  })

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', theme.primary)
    document.documentElement.style.setProperty('--color-secondary', theme.secondary)
    document.documentElement.style.setProperty('--color-background', theme.background)
    document.documentElement.style.setProperty('--color-surface', theme.surface || theme.background)
    document.documentElement.style.setProperty('--color-text', theme.text)
    document.documentElement.style.setProperty('--color-text-muted', theme.muted || '#6b7280')
    localStorage.setItem('gantt-theme', JSON.stringify(theme))
  }, [theme])

  return { theme, setTheme }
}
