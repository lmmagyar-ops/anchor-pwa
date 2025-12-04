/**
 * Utility functions for smart suggestions and analysis
 */

/**
 * Analyze journal entries to suggest tags based on trigger text
 * @param {Array} entries - Array of journal entries
 * @param {String} triggerText - Current trigger text being typed
 * @returns {Array} - Suggested tags sorted by relevance
 */
export const suggestTagsFromTrigger = (entries, triggerText) => {
  if (!entries || entries.length === 0 || !triggerText || triggerText.length < 3) {
    return []
  }

  const triggerLower = triggerText.toLowerCase()
  const tagFrequency = {}
  const tagRelevance = {}

  // Analyze each entry
  entries.forEach(entry => {
    if (!entry.tags || !entry.trigger) return

    const entryTriggerLower = entry.trigger.toLowerCase()
    
    // Check if current trigger text is similar to this entry's trigger
    const similarity = calculateSimilarity(triggerLower, entryTriggerLower)
    
    if (similarity > 0.3) { // At least 30% similar
      entry.tags.forEach(tag => {
        if (!tagFrequency[tag]) {
          tagFrequency[tag] = 0
          tagRelevance[tag] = 0
        }
        tagFrequency[tag]++
        tagRelevance[tag] += similarity // Weight by similarity
      })
    }
  })

  // Sort tags by relevance
  const suggestedTags = Object.keys(tagRelevance)
    .map(tag => ({
      tag,
      score: tagRelevance[tag] * tagFrequency[tag] // Combine relevance and frequency
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Top 3 suggestions
    .map(item => item.tag)

  return suggestedTags
}

/**
 * Get most frequently used tags from entries
 * @param {Array} entries - Array of journal entries
 * @param {Number} limit - Maximum number of tags to return
 * @returns {Array} - Most frequent tags
 */
export const getMostFrequentTags = (entries, limit = 5) => {
  if (!entries || entries.length === 0) {
    return []
  }

  const tagCount = {}
  
  entries.forEach(entry => {
    if (entry.tags && Array.isArray(entry.tags)) {
      entry.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })

  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

/**
 * Simple string similarity calculation (Jaccard similarity with words)
 * @param {String} str1 - First string
 * @param {String} str2 - Second string
 * @returns {Number} - Similarity score between 0 and 1
 */
const calculateSimilarity = (str1, str2) => {
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 2))
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 2))

  if (words1.size === 0 || words2.size === 0) {
    return 0
  }

  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])

  return intersection.size / union.size
}

/**
 * Check for progress milestones and generate encouragement messages
 * @param {Array} entries - Array of journal entries
 * @returns {Object|null} - Encouragement message object or null
 */
export const checkProgressMilestones = (entries) => {
  if (!entries || entries.length === 0) {
    return null
  }

  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  const oneWeek = 7 * oneDay

  // Get entries from last 7 days
  const recentEntries = entries.filter(entry => {
    const entryDate = entry.date || 0
    return (now - entryDate) < oneWeek
  })

  // Check for consecutive days
  const entryDates = recentEntries
    .map(entry => new Date(entry.date).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
    .sort()

  const consecutiveDays = calculateConsecutiveDays(entryDates)
  const totalEntries = entries.length
  const weeklyEntries = recentEntries.length

  // Generate messages based on milestones
  if (consecutiveDays >= 7) {
    return {
      type: 'milestone',
      message: "🎉 Amazing! You've journaled 7 days in a row! You're building an incredible habit.",
      severity: 'high'
    }
  } else if (consecutiveDays >= 3) {
    return {
      type: 'encouragement',
      message: `Great consistency! You've journaled ${consecutiveDays} days in a row. Keep it up!`,
      severity: 'medium'
    }
  } else if (weeklyEntries >= 5) {
    return {
      type: 'encouragement',
      message: `You've journaled ${weeklyEntries} times this week! Great progress!`,
      severity: 'medium'
    }
  } else if (totalEntries === 10 || totalEntries === 25 || totalEntries === 50 || totalEntries === 100) {
    return {
      type: 'milestone',
      message: `🎊 Milestone reached! You've completed ${totalEntries} journal entries!`,
      severity: 'high'
    }
  }

  return null
}

/**
 * Calculate consecutive days from sorted date strings
 * @param {Array} dateStrings - Array of date strings (sorted)
 * @returns {Number} - Number of consecutive days
 */
const calculateConsecutiveDays = (dateStrings) => {
  if (dateStrings.length === 0) return 0

  // Start from today and count backwards
  let consecutive = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < dateStrings.length; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const checkDateString = checkDate.toDateString()

    if (dateStrings.includes(checkDateString)) {
      consecutive++
    } else {
      break
    }
  }

  return consecutive
}


