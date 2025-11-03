import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Carousel } from 'react-bootstrap'
import { pedidosAPI } from '../services/api'
import './Home.css'

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const [formData, setFormData] = useState({
    nombre_cliente: '',
    direccion: '',
    tipo_combustible: '',
    cantidad: '100',
    nivel_urgencia: 'normal',
    telefono: '',
    observaciones: '',
  })

  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'telefono') {
      const soloNumeros = value.replace(/\D/g, '')
      setFormData((prev) => ({
        ...prev,
        [name]: soloNumeros,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nombre_cliente.trim()) {
      setAlert({ show: true, variant: 'danger', message: '❌ El nombre del cliente es obligatorio' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    if (!formData.telefono.trim()) {
      setAlert({ show: true, variant: 'danger', message: '❌ El teléfono es obligatorio' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    if (formData.telefono.length < 8) {
      setAlert({ show: true, variant: 'danger', message: '❌ El teléfono debe tener al menos 8 dígitos' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    if (!formData.direccion.trim()) {
      setAlert({ show: true, variant: 'danger', message: '❌ La dirección de entrega es obligatoria' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    if (!formData.tipo_combustible) {
      setAlert({ show: true, variant: 'danger', message: '❌ Debes seleccionar un tipo de combustible' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    const cantidadNumerica = parseFloat(formData.cantidad)
    if (!cantidadNumerica || cantidadNumerica < 100) {
      setAlert({ show: true, variant: 'danger', message: '❌ La cantidad mínima es 100 galones' })
      setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 5000)
      return
    }

    setIsSubmitting(true)

    try {
      await pedidosAPI.create({
        ...formData,
        cantidad: cantidadNumerica,
      })

      setAlert({
        show: true,
        variant: 'success',
        message: '¡Pedido registrado exitosamente! Nos pondremos en contacto con usted pronto. Si desea cancelar su pedido, puede hacerlo llamando a nuestro teléfono: +1-800-FUELFLOW',
      })

      setFormData({
        nombre_cliente: '',
        direccion: '',
        tipo_combustible: '',
        cantidad: '100',
        nivel_urgencia: 'normal',
        telefono: '',
        observaciones: '',
      })

      setTimeout(() => {
        setAlert({ show: false, variant: '', message: '' })
      }, 12000)
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.traceback || error.message || 'Error desconocido'

      setAlert({
        show: true,
        variant: 'danger',
        message: `Error: ${errorMsg}`,
      })

      setTimeout(() => {
        setAlert({ show: false, variant: '', message: '' })
      }, 10000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <Row className="align-items-center min-vh-100 py-5">
            <Col lg={7} className="text-white">
              <h1 className="display-1 fw-bold mb-4 animate-fade-in hero-title">
                FuelFlow
              </h1>
              <p className="lead fs-3 mb-4 animate-slide-up">
                Tu partner de confianza para distribución de combustible a domicilio.
                Con más de 10 años de experiencia entregando en toda la región.
              </p>
              <div className="hero-features mb-4 animate-slide-up-delay">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Entrega en menos de 2 horas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🛡️</span>
                  <span>Flota moderna y certificada</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🕐</span>
                  <span>Disponible las 24 horas, todos los días</span>
                </div>
              </div>
              <div className="contact-info animate-slide-up-delay-2">
                <Button variant="light" size="lg" className="me-3 btn-hero" href="#formulario">
                  Solicitar Entrega Ahora
                </Button>
                <div className="phone-number-hero">
                  <span className="phone-icon">📞</span>
                  <span className="phone-text">+1-800-FUELFLOW</span>
                </div>
              </div>
            </Col>
            <Col lg={5} className="hero-image-col">
              <div className="hero-statistics">
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Años de Experiencia</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Clientes Satisfechos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Servicio Disponible</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section
  className="fleet-section py-5"
>
  <Container>
    <Row className="align-items-center">
      <Col lg={6} className="mb-4">
        <Carousel
          className="shadow-lg rounded overflow-hidden fleet-carousel"
          interval={3000} // cambia cada 3 segundos automáticamente
          controls={true} //en true salen las flechas, y rn false  oculta flechas para cambiar imagenes
          indicators={true} // muestra los puntitos abajo de las imageness
          fade // transición suave
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/fleet-image.jpg"
              alt="Flota moderna - unidad 1"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/cisterna-de-combustible.png"
              alt="Operación de carga de diesel"
            />
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/camionGas.jpg"
              alt="Operación de despacho premium"
            />
          </Carousel.Item>

           <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/abastecimiento-gasolina.jpg"
              alt="Operación de despacho premium"
            />
          </Carousel.Item>
           <Carousel.Item>
            <img
              className="d-block w-100"
              src="/images/transporte-de-combustible.jpg"
              alt="Operación de despacho premium"
            />
          </Carousel.Item>
        </Carousel>
      </Col>

      <Col lg={6} >
        <div>
          <h2 className="display-5 fw-bold mb-4">Nuestra
            <span className="text-primary"> Flota Moderna</span>
          </h2>
          <p className="lead mb-4 text-dark">
            Contamos con más de 20 camiones cisterna de última generación, 
            equipados con tecnología avanzada y sistemas de seguridad certificados.
          </p>
          <ul className="fleet-features text-dark">
            <li>Cumplimiento con estándares internacionales</li>
            <li>Sistemas de monitoreo GPS en tiempo real</li>
            <li>Personal altamente capacitado y certificado</li>
            <li>Controles de calidad en cada entrega</li>
          </ul>
        </div>
      </Col>
    </Row>
  </Container>
</section>


      <section className="products-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title mb-3">Nuestros 
              <span className="text-primary"> Productos</span>
            </h2>
            <p className="text-muted lead">Combustibles de alta calidad para todas tus necesidades</p>
          </div>
          <Row className="g-4 mb-5">
            <Col md={4}>
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-card-image regular"></div>
                <Card.Body className="text-center p-4">
                  <Card.Title className="h4 mt-3">Gasolina Regular</Card.Title>
                  <Card.Text className="text-muted">
                    Perfecta para uso diario. Combustible de calidad garantizada 
                    con precio competitivo y rendimiento optimizado.
                  </Card.Text>
                  <div className="product-features mt-3">
                    <small className="text-muted">✓ Alto octanaje</small>
                    <small className="text-muted d-block">✓ Limpio y eficiente</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-card-image diesel"></div>
                <Card.Body className="text-center p-4">
                  <Card.Title className="h4 mt-3">Diesel</Card.Title>
                  <Card.Text className="text-muted">
                    Combustible diesel premium para vehículos comerciales 
                    e industriales. Máxima potencia y durabilidad.
                  </Card.Text>
                  <div className="product-features mt-3">
                    <small className="text-muted">✓ Alto rendimiento</small>
                    <small className="text-muted d-block">✓ Para flotas</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="product-card h-100 border-0 shadow-sm">
                <div className="product-card-image premium"></div>
                <Card.Body className="text-center p-4">
                  <Card.Title className="h4 mt-3">Gasolina Premium</Card.Title>
                  <Card.Text className="text-muted">
                    Máxima calidad para el mayor rendimiento. 
                    Protege tu motor y mejora el desempeño de tu vehículo.
                  </Card.Text>
                  <div className="product-features mt-3">
                    <small className="text-muted">✓ Protección del motor</small>
                    <small className="text-muted d-block">✓ Mayor potencia</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

 <section className="services-section py-5"> 
    <Container>
      <div className="text-center mb-5">
        <h2 className="section-title mb-3">Nuestros <span className="text-primary">Servicios</span></h2> 
        
        <p className="text-muted lead">Soluciones de abastecimiento a la medida de tus operaciones</p> 
      </div>

      <Row className="g-4">
        {/* Servicio 1 */}
        <Col md={6} lg={4}>
          <Card className="product-card h-100 border-0 shadow-sm"> 
            <div className="service-image-container"> 
              <img
                src="/images/llenado-barco.jpg"
                alt="Servicio de Llenado para Barcos"
                className="img-fluid w-100"
                style={{ height: '200px', objectFit: 'cover' }} 
              />
            </div>
            <Card.Body className="text-center p-4"> 
              <Card.Title className="h4 mt-3">Llenado para Barcos</Card.Title> 
              <Card.Text className="text-muted">
                Abastecemos combustible de forma segura y rápida directamente en muelles y embarcaciones.
              </Card.Text>
             
              <div className="product-features mt-3"> 
                <small className="text-muted">✓ Suministro seguro</small>
                <small className="text-muted d-block">✓ Atención en muelles</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Servicio 2 */}
        <Col md={6} lg={4}>
          <Card className="product-card h-100 border-0 shadow-sm"> 
            <div className="service-image-container">
              <img
                src="/images/camion-deliverys.jpg"
                alt="Servicio de Delivery"
                className="img-fluid w-100"
                style={{ height: '200px', objectFit: 'cover' }}
              />
            </div>
            <Card.Body className="text-center p-4">
              <Card.Title className="h4 mt-3">Servicio de Delivery</Card.Title>
              <Card.Text className="text-muted">
                Llevamos el combustible directamente a tu ubicación, con tiempos de entrega garantizados.
              </Card.Text>
              <div className="product-features mt-3">
                <small className="text-muted">✓ Entregas programadas</small>
                <small className="text-muted d-block">✓ Cobertura amplia</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Servicio 3 */}
        <Col md={6} lg={4}>
          <Card className="product-card h-100 border-0 shadow-sm"> 
            <div className="service-image-container">
              <img
                src="/images/delivery-empresas.jpg"
                alt="Abastecimiento a Empresas"
                className="img-fluid w-100"
                style={{ height: '200px', objectFit: 'cover' }}
              />
            </div>
            <Card.Body className="text-center p-4">
              <Card.Title className="h4 mt-3">Abastecimiento a Empresas</Card.Title>
              <Card.Text className="text-muted">
                Ofrecemos soluciones personalizadas de entrega y almacenamiento para flotas, fábricas y estaciones.
              </Card.Text>
              <div className="product-features mt-3">
                <small className="text-muted">✓ Soluciones B2B</small>
                <small className="text-muted d-block">✓ Precios mayoristas</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>


      <section className="why-section py-5">
  <Container>
    <h2 className="section-title text-center mb-5 fw-bold text-dark">
      ¿Por Qué Elegir <span className="text-primary">FuelFlow</span>?
    </h2>
    <Row className="g-4">
      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-bolt fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Entrega Rápida</h4>
          <p className="text-muted">
            Entregamos en menos de 2 horas en la mayoría de los casos. Tu tiempo es valioso, lo respetamos.
          </p>
        </div>
      </Col>

      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-tags fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Precios Competitivos</h4>
          <p className="text-muted">
            Ofrecemos los mejores precios del mercado sin comprometer la calidad del producto.
          </p>
        </div>
      </Col>

      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-certificate fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Calidad Certificada</h4>
          <p className="text-muted">
            Todos nuestros combustibles cumplen con los estándares internacionales más estrictos.
          </p>
        </div>
      </Col>

      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-shield-alt fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Seguridad Garantizada</h4>
          <p className="text-muted">
            Flota moderna con sistemas de seguridad avanzados y personal completamente capacitado.
          </p>
        </div>
      </Col>

      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-headset fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Atención 24/7</h4>
          <p className="text-muted">
            Estamos disponibles día y noche, los 365 días del año para atender tus necesidades.
          </p>
        </div>
      </Col>

      <Col md={6} lg={4}>
        <div className="why-card p-4 shadow-sm rounded-4 text-center">
          <div className="why-icon-wrapper bg-primary bg-opacity-10 text-primary mx-auto mb-3">
            <i className="fas fa-handshake fa-2x"></i>
          </div>
          <h4 className="fw-bold mb-2">Confianza</h4>
          <p className="text-muted">
            Más de 500 clientes satisfechos nos respaldan. Tu satisfacción es nuestra prioridad.
          </p>
        </div>
      </Col>
    </Row>
  </Container>
</section>


      <section className="form-section py-5" id="formulario">
        <Container>
          <h2 className="section-title text-center mb-4">Solicita tu <span className="text-primary">Entrega</span></h2>
          <p className="text-center text-muted mb-5">Completa el formulario y nos pondremos en contacto contigo</p>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  {alert.show && (
                    <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
                      {alert.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre del Cliente *</Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre_cliente"
                            value={formData.nombre_cliente}
                            onChange={handleChange}
                            required
                            placeholder="Tu nombre completo"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono de Contacto *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            placeholder="Ingrese solo números"
                            minLength={8}
                            maxLength={15}
                          />
                          <Form.Text className="text-muted">Solo números, mínimo 8 dígitos</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Dirección de Entrega *</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                        placeholder="Calle, Número, Ciudad, Código Postal"
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tipo de Combustible *</Form.Label>
                          <Form.Select name="tipo_combustible" value={formData.tipo_combustible} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="Regular">Gasolina Regular</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Premium">Gasolina Premium</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cantidad (galones) *</Form.Label>
                          <Form.Control
                            type="number"
                            name="cantidad"
                            value={formData.cantidad}
                            onChange={handleChange}
                            required
                            min="100"
                            step="1"
                            placeholder="Mínimo 100 galones"
                          />
                          <Form.Text className="text-muted">Mínimo: 100 galones</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Nivel de Urgencia</Form.Label>
                      <Form.Select name="nivel_urgencia" value={formData.nivel_urgencia} onChange={handleChange}>
                        <option value="normal">🟢 Normal - Entrega en 2-4 horas</option>
                        <option value="urgente">🟡 Urgente - Entrega en 1-2 horas</option>
                        <option value="critico">🔴 Crítico - Entrega inmediata</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Observaciones Adicionales</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Indicaciones para la entrega..."
                      />
                    </Form.Group>

                    <div className="d-grid">
                      <Button variant="primary" type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? '⏳ Enviando...' : '📤 Enviar Solicitud'}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <a href="/login" className="text-decoration-none text-muted fw-bold">
                        🛡️ ¿Eres administrador?
                      </a>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="footer-section bg-dark text-white py-4 mt-5">
        <Container>
          <Row>
            <Col md={4}>
              <h5 className="mb-3">FuelFlow</h5>
              <p className="text-white-50 mb-0">Tu aliado confiable en distribución de combustible.</p>
            </Col>
            <Col md={4}>
              <h6 className="mb-3">Contacto</h6>
              <p className="mb-1">
                <strong>Teléfono:</strong> +1-800-FUELFLOW
              </p>
              <p className="mb-1">
                <strong>Email:</strong> contacto@fuelflow.com
              </p>
              <p className="mb-0 text-white-50">
                Oficina: Av. Principal 123
              </p>
            </Col>
            <Col md={4}>
              <h6 className="mb-3">Horarios</h6>
              <p className="mb-1">🕐 Servicio 24/7</p>
              <p className="mb-0">📅 Todos los días del año</p>
            </Col>
          </Row>
          <hr className="my-4 bg-white-50" />
          <p className="text-center text-white-50 mb-0">
            © 2025 FuelFlow. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
    </div>
  )
}

export default Home