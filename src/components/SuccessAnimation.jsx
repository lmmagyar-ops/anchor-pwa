import React, { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'

const SuccessAnimation = ({ show, onComplete, message, size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = prefersReducedMotion()

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onComplete) {
          setTimeout(onComplete, 300) // Wait for fade out
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  }

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/20 dark:bg-black/40 backdrop-blur-sm
        ${reducedMotion ? '' : 'animate-fade-in'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`
          flex flex-col items-center gap-3
          px-6 py-4 rounded-2xl
          bg-white dark:bg-slate-800
          shadow-2xl
          ${reducedMotion ? '' : 'animate-scale-in'}
        `}
      >
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            bg-emerald-100 dark:bg-emerald-900/30
            flex items-center justify-center
            ${reducedMotion ? '' : 'animate-bounce-once'}
          `}
        >
          <CheckCircle2
            className={`${iconSizeClasses[size]} text-emerald-600 dark:text-emerald-400`}
          />
        </div>
        {message && (
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default SuccessAnimation


