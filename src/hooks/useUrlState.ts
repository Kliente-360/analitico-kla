import { useCallback, useState } from 'react'

function readParam(key: string, fallback: string): string {
  const params = new URLSearchParams(window.location.search)
  return params.get(key) ?? fallback
}

function writeParam(key: string, value: string, fallback: string) {
  const params = new URLSearchParams(window.location.search)
  if (value === fallback) params.delete(key)
  else params.set(key, value)
  const qs = params.toString()
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
  window.history.replaceState(null, '', url)
}

export function useUrlState(key: string, fallback: string): [string, (v: string) => void] {
  const [value, setLocal] = useState<string>(() => readParam(key, fallback))

  const setValue = useCallback((v: string) => {
    setLocal(v)
    writeParam(key, v, fallback)
  }, [key, fallback])

  return [value, setValue]
}
