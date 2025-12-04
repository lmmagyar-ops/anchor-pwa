import { useState, useRef, useEffect } from 'react'

/**
 * Custom hook for swipe gesture detection
 * @param {Object} options - Configuration options
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @param {Number} minSwipeDistance - Minimum distance in pixels to trigger swipe (default: 50)
 * @param {Boolean} enabled - Whether swipe detection is enabled
 */
export const useSwipe = ({ onSwipeLeft, onSwipeRight, minSwipeDistance = 50, enabled = true } = {}) => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const elementRef = useRef(null)
  const callbacksRef = useRef({ onSwipeLeft, onSwipeRight })
  const minDistance = minSwipeDistance

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onSwipeLeft, onSwipeRight }
  }, [onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const element = elementRef.current
    if (!element || !enabled) return

    const handleTouchStart = (e) => {
      setTouchEnd(null)
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return

      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minDistance
      const isRightSwipe = distance < -minDistance

      if (isLeftSwipe && callbacksRef.current.onSwipeLeft) {
        callbacksRef.current.onSwipeLeft()
      }
      if (isRightSwipe && callbacksRef.current.onSwipeRight) {
        callbacksRef.current.onSwipeRight()
      }

      // Reset
      setTouchStart(null)
      setTouchEnd(null)
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, minDistance, touchStart, touchEnd])

  return elementRef
}

