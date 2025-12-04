import React, { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const Toast = ({ toast, onDismiss }) => {
  const { id, message, type = 'info', duration = 5000, action = null } = toast

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  }

  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    error: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  }

  const Icon = icons[type] || Info

  return (
    <div
      className={`
        relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        ${styles[type]}
        animate-slide-in-right
        max-w-sm
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
        {action && (
          <button
            onClick={() => {
              if (action.onClick) action.onClick()
              onDismiss(id)
            }}
            className="mt-2 text-xs font-semibold underline hover:no-underline transition-all"
          >
            {action.label || 'Action'}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

