import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import LandingPage from './components/LandingPage'
import ErrorBoundary from './components/ErrorBoundary'
import { landingPageContent } from './content/landingPage'
import { ToastProvider } from './context/ToastContext'

function App() {
  const [showLanding, setShowLanding] = useState(() => {
    // Check if user has entered the app before
    return !localStorage.getItem('anchor_has_entered')
  })
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('anchor_theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('anchor_lang') || 'en'
  })

  const handleEnter = () => {
    localStorage.setItem('anchor_has_entered', 'true')
    setShowLanding(false)
  }

  const handleThemeChange = (newTheme) => {
    setIsDark(newTheme)
  }

  const handleLangChange = (newLang) => {
    setLang(newLang)
  }

  const handleGoToLanding = () => {
    localStorage.removeItem('anchor_has_entered')
    setShowLanding(true)
  }

  if (showLanding) {
    return (
      <LandingPage
        onEnter={handleEnter}
        content={landingPageContent}
        isDark={isDark}
        lang={lang}
        onThemeChange={handleThemeChange}
        onLangChange={handleLangChange}
      />
    )
  }

  return (
    <ErrorBoundary isDark={isDark}>
      <ToastProvider>
        <AppShell onGoToLanding={handleGoToLanding} />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App

