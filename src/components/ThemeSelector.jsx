import React, { useState } from 'react'
import { Palette, Check, Contrast } from 'lucide-react'
import { getAllThemes, getCurrentTheme, setTheme, applyTheme } from '../utils/themes'

const ThemeSelector = ({ isDark, onThemeChange, highContrast, toggleHighContrast }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentThemeState] = useState(getCurrentTheme())
  const themes = getAllThemes()

  const handleThemeSelect = (theme) => {
    setCurrentThemeState(theme)
    setTheme(theme.id)
    applyTheme(theme)
    if (onThemeChange) {
      onThemeChange(theme)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all relative"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <Palette className="w-[18px] h-[18px]" />
        {currentTheme.id !== 'teal' && (
          <span 
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: currentTheme.colors.primary }}
          />
        )}
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Menu */}
          <div className={`
            absolute right-0 top-full mt-2 z-50
            rounded-2xl shadow-xl border
            ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
            p-3 min-w-[200px]
            animate-fade-in
          `}>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-2">
              Choose Theme
            </div>

            {/* High Contrast Toggle */}
            {toggleHighContrast && (
              <button
                onClick={toggleHighContrast}
                className={`
                  w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg mb-1
                  transition-colors
                  ${highContrast
                    ? isDark ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-500/10 text-teal-700'
                    : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Contrast className="w-4 h-4" />
                  <span className="font-medium text-sm">High Contrast</span>
                </div>
                <div className={`w-8 h-5 rounded-full transition-colors ${highContrast ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${highContrast ? 'translate-x-3.5 ml-0' : 'translate-x-0.5'}`} />
                </div>
              </button>
            )}

            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1.5" />
            
            <div className="space-y-1">
              {themes.map((theme) => {
                const isSelected = currentTheme.id === theme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg
                      transition-colors
                      ${isSelected
                        ? isDark 
                          ? 'bg-slate-700 text-white' 
                          : 'bg-slate-100 text-slate-900'
                        : isDark
                          ? 'hover:bg-slate-700 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2"
                        style={{
                          backgroundColor: theme.colors.primary,
                          borderColor: isSelected ? theme.colors.primaryDark : 'transparent'
                        }}
                      />
                      <span className="font-medium capitalize">{theme.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeSelector


