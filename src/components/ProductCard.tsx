import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Product } from '../context/ProductContext';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/20 flex flex-col">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-slate-800 relative shrink-0">
        <img
          src={product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600/20 backdrop-blur-md text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-500/30">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors capitalize">
            {product.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 min-h-[2.5rem] leading-relaxed first-letter:uppercase">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-end mb-6 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Price</span>
            <span className="text-2xl font-black text-white">${product.price}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {new Date(product.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-10 px-0 text-xs sm:text-sm"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <ExternalLink size={14} />
            View
          </Button>

          <Button
            variant="secondary"
            className="w-10 h-10 rounded-xl p-0"
            onClick={() => navigate(`/edit/${product._id}`)}
            title="Edit"
          >
            <Edit2 size={16} />
          </Button>

          <Button
            variant="destructive"
            className="w-10 h-10 rounded-xl p-0"
            onClick={() => onDelete(product._id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
