import { create } from 'zustand'

export type NotifType = 'tax-change' | 'info' | 'warning'

export interface AppNotification {
  id: string
  title: string
  body: string
  timestamp: number
  read: boolean
  type: NotifType
}

interface NotificationState {
  notifications: AppNotification[]
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) => set((s) => ({
    notifications: [
      { ...n, id: crypto.randomUUID(), timestamp: Date.now(), read: false },
      ...s.notifications,
    ],
  })),
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),
  dismiss: (id) => set((s) => ({
    notifications: s.notifications.filter((n) => n.id !== id),
  })),
}))
