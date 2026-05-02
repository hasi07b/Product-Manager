import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Package, ShieldCheck,
  Truck, Edit2, Trash2, Calendar
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../context/ProductContext';
import { productApi } from '../lib/api';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading: contextLoading, deleteProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const localProduct = products.find((p) => p._id === id);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
      return;
    }

    setLoading(true);
    productApi.getById(id)
      .then((response) => {
        setProduct(response.data);
        setError(null);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id, products, contextLoading]);

  const handleDelete = async () => {
    if (!product) return;
    try {
      await deleteProduct(product._id);
      toast({
        title: "Product Deleted",
        description: "Redirecting to inventory...",
        variant: "success",
      });
      navigate('/');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  if (loading || (contextLoading && !product)) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <Skeleton className="h-10 w-40 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square rounded-[3rem]" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
        <h2 className="text-4xl font-black mb-4 text-white">Product Not Found</h2>
        <p className="text-slate-400 mb-8 text-lg">{error || 'This product does not exist.'}</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ChevronLeft className="mr-2" size={18} />
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group self-start"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(`/edit/${product._id}`)}
            className="flex-1 sm:flex-none"
          >
            <Edit2 size={16} />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-4">
        {/* Product Image */}
        <div className="relative group">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
            <img
              src={product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col pt-4">
          <span className="inline-block px-4 py-1.5 bg-blue-600/10 text-blue-400 text-xs font-black uppercase tracking-widest rounded-full border border-blue-500/20 mb-6 self-start">
            {product.category}
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight capitalize">
            {product.title}
          </h1>

          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase mb-1">Price</span>
              <span className="text-4xl font-black text-white">${product.price}</span>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                <Calendar size={12} /> Created
              </span>
              <span className="text-lg font-bold text-slate-300">
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 first-letter:uppercase">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
              <ShieldCheck className="text-blue-400" size={24} />
              <div>
                <div className="text-sm font-bold text-white">Verified Item</div>
                <div className="text-xs text-slate-500">Quality Checked</div>
              </div>
            </div>
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
              <Truck className="text-blue-400" size={24} />
              <div>
                <div className="text-sm font-bold text-white">Ready to Ship</div>
                <div className="text-xs text-slate-500">Global Coverage</div>
              </div>
            </div>
          </div>

          <Button className="h-16 text-lg font-black tracking-wide" variant="default" onClick={() => navigate('/')}>
            <Package size={20} />
            Inventory Dashboard
          </Button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="text-white font-semibold">"{product.title}"</span>? This action is permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
