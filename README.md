# ⛽ FuelFlow - Sistema de Gestión de Combustible

Sistema web completo para la gestión y seguimiento de pedidos de combustible con delivery a domicilio.

![FuelFlow](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Flask](https://img.shields.io/badge/Flask-3.x-red)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 🚀 Características

### Frontend (React)
- ✅ **Dashboard Administrativo** con sidebar navegable
- ✅ **Gestión de Pedidos** (Crear, Ver, Editar, Eliminar)
- ✅ **Estados de Pedidos** (Pendiente → En Ruta → Completado)
- ✅ **Filtros Avanzados** por fecha, urgencia, combustible
- ✅ **Estadísticas en Tiempo Real**
- ✅ **Tema Claro/Oscuro** automático
- ✅ **Diseño Responsive** para móviles y desktop
- ✅ **Interfaz Moderna** con Bootstrap y CSS personalizado

### Backend (Flask/Python)
- ✅ **API RESTful** completa
- ✅ **Base de Datos PostgreSQL** con relaciones
- ✅ **Autenticación** de administradores
- ✅ **Gestión de Estados** de pedidos
- ✅ **Filtrado y Búsqueda** avanzada
- ✅ **Estadísticas** automáticas

### Funcionalidades Específicas
- 🔄 **Flujo Completo**: Pendiente → En Ruta → Completado
- 🚨 **Niveles de Urgencia**: Normal, Urgente, Crítico
- ⛽ **Tipos de Combustible**: Regular, Diesel, Premium
- 📊 **Dashboard**: Estadísticas, gráficos y métricas
- 🔍 **Filtros**: Por fecha, cliente, dirección, urgencia
- 📱 **Responsive**: Funciona en todos los dispositivos

## 🛠️ Tecnologías

### Frontend
- **React 18** - Framework de UI
- **React Router** - Navegación
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **Vite** - Build tool

### Backend
- **Flask 3.x** - Framework web
- **PostgreSQL** - Base de datos
- **psycopg2** - Driver PostgreSQL
- **Flask-CORS** - Manejo de CORS
- **python-dotenv** - Variables de entorno

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Python 3.10+
- PostgreSQL 12+

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/fuelflow.git
cd fuelflow
```

### 2. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos PostgreSQL
# Crear base de datos llamada 'fuelflow'
# Configurar credenciales en config.py

# Ejecutar servidor
python app.py
```

### 3. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Login**: usuario: `admin`, contraseña: `admin123`

## 🎯 Uso

1. **Página Principal**: Información de la empresa y servicios
2. **Login**: Acceso al panel administrativo
3. **Dashboard**: 
   - Ver pedidos pendientes, en ruta y completados
   - Crear nuevos pedidos
   - Ver estadísticas en tiempo real
   - Filtrar pedidos por múltiples criterios

## 🏗️ Estructura del Proyecto

```
fuelflow/
├── backend/                 # API Flask
│   ├── app.py              # Punto de entrada
│   ├── routes.py           # Rutas de la API
│   ├── database.py         # Lógica de base de datos
│   ├── config.py           # Configuración
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas principales
│   │   ├── context/        # Context API
│   │   ├── services/       # API calls
│   │   └── styles/         # CSS personalizado
│   ├── public/             # Archivos estáticos
│   └── package.json        # Dependencias Node.js
│
└── README.md              # Documentación
```

## 🎨 Capturas de Pantalla

### Dashboard Principal
- Vista general con sidebar navegable
- Estadísticas en tiempo real
- Tema claro/oscuro

### Gestión de Pedidos
- Tabla con filtros avanzados
- Modales de edición y detalle
- Estados visuales con badges

### Formularios
- Diseño moderno y responsive
- Validaciones en tiempo real
- Modo oscuro completo

## 🚧 Estado del Proyecto

✅ **Completado**
- Autenticación y autorización
- CRUD completo de pedidos
- Dashboard con estadísticas
- Filtros y búsquedas
- Tema claro/oscuro
- Diseño responsive

🔄 **En Desarrollo**
- Notificaciones en tiempo real
- Reportes PDF
- Integración de mapas
- Aplicación móvil

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

⭐ ¡Dale una estrella si te gusta el proyecto!
