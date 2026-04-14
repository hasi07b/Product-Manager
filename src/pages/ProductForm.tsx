import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useProducts } from '../context/ProductContext';
import {
  Save, X, Package, DollarSign, Tag, Info, Loader2,
  Image as ImageIcon, Upload, ChevronLeft
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';

// DummyJSON product categories
const CATEGORIES = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
];

interface ProductFormData {
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, products, loading: contextLoading } = useProducts();
  const isEditMode = Boolean(id);

  const [previewImage, setPreviewImage] = useState<string>(
    'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [productLoaded, setProductLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    // watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    },
  });

  // ─── FIX: Populate form once products are loaded for edit mode ───────────────
  useEffect(() => {
    if (!isEditMode || !id) return;

    // Wait until products array is populated (either from API or already in state)
    if (products.length === 0 && contextLoading) return;

    const existingProduct = products.find((p) => p.id === parseInt(id));
    if (existingProduct && !productLoaded) {
      reset({
        title: existingProduct.title,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.description,
        thumbnail: existingProduct.thumbnail,
      });
      setPreviewImage(existingProduct.thumbnail);
      setServerError(null);
      setProductLoaded(true);
    } else if (!contextLoading && !existingProduct && !productLoaded) {
      // Products loaded but this ID not found — try fetching from API for IDs ≤ 100
      const numId = parseInt(id);
      if (numId <= 100) {
        fetch(`https://dummyjson.com/products/${numId}`)
          .then((r) => r.json())
          .then((data) => {
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
          .catch(() => setServerError('Product not found.'));
      } else {
        setServerError('Product not found.');
      }
    }
  }, [id, isEditMode, products, reset, contextLoading, productLoaded]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setValue('thumbnail', objectUrl);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (isEditMode && id) {
        await updateProduct(parseInt(id), data);
      } else {
        await addProduct(data);
      }
      navigate('/');
    } catch {
      setServerError('Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show spinner while waiting for product data in edit mode
  if (isEditMode && contextLoading && !productLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-20">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group cursor-pointer"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </button>

      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-slate-400 text-lg">
          {isEditMode
            ? 'Refine your inventory with precision and style.'
            : 'Expand your catalog with a new premium item.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        {serverError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-medium">
            {serverError}
          </div>
        )}

        {/* ── Image Upload ─────────────────────────────────────────────────── */}
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
            <h3 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
              <ImageIcon className="text-blue-400" size={20} />
              Product Visual
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload a high-quality product image. Supported formats: PNG, JPG, WEBP.
              <br />
              Max size suggested: 2MB.
            </p>
            <input
              type="hidden"
              {...register('thumbnail', { required: 'Thumbnail is required' })}
            />
            {errors.thumbnail && (
              <span className="text-red-400 text-xs">{errors.thumbnail.message}</span>
            )}
          </div>
        </div>

        {/* ── Fields Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {/* Title */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
              <Package size={16} className="text-blue-400" />
              Product Title
            </label>
            <input
              id="product-title"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
              })}
              placeholder="e.g. iPhone 15 Pro"
              className={`w-full bg-slate-950/50 border ${
                errors.title ? 'border-red-500/50' : 'border-white/10'
              } rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all`}
            />
            {errors.title && (
              <p className="text-red-400 text-xs ml-1 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
              <DollarSign size={16} className="text-blue-400" />
              Price (USD)
            </label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' },
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className={`w-full bg-slate-950/50 border ${
                errors.price ? 'border-red-500/50' : 'border-white/10'
              } rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all`}
            />
            {errors.price && (
              <p className="text-red-400 text-xs ml-1 font-medium">{errors.price.message}</p>
            )}
          </div>

          {/* Category — shadcn/Radix Select Dropdown */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
              <Tag size={16} className="text-blue-400" />
              Category
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger
                    id="product-category"
                    className={errors.category ? 'border-red-500/50' : ''}
                  >
                    <SelectValue placeholder="Select a category…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-400 text-xs ml-1 font-medium">{errors.category.message}</p>
            )}
          </div>

          {/* Pro tip card */}
          <div className="p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 flex items-start gap-4">
            <Info className="text-blue-400 shrink-0" size={24} />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Pro Tip:</strong> Use a descriptive title for better search visibility.
              Choose the closest category from the list to keep your catalog organised.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-400 ml-1">
            <Info size={16} className="text-blue-400" />
            Description
          </label>
          <textarea
            id="product-description"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'At least 10 characters required' },
            })}
            rows={5}
            placeholder="Describe the product details and key features…"
            className={`w-full bg-slate-950/50 border ${
              errors.description ? 'border-red-500/50' : 'border-white/10'
            } rounded-3xl px-6 py-4 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none shadow-inner`}
          />
          {errors.description && (
            <p className="text-red-400 text-xs ml-1 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 pt-6">
          <button
            type="button"
            id="cancel-btn"
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-white/5 hover:bg-white/10 rounded-[1.5rem] font-bold transition-all group cursor-pointer"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Cancel
          </button>
          <button
            type="submit"
            id="submit-btn"
            disabled={isSubmitting || contextLoading}
            className="flex-[2] flex items-center justify-center gap-2 px-8 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-[1.5rem] text-white font-bold transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 cursor-pointer"
          >
            {isSubmitting || contextLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
