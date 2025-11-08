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
      <Col xs={12} md={4} className="mb-3">
        <Card className="border-primary h-100">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)' }}>📊 Pedidos Pendientes</h5>
          </Card.Header>
          <Card.Body className="text-center py-3 py-md-4">
            <h2 className="display-4 text-primary" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{stats.pendientes || 0}</h2>
            <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Pendientes de asignar</p>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={4} className="mb-3">
        <Card className="border-success h-100">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)' }}>✅ Completados Hoy</h5>
          </Card.Header>
          <Card.Body className="text-center py-3 py-md-4">
            <h2 className="display-4 text-success" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{stats.completadosHoy || 0}</h2>
            <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Entregas del día de hoy</p>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={4} className="mb-3">
        <Card className="border-info h-100">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)' }}>📅 Completados Esta Semana</h5>
          </Card.Header>
          <Card.Body className="text-center py-3 py-md-4">
            <h2 className="display-4 text-info" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>{stats.completadosSemana || 0}</h2>
            <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Entregas de la semana actual</p>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} className="mt-2 mt-md-4">
        <Card>
          <Card.Header className="bg-dark text-white">
            <h5 className="mb-0" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.25rem)' }}>⛽ Tipos de Combustible Más Solicitados</h5>
          </Card.Header>
          <Card.Body style={{ padding: 'clamp(1rem, 3vw, 1.5rem)' }}>
            {topCombustibles.length === 0 ? (
              <p className="text-muted">No hay datos disponibles</p>
            ) : (
              <>
                {topCombustibles.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1rem)' }}>
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
                      style={{ height: 'clamp(1.25rem, 3vw, 1.5rem)' }}
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



