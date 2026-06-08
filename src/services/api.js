import axios from 'axios';

const API_BASE_URL = 'https://pharmacy-backend-gjah.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: Token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: 401 ise logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (credentials) => api.post('/user/login', credentials);
export const logoutUser = () => api.get('/user/logout');
export const getUserInfo = () => api.get('/user/user-info');

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Suppliers
export const getSuppliers = (params) => api.get('/suppliers', { params });
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);

// Customers
export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomerById = (id) => api.get(`/customers/${id}`);

// Orders
export const getOrders = (params) => api.get('/orders', { params });

export default api;