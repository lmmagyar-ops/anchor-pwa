import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Save, Clock } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import SuccessAnimation from './SuccessAnimation'
import { suggestTagsFromTrigger, getMostFrequentTags } from '../utils/suggestions'
import { getAutoSaveManager } from '../utils/autoSave'
import { updateStreak, getAllCurrentStreaks, getTotalActiveDays } from '../utils/streaks'
import { checkAchievements } from '../utils/achievements'

const Journal = ({ t, isDark, addEntry, entries = [] }) => {
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [showDraftRestore, setShowDraftRestore] = useState(false)
  const autoSaveManagerRef = useRef(getAutoSaveManager())
  const autoSaveManager = autoSaveManagerRef.current
  const autoSaveTimeoutRef = useRef(null)
  
  const [form, setForm] = useState({
    trigger: '',
    thought: '',
    rational: '',
    mood: 5,
    tags: []
  })

  const availableTags = ["Work", "Family", "Health", "Sleep", "News", "Finance", "Other"]

  // Smart tag suggestions based on trigger text
  const suggestedTags = useMemo(() => {
    if (form.trigger && form.trigger.length >= 3) {
      return suggestTagsFromTrigger(entries, form.trigger)
    }
    return []
  }, [form.trigger, entries])

  // Most frequent tags for quick access
  const frequentTags = useMemo(() => {
    return getMostFrequentTags(entries, 3)
  }, [entries])

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  // Restore draft on mount
  useEffect(() => {
    const draft = autoSaveManager.loadDraft()
    if (draft) {
      setShowDraftRestore(true)
      setHasDraft(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-save draft when form changes
  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Only auto-save if form has changes
    if (autoSaveManager.hasChanges(form)) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSaveManager.saveDraft(form)
        setHasDraft(true)
      }, 3000) // Save after 3 seconds of inactivity
    } else {
      setHasDraft(false)
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [form])

  // Clear draft on successful save
  useEffect(() => {
    if (showSuccess) {
      autoSaveManager.clearDraft()
      setHasDraft(false)
      setShowDraftRestore(false)
    }
  }, [showSuccess])

  const handleRestoreDraft = () => {
    const draft = autoSaveManager.loadDraft()
    if (draft) {
      setForm({
        trigger: draft.trigger || '',
        thought: draft.thought || '',
        rational: draft.rational || '',
        mood: draft.mood || 5,
        tags: draft.tags || []
      })
      setShowDraftRestore(false)
      toast.info('Draft restored')
    }
  }

  const handleDiscardDraft = () => {
    autoSaveManager.clearDraft()
    setShowDraftRestore(false)
    setHasDraft(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate that at least trigger is filled
    if (!form.trigger.trim()) {
      return
    }

    // Create entry object with timestamp
    const entry = {
      ...form,
      date: Date.now(),
      timestamp: new Date().toISOString()
    }

    // Call addEntry prop function
    if (addEntry) {
      addEntry(entry)
    }

    // Update journal streak
    const streak = updateStreak('journal')
    
    // Check for achievements
    const streaks = getAllCurrentStreaks()
    const totalDays = getTotalActiveDays()
    const newAchievements = checkAchievements(streaks, totalDays)
    
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        setTimeout(() => {
          toast.success(`🏆 ${achievement.title}! ${achievement.description}`, 5000)
        }, 1000)
      })
    }

    // Show success feedback
    setShowSuccess(true)
    toast.success(t.journal.saveSuccess || 'Entry saved successfully!', 3000)

    // Reset form
    setForm({
      trigger: '',
      thought: '',
      rational: '',
      mood: 5,
      tags: []
    })
  }

  return (
    <>
      <SuccessAnimation
        show={showSuccess}
        onComplete={() => setShowSuccess(false)}
        message={t.journal.saveSuccess || 'Entry saved!'}
      />
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col min-h-[calc(100vh-200px)] animate-fade-in px-4 py-6 pb-6 overflow-y-auto"
      >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t.journal.title}
          </h2>
          {hasDraft && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Draft saved</span>
            </div>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {t.journal.desc}
        </p>
      </div>

      {/* Draft Restore Banner */}
      {showDraftRestore && (
        <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You have a saved draft. Would you like to restore it?
            </p>
            <div className="flex gap-2 ml-4">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: The Trigger */}
      <div className="mb-6">
        <label 
          htmlFor="trigger" 
          className="block text-sm font-semibold text-rose-500 dark:text-rose-400 mb-2"
        >
          {t.journal.step1}
        </label>
        <textarea
          id="trigger"
          value={form.trigger}
          onChange={(e) => handleChange('trigger', e.target.value)}
          placeholder={t.journal.step1ph}
          className="w-full h-24 p-4 rounded-xl resize-none bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-colors"
        />
      </div>

      {/* Tag Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {t.journal.tags}
        </label>
        
        {/* Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">
              {t.journal?.suggestedTags || 'Suggested based on your entry:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                availableTags.includes(tag) && (
                  <button
                    key={`suggested-${tag}`}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${form.tags.includes(tag)
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 hover:bg-teal-500/20'
                      }
                    `}
                  >
                    {tag} {form.tags.includes(tag) && '✓'}
                  </button>
                )
              ))}
            </div>
          </div>
        )}

        {/* Frequent Tags */}
        {frequentTags.length > 0 && suggestedTags.length === 0 && (
          <div className="mb-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              {t.journal?.frequentTags || 'Your most used:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {frequentTags.map((tag) => (
                availableTags.includes(tag) && !form.tags.includes(tag) && (
                  <button
                    key={`frequent-${tag}`}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {tag}
                  </button>
                )
              ))}
            </div>
          </div>
        )}

        {/* All Tags */}
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${form.tags.includes(tag)
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: The Negative Thought */}
      <div className="mb-6">
        <label 
          htmlFor="thought" 
          className="block text-sm font-semibold text-indigo-500 dark:text-indigo-400 mb-2"
        >
          {t.journal.step2}
        </label>
        <textarea
          id="thought"
          value={form.thought}
          onChange={(e) => handleChange('thought', e.target.value)}
          placeholder={t.journal.step2ph}
          className="w-full h-24 p-4 rounded-xl resize-none bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Step 3: The Rational Response */}
      <div className="mb-6">
        <label 
          htmlFor="rational" 
          className="block text-sm font-semibold text-teal-500 dark:text-teal-400 mb-2"
        >
          {t.journal.step3}
        </label>
        <textarea
          id="rational"
          value={form.rational}
          onChange={(e) => handleChange('rational', e.target.value)}
          placeholder={t.journal.step3ph}
          className="w-full h-24 p-4 rounded-xl resize-none bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Mood Slider */}
      <div className="mb-8 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
        <label 
          htmlFor="mood" 
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4"
        >
          {t.journal.emotion}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="mood"
            min="1"
            max="10"
            value={form.mood}
            onChange={(e) => handleChange('mood', parseInt(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-teal-500 bg-slate-200 dark:bg-slate-700"
          />
          <span className="text-xl font-bold text-slate-900 dark:text-white min-w-[3rem] text-center">
            {form.mood}
          </span>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold text-lg shadow-xl transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl hover:from-teal-700 hover:to-teal-600 active:scale-95 flex items-center justify-center gap-2 mb-4"
      >
        <Save className="w-5 h-5" />
        {t.journal.save}
      </button>
    </form>
    </>
  )
}

export default Journal


