import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for pull-to-refresh functionality
 * @param {Function} onRefresh - Callback function to execute on refresh
 * @param {Object} options - Configuration options
 * @returns {Object} - Hook state and refs
 */
export const usePullToRefresh = (onRefresh, options = {}) => {
  const {
    threshold = 80, // Distance in pixels to trigger refresh
    disabled = false,
    resistance = 2.5 // How much to resist scrolling past threshold
  } = options

  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const startY = useRef(0)
  const currentY = useRef(0)
  const containerRef = useRef(null)
  const isAtTop = useRef(false)
  const pullDistanceRef = useRef(0) // Ref to track current pull distance for closure

  useEffect(() => {
    if (disabled) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      // Check if we're at the top of the container
      isAtTop.current = container.scrollTop === 0
      
      if (isAtTop.current) {
        startY.current = e.touches[0].clientY
        currentY.current = startY.current
      }
    }

    const handleTouchMove = (e) => {
      if (!isAtTop.current) return

      currentY.current = e.touches[0].clientY
      const deltaY = currentY.current - startY.current

      if (deltaY > 0 && container.scrollTop === 0) {
        // User is pulling down
        e.preventDefault() // Prevent default scroll behavior
        
        // Apply resistance as user pulls further
        const resistanceFactor = deltaY > threshold 
          ? 1 + (deltaY - threshold) / resistance 
          : 1
        const pullAmount = deltaY / resistanceFactor

        pullDistanceRef.current = pullAmount
        setPullDistance(pullAmount)
        setIsPulling(pullAmount > 10) // Start showing pull indicator after 10px
      }
    }

    const handleTouchEnd = async () => {
      // Use ref to get current pull distance to avoid stale closure
      const currentPullDistance = pullDistanceRef.current
      if (currentPullDistance >= threshold && isAtTop.current) {
        // Trigger refresh
        setIsRefreshing(true)
        setIsPulling(false)
        
        try {
          await onRefresh()
        } catch (error) {
          console.error('Refresh error:', error)
        } finally {
          setIsRefreshing(false)
          pullDistanceRef.current = 0
          setPullDistance(0)
        }
      } else {
        // Reset pull state
        setIsPulling(false)
        pullDistanceRef.current = 0
        setPullDistance(0)
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [disabled, onRefresh, threshold, resistance])

  return {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    shouldShowIndicator: isPulling || isRefreshing,
    pullProgress: Math.min(pullDistance / threshold, 1)
  }
}

