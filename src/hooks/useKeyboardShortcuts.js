import { useEffect } from 'react'

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * @param {Boolean} enabled - Whether shortcuts are enabled
 */
export const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      // Ignore shortcuts when typing in inputs, textareas, or when modifier keys are pressed
      const isInputFocused = 
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable

      // Ignore if modifier keys are pressed (except Escape which should work always)
      if (event.key !== 'Escape' && (event.ctrlKey || event.metaKey || event.altKey)) {
        return
      }

      // Check if this key combination is registered
      const handler = shortcuts[event.key]
      if (handler) {
        event.preventDefault()
        handler(event)
      }

      // Handle key combinations with Shift
      if (event.shiftKey) {
        const shiftHandler = shortcuts[`Shift+${event.key}`]
        if (shiftHandler) {
          event.preventDefault()
          shiftHandler(event)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}


