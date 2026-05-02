import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, loading } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      toast({
        title: "Login Successful",
        description: "Welcome back to Product Manager!",
        variant: "success",
      });
      navigate('/');
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900 rounded-3xl shadow-2xl border border-white/10">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
      <p className="text-center text-slate-400 mb-8">Login to your account to continue</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5 ml-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full h-12 text-lg font-bold"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors underline-offset-4 hover:underline">
          Create one now
        </Link>
      </p>
    </div>
  );
};

export default Login;
