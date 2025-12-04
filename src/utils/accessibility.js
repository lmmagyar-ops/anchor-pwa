// Accessibility utilities

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get animation classes based on reduced motion preference
export const getAnimationClasses = (baseClasses, animatedClasses) => {
  if (prefersReducedMotion()) {
    return baseClasses
  }
  return `${baseClasses} ${animatedClasses}`
}

