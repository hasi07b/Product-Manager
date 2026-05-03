import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";
import { PackageSearch, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const { filteredProducts, loading, error, deleteProduct } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Reset to page 1 when search results change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
  };

  const confirmDelete = async () => {
    if (selectedProductId) {
      setIsDeleting(true);
      try {
        await deleteProduct(selectedProductId);
        toast({
          title: "Product Deleted",
          description: "The product has been removed successfully.",
          variant: "success",
        });
      } catch (err) {
        toast({
          title: "Deletion Failed",
          description: "Could not delete the product.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setSelectedProductId(null);
      }
    }
  };

  const selectedProduct = filteredProducts.find(p => p._id === selectedProductId);

  if (error && filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">System Error</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
          <RefreshCw size={18} /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-12 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent leading-tight tracking-tight">
          Inventory <span className="text-blue-500">Control</span> Center
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
          The ultimate dashboard for tracking, managing, and scaling your product catalog.
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-16">
        <SearchBar />
      </div>

      {loading && filteredProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500 animate-in fade-in zoom-in duration-500">
          <PackageSearch size={80} className="mb-6 opacity-10" />
          <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
          <p className="text-slate-400">Try adjusting your search or add a new product.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 pb-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    size="icon"
                    className="w-10 h-10 rounded-lg"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modern Confirmation Modal */}
      <AlertDialog open={selectedProductId !== null} onOpenChange={(open) => !open && setSelectedProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="text-white font-semibold">"{selectedProduct?.title}"</span> and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete} loading={isDeleting}>
              Delete Product
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
