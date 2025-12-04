/**
 * Production-safe logging utility
 * Only logs in development, silently ignores in production
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args) => {
    // Always log errors, even in production (but they'll be minimal)
    console.error(...args)
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  }
}

