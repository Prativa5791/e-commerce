import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
    /** GET /api/products/ with optional query params */
    getAll: (params = {}) => api.get("/products/", { params }),
    /** GET /api/products/:id/ */
    getById: (id) => api.get(`/products/${id}/`),
    /** POST /api/products/ */
    create: (data) => api.post("/products/", data),
    /** PUT /api/products/:id/ */
    update: (id, data) => api.put(`/products/${id}/`, data),
    /** PATCH /api/products/:id/ */
    patch: (id, data) => api.patch(`/products/${id}/`, data),
    /** DELETE /api/products/:id/ */
    delete: (id) => api.delete(`/products/${id}/`),
    /** GET /api/products/analytics/ */
    analytics: () => api.get("/products/analytics/"),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
    /** POST /api/accounts/users/login/ */
    login: (username, password) =>
        api.post("/accounts/users/login/", { username, password }),
    /** POST /api/accounts/users/register/ */
    register: (username, email, password, mobile = "") =>
        api.post("/accounts/users/register/", { username, email, password, mobile }),
    /** GET /api/accounts/users/me/ */
    me: () => api.get("/accounts/users/me/"),
    /** GET /api/accounts/users/all-users/ (admin) */
    allUsers: () => api.get("/accounts/users/all-users/"),
    /** PATCH /api/accounts/users/:id/toggle-seller/ */
    toggleSeller: (id) => api.patch(`/accounts/users/${id}/toggle-seller/`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
    /** GET /api/orders/ — returns only the current user's orders */
    getAll: () => api.get("/orders/"),
    /** GET /api/orders/:id/ */
    getById: (id) => api.get(`/orders/${id}/`),
    /** POST /api/orders/checkout/ */
    checkout: (data) => api.post("/orders/checkout/", data),
    /** GET /api/orders/all-orders/ (admin) */
    allOrders: () => api.get("/orders/all-orders/"),
    /** PATCH /api/orders/:id/update-status/ */
    updateStatus: (id, data) => api.patch(`/orders/${id}/update-status/`, data),
    /** GET /api/orders/analytics/ (admin) */
    analytics: () => api.get("/orders/analytics/"),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsApi = {
    /** GET /api/reviews/reviews/product/:productId/ */
    getByProduct: (productId) => api.get(`/reviews/reviews/product/${productId}/`),
    /** POST /api/reviews/reviews/ */
    create: (data) => api.post("/reviews/reviews/", data),
    /** GET /api/reviews/reviews/my-reviews/ */
    myReviews: () => api.get("/reviews/reviews/my-reviews/"),
    /** DELETE /api/reviews/reviews/:id/ */
    delete: (id) => api.delete(`/reviews/reviews/${id}/`),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatApi = {
    /** GET /api/chat/rooms/ — list all chat rooms for current user */
    getRooms: () => api.get("/chat/rooms/"),
    /** POST /api/chat/rooms/ — create or get existing room */
    createRoom: (data) => api.post("/chat/rooms/", data),
    /** GET /api/chat/rooms/:id/messages/ — get messages in a room */
    getMessages: (roomId) => api.get(`/chat/rooms/${roomId}/messages/`),
    /** POST /api/chat/rooms/:id/send/ — send a message */
    sendMessage: (roomId, message) => api.post(`/chat/rooms/${roomId}/send/`, { message }),
    /** GET /api/chat/rooms/unread-count/ */
    unreadCount: () => api.get("/chat/rooms/unread-count/"),
};

export default api;
