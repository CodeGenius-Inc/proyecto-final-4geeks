import { useState, useEffect } from 'react'
import { Badge, Button, ButtonGroup, Alert, Table } from 'react-bootstrap'
import { pedidosAPI } from '../services/api'
import './PedidosTable.css'

const PedidosEnRuta = () => {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' })

  useEffect(() => {
    loadPedidos()

    const interval = setInterval(() => {
      loadPedidos()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const data = await pedidosAPI.getByEstado('en_ruta')
      setPedidos(data)
    } catch (error) {
      showAlert('danger', 'Error al cargar los pedidos en ruta')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message })
    setTimeout(() => setAlert({ show: false }), 3000)
  }

  const completarPedido = async (id) => {
    if (!window.confirm('¿Confirmar que este pedido fue completado?')) return

    try {
      await pedidosAPI.cambiarEstado(id, 'completado')
      showAlert('success', '¡Pedido completado con éxito!')
      loadPedidos()
    } catch (error) {
      showAlert('danger', 'Error al completar el pedido')
    }
  }

  const cancelarPedido = async (id) => {
    if (!window.confirm('¿Cancelar este pedido en ruta?')) return

    try {
      await pedidosAPI.cambiarEstado(id, 'cancelado')
      showAlert('success', 'Pedido cancelado')
      loadPedidos()
    } catch (error) {
      showAlert('danger', 'Error al cancelar el pedido')
    }
  }

  const getUrgenciaBadge = (urgencia) => {
    const normalizado = urgencia?.toLowerCase()
    const config = {
      normal: { variant: 'success', text: 'Normal' },
      urgente: { variant: 'warning', text: 'Urgente' },
      critico: { variant: 'danger', text: 'Crítico' },
    }
    const cfg = config[normalizado] || { variant: 'secondary', text: urgencia || 'N/A' }
    return <Badge bg={cfg.variant}>{cfg.text}</Badge>
  }

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

      {pedidos.length === 0 ? (
        <Alert variant="info">No hay pedidos en ruta actualmente</Alert>
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
              {pedidos.map((pedido) => (
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
                      <Button size="sm" variant="success" onClick={() => completarPedido(pedido.id)}>
                        ✓ Completar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => cancelarPedido(pedido.id)}>
                        Cancelar
                      </Button>
                    </div>
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

export default PedidosEnRuta
