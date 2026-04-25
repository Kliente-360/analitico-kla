import { useState, useEffect } from 'react'

// Returns false on mount, true after first paint (defers heavy renders)
export function usePageReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return ready
}
