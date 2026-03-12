import React, { useState, useEffect, useRef } from 'react'
import { Plus, BookOpen, Activity, Wind, X } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'

const FloatingActionButton = ({ activeTab, onQuickJournal, onQuickSOS, onQuickBreathing, lang = 'en' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const reducedMotion = prefersReducedMotion()

  // Scroll-aware auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (Math.abs(delta) < 10) return // Ignore tiny movements

      if (delta > 0 && currentY > 80) {
        // Scrolling down past threshold — hide
        setIsVisible(false)
        setIsExpanded(false)
      } else if (delta < -10) {
        // Scrolling up — show
        setIsVisible(true)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const actions = []

  // Contextual actions based on active tab
  if (activeTab === 'history') {
    actions.push({
      id: 'quick-journal',
      label: lang === 'en' ? 'Quick Journal' : 'Щоденник',
      icon: BookOpen,
      onClick: () => {
        setIsExpanded(false)
        if (onQuickJournal) onQuickJournal()
      },
      color: 'bg-teal-500 hover:bg-teal-600'
    })
  }

  // Quick SOS - available from any tab
  actions.push({
    id: 'quick-sos',
    label: lang === 'en' ? 'Quick SOS' : 'SOS',
    icon: Activity,
    onClick: () => {
      setIsExpanded(false)
      if (onQuickSOS) onQuickSOS()
    },
    color: 'bg-rose-500 hover:bg-rose-600'
  })

  // Quick Breathing - available from any tab except breathe tab
  if (activeTab !== 'breathe') {
    actions.push({
      id: 'quick-breathing',
      label: lang === 'en' ? 'Start Breathing' : 'Дихання',
      icon: Wind,
      onClick: () => {
        setIsExpanded(false)
        if (onQuickBreathing) onQuickBreathing()
      },
      color: 'bg-sky-500 hover:bg-sky-600'
    })
  }

  // Don't show FAB if no actions available
  if (actions.length === 0) return null

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`fixed bottom-28 right-4 z-30 flex flex-col items-end gap-3 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}>
      {/* Action Buttons */}
      {isExpanded && actions.map((action, index) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`
              ${action.color}
              text-white rounded-2xl p-3.5 shadow-lg
              flex items-center gap-3
              transition-all transform
              ${reducedMotion ? '' : 'animate-fade-in'}
              hover:scale-[1.05] active:scale-[0.95]
              ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
            style={{
              transitionDelay: reducedMotion ? '0ms' : `${index * 50}ms`
            }}
            aria-label={action.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium pr-2 whitespace-nowrap">
              {action.label}
            </span>
          </button>
        )
      })}

      {/* Main FAB Button */}
      <button
        onClick={toggleExpanded}
        className={`
          w-14 h-14 rounded-full
          bg-gradient-to-br from-teal-600 to-teal-500
          text-white shadow-lg shadow-teal-500/25
          flex items-center justify-center
          transition-all transform
          hover:scale-[1.05] active:scale-[0.95]
          hover:shadow-xl
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}

export default FloatingActionButton


