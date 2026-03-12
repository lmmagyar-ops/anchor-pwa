import React, { useState, useEffect, useRef } from 'react'
import { Settings, Volume2, VolumeX, Vibrate } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { updateStreak, getAllCurrentStreaks, getTotalActiveDays } from '../utils/streaks'
import { checkAchievements } from '../utils/achievements'
import { useToast } from '../context/ToastContext'

// Breath pattern configurations
const BREATH_PATTERNS = {
  '4-7-8': {
    name: '4-7-8',
    inhale: 4,
    hold: 7,
    exhale: 8,
    total: 19
  },
  'box': {
    name: 'Box Breathing',
    nameUa: 'Коробкове',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdOut: 4,
    total: 16
  },
  'resonant': {
    name: 'Resonant Breathing',
    nameUa: 'Резонансне',
    inhale: 5,
    hold: 0,
    exhale: 5,
    total: 10
  }
}

// Audio context for soundscapes (Web Audio API)
let audioContext = null
let soundscapeSource = null
let gainNode = null

const Breathing = ({ t, isDark, onRefreshQuote, lang = 'en' }) => {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const sessionStartTimeRef = useRef(null)
  const [phase, setPhase] = useState('idle') // 'idle', 'inhale', 'hold', 'exhale', 'holdOut' (for box)
  const [text, setText] = useState(t.breathe.inhale)
  const [showComplete, setShowComplete] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    return localStorage.getItem('anchor_haptic_enabled') === 'true'
  })
  const [soundscapeEnabled, setSoundscapeEnabled] = useState(false)
  const [soundscapeType, setSoundscapeType] = useState('brown')
  const [breathPattern, setBreathPattern] = useState(() => {
    return localStorage.getItem('anchor_breath_pattern') || '4-7-8'
  })
  
  const reducedMotion = prefersReducedMotion()
  const intervalRef = useRef(null)
  const timeoutRefs = useRef([])
  const isActiveRef = useRef(false)
  const currentPattern = BREATH_PATTERNS[breathPattern]

  // Haptic feedback function
  const triggerHaptic = (pattern = [100]) => {
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  // Cleanup function
  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []
    stopSoundscape()
  }

  // Soundscape functions
  const startSoundscape = () => {
    if (!soundscapeEnabled) return

    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        gainNode = audioContext.createGain()
        gainNode.gain.value = 0.3 // Volume at 30%
        gainNode.connect(audioContext.destination)
      }

      // Create brown noise using filtered white noise
      if (!soundscapeSource) {
        const bufferSize = 2 * audioContext.sampleRate
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = buffer.getChannelData(0)

        let lastOut = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          output[i] = (lastOut + (0.02 * white)) / 1.02
          lastOut = output[i]
          output[i] *= 3.5
        }

        soundscapeSource = audioContext.createBufferSource()
        soundscapeSource.buffer = buffer
        soundscapeSource.loop = true
        soundscapeSource.connect(gainNode)
        soundscapeSource.start()
      }
    } catch (error) {
      console.error('Error starting soundscape:', error)
      // Graceful degradation - disable soundscape if audio API fails
      setSoundscapeEnabled(false)
    }
  }

  const stopSoundscape = () => {
    if (soundscapeSource) {
      soundscapeSource.stop()
      soundscapeSource = null
    }
  }

  // Reset to idle state
  const resetToIdle = () => {
    setPhase('idle')
    setText(t.breathe.inhale)
    setShowComplete(true)
    setTimeout(() => setShowComplete(false), 3000)
  }

  // Start the breathing cycle based on selected pattern
  const startCycle = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
    timeoutRefs.current = []

    const { inhale, hold, exhale, holdOut, total } = currentPattern
    let elapsed = 0

    // Inhale phase
    setPhase('inhale')
    setText(t.breathe.inhale)
    setAnnouncement(`${t.breathe.inhale} ${inhale} seconds`)
    triggerHaptic([50])

    elapsed += inhale * 1000

    // Hold phase (if exists)
    if (hold > 0) {
      const holdTimeout = setTimeout(() => {
        if (isActiveRef.current) {
          setPhase('hold')
          setText(t.breathe.hold)
          setAnnouncement(`${t.breathe.hold} ${hold} seconds`)
          triggerHaptic([100, 50, 100])
        }
      }, elapsed)
      timeoutRefs.current.push(holdTimeout)
      elapsed += hold * 1000
    }

    // Exhale phase
    const exhaleTimeout = setTimeout(() => {
      if (isActiveRef.current) {
        setPhase('exhale')
        setText(t.breathe.exhale)
        setAnnouncement(`${t.breathe.exhale} ${exhale} seconds`)
        triggerHaptic([50])
      }
    }, elapsed)
    timeoutRefs.current.push(exhaleTimeout)
    elapsed += exhale * 1000

    // Hold out phase (for box breathing)
    if (holdOut && holdOut > 0) {
      const holdOutTimeout = setTimeout(() => {
        if (isActiveRef.current) {
          setPhase('holdOut')
          setText(t.breathe.hold || 'Hold...')
          setAnnouncement(`${t.breathe.hold || 'Hold'} ${holdOut} seconds`)
        }
      }, elapsed)
      timeoutRefs.current.push(holdOutTimeout)
    }
  }

  // Start/Stop handler
  const toggleSession = () => {
    if (isActive) {
      // Session ended - track streak if session was at least 30 seconds
      const sessionDuration = sessionStartTimeRef.current ? Date.now() - sessionStartTimeRef.current : 0
      if (sessionDuration >= 30000) { // At least 30 seconds
        const streak = updateStreak('breathing')
        
        // Check for achievements
        const streaks = getAllCurrentStreaks()
        const totalDays = getTotalActiveDays()
        const newAchievements = checkAchievements(streaks, totalDays, lang)
        
        if (newAchievements.length > 0) {
          newAchievements.forEach(achievement => {
            setTimeout(() => {
              toast.success(`🏆 ${achievement.title}! ${achievement.description}`, 5000)
            }, 500)
          })
        }
      }
      
      isActiveRef.current = false
      setIsActive(false)
      cleanup()
      resetToIdle()
      sessionStartTimeRef.current = null
    } else {
      isActiveRef.current = true
      setIsActive(true)
      setShowComplete(false)
      sessionStartTimeRef.current = Date.now()
      
      if (soundscapeEnabled) {
        startSoundscape()
      }
      
      startCycle()

      intervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          startCycle()
        }
      }, currentPattern.total * 1000)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  // Update when pattern changes
  useEffect(() => {
    localStorage.setItem('anchor_breath_pattern', breathPattern)
    if (isActive) {
      cleanup()
      startCycle()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          startCycle()
        }
      }, currentPattern.total * 1000)
    }
  }, [breathPattern])

  // Update text when translations change
  useEffect(() => {
    if (phase === 'idle') {
      setText(t.breathe.inhale)
    } else if (phase === 'inhale') {
      setText(t.breathe.inhale)
    } else if (phase === 'hold' || phase === 'holdOut') {
      setText(t.breathe.hold)
    } else if (phase === 'exhale') {
      setText(t.breathe.exhale)
    }
  }, [t, phase])

  // Save haptic preference
  useEffect(() => {
    localStorage.setItem('anchor_haptic_enabled', hapticEnabled.toString())
  }, [hapticEnabled])

  // Dynamic styles based on phase
  const getCircleStyles = () => {
    const baseStyles = "w-56 h-56 rounded-full border-[3px] flex items-center justify-center transition-all"
    const { inhale, exhale } = currentPattern
    
    switch (phase) {
      case 'inhale':
        return {
          className: `${baseStyles} scale-125 ease-in-out border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.5),0_0_60px_rgba(20,184,166,0.3)]`,
          style: { transitionDuration: `${inhale * 1000}ms` }
        }
      case 'hold':
      case 'holdOut':
        return {
          className: `${baseStyles} scale-125 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5),0_0_60px_rgba(99,102,241,0.3)]`,
          style: { transitionDuration: '0ms' }
        }
      case 'exhale':
        return {
          className: `${baseStyles} scale-100 ease-out border-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.5),0_0_60px_rgba(14,165,233,0.3)]`,
          style: { transitionDuration: `${exhale * 1000}ms` }
        }
      default:
        return {
          className: `${baseStyles} scale-100 border-slate-200 dark:border-slate-700/50`,
          style: {}
        }
    }
  }

  const getGlowStyles = () => {
    const baseStyles = "absolute w-56 h-56 rounded-full blur-3xl transition-all"
    
    if (phase === 'idle') {
      return `${baseStyles} scale-50 opacity-0 bg-teal-500`
    }
    const animationClass = reducedMotion ? '' : 'animate-pulse'
    return `${baseStyles} scale-150 opacity-40 bg-teal-500 ${animationClass}`
  }

  const getTextColor = () => {
    switch (phase) {
      case 'inhale':
        return 'text-teal-500 dark:text-teal-400'
      case 'hold':
      case 'holdOut':
        return 'text-indigo-500 dark:text-indigo-400'
      case 'exhale':
        return 'text-sky-500 dark:text-sky-400'
      default:
        return 'text-slate-700 dark:text-slate-300'
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    ' ': () => {
      // Spacebar: Start/stop breathing session
      toggleSession()
    },
    'Escape': () => {
      // Escape: Stop session if active
      if (isActive) {
        toggleSession()
      }
    }
  })

  return (
    <div className="flex flex-col items-center animate-fade-in px-4 pt-2 pb-6">
      {/* Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Header with Settings Button - More compact */}
      <div className="text-center mb-4 w-full relative">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-1 right-0 p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1 pr-10 tracking-tight">
          {t.breathe.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 tracking-tight">
          {t.breathe.desc}
        </p>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-full max-w-md mb-4 p-4 glass-card">
          {/* Breath Pattern Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.breathe.pattern || 'Breath Pattern'}
            </label>
            <div className="flex gap-2">
              {Object.keys(BREATH_PATTERNS).map((key) => (
                <button
                  key={key}
                  onClick={() => setBreathPattern(key)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    breathPattern === key
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                      : 'bg-slate-100/80 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/60'
                  }`}
                >
                  {(lang === 'ua' && BREATH_PATTERNS[key].nameUa) ? BREATH_PATTERNS[key].nameUa : BREATH_PATTERNS[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Haptic Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Vibrate className="w-4 h-4" />
              {t.breathe.haptic || 'Haptic Feedback'}
            </label>
            <button
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                hapticEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                hapticEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Soundscape Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {soundscapeEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              {t.breathe.soundscape || 'Ambient Sound'}
            </label>
            <button
              onClick={() => {
                const newState = !soundscapeEnabled
                setSoundscapeEnabled(newState)
                if (!newState) {
                  stopSoundscape()
                } else if (isActive) {
                  startSoundscape()
                }
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                soundscapeEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                soundscapeEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* Breathing Circle Container - Better balanced spacing */}
      <div className="relative flex items-center justify-center mb-5 flex-1 max-w-md">
        <div className={getGlowStyles()} aria-hidden="true" />
        <div 
          className={getCircleStyles().className}
          style={getCircleStyles().style}
          role="img" 
          aria-label={text}
        >
          <span className={`text-base font-medium capitalize tracking-tight ${getTextColor()}`}>
            {text}
          </span>
        </div>
      </div>

      {/* Control Button - Better spacing */}
      <button
        onClick={toggleSession}
        className={`
          w-full max-w-xs py-4 rounded-2xl shadow-lg font-semibold text-lg mb-3
          transition-all transform hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]
          ${isActive
            ? 'bg-slate-800 dark:bg-slate-700 text-slate-200 hover:bg-slate-700 dark:hover:bg-slate-600'
            : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-teal-500/25 hover:from-teal-700 hover:to-teal-600'
          }
        `}
      >
        {isActive ? t.breathe.stop : t.breathe.start}
      </button>

      {/* Completion Feedback */}
      {showComplete && (
        <div 
          className={`mb-3 text-teal-500 dark:text-teal-400 ${reducedMotion ? '' : 'animate-pulse'}`}
          role="status"
          aria-live="polite"
        >
          {t.breathe.complete}
        </div>
      )}
    </div>
  )
}

export default Breathing
