import { useNotificationStore } from '../store/notificationStore'

describe('notificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] })
  })

  it('starts with empty notifications', () => {
    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })

  it('adds a notification with id, timestamp and read=false', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'Test', body: 'Body' })
    const { notifications } = useNotificationStore.getState()
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toBe('Test')
    expect(notifications[0].read).toBe(false)
    expect(typeof notifications[0].id).toBe('string')
    expect(typeof notifications[0].timestamp).toBe('number')
  })

  it('prepends notifications so newest is first', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'First', body: '' })
    useNotificationStore.getState().addNotification({ type: 'info', title: 'Second', body: '' })
    const { notifications } = useNotificationStore.getState()
    expect(notifications[0].title).toBe('Second')
    expect(notifications[1].title).toBe('First')
  })

  it('markRead sets one notification to read=true', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'N', body: '' })
    const { notifications } = useNotificationStore.getState()
    const id = notifications[0].id
    useNotificationStore.getState().markRead(id)
    expect(useNotificationStore.getState().notifications[0].read).toBe(true)
  })

  it('markRead does not affect other notifications', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'A', body: '' })
    useNotificationStore.getState().addNotification({ type: 'info', title: 'B', body: '' })
    const { notifications } = useNotificationStore.getState()
    useNotificationStore.getState().markRead(notifications[1].id)
    expect(useNotificationStore.getState().notifications[0].read).toBe(false)
    expect(useNotificationStore.getState().notifications[1].read).toBe(true)
  })

  it('markAllRead sets all notifications to read=true', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'A', body: '' })
    useNotificationStore.getState().addNotification({ type: 'warning', title: 'B', body: '' })
    useNotificationStore.getState().markAllRead()
    const { notifications } = useNotificationStore.getState()
    expect(notifications.every((n) => n.read)).toBe(true)
  })

  it('dismiss removes only the specified notification', () => {
    useNotificationStore.getState().addNotification({ type: 'info', title: 'Keep', body: '' })
    useNotificationStore.getState().addNotification({ type: 'info', title: 'Remove', body: '' })
    const { notifications } = useNotificationStore.getState()
    useNotificationStore.getState().dismiss(notifications[0].id)
    const remaining = useNotificationStore.getState().notifications
    expect(remaining).toHaveLength(1)
    expect(remaining[0].title).toBe('Keep')
  })
})
