import axios from 'axios';

// Create a reusable Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productApi = {
  // GET /products - Get all products (supports pagination, search, filter)
  getAll: (params?: any) => api.get('/products', { params }),
  
  // GET /products/:id - Get single product
  getById: (id: string | number) => api.get(`/products/${id}`),
  
  // POST /products - Create product (Protected)
  create: (data: any) => api.post('/products', data),
  
  // PUT /products/:id - Update product (Protected)
  update: (id: string | number, data: any) => api.put(`/products/${id}`, data),
  
  // DELETE /products/:id - Delete product (Protected)
  delete: (id: string | number) => api.delete(`/products/${id}`),
};

export const authApi = {
  // POST /auth/register - Register user
  register: (userData: any) => api.post('/auth/register', userData),
  
  // POST /auth/login - Login user
  login: (credentials: any) => api.post('/auth/login', credentials),
};

export default api;
