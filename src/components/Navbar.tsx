import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, LogOut } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
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
} from "./ui/AlertDialog";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useProducts();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
      <div className="container mx-auto flex justify-between items-center gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group min-w-0 shrink-0">
          <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
            ProductManager
          </span>
          <span className="sm:hidden text-sm font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
            PM
          </span>
        </Link>

        {/* ── Right side nav ── */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* Nav Links */}
          <Link
            to="/"
            className="hidden sm:block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white font-medium text-sm"
          >
            Home
          </Link>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white font-medium text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:block bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white font-medium text-sm transition-all"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Add Product Link */}
              <Link
                to="/add"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-300 font-medium shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <span className="flex sm:hidden items-center justify-center w-9 h-9 text-white">
                  <Plus size={20} />
                </span>
                <span className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-white">
                  <Plus size={18} />
                  Add Product
                </span>
              </Link>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-slate-400">Welcome,</span>
                  <span className="text-sm font-semibold text-white capitalize">{user?.name}</span>
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all group"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account? You will need to sign in again to manage products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep me signed in</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
