import { Link } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
      <div className="container mx-auto flex justify-between items-center gap-4">

        {/* ── Logo (always visible) ── */}
        <Link to="/" className="flex items-center gap-2 group min-w-0 shrink-0">
          <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors shrink-0">
            <Package size={18} className="text-white" />
          </div>
          {/* Full name on sm+, abbreviated on mobile */}
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
            ProductManager
          </span>
          <span className="sm:hidden text-sm font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
            PM
          </span>
        </Link>

        {/* ── Right side nav ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Home — only on sm+ */}
          <Link
            to="/"
            className="hidden sm:block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white font-medium text-sm whitespace-nowrap"
          >
            Home
          </Link>

          {/* Add Product: icon-only pill on mobile, full button on sm+ */}
          <Link
            to="/add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {/* Mobile: square icon button */}
            <span className="flex sm:hidden items-center justify-center w-9 h-9">
              <Plus size={20} />
            </span>
            {/* Desktop: full label */}
            <span className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm">
              <Plus size={18} />
              Add Product
            </span>
          </Link>

        </div>
      </div>
    </nav>
  );
}
