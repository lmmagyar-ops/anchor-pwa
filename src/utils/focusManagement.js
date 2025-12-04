/**
 * Focus Management Utilities
 * Provides utilities for keyboard navigation and focus management
 */

/**
 * Trap focus within a container element
 * @param {HTMLElement} container - The container to trap focus within
 * @param {HTMLElement} firstFocusable - First focusable element (optional)
 * @param {HTMLElement} lastFocusable - Last focusable element (optional)
 * @returns {Function} Cleanup function
 */
export const trapFocus = (container, firstFocusable = null, lastFocusable = null) => {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const first = firstFocusable || focusableElements[0]
  const last = lastFocusable || focusableElements[focusableElements.length - 1]

  const handleTab = (e) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab (backwards)
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      // Tab (forwards)
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleTab)
  first?.focus()

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTab)
  }
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - The container to search
 * @returns {HTMLElement[]} Array of focusable elements
 */
export const getFocusableElements = (container) => {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

/**
 * Focus the first focusable element in a container
 * @param {HTMLElement} container - The container to focus within
 */
export const focusFirst = (container) => {
  const focusable = getFocusableElements(container)
  if (focusable.length > 0) {
    focusable[0].focus()
  }
}

/**
 * Focus the last focusable element in a container
 * @param {HTMLElement} container - The container to focus within
 */
export const focusLast = (container) => {
  const focusable = getFocusableElements(container)
  if (focusable.length > 0) {
    focusable[focusable.length - 1].focus()
  }
}

/**
 * Check if an element is focusable
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if focusable
 */
export const isFocusable = (element) => {
  if (!element) return false
  
  const tagName = element.tagName.toLowerCase()
  const tabIndex = element.getAttribute('tabindex')
  
  // Elements that are naturally focusable
  if (tagName === 'a' && element.href) return true
  if (['button', 'textarea', 'input', 'select'].includes(tagName) && !element.disabled) return true
  
  // Elements with explicit tabindex
  if (tabIndex !== null && tabIndex !== '-1') return true
  
  return false
}

