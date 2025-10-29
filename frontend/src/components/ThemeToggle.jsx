import { useTheme } from '../context/ThemeContext'
import { useLocation } from 'react-router'
import Button from 'react-bootstrap/Button'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  
  if (location.pathname.includes('/dashboard')) {
    return null
  }
  
  return (
    <Button
      variant={theme === 'dark' ? 'dark' : 'light'}
      onClick={toggleTheme}
      className="theme-toggle"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: 'none',
        fontSize: '1.5rem',
      }}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  )
}

export default ThemeToggle