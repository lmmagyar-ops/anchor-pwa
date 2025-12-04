import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

const InstallPrompt = ({ isDark, lang = 'en' }) => {
  const translations = {
    en: {
      title: "Install Anchor",
      subtitle: "Add to your home screen for quick access",
      description: "Get faster access and use Anchor offline, just like a native app.",
      install: "Install Anchor",
      later: "Maybe later",
      dismiss: "Dismiss"
    },
    ua: {
      title: "Встановити Anchor",
      subtitle: "Додайте на головний екран для швидкого доступу",
      description: "Отримайте швидший доступ та використовуйте Anchor офлайн, як нативний додаток.",
      install: "Встановити Anchor",
      later: "Можливо пізніше",
      dismiss: "Закрити"
    }
  }

  const t = translations[lang] || translations.en
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('anchor_install_dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so we can trigger it later
      setDeferredPrompt(e)
      
      // Show prompt if not dismissed recently (within last 24 hours)
      if (!dismissed || dismissedTime < oneDayAgo) {
        setShowPrompt(true)
      }
    }

    // Listen for the app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.removeItem('anchor_install_dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if app was installed manually (standalone mode)
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      // User accepted the install prompt
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.removeItem('anchor_install_dismissed')
    } else {
      // User dismissed the install prompt
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember dismissal for 24 hours
    localStorage.setItem('anchor_install_dismissed', Date.now().toString())
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 md:bottom-auto md:top-20 md:right-4 md:left-auto md:w-80 animate-fade-in">
      <div className={`
        rounded-2xl shadow-2xl border-2 p-4
        ${isDark 
          ? 'bg-slate-800 border-teal-500/50' 
          : 'bg-white border-teal-500/50'
        }
      `}>
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          aria-label={t.dismiss}
        >
          <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

        {/* Content */}
        <div className="pr-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.title}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.subtitle}
              </p>
            </div>
          </div>

          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.description}
          </p>

          {/* Install Button */}
          <button
            onClick={handleInstall}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold flex items-center justify-center gap-2 hover:from-teal-700 hover:to-teal-600 transition-all transform hover:scale-105 active:scale-95"
          >
            <Download className="w-5 h-5" />
            {t.install}
          </button>

          {/* Dismiss Link */}
          <button
            onClick={handleDismiss}
            className="w-full mt-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt

