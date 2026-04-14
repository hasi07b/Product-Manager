import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Product } from '../context/ProductContext';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-slate-900/60 hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-slate-800">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold line-clamp-1 group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20 shrink-0 ml-2">
            {product.category}
          </span>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-black text-white">${product.price}</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < Math.round(product.rating) ? 'bg-yellow-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* ── Details button — dynamic route with product.id ── */}
          <button
            id={`details-btn-${product.id}`}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 hover:cursor-pointer text-white p-3 rounded-xl transition-colors text-sm font-semibold cursor-pointer"
          >
            <ExternalLink size={16} />
            Details
          </button>

          {/* ── Edit button — dynamic route with product.id ── */}
          <button
            id={`edit-btn-${product.id}`}
            onClick={() => navigate(`/edit/${product.id}`)}
            className="p-3 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 rounded-xl transition-all cursor-pointer"
            title="Edit product"
          >
            <Edit2 size={18} />
          </button>

          {/* ── Delete button ── */}
          <button
            id={`delete-btn-${product.id}`}
            onClick={() => onDelete(product.id)}
            className="p-3 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 rounded-xl transition-all cursor-pointer"
            title="Delete product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
