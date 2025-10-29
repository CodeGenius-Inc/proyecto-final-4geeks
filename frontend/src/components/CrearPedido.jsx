import { useState } from 'react'
import { Form, Button, Container, Row, Col, Alert, Modal } from 'react-bootstrap'
import { pedidosAPI } from '../services/api'
import './CrearPedido.css'

const CrearPedido = ({ onPedidoCreado }) => {
  const [showModal, setShowModal] = useState(true)
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    telefono: '',
    direccion: '',
    cantidad: '',
    tipo_combustible: '',
    nivel_urgencia: 'normal',
    observaciones: '',
  })
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMensaje({ texto: '', tipo: '' })

    try {
      const pedidoData = {
        ...formData,
        cantidad: parseFloat(formData.cantidad),
      }

      await pedidosAPI.create(pedidoData)
      setMensaje({
        texto: '✅ Pedido creado exitosamente',
        tipo: 'success',
      })

      setFormData({
        nombre_cliente: '',
        telefono: '',
        direccion: '',
        cantidad: '',
        tipo_combustible: '',
        nivel_urgencia: 'normal',
        observaciones: '',
      })

      if (onPedidoCreado) {
        setTimeout(() => {
          handleCerrar()
        }, 1000)
      }
    } catch (error) {
      setMensaje({
        texto: `Error al crear el pedido: ${error.response?.data?.error || error.message}`,
        tipo: 'danger',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCerrar = () => {
    setShowModal(false)
    if (onPedidoCreado) {
      onPedidoCreado()
    }
  }

  return (
    <Modal show={showModal} onHide={handleCerrar} size="lg" backdrop={true}>
      <Modal.Header closeButton>
        <Modal.Title>➕ Crear Nuevo Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-card">
          <Form onSubmit={handleSubmit}>
              {mensaje.texto && (
                <Alert variant={mensaje.tipo} className="mb-4">
                  {mensaje.texto}
                </Alert>
              )}

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
                      placeholder="Ingrese el nombre completo"
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
                      placeholder="Ingrese el teléfono de contacto"
                    />
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
                  placeholder="Ingrese la dirección completa"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Combustible *</Form.Label>
                    <Form.Select
                      name="tipo_combustible"
                      value={formData.tipo_combustible}
                      onChange={handleChange}
                      required
                    >
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
                    <Form.Text className="text-muted">
                      Mínimo: 100 galones
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Nivel de Urgencia</Form.Label>
                <Form.Select
                  name="nivel_urgencia"
                  value={formData.nivel_urgencia}
                  onChange={handleChange}
                >
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
                  placeholder="Ingrese cualquier observación adicional sobre el pedido"
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? '⏳ Creando...' : '✅ Crear Pedido'}
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrar}>
            Cancelar
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setFormData({
                nombre_cliente: '',
                telefono: '',
                direccion: '',
                cantidad: '',
                tipo_combustible: '',
                nivel_urgencia: 'normal',
                observaciones: '',
              })
              setMensaje({ texto: '', tipo: '' })
            }}
          >
            Limpiar
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CrearPedido
