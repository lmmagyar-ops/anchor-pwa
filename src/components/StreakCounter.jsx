import React from 'react'
import { Flame, TrendingUp } from 'lucide-react'
import { getStreak } from '../utils/streaks'

const StreakCounter = ({ activity, label, isDark }) => {
  const streak = getStreak(activity)

  if (streak.current === 0) {
    return null // Don't show if no streak
  }

  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full
      ${isDark 
        ? 'bg-slate-800/50 text-slate-200' 
        : 'bg-slate-100 text-slate-700'
      }
      border ${isDark ? 'border-slate-700' : 'border-slate-200'}
    `}>
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-semibold">{streak.current}</span>
      <span className="text-xs opacity-75">{label}</span>
      {streak.current > 0 && streak.current === streak.longest && (
        <TrendingUp className="w-3 h-3 text-teal-500" title="Personal best!" />
      )}
    </div>
  )
}

export default StreakCounter

