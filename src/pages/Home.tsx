import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import DeleteModal from '../components/DeleteModal';
import { Loader2, PackageSearch } from 'lucide-react';

export default function Home() {
  const { filteredProducts, loading, error, deleteProduct } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
  };

  const confirmDelete = async () => {
    if (selectedProductId) {
      await deleteProduct(selectedProductId);
      setSelectedProductId(null);
    }
  };

  const selectedProduct = filteredProducts.find(p => p.id === selectedProductId);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <PackageSearch size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-16 text-center px-2">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-tight">
          Manage Your Inventory <br /> With Precision
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
          High-performance dashboard for tracking, editing, and managing your product catalog.
        </p>
      </header>

      <SearchBar />

      {loading && filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
          <PackageSearch size={64} className="mb-4 opacity-20" />
          <p className="text-xl font-medium">No products found for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteModal
        isOpen={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
        onConfirm={confirmDelete}
        productName={selectedProduct?.title || ''}
      />
    </div>
  );
}
