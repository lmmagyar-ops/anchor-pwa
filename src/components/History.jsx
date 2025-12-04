import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Trash2, FileText, Calendar, Tag, BookOpen, Download, Upload, ArrowRight, Sparkles, RefreshCw, Flame, Trophy } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { checkProgressMilestones } from '../utils/suggestions'
import { getUndoRedoManager, createClearEntriesAction } from '../utils/undoRedo'
import ChartTooltip from './ChartTooltip'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import { getStreak, getAllCurrentStreaks, getTotalActiveDays } from '../utils/streaks'
import { getAchievements, ACHIEVEMENTS } from '../utils/achievements'
import StreakCounter from './StreakCounter'
import AchievementBadge from './AchievementBadge'

const History = ({ t, isDark, entries, clearEntries, restoreEntries, onNavigateToJournal, onRefresh }) => {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef(null)
  
  // Pull-to-refresh handler
  const handleRefresh = async () => {
    // Force re-read from localStorage (in case data changed externally)
    try {
      const saved = localStorage.getItem('anchor_entries')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (restoreEntries) {
          restoreEntries(parsed)
        }
      }
      if (onRefresh) {
        await onRefresh()
      }
      toast.success('Refreshed!', 2000)
    } catch (error) {
      console.error('Refresh error:', error)
      toast.error('Refresh failed')
    }
  }
  
  // Pull-to-refresh hook
  const {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    shouldShowIndicator,
    pullProgress
  } = usePullToRefresh(handleRefresh, { threshold: 80 })
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: null,
    position: null
  })
  
  const chartContainerRef = useRef(null)

  // Get streaks and achievements
  const streaks = useMemo(() => ({
    breathing: getStreak('breathing'),
    journal: getStreak('journal'),
    sos: getStreak('sos'),
    pmr: getStreak('pmr'),
  }), [entries]) // Recalculate when entries change

  const unlockedAchievements = useMemo(() => {
    const achievementIds = getAchievements()
    return achievementIds.map(id => ACHIEVEMENTS[id]).filter(Boolean)
  }, [])

  const totalActiveDays = useMemo(() => getTotalActiveDays(), [entries])

  // Reset delete confirmation after 3 seconds
  useEffect(() => {
    if (isDeleting) {
      const timer = setTimeout(() => {
        setIsDeleting(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isDeleting])

  // Check for progress milestones and show encouragement
  const progressMessage = useMemo(() => {
    return checkProgressMilestones(entries)
  }, [entries])

  // Show progress message on mount or when entries change significantly
  useEffect(() => {
    if (progressMessage && entries.length > 0) {
      // Only show once per session, check localStorage
      const messageKey = `progress_${progressMessage.type}_${entries.length}`
      const hasBeenShown = localStorage.getItem(messageKey)
      
      if (!hasBeenShown && progressMessage.severity === 'high') {
        toast.success(progressMessage.message, 5000)
        localStorage.setItem(messageKey, 'true')
      }
    }
  }, [progressMessage, entries.length, toast])

  // Get smooth path for trend line (bezier curve)
  const getSmoothPath = (data) => {
    if (data.length < 2) {
      // If only one entry, draw a point
      if (data.length === 1) {
        const width = 100
        const height = 100
        const padding = 10
        const minMood = 1
        const maxMood = 10
        const x = padding + (width - 2 * padding) / 2
        const y = height - padding - ((data[0].mood - minMood) / (maxMood - minMood)) * (height - 2 * padding)
        return `M ${x} ${y} L ${x} ${y}`
      }
      return ''
    }
    
    const width = 100
    const height = 100
    const padding = 10
    
    const minMood = 1
    const maxMood = 10
    
    const points = data.map((entry, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((entry.mood - minMood) / (maxMood - minMood)) * (height - 2 * padding)
      return { x, y }
    })
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i]
      const next = points[i + 1]
      
      const cp1x = current.x + (next.x - current.x) / 3
      const cp1y = current.y
      const cp2x = current.x + (next.x - current.x) * 2 / 3
      const cp2y = next.y
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
    }
    
    return path
  }

  // Get last 7 entries sorted by date
  const last7Entries = useMemo(() => {
    return [...entries]
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, 7)
      .reverse() // Reverse for chronological display
  }, [entries])

  // Get heatmap data for last 14 days
  const heatmapData = useMemo(() => {
    const days = []
    const now = new Date()
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const entry = entries.find(e => {
        const entryDate = new Date(e.date || e.timestamp)
        entryDate.setHours(0, 0, 0, 0)
        return entryDate.getTime() === date.getTime()
      })
      
      days.push({
        date: date.getTime(),
        mood: entry?.mood || null
      })
    }
    
    return days
  }, [entries])

  // Pattern analysis by tags
  const patternAnalysis = useMemo(() => {
    const tagMap = {}
    
    entries.forEach(entry => {
      if (entry.tags && entry.tags.length > 0 && entry.mood) {
        entry.tags.forEach(tag => {
          if (!tagMap[tag]) {
            tagMap[tag] = { moods: [], tag }
          }
          tagMap[tag].moods.push(entry.mood)
        })
      }
    })
    
    return Object.values(tagMap)
      .map(item => ({
        tag: item.tag,
        avgMood: item.moods.reduce((a, b) => a + b, 0) / item.moods.length,
        count: item.moods.length
      }))
      .sort((a, b) => a.avgMood - b.avgMood) // Sort by avg mood (lowest first)
  }, [entries])

  // Get mood color
  const getMoodColor = (mood) => {
    if (!mood) return 'bg-slate-200 dark:bg-slate-800'
    if (mood <= 4) return 'bg-rose-400'
    if (mood <= 7) return 'bg-teal-600'
    return 'bg-teal-400'
  }

  // Get mood border color for entries
  const getMoodBorderColor = (mood) => {
    if (!mood) return 'border-slate-300 dark:border-slate-700'
    if (mood <= 4) return 'border-rose-500'
    if (mood <= 7) return 'border-teal-600'
    return 'border-teal-400'
  }

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  // Handle delete with confirmation and undo support
  const handleDelete = () => {
    if (isDeleting) {
      // Store previous entries for undo
      const previousEntries = [...entries]
      
      // Clear entries
      clearEntries()
      setIsDeleting(false)
      
      // Add undo action and show toast with undo button
      if (previousEntries.length > 0) {
        const undoManager = getUndoRedoManager()
        const entryCount = previousEntries.length
        const action = createClearEntriesAction(previousEntries, clearEntries, restoreEntries)
        undoManager.addAction(action)
        
        // Show toast with undo button
        toast.info(
          `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} cleared`,
          8000,
          {
            label: 'Undo',
            onClick: () => {
              const undone = undoManager.undo()
              if (undone) {
                toast.success(`${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} restored`)
              }
            }
          }
        )
      }
    } else {
      setIsDeleting(true)
    }
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle backup (export to JSON file)
  const handleBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      entries: entries
    }
    
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `anchor-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Show success toast
    toast.success(t.history.backupSuccess || 'Backup downloaded successfully!', 3000)
  }

  // Handle restore (import from JSON file)
  const handleRestore = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result)
        
        // Validate backup structure
        if (!backupData.entries || !Array.isArray(backupData.entries)) {
          toast.error(t.history.restoreError || 'Invalid backup file format')
          return
        }

        // Confirm restore (will overwrite existing entries)
        if (entries.length > 0) {
          const confirmRestore = window.confirm(
            t.history.restoreConfirm || 
            'This will replace your current entries. Continue?'
          )
          if (!confirmRestore) {
            event.target.value = '' // Reset file input
            return
          }
        }

        // Restore entries
        if (restoreEntries) {
          restoreEntries(backupData.entries)
          toast.success(t.history.restoreSuccess || 'Entries restored successfully!')
        }
      } catch (error) {
        console.error('Restore error:', error)
        toast.error(t.history.restoreError || 'Error reading backup file')
      }
    }
    
    reader.readAsText(file)
    event.target.value = '' // Reset file input
  }

  // Sorted entries (reverse chronological)
  const sortedEntries = [...entries].sort((a, b) => (b.date || 0) - (a.date || 0))

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in px-4 py-8">
        {/* Large Icon with Background */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <BookOpen className="w-20 h-20 text-teal-500 dark:text-teal-400" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1" />
          </div>
        </div>
        
        {/* Message */}
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
          {t.history.emptyTitle || 'Start Your Journey'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-sm">
          {t.history.empty}
        </p>
        
        {/* CTA Button */}
        {onNavigateToJournal && (
          <button
            onClick={onNavigateToJournal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            {t.history.startJournaling || 'Start Journaling'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        
        {/* Helpful Tips */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            {t.history.emptyTip || 'Tip: Journaling helps track patterns and celebrate progress'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-[calc(100vh-200px)] animate-fade-in px-4 py-6 pb-6 overflow-y-auto relative"
    >
      {/* Pull-to-Refresh Indicator */}
      {shouldShowIndicator && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10 pointer-events-none"
          style={{
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            opacity: Math.min(pullProgress, 1)
          }}
        >
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
            shadow-lg border ${isDark ? 'border-slate-700' : 'border-slate-200'}
            transition-all duration-200
          `}>
            <RefreshCw 
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{
                transform: isPulling && !isRefreshing ? `rotate(${pullDistance * 2}deg)` : 'none',
                transition: 'transform 0.1s ease-out'
              }}
            />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      
      {/* Progress Encouragement Banner */}
      {progressMessage && progressMessage.severity === 'medium' && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 dark:border-teal-400/20">
          <p className="text-teal-700 dark:text-teal-300 font-medium text-center">
            {progressMessage.message}
          </p>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {t.history.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium transition-all
            flex items-center gap-2
            ${isDeleting
              ? 'bg-rose-500 text-white'
              : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400'
            }
          `}
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? t.history.confirm : t.history.delete}
        </button>
      </div>

      {/* Streaks & Achievements Section */}
      {(streaks.breathing.current > 0 || streaks.journal.current > 0 || streaks.sos.current > 0 || streaks.pmr.current > 0 || unlockedAchievements.length > 0) && (
        <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Your Streaks
            </h3>
          </div>
          
          {/* Streak Counters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {streaks.breathing.current > 0 && (
              <StreakCounter activity="breathing" label="Breathing" isDark={isDark} />
            )}
            {streaks.journal.current > 0 && (
              <StreakCounter activity="journal" label="Journal" isDark={isDark} />
            )}
            {streaks.sos.current > 0 && (
              <StreakCounter activity="sos" label="SOS" isDark={isDark} />
            )}
            {streaks.pmr.current > 0 && (
              <StreakCounter activity="pmr" label="PMR" isDark={isDark} />
            )}
          </div>

          {/* Achievements */}
          {unlockedAchievements.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Achievements
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {unlockedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isDark={isDark}
                    size="md"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Mood Trend Chart */}
      {last7Entries.length > 0 && (
        <div 
          ref={chartContainerRef}
          className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {t.history.chartTitle}
          </h3>
          <div 
            className="w-full relative" 
            style={{ height: '120px' }}
            onMouseLeave={() => setTooltip({ visible: false, content: null, position: null })}
            aria-label="Mood trend chart showing last 7 entries"
          >
            <svg 
              width="100%" 
              height="120" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="overflow-visible"
              role="img"
              aria-label="Mood trend over time"
            >
              {/* Grid line */}
              <line
                x1="10"
                y1="90"
                x2="90"
                y2="90"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                className="text-slate-300 dark:text-slate-700"
              />
              {/* Trend line with smooth transition */}
              <path
                d={getSmoothPath(last7Entries)}
                fill="none"
                stroke={isDark ? '#2dd4bf' : '#0d9488'}
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Data points with interactive tooltips */}
              {last7Entries.map((entry, index) => {
                const width = 100
                const height = 100
                const padding = 10
                const minMood = 1
                const maxMood = 10
                const divisor = last7Entries.length > 1 ? (last7Entries.length - 1) : 1
                const x = padding + (index / divisor) * (width - 2 * padding)
                const y = height - padding - ((entry.mood - minMood) / (maxMood - minMood)) * (height - 2 * padding)
                
                const handlePointInteraction = (e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const svgRect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                  const pointX = (x / 100) * svgRect.width + svgRect.left
                  const pointY = (y / 100) * svgRect.height + svgRect.top
                  
                  const date = new Date(entry.date || entry.timestamp)
                  const dateStr = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })
                  
                  setTooltip({
                    visible: true,
                    content: (
                      <div>
                        <div className="font-semibold">{dateStr}</div>
                        <div className="text-xs opacity-80">Mood: {entry.mood}/10</div>
                      </div>
                    ),
                    position: { x: pointX, y: pointY }
                  })
                }
                
                return (
                  <g key={index}>
                    {/* Larger invisible hit area for easier interaction */}
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="transparent"
                      onMouseEnter={handlePointInteraction}
                      onMouseMove={handlePointInteraction}
                      onTouchStart={handlePointInteraction}
                      className="cursor-pointer"
                      aria-label={`Entry on ${new Date(entry.date || entry.timestamp).toLocaleDateString()}, mood ${entry.mood}`}
                    />
                    {/* Visible data point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill={isDark ? '#2dd4bf' : '#0d9488'}
                      className="transition-all duration-300 hover:r-[3.5]"
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Consistency Heatmap */}
      <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t.history.calendarTitle}
        </h3>
        <div 
          className="flex gap-1.5"
          onMouseLeave={() => setTooltip({ visible: false, content: null, position: null })}
          aria-label="Consistency heatmap showing mood entries for the last 14 days"
        >
          {heatmapData.map((day, index) => {
            const handleDayInteraction = (e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const date = new Date(day.date)
              const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              })
              
              setTooltip({
                visible: true,
                content: (
                  <div>
                    <div className="font-semibold">{dateStr}</div>
                    <div className="text-xs opacity-80">
                      {day.mood ? `Mood: ${day.mood}/10` : 'No entry'}
                    </div>
                  </div>
                ),
                position: { 
                  x: rect.left + rect.width / 2, 
                  y: rect.top - 10 
                }
              })
            }
            
            return (
              <div
                key={index}
                className={`
                  w-6 h-6 rounded cursor-pointer transition-all duration-200
                  ${getMoodColor(day.mood)} 
                  hover:scale-125 hover:ring-2 hover:ring-teal-400/50
                `}
                onMouseEnter={handleDayInteraction}
                onTouchStart={handleDayInteraction}
                aria-label={day.mood 
                  ? `Entry on ${new Date(day.date).toLocaleDateString()}, mood ${day.mood}` 
                  : `No entry on ${new Date(day.date).toLocaleDateString()}`
                }
              />
            )
          })}
        </div>
      </div>

      {/* Pattern Analysis */}
      {patternAnalysis.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {t.history.patternsTitle}
          </h3>
          <div 
            className="space-y-3"
            onMouseLeave={() => setTooltip({ visible: false, content: null, position: null })}
          >
            {patternAnalysis.map((pattern, index) => {
              const widthPercent = (pattern.avgMood / 10) * 100
              const barColor = pattern.avgMood <= 4 ? 'bg-rose-400' : pattern.avgMood <= 7 ? 'bg-teal-600' : 'bg-teal-400'
              
              const handleBarInteraction = (e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                
                setTooltip({
                  visible: true,
                  content: (
                    <div>
                      <div className="font-semibold">{pattern.tag}</div>
                      <div className="text-xs opacity-80">
                        Avg Mood: {pattern.avgMood.toFixed(1)}/10
                      </div>
                      <div className="text-xs opacity-80">
                        Entries: {pattern.count}
                      </div>
                    </div>
                  ),
                  position: { 
                    x: rect.left + rect.width / 2, 
                    y: rect.top - 10 
                  }
                })
              }
              
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">
                    {pattern.tag}
                  </span>
                  <div 
                    className="flex-1 h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative cursor-pointer group"
                    onMouseEnter={handleBarInteraction}
                    onTouchStart={handleBarInteraction}
                    aria-label={`${pattern.tag}: Average mood ${pattern.avgMood.toFixed(1)}, ${pattern.count} entries`}
                  >
                    <div
                      className={`h-full ${barColor} transition-all duration-500 group-hover:opacity-80`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 min-w-[3rem] text-right">
                    {pattern.avgMood.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Backup & Restore Buttons */}
      <div className="mb-6 space-y-3">
        {/* Export PDF Button */}
        <button
          onClick={handlePrint}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium flex items-center justify-center gap-2 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
        >
          <FileText className="w-5 h-5" />
          {t.history.export}
        </button>

        {/* Backup Button */}
        <button
          onClick={handleBackup}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium flex items-center justify-center gap-2 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
        >
          <Download className="w-5 h-5" />
          {t.history.backup}
        </button>

        {/* Restore Button */}
        <button
          onClick={handleRestore}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium flex items-center justify-center gap-2 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
        >
          <Upload className="w-5 h-5" />
          {t.history.restore}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Restore backup file"
      />

      {/* Entry List */}
      <div className="space-y-4">
        {sortedEntries.map((entry, index) => (
          <div
            key={index}
            className={`rounded-2xl border-l-4 ${getMoodBorderColor(entry.mood)} bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4`}
          >
            {/* Entry Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {formatDate(entry.date || entry.timestamp)}
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {entry.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {entry.mood && (
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  entry.mood <= 4
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                    : entry.mood <= 7
                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    : 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                }`}>
                  {entry.mood}/10
                </div>
              )}
            </div>

            {/* Entry Body */}
            {entry.trigger && (
              <div className="mb-3">
                <div className="text-[10px] uppercase tracking-widest text-rose-500 dark:text-rose-400 font-semibold mb-1">
                  Trigger
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {entry.trigger}
                </p>
              </div>
            )}

            {entry.thought && (
              <div className="mb-3">
                <div className="text-[10px] uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-semibold mb-1">
                  Thought
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {entry.thought}
                </p>
              </div>
            )}

            {entry.rational && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-teal-500 dark:text-teal-400 font-semibold mb-1">
                  Reframed
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {entry.rational}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Chart Tooltip */}
      <ChartTooltip
        isVisible={tooltip.visible}
        position={tooltip.position}
        content={tooltip.content}
        isDark={isDark}
      />
    </div>
  )
}

export default History

