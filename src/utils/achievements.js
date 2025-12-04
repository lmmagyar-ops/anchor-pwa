/**
 * Achievement system
 * Subtle, encouraging achievements for user progress
 */

const ACHIEVEMENT_STORAGE_KEY = 'anchor_achievements'

/**
 * Get all unlocked achievements
 */
export const getAchievements = () => {
  try {
    const saved = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

/**
 * Unlock an achievement
 */
export const unlockAchievement = (achievementId) => {
  const achievements = getAchievements()
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId)
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(achievements))
    return true
  }
  return false
}

// Note: getTotalActiveDays and getAllCurrentStreaks are exported from streaks.js to avoid circular dependencies

/**
 * Check for achievements based on streaks and activity
 */
export const checkAchievements = (streaks, totalDays) => {
  const newAchievements = []
  const unlocked = getAchievements()

  // Streak achievements
  if (streaks.breathing >= 7 && !unlocked.includes('breathe_week')) {
    unlockAchievement('breathe_week')
    newAchievements.push({
      id: 'breathe_week',
      title: 'Week Warrior',
      description: '7 days of breathing practice!',
      icon: '🔥',
    })
  }

  if (streaks.journal >= 7 && !unlocked.includes('journal_week')) {
    unlockAchievement('journal_week')
    newAchievements.push({
      id: 'journal_week',
      title: 'Reflection Master',
      description: '7 days of journaling!',
      icon: '✨',
    })
  }

  if (streaks.breathing >= 30 && !unlocked.includes('breathe_month')) {
    unlockAchievement('breathe_month')
    newAchievements.push({
      id: 'breathe_month',
      title: 'Breathing Champion',
      description: '30 days of breathing practice!',
      icon: '🌟',
    })
  }

  // Consistency achievements
  if (totalDays >= 14 && !unlocked.includes('two_weeks')) {
    unlockAchievement('two_weeks')
    newAchievements.push({
      id: 'two_weeks',
      title: 'Consistent Commitment',
      description: 'Active for 2 weeks!',
      icon: '💪',
    })
  }

  if (totalDays >= 30 && !unlocked.includes('one_month')) {
    unlockAchievement('one_month')
    newAchievements.push({
      id: 'one_month',
      title: 'Monthly Milestone',
      description: 'Active for 30 days!',
      icon: '🎉',
    })
  }

  return newAchievements
}

/**
 * Get achievement definitions
 */
export const ACHIEVEMENTS = {
  breathe_week: {
    id: 'breathe_week',
    title: 'Week Warrior',
    description: '7 days of breathing practice',
    icon: '🔥',
  },
  journal_week: {
    id: 'journal_week',
    title: 'Reflection Master',
    description: '7 days of journaling',
    icon: '✨',
  },
  breathe_month: {
    id: 'breathe_month',
    title: 'Breathing Champion',
    description: '30 days of breathing practice',
    icon: '🌟',
  },
  two_weeks: {
    id: 'two_weeks',
    title: 'Consistent Commitment',
    description: 'Active for 2 weeks',
    icon: '💪',
  },
  one_month: {
    id: 'one_month',
    title: 'Monthly Milestone',
    description: 'Active for 30 days',
    icon: '🎉',
  },
}

