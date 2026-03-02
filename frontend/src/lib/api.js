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
    /** GET /api/products/ with optional query params: category, search, in_stock */
    getAll: (params = {}) => api.get("/products/", { params }),
    /** GET /api/products/:id/ */
    getById: (id) => api.get(`/products/${id}/`),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
    /** POST /api/accounts/users/login/ */
    login: (username, password) =>
        api.post("/accounts/users/login/", { username, password }),
    /** POST /api/accounts/users/register/ */
    register: (username, email, password, mobile = "") =>
        api.post("/accounts/users/register/", { username, email, password, mobile }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
    /** GET /api/orders/ — returns only the current user's orders */
    getAll: () => api.get("/orders/"),
    /** POST /api/orders/ */
    create: (data) => api.post("/orders/", data),
};

export default api;
