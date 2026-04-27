import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import { ThemeProvider } from './components/ThemeProvider'

export default function App() {
  const { isAuthenticated, loading, init } = useAuthStore()

  useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-ink-50">
          <div className="w-8 h-8 border-2 border-primary-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      {isAuthenticated ? <Layout /> : <LoginPage />}
    </ThemeProvider>
  )
}
