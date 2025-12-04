import React from 'react'
import { prefersReducedMotion } from '../utils/accessibility'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const reducedMotion = prefersReducedMotion()
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  if (reducedMotion) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-teal-500"></div>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-teal-500 animate-spin"></div>
    </div>
  )
}

export default LoadingSpinner


