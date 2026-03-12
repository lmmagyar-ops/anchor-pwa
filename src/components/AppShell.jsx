import React, { useState, useEffect, useRef } from 'react'
import { isHighContrastEnabled, setHighContrast } from '../utils/contrastMode'
import { getCurrentTheme } from '../utils/themes'
import { 
  Wind, 
  Activity, 
  BookOpen, 
  BarChart2, 
  Phone,
  Sun,
  Moon,
  Anchor as AnchorIcon,
  LogOut,
  Heart,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Breathing from './Breathing'
import SOS from './SOS'
import Journal from './Journal'
import History from './History'
import Connect from './Connect'
import PMR from './PMR'
import PasscodeLock from './PasscodeLock'
import ToastContainer from './ToastContainer'
import FloatingActionButton from './FloatingActionButton'
import ErrorBoundary from './ErrorBoundary'
import ThemeSelector from './ThemeSelector'
import InstallPrompt from './InstallPrompt'
import { useToast } from '../context/ToastContext'
import { getUndoRedoManager, createClearEntriesAction } from '../utils/undoRedo'

// Translation structure
const translations = {
  en: {
    nav: {
      breathe: "Breathe",
      sos: "SOS",
      journal: "Refine",
      history: "Insight",
      connect: "Connect",
      pmr: "Relax"
    },
    brand: "Anchor",
    enter: "Enter",
    breathe: {
      title: "4-7-8 Breathing",
      desc: "Inhale for 4, Hold for 7, Exhale for 8...",
      inhale: "Inhale...",
      hold: "Hold...",
      exhale: "Exhale...",
      start: "Begin Session",
      stop: "End Session",
      complete: "Session Complete. Well done.",
      pattern: "Breath Pattern",
      haptic: "Haptic Feedback",
      soundscape: "Ambient Sound"
    },
    sos: {
      title: "Grounding (5-4-3-2-1)",
      desc: "Let's stop the panic. Look around you and find:",
      step1: "5 things you can see",
      step2: "4 things you can touch",
      step3: "3 things you can hear",
      step4: "2 things you can smell",
      step5: "1 thing you can taste",
      done: "I've found them",
      reset: "Start Over",
      crisis: "Need immediate help? Click here for resources."
    },
    journal: {
      title: "Let's Reframe",
      desc: "Challenge negative thoughts. Write down what is troubling you.",
      step1: "The Trigger",
      step1ph: "What happened?",
      step2: "The Negative Thought",
      step2ph: "What are you telling yourself?",
      step3: "The Rational Response",
      step3ph: "What is a more balanced view?",
      emotion: "Emotion Intensity (1-10)",
      tags: "What is this related to?",
      save: "Save Entry",
      saveSuccess: "Entry saved successfully!"
    },
    history: {
      title: "Your Progress",
      chartTitle: "Mood Trends",
      calendarTitle: "Consistency Heatmap",
      patternsTitle: "Pattern Analysis",
      empty: "No entries yet. Start journaling to track your growth.",
      emptyTitle: "Start Your Journey",
      startJournaling: "Start Journaling",
      emptyTip: "Tip: Journaling helps track patterns and celebrate progress",
      export: "Generate PDF Report",
      backup: "Backup to File",
      backupSuccess: "Backup downloaded successfully!",
      restore: "Restore from File",
      restoreConfirm: "This will replace your current entries. Continue?",
      restoreSuccess: "Entries restored successfully!",
      restoreError: "Error reading backup file. Please check the file format.",
      copied: "Copied!",
      delete: "Clear History",
      confirm: "Tap to Confirm"
    },
    connect: {
      title: "Need Deeper Support?",
      role: "Clinical Psychologist",
      greeting: "Hello, I'm Viktoriia. I help people navigate anxiety and build resilience.",
      testimonial: "\"I finally feel heard and understood without having to explain my culture.\"",
      cta: "Book Free Discovery Call",
      secondary: "Ask a Question",
      safety: "100% Confidential & Secure",
      faqTitle: "Common Questions",
      faqs: [
        { q: "What happens in a discovery call?", a: "We chat for 15 minutes to see if we are a good match. No pressure to book." },
        { q: "Is it confidential?", a: "Absolutely. Everything we discuss is protected by professional ethics." },
        { q: "Do you work online?", a: "Yes, I offer secure video sessions so you can join from anywhere." }
      ]
    },
    quickExit: "Quick Exit",
    passcode: {
      title: "Enter Passcode",
      desc: "Enter your 4-digit passcode",
      setupTitle: "Set Passcode",
      setupDesc: "Create a 4-digit passcode to secure your journal",
      error: "Incorrect passcode",
      disable: "Disable Lock",
      disableConfirm: "Are you sure you want to disable the lock?"
    },
    pmr: {
      title: "Relax with Intention",
      desc: "Tense and release muscle groups to reduce tension",
      ready: "Ready to begin? Click Start Session to begin the exercise.",
      tense: "Tense",
      relax: "Relax",
      start: "Start Session",
      next: "Next",
      previous: "Previous",
      complete: "Complete",
      nextTense: "Next: Tense",
      relaxing: "Relaxing...",
      feet: "Feet & Calves",
      tenseFeet: "Tense your feet and calves by pointing your toes. Hold for 5 seconds.",
      relaxFeet: "Release and feel the tension flow away. Rest for 10 seconds.",
      thighs: "Thighs & Glutes",
      tenseThighs: "Tense your thighs and glutes by squeezing them tight. Hold for 5 seconds.",
      relaxThighs: "Release and notice the difference. Rest for 10 seconds.",
      hands: "Hands & Arms",
      tenseHands: "Clench your fists and tense your arms. Hold for 5 seconds.",
      relaxHands: "Release and let your arms go limp. Rest for 10 seconds.",
      stomach: "Stomach & Core",
      tenseStomach: "Tighten your stomach and core muscles. Hold for 5 seconds.",
      relaxStomach: "Release and breathe deeply. Rest for 10 seconds.",
      shoulders: "Shoulders & Neck",
      tenseShoulders: "Raise your shoulders up toward your ears. Hold for 5 seconds.",
      relaxShoulders: "Let them drop and feel the release. Rest for 10 seconds.",
      face: "Face & Jaw",
      tenseFace: "Scrunch up your face and clench your jaw. Hold for 5 seconds.",
      relaxFace: "Release and let your face go completely soft. Rest for 10 seconds."
    }
  },
  ua: {
    nav: {
      breathe: "Дихання",
      sos: "SOS",
      journal: "Щоденник",
      history: "Прогрес",
      connect: "Підтримка",
      pmr: "Релакс"
    },
    brand: "Anchor",
    enter: "Увійти",
    breathe: {
      title: "Дихання 4-7-8",
      desc: "Вдих на 4, затримка на 7, видих на 8...",
      inhale: "Вдих...",
      hold: "Тримай...",
      exhale: "Видих...",
      start: "Розпочати",
      stop: "Завершити",
      complete: "Чудово! Сесію завершено.",
      pattern: "Техніка дихання",
      haptic: "Вібровідгук",
      soundscape: "Фонові звуки"
    },
    sos: {
      title: "Заземлення (5-4-3-2-1)",
      desc: "Зупинімо паніку. Озирнись і знайди:",
      step1: "5 речей, які ти бачиш",
      step2: "4 речі, яких можеш торкнутися",
      step3: "3 звуки, які чуєш",
      step4: "2 запахи, які відчуваєш",
      step5: "1 смак, який можеш розпізнати",
      done: "Знайшов — далі",
      reset: "Спочатку",
      crisis: "Потрібна термінова допомога? Натисни тут."
    },
    journal: {
      title: "Переосмислення",
      desc: "Запиши, що тебе турбує, і подивись на це інакше.",
      step1: "Що сталося?",
      step1ph: "Опиши ситуацію...",
      step2: "Що ти собі кажеш?",
      step2ph: "Яка думка з'явилась?",
      step3: "А як насправді?",
      step3ph: "Спробуй подивитися збоку...",
      emotion: "Сила емоцій (1-10)",
      tags: "До чого це стосується?",
      save: "Зберегти",
      saveSuccess: "Запис збережено!"
    },
    history: {
      title: "Твій прогрес",
      chartTitle: "Як змінюється настрій",
      calendarTitle: "Календар активності",
      patternsTitle: "Що впливає на настрій",
      empty: "Записів поки немає. Почни вести щоденник — і ти побачиш свій прогрес.",
      emptyTitle: "Почни свій шлях",
      startJournaling: "Зробити перший запис",
      emptyTip: "Порада: щоденник допомагає помічати закономірності й бачити зміни",
      export: "Зберегти як PDF",
      backup: "Створити копію",
      backupSuccess: "Копію збережено!",
      restore: "Відновити з файлу",
      restoreConfirm: "Це замінить усі поточні записи. Продовжити?",
      restoreSuccess: "Записи відновлено!",
      restoreError: "Не вдалося прочитати файл. Перевір формат.",
      copied: "Скопійовано!",
      delete: "Очистити все",
      confirm: "Натисни ще раз"
    },
    connect: {
      title: "Потрібна глибша підтримка?",
      role: "Клінічна психологиня",
      greeting: "Привіт, я Вікторія. Допомагаю людям впоратися з тривогою та стати стійкішими.",
      testimonial: "\"Нарешті я почуваюся почутою — без потреби пояснювати свою культуру.\"",
      cta: "Записатися на безкоштовну розмову",
      secondary: "Написати питання",
      safety: "100% конфіденційно",
      faqTitle: "Часті запитання",
      faqs: [
        { q: "Як проходить перша розмова?", a: "Ми поспілкуємося 15 хвилин, щоб зрозуміти, чи підходимо одне одному. Без жодних зобов'язань." },
        { q: "Це конфіденційно?", a: "Так, абсолютно. Усе, що ми обговорюємо, захищено професійною етикою." },
        { q: "Ви працюєте онлайн?", a: "Так, я проводжу сесії по відеозв'язку — можеш приєднатися з будь-де." }
      ]
    },
    quickExit: "Швидкий вихід",
    passcode: {
      title: "Введи код",
      desc: "Введи 4-значний код доступу",
      setupTitle: "Створи код",
      setupDesc: "Придумай 4-значний код для захисту щоденника",
      error: "Неправильний код",
      disable: "Вимкнути блокування",
      disableConfirm: "Точно вимкнути блокування?"
    },
    pmr: {
      title: "Розслаблення з фокусом",
      desc: "Напруж і відпусти м'язи — відчуй різницю",
      ready: "Готово? Натисни «Розпочати», щоб почати вправу.",
      tense: "Напруж",
      relax: "Відпусти",
      start: "Розпочати",
      next: "Далі",
      previous: "Назад",
      complete: "Готово",
      nextTense: "Далі: напруження",
      relaxing: "Розслаблення...",
      feet: "Стопи та литки",
      tenseFeet: "Витягни носки й напруж стопи та литки. Тримай 5 секунд.",
      relaxFeet: "Відпусти — відчуй, як напруга йде. Відпочинь 10 секунд.",
      thighs: "Стегна та сідниці",
      tenseThighs: "Стисни стегна й сідниці якомога сильніше. Тримай 5 секунд.",
      relaxThighs: "Відпусти й відчуй різницю. Відпочинь 10 секунд.",
      hands: "Руки та кисті",
      tenseHands: "Стисни кулаки й напруж руки. Тримай 5 секунд.",
      relaxHands: "Розслаб руки повністю. Відпочинь 10 секунд.",
      stomach: "Живіт",
      tenseStomach: "Напруж м'язи живота. Тримай 5 секунд.",
      relaxStomach: "Відпусти й глибоко вдихни. Відпочинь 10 секунд.",
      shoulders: "Плечі та шия",
      tenseShoulders: "Підніми плечі до вух. Тримай 5 секунд.",
      relaxShoulders: "Різко опусти — відчуй полегшення. Відпочинь 10 секунд.",
      face: "Обличчя та щелепа",
      tenseFace: "Зморщ обличчя й стисни щелепу. Тримай 5 секунд.",
      relaxFace: "Повністю розслаб обличчя. Відпочинь 10 секунд."
    }
  }
}

// Daily quotes
const dailyQuotes = {
  en: [
    "Your breath is always with you. Use it as your anchor.",
    "In this moment, you are safe. In this moment, you are enough.",
    "Your body is your home. Ground yourself in it.",
    "Anxiety is a wave. You are the ocean.",
    "One breath at a time, one moment at a time.",
    "You have survived 100% of your worst days. You can do this.",
    "Peace is not the absence of chaos, but finding calm within it."
  ],
  ua: [
    "Твоє дихання завжди з тобою. Воно — твій якір.",
    "Просто зараз ти в безпеці. Просто зараз — цього досить.",
    "Твоє тіло — твій дім. Повертайся до нього.",
    "Тривога — це хвиля. А ти — океан.",
    "Один вдих. Один момент. Крок за кроком.",
    "Ти пережив усі свої найважчі дні. Впораєшся і з цим.",
    "Спокій — це не відсутність хаосу, а тиша всередині нього."
  ]
}

// Top Header Component
const TopHeader = ({ isDark, toggleTheme, lang, toggleLang, t, onQuickExit, highContrast, toggleHighContrast, onGoToLanding }) => {
  const handleQuickExit = () => {
    // Clear browsing history and redirect to neutral site
    window.location.href = 'https://www.google.com'
  }

  const handleLogoClick = () => {
    if (onGoToLanding) {
      onGoToLanding()
    } else {
      // Fallback: Clear the flag to show landing page and reload
      localStorage.removeItem('anchor_has_entered')
      window.location.reload()
    }
  }

  return (
    <header className="sticky top-0 z-20 glass">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand - Clickable Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-xl px-1 -ml-1"
          aria-label="Go to landing page"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <AnchorIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-white tracking-tight">
            {t.brand}
          </span>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          {/* Quick Exit Button - Small, always accessible */}
          <button
            onClick={handleQuickExit}
            className="p-2.5 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all"
            aria-label={t.quickExit}
            title={t.quickExit}
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
          </button>

          {/* Theme Selector (includes contrast toggle) */}
          <ThemeSelector 
            isDark={isDark}
            onThemeChange={(theme) => setCurrentTheme(theme)}
            highContrast={highContrast}
            toggleHighContrast={toggleHighContrast}
          />

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="ml-1 px-3 py-1.5 rounded-full text-sm font-semibold tracking-tight transition-all bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50"
          >
            {lang === 'en' ? 'UA' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  )
}

// Bottom Navigation Component
const BottomNav = ({ activeTab, setActiveTab, t, isDark }) => {
  const navItems = [
    { id: 'breathe', icon: Wind, label: t.nav.breathe },
    { id: 'sos', icon: Activity, label: t.nav.sos },
    { id: 'pmr', icon: Heart, label: t.nav.pmr },
    { id: 'journal', icon: BookOpen, label: t.nav.journal },
    { id: 'history', icon: BarChart2, label: t.nav.history },
    { id: 'connect', icon: Phone, label: t.nav.connect },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-md mx-auto px-4">
        <div className="glass-nav rounded-3xl shadow-glass p-1.5">
          <div className="flex items-center justify-around">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'text-teal-500 bg-teal-500/8 dark:bg-teal-500/10'
                      : 'text-slate-500 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                  }`}
                  aria-label={label}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Onboarding Overlay Component
const OnboardingOverlay = ({ onComplete, lang, t }) => {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: lang === 'en' ? 'Welcome to Anchor' : 'Вітаємо в Anchor',
      description: lang === 'en' 
        ? 'Your privacy-first sanctuary for anxiety relief and resilience building.'
        : 'Твій приватний простір для роботи з тривогою та внутрішньої стійкості.'
    },
    {
      title: lang === 'en' ? 'Proven Tools' : 'Перевірені техніки',
      description: lang === 'en'
        ? 'Access clinically proven techniques like 4-7-8 breathing, somatic grounding, and CBT journaling.'
        : 'Дихання 4-7-8, заземлення, щоденник переосмислення — усе підтверджено клінічно.'
    },
    {
      title: lang === 'en' ? 'Your Safe Space' : 'Твій безпечний простір',
      description: lang === 'en'
        ? 'Everything works offline. Your data stays private. No tracking, no intrusion.'
        : 'Працює офлайн. Дані залишаються на пристрої. Жодного відстеження.'
    },
  ]

  const handleEnter = () => {
    localStorage.setItem('anchor_intro_seen', 'true')
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem('anchor_intro_seen', 'true')
    onComplete()
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleEnter()
    }
  }

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full relative">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute -top-2 -right-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
          aria-label={lang === 'en' ? 'Skip onboarding' : 'Пропустити'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'en' ? `Step ${step + 1} of ${steps.length}` : `${step + 1} з ${steps.length}`}
              </span>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === step
                        ? 'w-8 bg-teal-500'
                        : index < step
                        ? 'w-2 bg-teal-500/50'
                        : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8 min-h-[200px] animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">
              {steps[step].title}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {steps[step].description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                {lang === 'en' ? 'Back' : 'Назад'}
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition-colors font-semibold"
            >
              {step < steps.length - 1 ? (
                <>
                  {lang === 'en' ? 'Next' : 'Далі'}
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                lang === 'en' ? 'Enter The Anchor' : 'Почати'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hidden Print Template Component
const PrintTemplate = ({ entries, lang }) => {
  return (
    <div className="hidden print:block print:bg-white print:text-black">
      <div className="print:p-8">
        <h1 className="print:text-3xl print:font-bold print:mb-6">
          {lang === 'en' ? 'Anchor Journal' : 'Щоденник Anchor'}
        </h1>
        <div className="print:space-y-6">
          {entries.length === 0 ? (
            <p className="print:text-slate-600">
              {lang === 'en' ? 'No entries yet.' : 'Поки що немає записів.'}
            </p>
          ) : (
            entries.map((entry, index) => (
              <div key={index} className="print:border-b print:border-slate-300 print:pb-4 print:mb-4">
                <div className="print:text-sm print:text-slate-500 print:mb-2">
                  {new Date(entry.date || entry.timestamp || Date.now()).toLocaleDateString(
                    lang === 'en' ? 'en-US' : 'uk-UA',
                    { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }
                  )}
                  {entry.mood && ` • ${lang === 'en' ? 'Mood' : 'Настрій'}: ${entry.mood}/10`}
                  {entry.tags && entry.tags.length > 0 && ` • ${lang === 'en' ? 'Tags' : 'Теги'}: ${entry.tags.join(', ')}`}
                </div>
                {entry.trigger && (
                  <div className="print:mb-2">
                    <div className="print:text-xs print:font-bold print:text-rose-600 print:mb-1">{lang === 'en' ? 'TRIGGER' : 'ТРИГЕР'}</div>
                    <div className="print:text-base print:leading-relaxed">{entry.trigger}</div>
                  </div>
                )}
                {entry.thought && (
                  <div className="print:mb-2">
                    <div className="print:text-xs print:font-bold print:text-indigo-600 print:mb-1">{lang === 'en' ? 'THOUGHT' : 'ДУМКА'}</div>
                    <div className="print:text-base print:leading-relaxed">{entry.thought}</div>
                  </div>
                )}
                {entry.rational && (
                  <div>
                    <div className="print:text-xs print:font-bold print:text-teal-600 print:mb-1">{lang === 'en' ? 'REFRAMED' : 'ПЕРЕОСМИСЛЕНО'}</div>
                    <div className="print:text-base print:leading-relaxed">{entry.rational}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Main App Shell Component
const AppShell = ({ onGoToLanding }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('anchor_theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('anchor_lang') || 'ua'
  })
  const [activeTab, setActiveTab] = useState('breathe')
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('anchor_entries')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [dailyQuote, setDailyQuote] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Check if lock is enabled - if not, start unlocked
    return localStorage.getItem('anchor_lock_enabled') !== 'true'
  })
  const [highContrast, setHighContrastState] = useState(() => {
    return isHighContrastEnabled()
  })
  const [currentTheme, setCurrentTheme] = useState(() => {
    return getCurrentTheme()
  })

  // Ref for main content area to handle scrolling
  const mainContentRef = useRef(null)

  // Scroll to top when switching tabs (especially journal tab)
  useEffect(() => {
    if (mainContentRef.current) {
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        if (mainContentRef.current) {
          mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    }
  }, [activeTab])

  // Initialize onboarding check
  useEffect(() => {
    const introSeen = localStorage.getItem('anchor_intro_seen')
    if (!introSeen) {
      setShowOnboarding(true)
    }
  }, [])

  // Load daily quote
  const refreshDailyQuote = () => {
    const quotes = dailyQuotes[lang]
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setDailyQuote(randomQuote)
  }
  
  useEffect(() => {
    refreshDailyQuote()
  }, [lang])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('anchor_theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Save language preference
  useEffect(() => {
    localStorage.setItem('anchor_lang', lang)
  }, [lang])

  // Sync entries to localStorage
  useEffect(() => {
    localStorage.setItem('anchor_entries', JSON.stringify(entries))
  }, [entries])

  const toggleTheme = () => setIsDark(!isDark)
  const toggleLang = () => setLang(lang === 'en' ? 'ua' : 'en')
  
  // High Contrast toggle
  const toggleHighContrast = () => {
    const newState = !highContrast
    setHighContrastState(newState)
    setHighContrast(newState)
  }

  // Add entry function for Journal component
  const addEntry = (entry) => {
    setEntries(prev => [...prev, entry])
  }

  // Clear entries function for History component
  const clearEntries = () => {
    setEntries([])
    localStorage.removeItem('anchor_entries')
  }

  // Restore entries function for History component
  const restoreEntries = (restoredEntries) => {
    setEntries(restoredEntries)
    localStorage.setItem('anchor_entries', JSON.stringify(restoredEntries))
  }

  const t = translations[lang]
  const { toasts, dismissToast, toast } = useToast()

  // Dark mode animated blobs
  const DarkModeBlobs = () => {
    if (!isDark) return null
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animationClass = reducedMotion ? '' : 'animate-pulse-slow'
    
    return (
      <>
        <div className={`absolute -top-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl ${animationClass}`} />
        <div className={`absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl ${animationClass}`} style={{ animationDelay: '2s' }} />
      </>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} flex items-center justify-center p-4 md:p-8 relative`}>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Device Frame */}
      <div className={`
        w-full h-screen
        ${isDark ? 'bg-slate-900' : 'bg-gradient-to-b from-slate-50 to-white'}
        md:max-w-md md:h-[90vh] md:rounded-[2.5rem] md:border-[8px] md:border-slate-800
        overflow-hidden
        relative
        flex flex-col
      `}>
        {/* Passcode Lock - Shows if locked */}
        {!isUnlocked && (
          <PasscodeLock
            onUnlock={() => setIsUnlocked(true)}
            isDark={isDark}
            t={t}
          />
        )}

        {/* Dark Mode Blobs */}
        <DarkModeBlobs />

        {/* Onboarding Overlay */}
        {showOnboarding && (
          <OnboardingOverlay
            onComplete={() => setShowOnboarding(false)}
            lang={lang}
            t={t}
          />
        )}

        {/* Top Header - Hidden when locked */}
        {isUnlocked && (
          <TopHeader
            isDark={isDark}
            toggleTheme={toggleTheme}
            lang={lang}
            toggleLang={toggleLang}
            t={t}
            onQuickExit={() => {}}
            highContrast={highContrast}
            toggleHighContrast={toggleHighContrast}
            onGoToLanding={onGoToLanding}
          />
        )}

        {/* Main Content Area - Hidden when locked */}
        {isUnlocked && (
          <main ref={mainContentRef} id="main-content" className="flex-1 relative overflow-y-auto pb-24 transition-all duration-300">
          {/* Module Content Based on Active Tab */}
          {activeTab === 'breathe' && (
            <div className="tab-transition-wrapper">
            <>
              {/* Quote Area with Settings (visible on breathe tab) - Compact */}
              {dailyQuote && (
                <div className="px-4 pt-3 pb-2">
                  <div className="glass-card px-4 py-3" style={{ borderLeft: '3px solid #14b8a6' }}>
                    <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-[15px] tracking-tight">
                      {dailyQuote}
                    </p>
                  </div>
                </div>
              )}
              <ErrorBoundary isDark={isDark}>
                <Breathing t={t} isDark={isDark} onRefreshQuote={refreshDailyQuote} lang={lang} />
              </ErrorBoundary>
            </>
            </div>
          )}

          {/* SOS Module */}
          {activeTab === 'sos' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <SOS t={t} isDark={isDark} lang={lang} />
              </ErrorBoundary>
            </div>
          )}

          {/* PMR Module */}
          {activeTab === 'pmr' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <PMR t={t} isDark={isDark} lang={lang} />
              </ErrorBoundary>
            </div>
          )}

          {/* Journal Module */}
          {activeTab === 'journal' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <Journal t={t} isDark={isDark} addEntry={addEntry} entries={entries} lang={lang} />
              </ErrorBoundary>
            </div>
          )}

          {/* History Module */}
          {activeTab === 'history' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <History 
                  t={t} 
                  isDark={isDark} 
                  entries={entries} 
                  clearEntries={clearEntries}
                  restoreEntries={restoreEntries}
                  onNavigateToJournal={() => setActiveTab('journal')}
                  onRefresh={refreshDailyQuote}
                  lang={lang}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* Connect Module */}
          {activeTab === 'connect' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <Connect t={t} isDark={isDark} />
              </ErrorBoundary>
            </div>
          )}

          {/* Placeholder for other modules */}
          {activeTab !== 'breathe' && activeTab !== 'sos' && activeTab !== 'pmr' && activeTab !== 'journal' && activeTab !== 'history' && activeTab !== 'connect' && (
            <div className="px-4 py-6">
              <div className="text-center text-slate-500 dark:text-slate-400">
                {lang === 'en' 
                  ? `Content for ${t.nav[activeTab]} will appear here`
                  : `Вміст для ${t.nav[activeTab]} з'явиться тут`
                }
              </div>
            </div>
          )}
        </main>
        )}

        {/* Bottom Navigation - Hidden when locked */}
        {isUnlocked && (
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            t={t}
            isDark={isDark}
          />
        )}

        {/* Floating Action Button - Hidden when locked */}
        {isUnlocked && (
          <FloatingActionButton
            activeTab={activeTab}
            onQuickJournal={() => setActiveTab('journal')}
            onQuickSOS={() => setActiveTab('sos')}
            onQuickBreathing={() => setActiveTab('breathe')}
            lang={lang}
          />
        )}
      </div>

      {/* Hidden Print Template */}
      <PrintTemplate entries={entries} lang={lang} />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Install Prompt - Show when PWA can be installed (outside device frame on desktop) */}
      {isUnlocked && (
        <InstallPrompt isDark={isDark} lang={lang} />
      )}
    </div>
  )
}

export default AppShell

