import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, Star, ShoppingCart, ShieldCheck,
  Truck, RotateCcw, Loader2, Edit2, Trash2
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../context/ProductContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading: contextLoading, deleteProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const numId = parseInt(id);

    // ── Strategy 1: find in already-loaded local state ──────────────────
    const localProduct = products.find((p) => p.id === numId);
    if (localProduct) {
      setProduct(localProduct);
      setActiveImage(localProduct.thumbnail);
      setLoading(false);
      return;
    }

    // ── Strategy 2: if context is still loading, wait ───────────────────
    if (contextLoading) return; // effect re-runs when products fills up

    // ── Strategy 3: products loaded but not found locally ───────────────
    // Only fetch from API for original DummyJSON IDs (≤ 194)
    if (numId <= 194) {
      setLoading(true);
      fetch(`https://dummyjson.com/products/${numId}`)
        .then((r) => {
          if (!r.ok) throw new Error('Product not found');
          return r.json();
        })
        .then((data: Product) => {
          setProduct(data);
          setActiveImage(data.thumbnail);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // Locally-created product (ID > 194) — not on the server
      setError('Product not found. It may have been deleted.');
      setLoading(false);
    }
  }, [id, products, contextLoading]);

  // ── Handle delete from detail page ────────────────────────────────────
  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
      await deleteProduct(product.id);
      navigate('/');
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading || (contextLoading && !product)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold mb-4 text-red-500">Product Not Found</h2>
        <p className="text-slate-400 mb-8">{error || 'This product does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-all cursor-pointer"
        >
          <ChevronLeft size={18} />
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Back + Action Buttons Row */}
      <div className="flex items-center justify-between mb-8">
        <button
          id="back-btn"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>

        <div className="flex gap-3">
          <button
            id={`detail-edit-btn-${product.id}`}
            onClick={() => navigate(`/edit/${product.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-300 rounded-xl transition-all cursor-pointer text-sm font-semibold"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            id={`detail-delete-btn-${product.id}`}
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 rounded-xl transition-all cursor-pointer text-sm font-semibold"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* ── Gallery ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-white/5">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                id={`gallery-thumb-${idx}`}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === img
                    ? 'border-blue-500 scale-95'
                    : 'border-transparent hover:border-white/20'
                }`}
              >
                <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Info ─────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-bold rounded-full border border-blue-500/20 mb-4 uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white font-bold">{product.rating}</span>
              </div>
              <span>•</span>
              <span className="font-medium">{product.brand || 'N/A'}</span>
              <span>•</span>
              <span
                className={`font-semibold ${
                  product.stock > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="text-4xl font-black mb-8 flex items-baseline gap-2">
            ${product.price}
            <span className="text-lg text-slate-500 line-through font-normal">
              ${(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
            </span>
            <span className="text-sm text-green-400 font-semibold ml-1">
              {product.discountPercentage}% off
            </span>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 pb-8 border-b border-white/5">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
              <ShieldCheck className="text-blue-400" size={24} />
              <div>
                <div className="text-sm font-bold">1 Year Warranty</div>
                <div className="text-xs text-slate-500">Official Brand Warranty</div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
              <Truck className="text-blue-400" size={24} />
              <div>
                <div className="text-sm font-bold">Free Delivery</div>
                <div className="text-xs text-slate-500">On all orders above $100</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              id={`add-to-catalog-btn-${product.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <ShoppingCart size={20} />
              Add to Catalog
            </button>
            <button
              id={`refresh-btn-${product.id}`}
              onClick={() => setActiveImage(product.thumbnail)}
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-colors cursor-pointer"
              title="Reset to main image"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
