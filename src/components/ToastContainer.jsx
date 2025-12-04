import React from 'react'
import Toast from './Toast'

const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full md:max-w-md"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default ToastContainer


