import React from 'react'
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

const ErrorFallback = ({ error, errorInfo, onReset, isDark }) => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className={`
      min-h-screen flex items-center justify-center p-4
      ${isDark ? 'bg-slate-950' : 'bg-slate-50'}
    `}>
      <div className={`
        max-w-md w-full p-8 rounded-2xl
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        border-2 shadow-xl
      `}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center
            ${isDark ? 'bg-rose-500/20' : 'bg-rose-100'}
          `}>
            <AlertCircle className={`w-10 h-10 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
          </div>
        </div>

        {/* Title */}
        <h1 className={`
          text-2xl font-bold text-center mb-3
          ${isDark ? 'text-white' : 'text-slate-900'}
        `}>
          Something went wrong
        </h1>

        {/* Message */}
        <p className={`
          text-center mb-6
          ${isDark ? 'text-slate-400' : 'text-slate-600'}
        `}>
          We're sorry for the inconvenience. The app encountered an unexpected error.
        </p>

        {/* Error Details (Collapsible for debugging) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className={`
            mb-6 p-4 rounded-xl
            ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}
            border
          `}>
            <summary className={`
              cursor-pointer text-sm font-semibold mb-2
              ${isDark ? 'text-slate-300' : 'text-slate-700'}
            `}>
              Error Details (Development Only)
            </summary>
            <pre className={`
              text-xs overflow-auto max-h-48
              ${isDark ? 'text-rose-400' : 'text-rose-600'}
            `}>
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onReset}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold
              flex items-center justify-center gap-2
              transition-all transform hover:scale-105 active:scale-95
              bg-gradient-to-r from-teal-600 to-teal-500
              text-white shadow-lg hover:shadow-xl
            `}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold
              flex items-center justify-center gap-2
              transition-all transform hover:scale-105 active:scale-95
              ${isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
              }
            `}
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>

          <button
            onClick={handleReload}
            className={`
              w-full py-3 px-4 rounded-xl font-medium text-sm
              flex items-center justify-center gap-2
              transition-colors
              ${isDark 
                ? 'text-slate-400 hover:text-slate-300'
                : 'text-slate-600 hover:text-slate-700'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback

