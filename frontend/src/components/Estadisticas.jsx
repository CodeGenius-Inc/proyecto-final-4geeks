import { Card, Badge, Row, Col, ProgressBar } from 'react-bootstrap'

const Estadisticas = ({ stats }) => {
  const calcularPorcentajes = () => {
    if (!stats.combustibleTop || stats.combustibleTop.length === 0) return []

    const total = stats.combustibleTop.reduce((sum, item) => sum + item.cantidad, 0)

    return stats.combustibleTop.map((item) => ({
      ...item,
      porcentaje: total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : 0,
    }))
  }

  const topCombustibles = calcularPorcentajes()

  return (
    <Row>
      <Col md={4} className="mb-3">
        <Card className="border-primary h-100">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">📊 Pedidos Pendientes</h5>
          </Card.Header>
          <Card.Body className="text-center py-4">
            <h2 className="display-4 text-primary">{stats.pendientes || 0}</h2>
            <p className="text-muted mb-0">Pendientes de asignar</p>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4} className="mb-3">
        <Card className="border-success h-100">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">✅ Completados Hoy</h5>
          </Card.Header>
          <Card.Body className="text-center py-4">
            <h2 className="display-4 text-success">{stats.completadosHoy || 0}</h2>
            <p className="text-muted mb-0">Entregas del día de hoy</p>
          </Card.Body>
        </Card>
      </Col>

      <Col md={4} className="mb-3">
        <Card className="border-info h-100">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">📅 Completados Esta Semana</h5>
          </Card.Header>
          <Card.Body className="text-center py-4">
            <h2 className="display-4 text-info">{stats.completadosSemana || 0}</h2>
            <p className="text-muted mb-0">Entregas de la semana actual</p>
          </Card.Body>
        </Card>
      </Col>

      <Col md={12} className="mt-4">
        <Card>
          <Card.Header className="bg-dark text-white">
            <h5 className="mb-0">⛽ Tipos de Combustible Más Solicitados</h5>
          </Card.Header>
          <Card.Body>
            {topCombustibles.length === 0 ? (
              <p className="text-muted">No hay datos disponibles</p>
            ) : (
              <>
                {topCombustibles.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>
                        <strong>{item.tipo}</strong>
                      </span>
                      <span>
                        {item.cantidad} pedidos ({item.porcentaje}%)
                      </span>
                    </div>
                    <ProgressBar
                      variant={index === 0 ? 'success' : index === 1 ? 'info' : index === 2 ? 'warning' : 'secondary'}
                      now={parseFloat(item.porcentaje)}
                      label={`${item.porcentaje}%`}
                    />
                  </div>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default Estadisticas



