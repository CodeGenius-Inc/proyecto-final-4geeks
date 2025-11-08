-- Schema SQL para FuelFlow - Base de datos PostgreSQL
-- Compatible con Neon

-- Crear tipo ENUM para urgencia
CREATE TYPE urgencia_pedido AS ENUM ('Normal', 'Urgente', 'Critico');

-- Crear tipo ENUM para tipo de combustible
CREATE TYPE tipo_combustible_enum AS ENUM ('Regular', 'Premium', 'Diesel');

-- Crear tipo ENUM para estado de pedido
CREATE TYPE estado_pedido_enum AS ENUM ('Pendiente', 'En_Ruta', 'Completado');

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administrador (
    administrador_id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    cliente_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de combustible
CREATE TABLE IF NOT EXISTS tipo_combustible (
    tipo_combustible_id SERIAL PRIMARY KEY,
    tipo_combustible tipo_combustible_enum NOT NULL
);

-- Tabla de estados de pedido
CREATE TABLE IF NOT EXISTS estado_pedido (
    estado_pedido_id SERIAL PRIMARY KEY,
    estado_pedido estado_pedido_enum NOT NULL
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    pedidos_id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES cliente(cliente_id) ON DELETE CASCADE,
    tipo_combustible_id INTEGER NOT NULL REFERENCES tipo_combustible(tipo_combustible_id),
    estado_pedido_id INTEGER NOT NULL REFERENCES estado_pedido(estado_pedido_id),
    cantidad_combustible INTEGER NOT NULL,
    urgencia urgencia_pedido DEFAULT 'Normal',
    observacion TEXT,
    fecha_hora_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP,
    CHECK (cantidad_combustible > 0)
);

-- Insertar datos iniciales: tipos de combustible
INSERT INTO tipo_combustible (tipo_combustible_id, tipo_combustible) VALUES
    (3, 'Regular'),
    (4, 'Diesel'),
    (5, 'Premium')
ON CONFLICT DO NOTHING;

-- Insertar datos iniciales: estados de pedido
INSERT INTO estado_pedido (estado_pedido_id, estado_pedido) VALUES
    (1, 'Pendiente'),
    (2, 'En_Ruta'),
    (3, 'Completado')
ON CONFLICT DO NOTHING;

-- Insertar usuario administrador por defecto
INSERT INTO administrador (usuario, contraseña) VALUES
    ('admin', 'admin123')
ON CONFLICT (usuario) DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado_pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_hora_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_cliente_nombre ON cliente(nombre);
CREATE INDEX IF NOT EXISTS idx_cliente_direccion ON cliente(direccion);
