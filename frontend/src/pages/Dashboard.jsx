import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import PedidosList from '../components/PedidosList'
import Estadisticas from '../components/Estadisticas'
import PedidosEnRuta from '../components/PedidosEnRuta'
import PedidosCompletados from '../components/PedidosCompletados'
import CrearPedido from '../components/CrearPedido'
import { pedidosAPI } from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('pendientes')
  const [stats, setStats] = useState({
    pendientes: 0,
    completadosHoy: 0,
    completadosSemana: 0,
    combustibleTop: [],
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    loadStats()

    const interval = setInterval(() => {
      loadStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [user, navigate])

  const loadStats = async () => {
    try {
      const data = await pedidosAPI.getEstadisticas()
      setStats(data)
    } catch (error) {
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h4>⛽ FuelFlow</h4>
          <p className="text-muted small mb-0">Panel de Administración</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'pendientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('pendientes')}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Pendientes</span>
            {stats.pendientes > 0 && (
              <Badge bg="danger" className="nav-badge">{stats.pendientes}</Badge>
            )}
          </button>

          <button
            className={`nav-item ${activeTab === 'en-ruta' ? 'active' : ''}`}
            onClick={() => setActiveTab('en-ruta')}
          >
            <span className="nav-icon">📍</span>
            <span className="nav-text">En Ruta</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'completados' ? 'active' : ''}`}
            onClick={() => setActiveTab('completados')}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-text">Completados</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'estadisticas' ? 'active' : ''}`}
            onClick={() => setActiveTab('estadisticas')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Estadísticas</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'crear' ? 'active' : ''}`}
            onClick={() => setActiveTab('crear')}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Crear Pedido</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="mb-2"><strong>{(user.username || 'Admin').toUpperCase()}</strong></p>
            <Button variant="outline-light" size="sm" className="w-100" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">
            {activeTab === 'pendientes' && '📋 Pedidos Pendientes'}
            {activeTab === 'en-ruta' && '📍 Pedidos En Ruta'}
            {activeTab === 'completados' && '✅ Pedidos Completados'}
            {activeTab === 'estadisticas' && '📊 Estadísticas'}
            {activeTab === 'crear' && '➕ Crear Nuevo Pedido'}
          </h2>
          <Button
            variant={theme === 'dark' ? 'dark' : 'light'}
            onClick={toggleTheme}
            className="theme-toggle-dashboard"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </Button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'pendientes' && <PedidosList />}
          {activeTab === 'en-ruta' && <PedidosEnRuta />}
          {activeTab === 'completados' && <PedidosCompletados />}
          {activeTab === 'estadisticas' && <Estadisticas stats={stats} />}
          {activeTab === 'crear' && <CrearPedido onPedidoCreado={() => setActiveTab('pendientes')} />}
        </div>
      </main>
    </div>
  )
}

export default Dashboard