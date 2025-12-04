import React, { useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { getAllThemes, getCurrentTheme, setTheme, applyTheme } from '../utils/themes'

const ThemeSelector = ({ isDark, onThemeChange }) => {
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
        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <Palette className="w-5 h-5 text-slate-700 dark:text-slate-300" />
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

