/**
 * Auto-save utility for draft management
 */

const DRAFT_STORAGE_KEY = 'anchor_journal_draft'
const AUTO_SAVE_INTERVAL = 3000 // 3 seconds

class AutoSaveManager {
  constructor() {
    this.saveTimeout = null
    this.isEnabled = true
  }

  /**
   * Start auto-saving draft data
   * @param {Function} getDraftData - Function that returns current draft data
   */
  startAutoSave(getDraftData) {
    if (!this.isEnabled) return

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
    }

    // Schedule auto-save
    this.saveTimeout = setTimeout(() => {
      const data = getDraftData()
      if (data && this.hasChanges(data)) {
        this.saveDraft(data)
        // Continue auto-saving
        this.startAutoSave(getDraftData)
      }
    }, AUTO_SAVE_INTERVAL)
  }

  /**
   * Stop auto-saving
   */
  stopAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
      this.saveTimeout = null
    }
  }

  /**
   * Save draft to localStorage
   * @param {Object} draftData - Draft data to save
   */
  saveDraft(draftData) {
    try {
      const draft = {
        ...draftData,
        savedAt: Date.now()
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      return true
    } catch (error) {
      console.error('Error saving draft:', error)
      return false
    }
  }

  /**
   * Load draft from localStorage
   * @returns {Object|null} - Draft data or null
   */
  loadDraft() {
    try {
      const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!draftJson) return null

      const draft = JSON.parse(draftJson)
      // Don't load drafts older than 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      if (draft.savedAt < sevenDaysAgo) {
        this.clearDraft()
        return null
      }

      return draft
    } catch (error) {
      console.error('Error loading draft:', error)
      return null
    }
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft() {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Error clearing draft:', error)
      return false
    }
  }

  /**
   * Check if draft has meaningful changes (not empty)
   * @param {Object} data - Draft data to check
   * @returns {Boolean}
   */
  hasChanges(data) {
    return !!(data.trigger?.trim() || data.thought?.trim() || data.rational?.trim() || data.tags?.length > 0)
  }

  /**
   * Check if a draft exists
   * @returns {Boolean}
   */
  hasDraft() {
    return localStorage.getItem(DRAFT_STORAGE_KEY) !== null
  }

  /**
   * Get draft timestamp (for showing when it was saved)
   * @returns {Number|null}
   */
  getDraftTimestamp() {
    const draft = this.loadDraft()
    return draft?.savedAt || null
  }
}

// Singleton instance
let autoSaveManager = null

/**
 * Get the auto-save manager instance
 */
export const getAutoSaveManager = () => {
  if (!autoSaveManager) {
    autoSaveManager = new AutoSaveManager()
  }
  return autoSaveManager
}

