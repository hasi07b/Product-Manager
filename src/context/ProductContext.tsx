import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { productApi, authApi } from '../lib/api';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredProducts: Product[];
  user: User | null;
  isAuthenticated: boolean;
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, updatedData: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  // 1. Auth Actions
  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 2. Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all for frontend search/pagination as requested
      const response = await productApi.getAll();
      setProducts(response.data.products || response.data); // Handle both formats
    } catch (err) {
      setError('Failed to load products from server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Add Product
  const addProduct = async (productData: any) => {
    setLoading(true);
    try {
      const response = await productApi.create(productData);
      const newProduct = response.data;
      setProducts((prev) => [newProduct, ...prev]);
    } catch (err) {
      setError('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Product
  const updateProduct = async (id: string, updatedData: any) => {
    setLoading(true);
    try {
      const response = await productApi.update(id, updatedData);
      const updatedProduct = response.data;
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
      );
    } catch (err) {
      setError('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete Product
  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Frontend Search Filtering
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        searchTerm,
        filteredProducts,
        user,
        isAuthenticated,
        setSearchTerm,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        login,
        register,
        logout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
