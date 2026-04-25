import { useState, useRef, useEffect } from 'react'
import { Bell, X, CheckCheck } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'
import { INITIAL_NOTIFICATIONS } from '../data/taxChangeEvents'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { notifications, addNotification, markRead, markAllRead, dismiss } = useNotificationStore()

  // Load initial notifications on first mount
  useEffect(() => {
    if (notifications.length === 0) {
      INITIAL_NOTIFICATIONS.forEach((n) => addNotification(n))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  const typeColor = (t: string) =>
    t === 'tax-change' ? 'text-primary-700' :
    t === 'warning' ? 'text-amber-600' : 'text-blue-600'

  return (
    <div className="relative print:hidden" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificações${unread > 0 ? ` (${unread} não lidas)` : ''}`}
        className="relative flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">Notificações</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary-700 hover:underline flex items-center gap-1">
                <CheckCheck size={12} />
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">Nenhuma notificação</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-primary-50/40' : ''}`}
                  onClick={() => markRead(n.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${typeColor(n.type)} mb-0.5`}>{n.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{n.body}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        {new Date(n.timestamp).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                      aria-label="Descartar notificação"
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {!n.read && <span className="inline-block w-1.5 h-1.5 bg-primary-700 rounded-full mt-1" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
