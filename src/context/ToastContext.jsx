import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastIdCounter = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 5000, action = null) => {
    const id = ++toastIdCounter
    const toast = { id, message, type, duration, action }

    setToasts((prev) => [...prev, toast])
    return id
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration, action) => showToast(message, 'success', duration, action),
    error: (message, duration, action) => showToast(message, 'error', duration, action),
    info: (message, duration, action) => showToast(message, 'info', duration, action),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

