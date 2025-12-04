import React from 'react'
import { prefersReducedMotion } from '../utils/accessibility'

const Skeleton = ({ className = '', variant = 'default' }) => {
  const reducedMotion = prefersReducedMotion()
  const baseClasses = 'bg-slate-200 dark:bg-slate-700 rounded'
  const animationClass = reducedMotion ? '' : 'animate-pulse'

  const variants = {
    default: `${baseClasses} ${animationClass}`,
    text: `${baseClasses} ${animationClass} h-4`,
    heading: `${baseClasses} ${animationClass} h-6`,
    circle: `${baseClasses} ${animationClass} rounded-full`,
    chart: `${baseClasses} ${animationClass}`,
  }

  return <div className={`${variants[variant]} ${className}`} aria-hidden="true" />
}

export default Skeleton


