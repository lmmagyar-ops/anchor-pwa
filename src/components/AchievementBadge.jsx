import React from 'react'
import { Trophy, Sparkles } from 'lucide-react'

const AchievementBadge = ({ achievement, isDark, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  if (!achievement) return null

  return (
    <div 
      className={`
        ${sizeClasses[size]} rounded-full
        flex flex-col items-center justify-center
        ${isDark 
          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30' 
          : 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300'
        }
        border-2
        relative
        group
      `}
      title={achievement.title}
    >
      <span className="text-2xl">{achievement.icon}</span>
      
      {/* Tooltip */}
      <div className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
        px-3 py-2 rounded-lg
        ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
        shadow-xl border ${isDark ? 'border-slate-700' : 'border-slate-200'}
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
        whitespace-nowrap z-50
      `}>
        <div className="font-semibold text-xs">{achievement.title}</div>
        <div className="text-xs opacity-75">{achievement.description}</div>
      </div>
    </div>
  )
}

export default AchievementBadge

