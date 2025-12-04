import React, { useState, useEffect, useRef } from 'react'
import { Lock, Key } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { trapFocus } from '../utils/focusManagement'

const PasscodeLock = ({ onUnlock, isDark, t }) => {
  const { toast } = useToast()
  const [passcode, setPasscode] = useState('')
  const [isEnabled, setIsEnabled] = useState(() => {
    return localStorage.getItem('anchor_lock_enabled') === 'true'
  })
  const [storedPasscode, setStoredPasscode] = useState(() => {
    return localStorage.getItem('anchor_lock_passcode') || ''
  })
  const [error, setError] = useState('')
  const [isSettingUp, setIsSettingUp] = useState(!storedPasscode && isEnabled)
  const inputRefs = useRef([])
  const containerRef = useRef(null)

  // Auto-focus first input and trap focus
  useEffect(() => {
    if (containerRef.current) {
      // Trap focus within the modal
      const cleanup = trapFocus(containerRef.current)
      
      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
      
      return cleanup
    }
  }, [isSettingUp])

  // Check if lock should be enabled
  useEffect(() => {
    const lockEnabled = localStorage.getItem('anchor_lock_enabled') === 'true'
    setIsEnabled(lockEnabled)
    if (!lockEnabled) {
      onUnlock() // Auto-unlock if disabled
    }
  }, [])

  // Handle passcode input
  const handleInput = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only numbers

    const newPasscode = passcode.split('')
    newPasscode[index] = value
    const updatedPasscode = newPasscode.join('').slice(0, 4)
    setPasscode(updatedPasscode)
    setError('')

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (updatedPasscode.length === 4) {
      if (isSettingUp) {
        // First time setup - confirm
        handleSetupComplete(updatedPasscode)
      } else {
        // Verify passcode
        handleVerify(updatedPasscode)
      }
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !passcode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle setup completion
  const handleSetupComplete = (code) => {
    // Store passcode (in real app, this should be encrypted)
    localStorage.setItem('anchor_lock_passcode', code)
    localStorage.setItem('anchor_lock_enabled', 'true')
    setStoredPasscode(code)
    setIsSettingUp(false)
    setPasscode('')
    setError('')
    onUnlock()
  }

  // Handle verification
  const handleVerify = (code) => {
    if (code === storedPasscode) {
      setError('')
      onUnlock()
    } else {
      setError(t.passcode?.error || 'Incorrect passcode')
      setPasscode('')
      inputRefs.current[0]?.focus()
      // Shake animation via error class
      setTimeout(() => setError(''), 300)
    }
  }

  // Disable lock
  const handleDisable = () => {
    if (confirm(t.passcode?.disableConfirm || 'Are you sure you want to disable the lock?')) {
      localStorage.removeItem('anchor_lock_enabled')
      localStorage.removeItem('anchor_lock_passcode')
      setIsEnabled(false)
      onUnlock()
    }
  }

  if (!isEnabled) {
    return null
  }

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${isDark ? 'bg-slate-950' : 'bg-slate-50'}
      transition-colors duration-300
    `}>
      <div ref={containerRef} className="w-full max-w-xs px-6">
        {/* Lock Icon */}
        <div className="flex justify-center mb-8">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center
            ${isDark ? 'bg-slate-800' : 'bg-slate-200'}
          `}>
            <Lock className={`w-10 h-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          </div>
        </div>

        {/* Title */}
        <h2 className={`
          text-2xl font-bold text-center mb-2
          ${isDark ? 'text-white' : 'text-slate-900'}
        `}>
          {isSettingUp 
            ? (t.passcode?.setupTitle || 'Set Passcode')
            : (t.passcode?.title || 'Enter Passcode')
          }
        </h2>
        <p className={`
          text-sm text-center mb-8
          ${isDark ? 'text-slate-400' : 'text-slate-600'}
        `}>
          {isSettingUp
            ? (t.passcode?.setupDesc || 'Create a 4-digit passcode to secure your journal')
            : (t.passcode?.desc || 'Enter your 4-digit passcode')
          }
        </p>

        {/* Passcode Inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={passcode[index] || ''}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-14 h-14 text-center text-2xl font-semibold rounded-xl
                border-2 transition-all
                ${error
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                  : passcode[index]
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : isDark
                      ? 'border-slate-700 bg-slate-800 text-white'
                      : 'border-slate-300 bg-white text-slate-900'
                }
                focus:outline-none focus:ring-2 focus:ring-teal-500
              `}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-rose-500 text-sm text-center mb-4 animate-pulse">
            {error}
          </p>
        )}

        {/* Disable Lock Option (only when not setting up) */}
        {!isSettingUp && (
          <button
            onClick={handleDisable}
            className={`
              w-full py-2 text-sm
              ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'}
              transition-colors
            `}
          >
            {t.passcode?.disable || 'Disable Lock'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PasscodeLock

