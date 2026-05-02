import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { productApi } from '../lib/api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredProducts: Product[];
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: number, updatedData: any) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
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

  // 1. Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAll();
      // Our backend returns the array directly
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products from server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Product
  const addProduct = async (productData: any) => {
    setLoading(true);
    try {
      const response = await productApi.create(productData);
      const newProduct = response.data;
      // Update UI without refreshing page
      setProducts((prev) => [newProduct, ...prev]);
    } catch (err) {
      setError('Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Product
  const updateProduct = async (id: number, updatedData: any) => {
    setLoading(true);
    try {
      const response = await productApi.update(id, updatedData);
      const updatedProduct = response.data;
      // Reflect changes instantly in UI
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
    } catch (err) {
      setError('Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete Product
  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      await productApi.delete(id);
      // Remove product from UI immediately
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Simple search filter
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        searchTerm,
        filteredProducts,
        setSearchTerm,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
