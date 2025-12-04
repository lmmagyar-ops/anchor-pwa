import React, { useState, useRef, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

/**
 * Tooltip component for contextual help and hints
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', // 'top', 'bottom', 'left', 'right'
  trigger = 'hover', // 'hover', 'click', 'always'
  showClose = false,
  className = '',
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'always')
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const wrapperRef = useRef(null)
  const tooltipRef = useRef(null)
  const timeoutRef = useRef(null)

  const calculatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return

    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = wrapperRect.top + scrollY - tooltipRect.height - 8
        left = wrapperRect.left + scrollX + (wrapperRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = wrapperRect.bottom + scrollY + 8
        left = wrapperRect.left + scrollX + (wrapperRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = wrapperRect.top + scrollY + (wrapperRect.height / 2) - (tooltipRect.height / 2)
        left = wrapperRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = wrapperRect.top + scrollY + (wrapperRect.height / 2) - (tooltipRect.height / 2)
        left = wrapperRect.right + scrollX + 8
        break
      default:
        top = wrapperRect.top + scrollY - tooltipRect.height - 8
        left = wrapperRect.left + scrollX + (wrapperRect.width / 2) - (tooltipRect.width / 2)
    }

    // Keep tooltip in viewport
    const padding = 10
    if (top < scrollY + padding) {
      top = scrollY + padding
    }
    if (left < scrollX + padding) {
      left = scrollX + padding
    }
    if (left + tooltipRect.width > scrollX + window.innerWidth - padding) {
      left = scrollX + window.innerWidth - tooltipRect.width - padding
    }

    setTooltipPosition({ top, left })
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          setTimeout(calculatePosition, 10)
        }, delay)
      } else {
        setIsVisible(true)
        setTimeout(calculatePosition, 10)
      }
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
      setTimeout(calculatePosition, 10)
    }
  }

  useEffect(() => {
    if (isVisible && trigger !== 'always') {
      calculatePosition()
    }
  }, [isVisible, position])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 rounded-lg text-sm
            bg-slate-900 dark:bg-slate-800 text-white
            shadow-xl border border-slate-700 dark:border-slate-600
            max-w-xs pointer-events-none
            animate-fade-in
            ${trigger === 'always' ? 'pointer-events-auto' : ''}
          `}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: position === 'top' || position === 'bottom' 
              ? 'translateX(-50%)' 
              : position === 'left' || position === 'right'
              ? 'translateY(-50%)'
              : 'none'
          }}
        >
          {showClose && trigger === 'always' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className="absolute top-1 right-1 p-1 rounded hover:bg-slate-700"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <div className="whitespace-normal">{content}</div>
          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-slate-900 dark:bg-slate-800 border-slate-700 dark:border-slate-600
              ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r' : ''}
              ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-l' : ''}
              ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 border-l border-b' : ''}
              ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 border-r border-t' : ''}
            `}
          />
        </div>
      )}
    </div>
  )
}

/**
 * First-time tooltip that shows once and remembers dismissal
 */
export const FirstTimeTooltip = ({ 
  id, // Unique ID to track if shown
  children, 
  content, 
  position = 'top',
  onDismiss,
  ...props 
}) => {
  const [hasBeenShown, setHasBeenShown] = useState(() => {
    return localStorage.getItem(`anchor_tooltip_${id}`) === 'shown'
  })
  const [isVisible, setIsVisible] = useState(!hasBeenShown)

  const handleDismiss = () => {
    localStorage.setItem(`anchor_tooltip_${id}`, 'shown')
    setHasBeenShown(true)
    setIsVisible(false)
    if (onDismiss) onDismiss()
  }

  if (hasBeenShown) {
    return children
  }

  return (
    <Tooltip
      trigger="always"
      content={
        <div>
          <div className="mb-2">{content}</div>
          <button
            onClick={handleDismiss}
            className="text-xs underline hover:no-underline"
          >
            Got it
          </button>
        </div>
      }
      position={position}
      showClose={true}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

export default Tooltip

