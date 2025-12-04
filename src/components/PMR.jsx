import React, { useState, useEffect, useRef } from 'react'
import { Footprints, Hand, Heart, Brain, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useSwipe } from '../hooks/useSwipe'
import { updateStreak, getAllCurrentStreaks, getTotalActiveDays } from '../utils/streaks'
import { checkAchievements } from '../utils/achievements'
import { useToast } from '../context/ToastContext'

const PMR = ({ t, isDark }) => {
  const [step, setStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [phase, setPhase] = useState('tense') // 'tense' or 'relax'

  const reducedMotion = prefersReducedMotion()

  // Timer durations (increased by 2 seconds to give users more time to read instructions)
  const TENSE_DURATION = 7 // seconds
  const RELAX_DURATION = 12 // seconds

  // PMR muscle groups with instructions
  const muscleGroups = [
    {
      id: 'feet',
      icon: Footprints,
      name: t.pmr?.feet || 'Feet & Calves',
      tense: t.pmr?.tenseFeet || 'Tense your feet and calves by pointing your toes. Hold for 7 seconds.',
      relax: t.pmr?.relaxFeet || 'Release and feel the tension flow away. Rest for 12 seconds.',
      color: 'text-emerald-400',
      bg: 'from-emerald-500/20',
      borderColor: 'border-emerald-400/30'
    },
    {
      id: 'thighs',
      icon: Footprints,
      name: t.pmr?.thighs || 'Thighs & Glutes',
      tense: t.pmr?.tenseThighs || 'Tense your thighs and glutes by squeezing them tight. Hold for 7 seconds.',
      relax: t.pmr?.relaxThighs || 'Release and notice the difference. Rest for 12 seconds.',
      color: 'text-blue-400',
      bg: 'from-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'hands',
      icon: Hand,
      name: t.pmr?.hands || 'Hands & Arms',
      tense: t.pmr?.tenseHands || 'Clench your fists and tense your arms. Hold for 7 seconds.',
      relax: t.pmr?.relaxHands || 'Release and let your arms go limp. Rest for 12 seconds.',
      color: 'text-purple-400',
      bg: 'from-purple-500/20',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'stomach',
      icon: Heart,
      name: t.pmr?.stomach || 'Stomach & Core',
      tense: t.pmr?.tenseStomach || 'Tighten your stomach and core muscles. Hold for 7 seconds.',
      relax: t.pmr?.relaxStomach || 'Release and breathe deeply. Rest for 12 seconds.',
      color: 'text-pink-400',
      bg: 'from-pink-500/20',
      borderColor: 'border-pink-400/30'
    },
    {
      id: 'shoulders',
      icon: Hand,
      name: t.pmr?.shoulders || 'Shoulders & Neck',
      tense: t.pmr?.tenseShoulders || 'Raise your shoulders up toward your ears. Hold for 7 seconds.',
      relax: t.pmr?.relaxShoulders || 'Let them drop and feel the release. Rest for 12 seconds.',
      color: 'text-orange-400',
      bg: 'from-orange-500/20',
      borderColor: 'border-orange-400/30'
    },
    {
      id: 'face',
      icon: Brain,
      name: t.pmr?.face || 'Face & Jaw',
      tense: t.pmr?.tenseFace || 'Scrunch up your face and clench your jaw. Hold for 7 seconds.',
      relax: t.pmr?.relaxFace || 'Release and let your face go completely soft. Rest for 12 seconds.',
      color: 'text-rose-400',
      bg: 'from-rose-500/20',
      borderColor: 'border-rose-400/30'
    }
  ]

  const currentGroup = muscleGroups[step]
  const Icon = currentGroup?.icon
  const isLastStep = step === muscleGroups.length - 1
  const isFirstStep = step === 0

  // Use refs to track current values in timer callback (avoid stale closures)
  const phaseRef = useRef(phase)
  const stepRef = useRef(step)
  const isActiveRef = useRef(isActive)

  // Update refs when state changes
  useEffect(() => {
    phaseRef.current = phase
    stepRef.current = step
    isActiveRef.current = isActive
  }, [phase, step, isActive])

  // Timer effect - FIXED: Single stable interval that doesn't recreate
  useEffect(() => {
    if (!isActive) {
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          return 0 // Don't count down if already at 0
        }
        
        const newTime = prevTime - 1
        
        // When timer reaches 0, trigger auto-advance
        if (newTime <= 0) {
          // Schedule state updates outside of setState callback
          setTimeout(() => {
            const currentPhase = phaseRef.current
            const currentStep = stepRef.current
            
            if (currentPhase === 'tense') {
              // Tense finished, move to relax phase
              setPhase('relax')
              setTimeRemaining(RELAX_DURATION)
            } else {
              // Relax finished, move to next muscle group
              setPhase('tense')
              if (currentStep < muscleGroups.length - 1) {
                setStep(currentStep + 1)
                setTimeRemaining(TENSE_DURATION)
              } else {
                // All done - complete session
                setIsActive(false)
                setPhase('tense')
                setStep(0)
                
                // Track streak and achievements
                const streak = updateStreak('pmr')
                const streaks = getAllCurrentStreaks()
                const totalDays = getTotalActiveDays()
                const newAchievements = checkAchievements(streaks, totalDays)
                
                if (newAchievements.length > 0) {
                  newAchievements.forEach(achievement => {
                    setTimeout(() => {
                      toast.success(`🏆 ${achievement.title}! ${achievement.description}`, 5000)
                    }, 500)
                  })
                }
              }
            }
          }, 50)
          
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive]) // CRITICAL FIX: Only depend on isActive, NOT timeRemaining - prevents interval recreation

  const startSession = () => {
    setIsActive(true)
    setPhase('tense')
    setTimeRemaining(TENSE_DURATION) // Start with tense phase
  }

  const handleNext = () => {
    // Only allow manual next when session is not active
    if (isActive) {
      return
    }
    
    if (isLastStep) {
      // Already at last step, nothing to do
      return
    } else {
      setStep(step + 1)
      setPhase('tense') // Reset to tense phase
      setTimeRemaining(0)
    }
  }

  const handlePrevious = () => {
    // Only allow manual previous when session is not active
    if (isActive) {
      return
    }
    
    if (!isFirstStep) {
      setStep(step - 1)
      setPhase('tense') // Reset to tense phase
      setTimeRemaining(0)
    }
  }

  const togglePhase = () => {
    if (!isActive) {
      startSession()
    } else {
      // Only allow manual toggle when timer is at 0
      if (timeRemaining === 0) {
        if (phase === 'tense') {
          setPhase('relax')
          setTimeRemaining(RELAX_DURATION)
        } else {
          setPhase('tense')
          setTimeRemaining(TENSE_DURATION)
        }
      }
    }
  }

  const stopSession = () => {
    setIsActive(false)
    setTimeRemaining(0)
    setPhase('tense')
    setStep(0)
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ArrowRight': () => {
      if (!isActive) handleNext()
    },
    'ArrowLeft': () => {
      if (!isActive) handlePrevious()
    },
    ' ': () => {
      // Spacebar: Toggle phase/start session
      if (timeRemaining === 0) {
        togglePhase()
      }
    },
    'Escape': () => {
      if (isActive) {
        stopSession()
      }
    }
  })

  // Swipe gestures (only when not active)
  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      if (!isActive) handleNext()
    },
    onSwipeRight: () => {
      if (!isActive) handlePrevious()
    },
    enabled: !isActive
  })

  return (
    <div ref={swipeRef} className="flex flex-col min-h-[calc(100vh-200px)] animate-fade-in px-4 py-4 overflow-y-auto">
      {/* Header - More compact */}
      <div className={`text-center ${isActive ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`font-bold text-slate-900 dark:text-white ${isActive ? 'text-xl mb-1' : 'text-3xl mb-2'}`}>
          {t.pmr?.title || 'Relax with Intention'}
        </h2>
        {!isActive && (
          <p className="text-slate-600 dark:text-slate-400">
            {t.pmr?.desc || 'Tense and release muscle groups to reduce tension'}
          </p>
        )}
      </div>

      {/* Progress Indicator - More compact */}
      <div className={`${isActive ? 'mb-3' : 'mb-4'}`}>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>{step + 1} / {muscleGroups.length}</span>
          <span>{currentGroup?.name}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${((step + 1) / muscleGroups.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Muscle Group Card */}
      {currentGroup && (
        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          {/* Icon Container - Smaller when active */}
          <div className={`relative flex items-center justify-center ${isActive ? 'mb-4 w-32 h-32' : 'mb-6 w-40 h-40'}`}>
            {/* Background Gradient Orb */}
            {(() => {
              const pulseClass = reducedMotion ? '' : 'animate-pulse'
              const sizeClass = isActive ? 'w-32 h-32' : 'w-40 h-40'
              return (
                <div className={`absolute ${sizeClass} rounded-full bg-gradient-to-tr ${currentGroup.bg} to-transparent ${pulseClass} blur-3xl`} />
              )
            })()}

            {/* Icon Card - Smaller when active */}
            <div className={`
              relative ${isActive ? 'w-16 h-16 border-2' : 'w-40 h-40 border-4'} rounded-full ${currentGroup.borderColor}
              bg-white/5 dark:bg-slate-800/50 backdrop-blur-md
              ${isActive ? 'flex items-center justify-center' : 'flex flex-col items-center justify-center'}
              transition-all duration-500
            `}>
              <Icon className={`${isActive ? 'w-8 h-8' : 'w-12 h-12'} ${currentGroup.color} ${!isActive ? 'mb-1.5' : ''}`} />
              {!isActive && (
                <span className={`text-base font-semibold ${currentGroup.color}`}>
                  {currentGroup.name}
                </span>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className={`w-full max-w-md ${isActive ? 'mb-4' : 'mb-5'}`}>
            <div className={`
              ${isActive ? 'p-4' : 'p-5'} rounded-2xl
              ${isDark ? 'bg-slate-800/50' : 'bg-white/50'}
              backdrop-blur-md border border-slate-200 dark:border-slate-700
            `}>
              {!isActive ? (
                <p className="text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                  {t.pmr?.ready || 'Ready to begin? Click Start Session to begin the exercise.'}
                </p>
              ) : (
                <>
                  {phase === 'tense' ? (
                    <>
                      <div className="text-center mb-3">
                        <div className={`
                          text-6xl font-bold mb-1.5
                          ${currentGroup.color}
                        `}>
                          {timeRemaining}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {t.pmr?.tense || 'Tense'}
                        </p>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                        {currentGroup.tense}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-3">
                        <div className={`
                          text-6xl font-bold mb-1.5
                          ${currentGroup.color}
                        `}>
                          {timeRemaining}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {t.pmr?.relax || 'Relax'}
                        </p>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-center leading-relaxed">
                        {currentGroup.relax}
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Button - More compact */}
          <button
            onClick={!isActive ? togglePhase : (timeRemaining === 0 ? togglePhase : stopSession)}
            className={`
              w-full max-w-xs ${isActive ? 'py-3' : 'py-4'} rounded-2xl font-semibold ${isActive ? 'text-base' : 'text-lg'}
              transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95
              ${isActive
                ? timeRemaining > 0
                  ? 'bg-slate-800 dark:bg-slate-700 text-slate-200 hover:bg-slate-700 dark:hover:bg-slate-600'
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600'
                : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600'
              }
            `}
          >
            {!isActive
              ? (t.pmr?.start || 'Start Session')
              : timeRemaining > 0
                ? `${timeRemaining}s`
                : (phase === 'relax' 
                    ? (t.pmr?.nextTense || 'Next: Tense') 
                    : (t.pmr?.relaxing || 'Relaxing...'))
            }
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className={`flex justify-between gap-3 ${!isActive ? 'mt-auto pt-4 pb-28' : 'mt-4 pb-28'}`}>
        <button
          onClick={handlePrevious}
          disabled={isFirstStep || isActive}
          className={`
            flex-1 py-2 rounded-lg text-sm font-medium
            transition-all
            ${isFirstStep || isActive
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }
            flex items-center justify-center gap-1.5
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          {t.pmr?.previous || 'Previous'}
        </button>

        <button
          onClick={handleNext}
          disabled={isActive || isLastStep}
          className={`
            flex-1 py-2 rounded-lg text-sm font-medium
            bg-gradient-to-r from-teal-600 to-teal-500 text-white
            hover:from-teal-700 hover:to-teal-600
            transition-all
            flex items-center justify-center gap-1.5
            ${isActive || isLastStep ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLastStep
            ? (t.pmr?.complete || 'Complete')
            : (t.pmr?.next || 'Next')
          }
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default PMR

