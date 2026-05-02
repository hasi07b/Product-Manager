import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProducts } from '../context/ProductContext';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/use-toast';
import {
  Package, DollarSign, Tag, Info, Loader2,
  Image as ImageIcon, Upload, ChevronLeft
} from 'lucide-react';
import { productApi } from '../lib/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';

const CATEGORIES = [
  'beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration',
  'kitchen-accessories', 'laptops', 'mobile-accessories', 'smartphones',
  'tablets', 'tops', 'vehicle'
];

// Zod Schema for validation
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title too long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnail: z.string().min(1, "Product image is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, products, loading: contextLoading } = useProducts();
  const { toast } = useToast();
  const isEditMode = Boolean(id);

  const [previewImage, setPreviewImage] = useState<string>(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
  );
  const [productLoaded, setProductLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
  });

  useEffect(() => {
    if (!isEditMode || !id) return;
    if (products.length === 0 && contextLoading) return;

    const existingProduct = products.find((p) => p._id === id);
    if (existingProduct && !productLoaded) {
      reset({
        title: existingProduct.title,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.description,
        thumbnail: existingProduct.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      });
      setPreviewImage(existingProduct.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
      setProductLoaded(true);
    } else if (!contextLoading && !existingProduct && !productLoaded) {
      productApi.getById(id)
        .then((response) => {
          const data = response.data;
          reset({
            title: data.title,
            price: data.price,
            category: data.category,
            description: data.description,
            thumbnail: data.thumbnail,
          });
          setPreviewImage(data.thumbnail);
          setProductLoaded(true);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Product not found.",
            variant: "destructive",
          });
          navigate('/');
        });
    }
  }, [id, isEditMode, products, reset, contextLoading, productLoaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setValue('thumbnail', base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditMode && id) {
        await updateProduct(id, data);
        toast({
          title: "Success",
          description: "Product updated successfully!",
          variant: "success",
        });
      } else {
        await addProduct(data);
        toast({
          title: "Success",
          description: "Product created successfully!",
          variant: "success",
        });
      }
      navigate('/');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditMode && contextLoading && !productLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-16 px-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </button>

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
          {isEditMode ? 'Edit Product' : 'New Product'}
        </h1>
        <p className="text-slate-400 text-lg">
          Fill in the details below to {isEditMode ? 'update' : 'create'} a product.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 bg-slate-900 border border-white/10 p-6 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Image Selection Area */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start pb-8 border-b border-white/5">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[2rem] overflow-hidden bg-slate-800 border-2 border-dashed border-white/10 group-hover:border-blue-500/50 transition-all shadow-inner">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-white" size={32} />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  Change Image
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left pt-4">
            <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2 text-white">
              <ImageIcon className="text-blue-400" size={20} />
              Product Visual
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload a high-quality product image to attract customers.
            </p>
            {errors.thumbnail && (
              <span className="text-red-500 text-xs font-medium bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                {errors.thumbnail.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
              <Package size={16} className="text-blue-500" />
              Title
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Premium Smart Watch"
              className={`w-full bg-slate-950 border ${errors.title ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
            />
            {errors.title && <p className="text-red-500 text-xs ml-1 font-medium">{errors.title.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
              <DollarSign size={16} className="text-blue-500" />
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              className={`w-full bg-slate-950 border ${errors.price ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
            />
            {errors.price && <p className="text-red-500 text-xs ml-1 font-medium">{errors.price.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
              <Tag size={16} className="text-blue-500" />
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={`bg-slate-950 border ${errors.category ? 'border-red-500' : 'border-white/10'} rounded-2xl h-14`}>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat.replace(/-/g, ' ').toUpperCase()}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-red-500 text-xs ml-1 font-medium">{errors.category.message}</p>}
          </div>
          
          <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-start gap-4 self-start">
            <Info className="text-blue-500 shrink-0" size={24} />
            <p className="text-xs text-slate-400">
              Senior Tip: Keep your title concise but descriptive. Zod validation ensures high-quality data.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 ml-1">
            <Info size={16} className="text-blue-500" />
            Description
          </label>
          <textarea
            {...register('description')}
            rows={5}
            className={`w-full bg-slate-950 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-3xl px-6 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none`}
            placeholder="Tell us everything about this product..."
          />
          {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1 h-14 text-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={contextLoading}
            className="flex-[2] h-14 text-lg font-black tracking-wide"
          >
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
