// Service Worker Registration
import { logger } from './logger'

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          logger.log('Service Worker registered:', registration.scope)
          
          // Check for updates periodically (every 5 minutes in production)
          const updateInterval = import.meta.env.DEV ? 60000 : 300000
          setInterval(() => {
            registration.update()
          }, updateInterval)
        })
        .catch((error) => {
          logger.error('Service Worker registration failed:', error)
        })
    })
  }
}

