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
  ChevronLeft,
  Contrast
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
      breathe: "Дихати",
      sos: "SOS",
      journal: "Уточнити",
      history: "Інсайт",
      connect: "Зв'язатися",
      pmr: "Розслаблення"
    },
    brand: "Якір",
    enter: "Увійти",
    breathe: {
      title: "Дихання 4-7-8",
      desc: "Вдихніть на 4, Затримайте на 7, Видихніть на 8...",
      inhale: "Вдих...",
      hold: "Затримайте...",
      exhale: "Видих...",
      start: "Почати сесію",
      stop: "Закінчити сесію",
      complete: "Сесія завершена. Молодець.",
      pattern: "Паттерн дихання",
      haptic: "Тактильний зворотний зв'язок",
      soundscape: "Фонові звуки"
    },
    sos: {
      title: "Заземлення (5-4-3-2-1)",
      desc: "Давайте зупинимо паніку. Подивіться навколо і знайдіть:",
      step1: "5 речей, які ви бачите",
      step2: "4 речі, які ви можете відчути",
      step3: "3 речі, які ви чуєте",
      step4: "2 речі, які ви відчуваєте запах",
      step5: "1 річ, яку ви можете скуштувати",
      done: "Я знайшов їх",
      reset: "Почати спочатку",
      crisis: "Потрібна негайна допомога? Натисніть тут для ресурсів."
    },
    journal: {
      title: "Давайте переосмислимо",
      desc: "Оскаржуйте негативні думки. Запишіть те, що вас турбує.",
      step1: "Тригер",
      step1ph: "Що сталося?",
      step2: "Негативна думка",
      step2ph: "Що ви собі говорите?",
      step3: "Раціональна відповідь",
      step3ph: "Який більш збалансований погляд?",
      emotion: "Інтенсивність емоцій (1-10)",
      tags: "З чим це пов'язано?",
      save: "Зберегти запис",
      saveSuccess: "Запис успішно збережено!"
    },
    history: {
      title: "Ваш прогрес",
      chartTitle: "Тенденції настрою",
      calendarTitle: "Теплокарта послідовності",
      patternsTitle: "Аналіз патернів",
      empty: "Поки що немає записів. Почніть вести щоденник, щоб відстежувати свій розвиток.",
      emptyTitle: "Почніть свою подорож",
      startJournaling: "Почати вести щоденник",
      emptyTip: "Порада: Ведення щоденника допомагає відстежувати патерни та святкувати прогрес",
      export: "Створити PDF-звіт",
      backup: "Резервна копія у файл",
      backupSuccess: "Резервну копію успішно завантажено!",
      restore: "Відновити з файлу",
      restoreConfirm: "Це замінить ваші поточні записи. Продовжити?",
      restoreSuccess: "Записи успішно відновлено!",
      restoreError: "Помилка читання файлу резервної копії. Перевірте формат файлу.",
      copied: "Скопійовано!",
      delete: "Очистити історію",
      confirm: "Натисніть для підтвердження"
    },
    connect: {
      title: "Потрібна глибша підтримка?",
      role: "Клінічний психолог",
      greeting: "Привіт, я Вікторія. Я допомагаю людям подолати тривогу та розвинути стійкість.",
      testimonial: "\"Нарешті я почуваюся почутою і зрозумілою без необхідності пояснювати свою культуру.\"",
      cta: "Записатися на безкоштовну консультацію",
      secondary: "Задати питання",
      safety: "100% Конфіденційно та безпечно",
      faqTitle: "Часті запитання",
      faqs: [
        { q: "Що відбувається на консультації?", a: "Ми спілкуємося 15 хвилин, щоб подивитися, чи ми підходимо один одному. Без тиску на запис." },
        { q: "Це конфіденційно?", a: "Абсолютно. Все, про що ми говоримо, захищено професійною етикою." },
        { q: "Ви працюєте онлайн?", a: "Так, я пропоную безпечні відео-сесії, тому ви можете приєднатися звідки завгодно." }
      ]
    },
    quickExit: "Швидкий вихід",
    passcode: {
      title: "Введіть код",
      desc: "Введіть ваш 4-значний код",
      setupTitle: "Встановити код",
      setupDesc: "Створіть 4-значний код для захисту вашого щоденника",
      error: "Неправильний код",
      disable: "Вимкнути блокування",
      disableConfirm: "Ви впевнені, що хочете вимкнути блокування?"
    },
    pmr: {
      title: "Розслабтеся з метою",
      desc: "Напружуйте та розслабляйте групи м'язів для зняття напруги",
      ready: "Готові почати? Натисніть 'Почати сесію', щоб розпочати вправу.",
      tense: "Напружте",
      relax: "Розслабте",
      start: "Почати сесію",
      next: "Далі",
      previous: "Назад",
      complete: "Завершити",
      nextTense: "Далі: Напружте",
      relaxing: "Розслаблення...",
      feet: "Стопи та литки",
      tenseFeet: "Напружте стопи та литки, витягнувши носки. Тримайте 5 секунд.",
      relaxFeet: "Розслабте і відчуйте, як напруга відступає. Відпочиньте 10 секунд.",
      thighs: "Стегна та сідниці",
      tenseThighs: "Напружте стегна та сідниці, стиснувши їх міцно. Тримайте 5 секунд.",
      relaxThighs: "Розслабте і помітьте різницю. Відпочиньте 10 секунд.",
      hands: "Руки та кисті",
      tenseHands: "Стисніть кулаки і напружте руки. Тримайте 5 секунд.",
      relaxHands: "Розслабте і дозвольте рукам обвиснути. Відпочиньте 10 секунд.",
      stomach: "Живіт та кор",
      tenseStomach: "Напружте м'язи живота та кер. Тримайте 5 секунд.",
      relaxStomach: "Розслабте і дихайте глибоко. Відпочиньте 10 секунд.",
      shoulders: "Плечі та шия",
      tenseShoulders: "Підніміть плечі до вух. Тримайте 5 секунд.",
      relaxShoulders: "Опустіть їх і відчуйте розслаблення. Відпочиньте 10 секунд.",
      face: "Обличчя та щелепа",
      tenseFace: "Скрутіть обличчя і стисніть щелепу. Тримайте 5 секунд.",
      relaxFace: "Розслабте і дозвольте обличчю стати повністю м'яким. Відпочиньте 10 секунд."
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
    "Твоє дихання завжди з тобою. Використовуй його як якір.",
    "У цю мить ти в безпеці. У цю мить ти достатній.",
    "Твоє тіло - твій дім. Заземися в ньому.",
    "Тривога - це хвиля. Ти - океан.",
    "Одне дихання за раз, один момент за раз.",
    "Ти пережив 100% своїх найгірших днів. Ти зможеш це зробити.",
    "Спокій - це не відсутність хаосу, а знаходження спокою всередині нього."
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
    <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Brand - Clickable Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-lg px-1 -ml-1"
          aria-label="Go to landing page"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <AnchorIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {t.brand}
          </span>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Exit Button - Small, always accessible */}
          <button
            onClick={handleQuickExit}
            className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            aria-label={t.quickExit}
            title={t.quickExit}
          >
            <LogOut className="w-4 h-4" />
          </button>

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

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
              highContrast ? 'bg-teal-500/20' : ''
            }`}
            aria-label="Toggle high contrast mode"
            title={highContrast ? 'High contrast enabled' : 'Enable high contrast'}
          >
            <Contrast className={`w-5 h-5 ${highContrast ? 'text-teal-500' : 'text-slate-700 dark:text-slate-300'}`} />
          </button>

          {/* Theme Selector */}
          <ThemeSelector 
            isDark={isDark}
            onThemeChange={(theme) => setCurrentTheme(theme)}
          />

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
    <nav className="fixed bottom-0 left-0 right-0 pb-8 px-4 z-20">
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl backdrop-blur-md bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-lg p-2">
          <div className="flex items-center justify-around">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-teal-500 scale-110'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  aria-label={label}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-xs font-medium">{label}</span>
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
      title: lang === 'en' ? 'Welcome to Anchor' : 'Ласкаво просимо до Якір',
      description: lang === 'en' 
        ? 'Your privacy-first sanctuary for anxiety relief and resilience building.'
        : 'Ваш притулок, орієнтований на конфіденційність, для зняття тривоги та розвитку стійкості.'
    },
    {
      title: lang === 'en' ? 'Proven Tools' : 'Перевірені інструменти',
      description: lang === 'en'
        ? 'Access clinically proven techniques like 4-7-8 breathing, somatic grounding, and CBT journaling.'
        : 'Отримайте доступ до клінічно перевірених технік, таких як дихання 4-7-8, соматичне заземлення та CBT-щоденник.'
    },
    {
      title: lang === 'en' ? 'Your Safe Space' : 'Ваш безпечний простір',
      description: lang === 'en'
        ? 'Everything works offline. Your data stays private. No tracking, no intrusion.'
        : 'Все працює офлайн. Ваші дані залишаються приватними. Без відстеження, без вторгнення.'
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
          aria-label={lang === 'en' ? 'Skip onboarding' : 'Пропустити ознайомлення'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-medium">
                {lang === 'en' ? `Step ${step + 1} of ${steps.length}` : `Крок ${step + 1} з ${steps.length}`}
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
                lang === 'en' ? 'Enter The Anchor' : 'Увійти до Якір'
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
          {lang === 'en' ? 'Anchor Journal' : 'Щоденник Якір'}
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
                  {entry.mood && ` • Mood: ${entry.mood}/10`}
                  {entry.tags && entry.tags.length > 0 && ` • Tags: ${entry.tags.join(', ')}`}
                </div>
                {entry.trigger && (
                  <div className="print:mb-2">
                    <div className="print:text-xs print:font-bold print:text-rose-600 print:mb-1">TRIGGER</div>
                    <div className="print:text-base print:leading-relaxed">{entry.trigger}</div>
                  </div>
                )}
                {entry.thought && (
                  <div className="print:mb-2">
                    <div className="print:text-xs print:font-bold print:text-indigo-600 print:mb-1">THOUGHT</div>
                    <div className="print:text-base print:leading-relaxed">{entry.thought}</div>
                  </div>
                )}
                {entry.rational && (
                  <div>
                    <div className="print:text-xs print:font-bold print:text-teal-600 print:mb-1">REFRAMED</div>
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
    return localStorage.getItem('anchor_lang') || 'en'
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
        ${isDark ? 'bg-slate-900' : 'bg-white'}
        md:max-w-md md:h-[90vh] md:rounded-[3rem] md:border-[8px] md:border-slate-800
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
                <div className="px-4 pt-3 pb-3">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 text-center italic leading-relaxed text-sm">
                      {dailyQuote}
                    </p>
                  </div>
                </div>
              )}
              <ErrorBoundary isDark={isDark}>
                <Breathing t={t} isDark={isDark} onRefreshQuote={refreshDailyQuote} />
              </ErrorBoundary>
            </>
            </div>
          )}

          {/* SOS Module */}
          {activeTab === 'sos' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <SOS t={t} isDark={isDark} />
              </ErrorBoundary>
            </div>
          )}

          {/* PMR Module */}
          {activeTab === 'pmr' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <PMR t={t} isDark={isDark} />
              </ErrorBoundary>
            </div>
          )}

          {/* Journal Module */}
          {activeTab === 'journal' && (
            <div className="tab-transition-wrapper">
              <ErrorBoundary isDark={isDark}>
                <Journal t={t} isDark={isDark} addEntry={addEntry} entries={entries} />
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

