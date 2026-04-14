import { Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useProducts();

  return (
    <div className="relative max-w-2xl mx-auto mb-12 group">
      <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex items-center">
        <Search className="absolute left-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for premium products..."
          className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
