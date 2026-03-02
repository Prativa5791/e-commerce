import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor — attach auth token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})

// Orders
export const ordersApi = {
    getAll: () => api.get('/orders/'),
    getById: (id) => api.get(`/orders/${id}/`),
    create: (data) => api.post('/orders/', data),
    update: (id, data) => api.patch(`/orders/${id}/`, data),
    delete: (id) => api.delete(`/orders/${id}/`),
}

// Order Items
export const orderItemsApi = {
    getAll: () => api.get('/orderitems/'),
    create: (data) => api.post('/orderitems/', data),
}

export default api
