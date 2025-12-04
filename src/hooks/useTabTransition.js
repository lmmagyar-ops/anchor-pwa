import { useState, useEffect, useRef } from 'react'

// Tab order for direction detection
const TAB_ORDER = ['breathe', 'sos', 'pmr', 'journal', 'history', 'connect']

export const useTabTransition = (activeTab) => {
  const [direction, setDirection] = useState('right') // 'left' or 'right'
  const prevTabRef = useRef(activeTab)

  useEffect(() => {
    const prevIndex = TAB_ORDER.indexOf(prevTabRef.current)
    const currentIndex = TAB_ORDER.indexOf(activeTab)

    if (prevIndex !== -1 && currentIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 'right' : 'left')
    }

    prevTabRef.current = activeTab
  }, [activeTab])

  return { direction }
}

