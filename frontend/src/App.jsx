import { HashRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ScrollToTop from './components/ScrollToTop'
import ThemeToggle from './components/ThemeToggle'
import ScrollToTopButton from './components/ScrollToTopButton'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PublicLayout from './components/layouts/PublicLayout'
import Home from './pages/Home'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <ScrollToTop />
          <ThemeToggle />
          <ScrollToTopButton />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App