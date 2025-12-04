/**
 * Icon size constants for consistent iconography across the app
 * Standardizes icon sizes and stroke widths
 */

export const ICON_SIZES = {
  xs: 'w-4 h-4',      // Extra small - 16px (buttons, inline)
  sm: 'w-5 h-5',      // Small - 20px (headers, nav items)
  md: 'w-6 h-6',      // Medium - 24px (primary actions)
  lg: 'w-8 h-8',      // Large - 32px (feature icons, hero)
  xl: 'w-12 h-12',    // Extra large - 48px (landing page, empty states)
  '2xl': 'w-16 h-16', // 2X large - 64px (landing page hero)
  '3xl': 'w-20 h-20', // 3X large - 80px (empty states)
}

export const ICON_STROKE = {
  thin: 1.5,    // Thin stroke for small icons
  normal: 2,    // Normal stroke (default)
  bold: 2.5,    // Bold stroke for emphasis
}

/**
 * Get standardized icon classes
 * @param {string} size - Icon size key (xs, sm, md, lg, xl, 2xl, 3xl)
 * @returns {string} - Tailwind classes for icon size
 */
export const getIconSize = (size = 'md') => {
  return ICON_SIZES[size] || ICON_SIZES.md
}

/**
 * Icon usage guidelines:
 * - xs: Quick exit, small buttons, inline indicators
 * - sm: Header icons, navigation items, form labels
 * - md: Primary action buttons, tab icons
 * - lg: Feature icons, section headers
 * - xl: Landing page features, empty state icons
 * - 2xl: Hero sections, prominent features
 * - 3xl: Large empty states, onboarding
 */


