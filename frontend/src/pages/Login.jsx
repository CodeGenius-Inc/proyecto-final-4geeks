import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, loading } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate, loading])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(formData)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Credenciales invalidas. Usuario: admin, Password: admin123')
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow-lg">
              <Card.Header className="bg-primary text-white text-center py-4">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <h3 className="mb-0" style={{ fontSize: '2rem', fontWeight: '700' }}>⛽ FuelFlow</h3>
                </div>
                <small className="text-white-50" style={{ fontSize: '1rem' }}>Panel de Administración</small>
              </Card.Header>
              <Card.Body className="p-5">
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                      placeholder="Ingresa tu usuario"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                      placeholder="Ingresa tu contraseña"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isLoading}
                      style={{ fontSize: '1.1rem', fontWeight: '600' }}
                    >
                      {isLoading ? '⏳ Verificando...' : '🚀 Iniciar Sesión'}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <a href="/" className="text-decoration-none">
                    ← Volver al inicio
                  </a>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-3">
              <small className="text-muted">
                Sistema de Gestión de Deliverys de Combustible
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
