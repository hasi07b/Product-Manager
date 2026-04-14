import { Link } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <Package size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ProductManager
          </span>
        </Link>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white font-medium"
          >
            Home
          </Link>
          <Link
            to="/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
