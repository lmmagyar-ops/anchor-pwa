/**
 * Undo/Redo utility for managing action history
 */

const MAX_UNDO_HISTORY = 10 // Maximum number of undo actions to keep

class UndoRedoManager {
  constructor() {
    this.history = []
    this.currentIndex = -1
  }

  /**
   * Add an action to the undo history
   * @param {Object} action - Action object with type, data, and undo/redo callbacks
   */
  addAction(action) {
    // Remove any actions after current index (if user did something after undo)
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    // Add new action
    this.history.push({
      ...action,
      timestamp: Date.now()
    })
    
    // Limit history size
    if (this.history.length > MAX_UNDO_HISTORY) {
      this.history.shift()
      this.currentIndex = MAX_UNDO_HISTORY - 1
    } else {
      this.currentIndex = this.history.length - 1
    }
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.currentIndex >= 0
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * Undo the last action
   * @returns {Object|null} - The action that was undone, or null if nothing to undo
   */
  undo() {
    if (!this.canUndo()) return null

    const action = this.history[this.currentIndex]
    if (action.undo) {
      action.undo(action.data)
    }
    
    this.currentIndex--
    return action
  }

  /**
   * Redo the last undone action
   * @returns {Object|null} - The action that was redone, or null if nothing to redo
   */
  redo() {
    if (!this.canRedo()) return null

    this.currentIndex++
    const action = this.history[this.currentIndex]
    if (action.redo) {
      action.redo(action.data)
    }
    
    return action
  }

  /**
   * Clear all undo/redo history
   */
  clear() {
    this.history = []
    this.currentIndex = -1
  }

  /**
   * Get the description of the last action (for undo button text)
   */
  getLastActionDescription() {
    if (!this.canUndo()) return null
    return this.history[this.currentIndex].description || 'Undo'
  }
}

// Singleton instance for global undo/redo
let globalUndoRedo = null

/**
 * Get the global undo/redo manager instance
 */
export const getUndoRedoManager = () => {
  if (!globalUndoRedo) {
    globalUndoRedo = new UndoRedoManager()
  }
  return globalUndoRedo
}

/**
 * Create an undo action for clearing entries
 */
export const createClearEntriesAction = (previousEntries, clearEntries, restoreEntries) => {
  return {
    type: 'clear_entries',
    description: 'Clear all entries',
    data: {
      previousEntries: [...previousEntries]
    },
    undo: (data) => {
      restoreEntries(data.previousEntries)
    },
    redo: () => {
      clearEntries()
    }
  }
}

/**
 * Create an undo action for deleting a single entry
 */
export const createDeleteEntryAction = (entry, addEntry, removeEntry) => {
  return {
    type: 'delete_entry',
    description: 'Delete entry',
    data: {
      entry: { ...entry }
    },
    undo: (data) => {
      addEntry(data.entry)
    },
    redo: () => {
      removeEntry(entry.date)
    }
  }
}

