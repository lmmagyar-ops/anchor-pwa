/**
 * Theme system for customizable color themes
 * Supports Teal (default), Blue, Purple, Green
 */

export const THEMES = {
  teal: {
    name: 'Teal',
    id: 'teal',
    colors: {
      primary: '#14b8a6',    // teal-500
      primaryDark: '#0d9488', // teal-600
      primaryLight: '#2dd4bf', // teal-400
      accent: '#6366f1',      // indigo-500
    },
    gradient: 'from-teal-600 to-teal-500',
    bgGradient: 'from-teal-500/10 to-emerald-500/10',
  },
  blue: {
    name: 'Blue',
    id: 'blue',
    colors: {
      primary: '#3b82f6',    // blue-500
      primaryDark: '#2563eb', // blue-600
      primaryLight: '#60a5fa', // blue-400
      accent: '#8b5cf6',      // purple-500
    },
    gradient: 'from-blue-600 to-blue-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  purple: {
    name: 'Purple',
    id: 'purple',
    colors: {
      primary: '#8b5cf6',    // purple-500
      primaryDark: '#7c3aed', // purple-600
      primaryLight: '#a78bfa', // purple-400
      accent: '#ec4899',      // pink-500
    },
    gradient: 'from-purple-600 to-purple-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
  },
  green: {
    name: 'Green',
    id: 'green',
    colors: {
      primary: '#10b981',    // emerald-500
      primaryDark: '#059669', // emerald-600
      primaryLight: '#34d399', // emerald-400
      accent: '#06b6d4',      // cyan-500
    },
    gradient: 'from-emerald-600 to-emerald-500',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
  },
}

/**
 * Get current theme from localStorage
 */
export const getCurrentTheme = () => {
  const saved = localStorage.getItem('anchor_color_theme')
  return saved && THEMES[saved] ? THEMES[saved] : THEMES.teal
}

/**
 * Set theme preference
 */
export const setTheme = (themeId) => {
  if (THEMES[themeId]) {
    localStorage.setItem('anchor_color_theme', themeId)
    applyTheme(THEMES[themeId])
  }
}

/**
 * Apply theme to document
 */
export const applyTheme = (theme) => {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark)
  root.style.setProperty('--theme-primary-light', theme.colors.primaryLight)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  root.setAttribute('data-theme', theme.id)
}

/**
 * Initialize theme on load
 */
export const initTheme = () => {
  const theme = getCurrentTheme()
  applyTheme(theme)
}

/**
 * Get all available themes
 */
export const getAllThemes = () => {
  return Object.values(THEMES)
}

