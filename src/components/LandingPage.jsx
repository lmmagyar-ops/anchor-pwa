import React, { useState, useEffect } from 'react'
import { 
  Anchor as AnchorIcon, 
  Sun, 
  Moon,
  Wind,
  ShieldCheck,
  Zap,
  Brain,
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  Lock,
  WifiOff,
  Star
} from 'lucide-react'
import { prefersReducedMotion } from '../utils/accessibility'

const LandingPage = ({ onEnter, content, isDark: initialDark, lang: initialLang, onThemeChange, onLangChange }) => {
  const [isDark, setIsDark] = useState(initialDark)
  const [lang, setLang] = useState(initialLang)

  // Sync theme and language with parent
  useEffect(() => {
    setIsDark(initialDark)
  }, [initialDark])

  useEffect(() => {
    setLang(initialLang)
  }, [initialLang])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('anchor_theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Save language preference
  useEffect(() => {
    localStorage.setItem('anchor_lang', lang)
  }, [lang])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    if (onThemeChange) {
      onThemeChange(newTheme)
    }
  }

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ua' : 'en'
    setLang(newLang)
    if (onLangChange) {
      onLangChange(newLang)
    }
  }

  // Safely get content with fallbacks
  const c = content[lang] || content['en'] || {}
  
  // Ensure required properties have fallbacks
  const heroTitle = c.heroTitle || 'Find Calm When Anxiety Strikes'
  const heroDesc = c.heroDesc || 'Your personal toolkit for managing anxiety.'
  const enterBtn = c.enterBtn || 'Enter Anchor'
  const enterBtnSecondary = c.enterBtnSecondary || null
  const trustBadge = c.trustBadge || null

  // Safe headline split for gradient effect
  const getHeadlineParts = (title) => {
    const words = title.split(' ')
    if (words.length <= 3) {
      return { gradient: words.join(' '), normal: '' }
    }
    const splitPoint = Math.ceil(words.length / 2)
    return {
      gradient: words.slice(0, splitPoint).join(' '),
      normal: words.slice(splitPoint).join(' ')
    }
  }

  const headlineParts = getHeadlineParts(heroTitle)

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-md bg-opacity-80 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <AnchorIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Anchor
              </span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {lang === 'en' ? 'UA' : 'EN'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {(() => {
            const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
            const pulseClass = reducedMotion ? '' : 'animate-pulse-calm'
            return (
              <>
                <div className={`absolute -top-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl ${pulseClass}`} />
                <div className={`absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl ${pulseClass}`} style={{ animationDelay: '4s' }} />
              </>
            )
          })()}
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          {/* Breathing Animation Decoration */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {(() => {
                const reducedMotion = prefersReducedMotion()
                const pulseClass = reducedMotion ? '' : 'animate-pulse-calm'
                return (
                  <>
                    {/* Gentle Pulse Circle - No ping, just calm breathing rhythm */}
                    <div className={`absolute inset-4 rounded-full bg-teal-500/20 ${pulseClass}`} />
                    <div className={`absolute inset-8 rounded-full bg-teal-500/10 ${pulseClass}`} style={{ animationDelay: '2s' }} />
                  </>
                )
              })()}
              
              {/* Center Icon */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center">
                <Wind className="w-8 h-8 text-teal-500 dark:text-teal-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-700 leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {headlineParts.gradient && (
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                {headlineParts.gradient}
              </span>
            )}
            {headlineParts.normal && (
              <>
                {' '}
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {headlineParts.normal}
                </span>
              </>
            )}
          </h1>
          
          <p className={`max-w-2xl mx-auto text-xl md:text-2xl mb-10 leading-relaxed transition-colors duration-700 font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {heroDesc}
          </p>

          {/* CTA Button with Glow Effect */}
          <div className="mb-8 flex items-center justify-center relative z-10">
            <button
              onClick={onEnter}
              className={`group px-12 py-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl min-w-[200px] relative z-10 overflow-hidden cta-glow-button ${
                isDark
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400'
                  : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600'
              }`}
              aria-label={enterBtn}
            >
              {/* Shimmer overlay */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 cta-shimmer"></span>
              
              {/* Button content */}
              <span className="relative z-10">
                {enterBtn || 'Enter Anchor'}
              </span>
              <ArrowRight className="w-6 h-6 flex-shrink-0 relative z-10" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 mb-8 relative z-10">
            <div className={`text-center p-4 rounded-xl backdrop-blur-sm ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-slate-200'
            }`}>
              <Lock className={`w-6 h-6 mx-auto mb-2 ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`} />
              <p className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                No Account
              </p>
              <p className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Required
              </p>
            </div>
            <div className={`text-center p-4 rounded-xl backdrop-blur-sm ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-slate-200'
            }`}>
              <WifiOff className={`w-6 h-6 mx-auto mb-2 ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`} />
              <p className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Works
              </p>
              <p className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Offline
              </p>
            </div>
            <div className={`text-center p-4 rounded-xl backdrop-blur-sm ${
              isDark ? 'bg-white/5 border border-white/10' : 'bg-white/50 border border-slate-200'
            }`}>
              <ShieldCheck className={`w-6 h-6 mx-auto mb-2 ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`} />
              <p className={`text-xs font-semibold ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                100%
              </p>
              <p className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Private
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      {c.trustSection && c.trustSection.stats && Array.isArray(c.trustSection.stats) && c.trustSection.stats.length > 0 && (
        <section className={`py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
          isDark ? 'bg-slate-900/30' : 'bg-slate-50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-bold text-center mb-8 transition-colors duration-700 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {c.trustSection.title || 'Why Thousands Trust Anchor'}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {c.trustSection.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-4xl md:text-5xl font-bold mb-2 transition-colors duration-700 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm font-medium transition-colors duration-700 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
        isDark ? 'bg-slate-900/50' : 'bg-slate-100/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(c.features || []).map((feature, index) => {
              if (!feature) return null
              
              // Map icon names to components
              const iconMap = {
                Zap,
                Brain,
                Wind
              }
              const IconComponent = iconMap[feature.icon] || Zap
              
              return (
                <div
                  key={index}
                  className={`rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isDark
                      ? 'bg-white/5 border border-white/10 hover:border-teal-500/50'
                      : 'bg-white border border-slate-200 hover:border-teal-500 shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${
                    isDark ? 'bg-teal-500/20' : 'bg-teal-100'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      isDark ? 'text-teal-400' : 'text-teal-600'
                    }`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 transition-colors duration-700 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {feature.title || 'Feature'}
                  </h3>
                  <p className={`text-base leading-relaxed transition-colors duration-700 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {feature.desc || ''}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {c.testimonials && Array.isArray(c.testimonials) && c.testimonials.length > 0 && (
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
          isDark ? 'bg-slate-900/30' : 'bg-white'
        }`}>
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-colors duration-700 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              What Users Are Saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {c.testimonials.map((testimonial, index) => {
                if (!testimonial) return null
                return (
                <div
                  key={index}
                  className={`rounded-2xl p-6 transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className={`mb-4 leading-relaxed transition-colors duration-700 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    "{testimonial.text || ''}"
                  </p>
                  <p className={`text-sm font-semibold transition-colors duration-700 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    — {testimonial.author || 'User'}
                  </p>
                </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Expert/Connect Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-3xl p-8 md:p-12 transition-all duration-300 ${
            isDark
              ? 'bg-white/5 border-2 border-white/10 shadow-2xl'
              : 'bg-white border-2 border-slate-200 shadow-2xl'
          }`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                  <span className="text-5xl font-bold text-teal-600 dark:text-teal-400">
                    V
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 mb-3">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {c.expertBadge || 'Clinical Expertise'}
                  </span>
                </div>
                
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-700 ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {c.expertTitle || 'Clinical Psychologist'}
                </h2>
                
                <p className={`mb-4 leading-relaxed transition-colors duration-700 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {c.expertDesc || ''}
                </p>

                {c.expertLink && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onEnter()
                    }}
                    className={`inline-flex items-center gap-2 font-semibold transition-colors duration-700 ${
                      isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'
                    }`}
                  >
                    {c.expertLink}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      {c.secondaryCta && c.secondaryCta.title && (
        <section className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700 ${
          isDark ? 'bg-gradient-to-br from-slate-900 to-slate-950' : 'bg-gradient-to-br from-teal-50 to-slate-50'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-700 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {c.secondaryCta.title}
            </h2>
            {c.secondaryCta.desc && (
              <p className={`text-xl mb-8 transition-colors duration-700 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {c.secondaryCta.desc}
              </p>
            )}
            {c.secondaryCta.button && (
              <button
                onClick={onEnter}
                className={`px-12 py-6 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${
                  isDark
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400'
                    : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600'
                }`}
              >
                {c.secondaryCta.button}
                <ArrowRight className="w-6 h-6 inline-block ml-2" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 px-4 text-center transition-colors duration-700 ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        <p className="text-sm">
          {c.footer || '© 2024 Anchor. Built with privacy in mind.'}
        </p>
      </footer>
    </div>
  )
}

export default LandingPage

