import { useEffect, useRef } from 'react'
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'

/**
 * Hook that automatically saves data to localStorage when it changes.
 * Includes debouncing to prevent excessive writes and a beforeunload 
 * listener to ensure data is saved when the user leaves the page.
 * 
 * @param {any} data - The data to save
 * @param {boolean} enabled - Whether auto-save is enabled
 */
export function useAutoSave(data, enabled = true) {
  const isInitialMount = useRef(true)
  const dataRef = useRef(data)

  // Update ref to latest data so it's available to the beforeunload listener
  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with defaults
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (enabled && data) {
      // Debounce: save 1 second after last change
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(data)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [data, enabled])

  // Ensure data is saved when the user refreshes or closes the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled && dataRef.current) {
        saveToLocalStorage(dataRef.current)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

  return {
    loadSaved: () => loadFromLocalStorage()
  }
}
