import React, { useState } from 'react'
import { Plus, BookOpen, Activity, Wind, X } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'

const FloatingActionButton = ({ activeTab, onQuickJournal, onQuickSOS, onQuickBreathing }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const reducedMotion = prefersReducedMotion()

  const actions = []

  // Contextual actions based on active tab
  if (activeTab === 'history') {
    actions.push({
      id: 'quick-journal',
      label: 'Quick Journal',
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
    label: 'Quick SOS',
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
      label: 'Start Breathing',
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
    <div className="fixed bottom-28 right-4 z-30 flex flex-col items-end gap-3">
      {/* Action Buttons */}
      {isExpanded && actions.map((action, index) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`
              ${action.color}
              text-white rounded-full p-4 shadow-xl
              flex items-center gap-3
              transition-all transform
              ${reducedMotion ? '' : 'animate-fade-in'}
              hover:scale-110 active:scale-95
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
          bg-gradient-to-r from-teal-600 to-teal-500
          text-white shadow-xl
          flex items-center justify-center
          transition-all transform
          hover:scale-110 active:scale-95
          hover:shadow-2xl
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


