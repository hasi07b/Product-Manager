import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredProducts: Product[];
  setSearchTerm: (term: string) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: number, updatedData: Partial<Product>) => Promise<void>;
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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Partial<Product>) => {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      // DummyJSON returns a new product with an ID (usually 195), 
      // but since it's a mock API, we should make the ID unique locally 
      // if it conflicts or if we add multiple.
      const newProduct = {
        ...data,
        id: Date.now(), // Ensure local uniqueness
        images: product.images || [product.thumbnail || ''], // Ensure images array exists
        rating: 0,
        stock: 10,
        brand: 'Generic'
      };
      setProducts((prev) => [newProduct, ...prev]);
    } catch (err) {
      setError('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number, updatedData: Partial<Product>) => {
    setLoading(true);
    try {
      // DummyJSON only allows updating products with ID <= 100
      let data = updatedData;
      if (id <= 100) {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (response.ok) {
          data = await response.json();
        }
      }
      
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data, images: p.images || [data.thumbnail || ''] } : p))
      );
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      // Try to call API only for products that exist on server
      if (id <= 100) {
        await fetch(`https://dummyjson.com/products/${id}`, {
          method: 'DELETE',
        });
      }
      // Always remove from local state
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
