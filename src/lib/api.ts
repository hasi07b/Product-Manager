import axios from 'axios';

// Create a reusable Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  // GET /products - Get all products
  getAll: () => api.get('/products'),
  
  // GET /products/:id - Get single product
  getById: (id: string | number) => api.get(`/products/${id}`),
  
  // POST /products - Create product
  create: (data: any) => api.post('/products', data),
  
  // PUT /products/:id - Update product
  update: (id: string | number, data: any) => api.put(`/products/${id}`, data),
  
  // DELETE /products/:id - Delete product
  delete: (id: string | number) => api.delete(`/products/${id}`),
};

export default api;
