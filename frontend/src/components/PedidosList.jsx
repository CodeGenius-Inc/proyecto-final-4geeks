import { useState, useEffect } from 'react'
import { Badge, Button, ButtonGroup, Form, Alert, Modal, Row, Col, Table } from 'react-bootstrap'
import { pedidosAPI } from '../services/api'
import './PedidosTable.css'
import './CrearPedido.css'

const PedidosList = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUrgencia, setFilterUrgencia] = useState('')
  const [filterCombustible, setFilterCombustible] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [editingPedido, setEditingPedido] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const data = await pedidosAPI.getByEstado('pendiente')
      setPedidos(data)
    } catch (error) {
      showAlert('danger', 'Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message })
    setTimeout(() => setAlert({ show: false }), 3000)
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.cambiarEstado(id, nuevoEstado)
      showAlert('success', 'Estado actualizado correctamente')
      loadPedidos()
    } catch (error) {
      showAlert('danger', 'Error al actualizar el estado')
    }
  }

  const verDetalle = (pedido) => {
    setSelectedPedido(pedido)
    setShowModal(true)
  }

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return

    try {
      await pedidosAPI.delete(id)
      showAlert('success', 'Pedido eliminado correctamente')
      loadPedidos()
    } catch (error) {
      showAlert('danger', 'Error al eliminar el pedido')
    }
  }

  const editarPedido = (pedido) => {
    setEditingPedido(pedido)
    setEditFormData({
      nombre_cliente: pedido.nombre_cliente || '',
      telefono: pedido.telefono || '',
      direccion: pedido.direccion || '',
      cantidad: pedido.cantidad || '',
      tipo_combustible: pedido.tipo_combustible || '',
      nivel_urgencia: pedido.nivel_urgencia || 'normal',
      observaciones: pedido.observaciones || '',
    })
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    })
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    
    try {
      const datos = {
        ...editFormData,
        cantidad: parseFloat(editFormData.cantidad),
      }
      
      await pedidosAPI.update(editingPedido.id, datos)
      showAlert('success', 'Pedido actualizado correctamente')
      setShowEditModal(false)
      setEditingPedido(null)
      setEditFormData({})
      loadPedidos()
    } catch (error) {
      showAlert('danger', 'Error al actualizar el pedido')
    }
  }

  const getUrgenciaBadge = (urgencia) => {
    const config = {
      normal: { variant: 'success', text: 'Normal' },
      urgente: { variant: 'warning', text: 'Urgente' },
      critico: { variant: 'danger', text: 'Crítico' },
    }
    const cfg = config[urgencia] || { variant: 'secondary', text: urgencia }
    return <Badge bg={cfg.variant}>{cfg.text}</Badge>
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchSearch =
      pedido.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.direccion?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchUrgencia = !filterUrgencia || pedido.nivel_urgencia?.toLowerCase() === filterUrgencia.toLowerCase()
    const matchCombustible = !filterCombustible || pedido.tipo_combustible === filterCombustible

    return matchSearch && matchUrgencia && matchCombustible
  })

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Alert show={alert.show} variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
        {alert.message}
      </Alert>

      <div className="filters-card mb-3">
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Buscar por cliente o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select value={filterUrgencia} onChange={(e) => setFilterUrgencia(e.target.value)}>
              <option value="">Todas las urgencias</option>
              <option value="normal">Normal</option>
              <option value="urgente">Urgente</option>
              <option value="critico">Crítico</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select value={filterCombustible} onChange={(e) => setFilterCombustible(e.target.value)}>
              <option value="">Todos los combustibles</option>
              <option value="Regular">Gasolina Regular</option>
              <option value="Diesel">Diesel</option>
              <option value="Premium">Gasolina Premium</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <Alert variant="info">
          {pedidos.length === 0 ? 'No hay pedidos pendientes' : 'No se encontraron pedidos con los filtros aplicados'}
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped hover className="pedidos-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Combustible</th>
                <th>Cantidad</th>
                <th>Urgencia</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className={pedido.nivel_urgencia === 'critico' ? 'table-danger' : ''}>
                  <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                  <td>{pedido.nombre_cliente}</td>
                  <td>{pedido.direccion}</td>
                  <td>{pedido.tipo_combustible}</td>
                  <td>{pedido.cantidad} gal</td>
                  <td>{getUrgenciaBadge(pedido.nivel_urgencia)}</td>
                  <td>{pedido.telefono}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button size="sm" variant="outline-primary" onClick={() => verDetalle(pedido)}>
                        Ver
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => editarPedido(pedido)} title="Editar pedido">
                        Editar
                      </Button>
                      <Button size="sm" variant="success" onClick={() => cambiarEstado(pedido.id, 'en_ruta')}>
                        En Ruta
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => eliminarPedido(pedido.id)}>
                        ✕
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg" 
        data-theme="inherit"
        backdrop={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPedido && (
            <div className="form-card">
              <Form onSubmit={guardarEdicion}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Cliente *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre_cliente"
                      value={editFormData.nombre_cliente}
                      onChange={handleEditChange}
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
                      value={editFormData.telefono}
                      onChange={handleEditChange}
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
                  value={editFormData.direccion}
                  onChange={handleEditChange}
                  required
                  placeholder="Ingrese la dirección completa"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad (Galones) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="cantidad"
                      value={editFormData.cantidad}
                      onChange={handleEditChange}
                      required
                      min="1"
                      step="0.1"
                      placeholder="Ingrese la cantidad en galones"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Combustible *</Form.Label>
                    <Form.Select
                      name="tipo_combustible"
                      value={editFormData.tipo_combustible}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Seleccione el tipo de combustible</option>
                      <option value="Regular">Gasolina Regular</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Premium">Gasolina Premium</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Nivel de Urgencia</Form.Label>
                <Form.Select
                  name="nivel_urgencia"
                  value={editFormData.nivel_urgencia}
                  onChange={handleEditChange}
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
                  value={editFormData.observaciones}
                  onChange={handleEditChange}
                  placeholder="Ingrese cualquier observación adicional sobre el pedido"
                />
              </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        backdrop={true}
      >
        <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-center">
          <Modal.Title className="d-flex align-items-center mb-0">
            <span className="me-2" style={{ fontSize: '1.5rem' }}>📋</span>
            Detalle del Pedido
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
            aria-label="Cerrar"
          ></button>
        </Modal.Header>
        <Modal.Body className="pt-2">
          {selectedPedido && (
            <div className="pedido-detail-card">
              <Row className="g-4">
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">👤</div>
                    <div className="detail-content">
                      <div className="detail-label">Cliente</div>
                      <div className="detail-value">{selectedPedido.nombre_cliente}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">📞</div>
                    <div className="detail-content">
                      <div className="detail-label">Teléfono</div>
                      <div className="detail-value">{selectedPedido.telefono}</div>
                    </div>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="detail-item">
                    <div className="detail-icon">📍</div>
                    <div className="detail-content">
                      <div className="detail-label">Dirección de Entrega</div>
                      <div className="detail-value">{selectedPedido.direccion}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">⛽</div>
                    <div className="detail-content">
                      <div className="detail-label">Tipo de Combustible</div>
                      <div className="detail-value">{selectedPedido.tipo_combustible}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">🛢️</div>
                    <div className="detail-content">
                      <div className="detail-label">Cantidad</div>
                      <div className="detail-value">{selectedPedido.cantidad} galones</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">⚡</div>
                    <div className="detail-content">
                      <div className="detail-label">Urgencia</div>
                      <div className="detail-value">{getUrgenciaBadge(selectedPedido.nivel_urgencia)}</div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <div className="detail-icon">📅</div>
                    <div className="detail-content">
                      <div className="detail-label">Fecha del Pedido</div>
                      <div className="detail-value">{new Date(selectedPedido.fecha_pedido).toLocaleString()}</div>
                    </div>
                  </div>
                </Col>
                {selectedPedido.observaciones && (
                  <Col xs={12}>
                    <div className="detail-item">
                      <div className="detail-icon">📝</div>
                      <div className="detail-content">
                        <div className="detail-label">Observaciones</div>
                        <div className="detail-value detail-observations">{selectedPedido.observaciones}</div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-primary" onClick={() => setShowModal(false)} className="px-4">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PedidosList
