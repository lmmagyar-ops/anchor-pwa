import React, { useState } from 'react'
import { Eye, Hand, Music, Wind, Zap, CheckCircle2, ChevronRight } from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useSwipe } from '../hooks/useSwipe'
import { FirstTimeTooltip } from './Tooltip'
import { updateStreak, getAllCurrentStreaks, getTotalActiveDays } from '../utils/streaks'
import { checkAchievements } from '../utils/achievements'
import { useToast } from '../context/ToastContext'

const SOS = ({ t, isDark }) => {
  const { toast } = useToast()
  const [step, setStep] = useState(0) // 0-4: Sight, Touch, Sound, Smell, Taste

  // Steps array with sense, icon, color theme, and gradient background
  const steps = [
    {
      sense: 'Sight',
      icon: Eye,
      text: t.sos.step1,
      color: 'text-sky-400',
      bg: 'from-sky-500/20',
      borderColor: 'border-sky-400/30'
    },
    {
      sense: 'Touch',
      icon: Hand,
      text: t.sos.step2,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/20',
      borderColor: 'border-emerald-400/30'
    },
    {
      sense: 'Sound',
      icon: Music,
      text: t.sos.step3,
      color: 'text-violet-400',
      bg: 'from-violet-500/20',
      borderColor: 'border-violet-400/30'
    },
    {
      sense: 'Smell',
      icon: Wind,
      text: t.sos.step4,
      color: 'text-rose-400',
      bg: 'from-rose-500/20',
      borderColor: 'border-rose-400/30'
    },
    {
      sense: 'Taste',
      icon: Zap,
      text: t.sos.step5,
      color: 'text-amber-400',
      bg: 'from-amber-500/20',
      borderColor: 'border-amber-400/30'
    }
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon
  const isLastStep = step === 4

  const handleNext = () => {
    if (isLastStep) {
      // Complete - track SOS streak
      const streak = updateStreak('sos')
      
      // Check for achievements
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
      
      // Reset to start
      setStep(0)
    } else {
      // Move to next step
      setStep(step + 1)
    }
  }

  const handleCrisis = () => {
    // Simple alert for now - can be replaced with actual resource link
    alert(t.sos.crisis)
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ArrowRight': () => {
      handleNext()
    },
    'ArrowLeft': () => {
      handlePrevious()
    },
    'Enter': () => {
      handleNext()
    },
    'Escape': () => {
      setStep(0)
    }
  })

  // Swipe gestures
  const swipeRef = useSwipe({
    onSwipeLeft: () => handleNext(),
    onSwipeRight: () => handlePrevious()
  })

  return (
    <div ref={swipeRef} className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-fade-in px-4 py-8 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t.sos.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t.sos.desc}
        </p>
      </div>

      {/* Sensory Card Container */}
      <div className="relative flex items-center justify-center mb-12 w-64 h-64">
        {/* Background Gradient Orb - pulsing behind */}
        {(() => {
          const reducedMotion = prefersReducedMotion()
          const pulseClass = reducedMotion ? '' : 'animate-pulse'
          return (
            <div 
              className={`absolute w-64 h-64 rounded-full bg-gradient-to-tr ${currentStep.bg} to-transparent ${pulseClass} blur-3xl transition-all duration-500`}
            />
          )
        })()}

        {/* Main Card - Circular */}
        <div className={`relative w-64 h-64 rounded-full border-4 ${currentStep.borderColor} bg-white/5 dark:bg-slate-800/50 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-500`}>
          {/* Icon Container - Rounded Square with Glassmorphism */}
          <div className="w-20 h-20 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
            <Icon className={`w-8 h-8 ${currentStep.color}`} />
          </div>

          {/* Instruction Text */}
          <p className={`text-xl font-semibold text-center px-6 ${currentStep.color}`}>
            {currentStep.text}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
          className={`
          w-full max-w-xs py-4 rounded-2xl shadow-xl font-semibold text-lg
          transition-all transform hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95
          flex items-center justify-center gap-2 mb-4
          ${isLastStep
            ? 'bg-slate-700 dark:bg-slate-600 text-slate-200 hover:bg-slate-600 dark:hover:bg-slate-500'
            : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600'
          }
        `}
      >
        {isLastStep ? (
          <>
            {t.sos.reset}
            <ChevronRight className="w-5 h-5" />
          </>
        ) : (
          <>
            {t.sos.done}
            <CheckCircle2 className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Crisis Link */}
      <button
        onClick={handleCrisis}
        className="text-sm text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 underline"
      >
        {t.sos.crisis}
      </button>
    </div>
  )
}

export default SOS

