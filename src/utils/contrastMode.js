/**
 * High Contrast Mode utilities
 * Provides WCAG AAA compliant high contrast theme for accessibility
 */

export const isHighContrastEnabled = () => {
  return localStorage.getItem('anchor_high_contrast') === 'true'
}

export const setHighContrast = (enabled) => {
  localStorage.setItem('anchor_high_contrast', enabled.toString())
  document.documentElement.classList.toggle('high-contrast', enabled)
}

export const initHighContrast = () => {
  const enabled = isHighContrastEnabled()
  document.documentElement.classList.toggle('high-contrast', enabled)
}

