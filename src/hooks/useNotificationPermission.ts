import { useState, useCallback } from 'react'

type PermissionState = 'default' | 'granted' | 'denied'

export function useNotificationPermission() {
  const [permission, setPermission] = useState<PermissionState>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  )

  const request = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  const send = useCallback((title: string, body: string) => {
    if (permission !== 'granted') return
    new Notification(title, { body, icon: '/favicon.ico' })
  }, [permission])

  return { permission, request, send }
}
