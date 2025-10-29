import { useState, useEffect } from 'react'
import { Badge, Form, Alert, Table, Row, Col } from 'react-bootstrap'
import { pedidosAPI } from '../services/api'
import './PedidosTable.css'

const PedidosCompletados = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterInicio, setFilterInicio] = useState('')
  const [filterFin, setFilterFin] = useState('')

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const data = await pedidosAPI.getByEstado('completado')
      setPedidos(data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchSearch =
      pedido.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.direccion?.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchSearch) return false

    if (filterInicio && filterFin) {
      const fechaCompletado = new Date(pedido.fecha_completado || pedido.fecha_pedido)
      const fechaPedidoStr = fechaCompletado.toISOString().split('T')[0]
      
      return fechaPedidoStr >= filterInicio && fechaPedidoStr <= filterFin
    }

    return true
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
      <div className="filters-card mb-3">
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Buscar cliente o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-muted mb-1">Fecha desde:</Form.Label>
            <Form.Control
              type="date"
              value={filterInicio}
              onChange={(e) => setFilterInicio(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-muted mb-1">Fecha hasta:</Form.Label>
            <Form.Control
              type="date"
              value={filterFin}
              onChange={(e) => setFilterFin(e.target.value)}
            />
          </Col>
        </Row>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <Alert variant="info">
          {pedidos.length === 0 ? 'No hay pedidos completados' : 'No se encontraron pedidos con los filtros aplicados'}
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
                <th>Fecha de Entrega</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                  <td>{pedido.nombre_cliente}</td>
                  <td>{pedido.direccion}</td>
                  <td>{pedido.tipo_combustible}</td>
                  <td>{pedido.cantidad} gal</td>
                  <td>{new Date(pedido.fecha_completado || pedido.fecha_pedido).toLocaleDateString()}</td>
                  <td>
                    <Badge bg="success">Completado</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  )
}

export default PedidosCompletados
