/**
 * Streak tracking system
 * Tracks daily usage streaks for breathing, journal, SOS, and PMR
 */

const STREAK_STORAGE_KEY = 'anchor_streaks'

/**
 * Get all streak data
 */
export const getStreaks = () => {
  try {
    const saved = localStorage.getItem(STREAK_STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      breathing: { current: 0, longest: 0, lastDate: null },
      journal: { current: 0, longest: 0, lastDate: null },
      sos: { current: 0, longest: 0, lastDate: null },
      pmr: { current: 0, longest: 0, lastDate: null },
    }
  } catch {
    return {
      breathing: { current: 0, longest: 0, lastDate: null },
      journal: { current: 0, longest: 0, lastDate: null },
      sos: { current: 0, longest: 0, lastDate: null },
      pmr: { current: 0, longest: 0, lastDate: null },
    }
  }
}

/**
 * Save streak data
 */
const saveStreaks = (streaks) => {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streaks))
}

/**
 * Get today's date string (YYYY-MM-DD)
 */
const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Get yesterday's date string
 */
const getYesterdayString = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

/**
 * Check if date is today
 */
const isToday = (dateString) => {
  return dateString === getTodayString()
}

/**
 * Check if date is yesterday
 */
const isYesterday = (dateString) => {
  return dateString === getYesterdayString()
}

/**
 * Update streak for a specific activity
 */
export const updateStreak = (activity) => {
  const streaks = getStreaks()
  const today = getTodayString()
  
  if (!streaks[activity]) {
    streaks[activity] = { current: 0, longest: 0, lastDate: null }
  }

  const streak = streaks[activity]

  // If already updated today, do nothing
  if (isToday(streak.lastDate)) {
    return streak
  }

  // If last update was yesterday, continue streak
  if (isYesterday(streak.lastDate)) {
    streak.current += 1
  } else {
    // Reset streak (missed a day or first time)
    streak.current = 1
  }

  // Update longest streak if current is longer
  if (streak.current > streak.longest) {
    streak.longest = streak.current
  }

  streak.lastDate = today
  saveStreaks(streaks)

  return streak
}

/**
 * Get streak for a specific activity
 */
export const getStreak = (activity) => {
  const streaks = getStreaks()
  const streak = streaks[activity] || { current: 0, longest: 0, lastDate: null }

  // Check if streak should be reset (missed today)
  if (streak.lastDate && !isToday(streak.lastDate) && !isYesterday(streak.lastDate)) {
    streak.current = 0
    streak.lastDate = null
    saveStreaks(streaks)
  }

  return streak
}

/**
 * Get all current streaks
 */
export const getAllCurrentStreaks = () => {
  const streaks = getStreaks()
  return {
    breathing: getStreak('breathing').current,
    journal: getStreak('journal').current,
    sos: getStreak('sos').current,
    pmr: getStreak('pmr').current,
  }
}

/**
 * Get total active days (days with at least one activity)
 */
export const getTotalActiveDays = () => {
  const streaks = getStreaks()
  const allDates = new Set()
  
  Object.values(streaks).forEach(streak => {
    if (streak.lastDate) {
      allDates.add(streak.lastDate)
      // Also count all dates in the streak
      if (streak.current > 0 && streak.lastDate) {
        const lastDate = new Date(streak.lastDate)
        for (let i = 0; i < streak.current; i++) {
          const date = new Date(lastDate)
          date.setDate(date.getDate() - i)
          allDates.add(date.toISOString().split('T')[0])
        }
      }
    }
  })
  
  return allDates.size
}

