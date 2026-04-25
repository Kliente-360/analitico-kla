import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import Layout from './components/Layout'
import { ThemeProvider } from './components/ThemeProvider'

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <ThemeProvider>
      {isAuthenticated ? <Layout /> : <LoginPage />}
    </ThemeProvider>
  )
}
