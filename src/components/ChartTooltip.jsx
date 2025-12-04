import React, { useEffect, useRef } from 'react'

const ChartTooltip = ({ 
  isVisible, 
  position, 
  content, 
  isDark,
  children 
}) => {
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (isVisible && tooltipRef.current && position) {
      // Position tooltip near cursor/target
      const tooltip = tooltipRef.current
      const rect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let left = position.x
      let top = position.y - rect.height - 8
      
      // Adjust if tooltip goes off screen
      if (left + rect.width > viewportWidth - 10) {
        left = viewportWidth - rect.width - 10
      }
      if (left < 10) {
        left = 10
      }
      if (top < 10) {
        top = position.y + 20 // Show below if no room above
      }
      
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    }
  }, [isVisible, position])

  if (!isVisible || !content) return null

  return (
    <div
      ref={tooltipRef}
      className={`
        fixed z-50 pointer-events-none
        px-3 py-2 rounded-lg text-sm font-medium
        shadow-lg backdrop-blur-md
        ${isDark 
          ? 'bg-slate-800/95 border border-slate-700 text-white' 
          : 'bg-white/95 border border-slate-200 text-slate-900'
        }
        transition-opacity duration-150
      `}
      role="tooltip"
      aria-live="polite"
    >
      {content}
    </div>
  )
}

export default ChartTooltip

