import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export const pedidosAPI = {
  getAll: async () => {
    const response = await api.get('/pedidos')
    return response.data
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/pedidos/estado/${estado}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/pedidos/${id}`)
    return response.data
  },

  create: async (pedido) => {
    const response = await api.post('/pedidos', pedido)
    return response.data
  },

  update: async (id, datos) => {
    const response = await api.put(`/pedidos/${id}`, datos)
    return response.data
  },

  cambiarEstado: async (id, nuevoEstado) => {
    const response = await api.patch(`/pedidos/${id}/estado`, { estado: nuevoEstado })
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/pedidos/${id}`)
    return response.data
  },

  buscar: async (termino) => {
    const response = await api.get(`/pedidos/buscar`, { params: { q: termino } })
    return response.data
  },

  getEstadisticas: async () => {
    const response = await api.get('/pedidos/estadisticas')
    return response.data
  },
}

export const authAPI = {
  login: async (credenciales) => {
    const response = await api.post('/auth/login', credenciales)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default api