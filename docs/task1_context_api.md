# Product Manager — Mukammal Documentation (Roman Urdu)

> **Audience:** Beginner developers jo React seekh rahe hain.
> Har feature ke saath real code snippet diya gaya hai taake samajhna easy ho.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Entry Point — main.tsx](#3-entry-point--maintsx)
4. [Routing — App.tsx](#4-routing--apptsx)
5. [Global State — ProductContext](#5-global-state--productcontext)
   - 5.1 [Product Interface (TypeScript Type)](#51-product-interface-typescript-type)
   - 5.2 [createContext](#52-createcontext)
   - 5.3 [Custom Hook — useProducts](#53-custom-hook--useproducts)
   - 5.4 [ProductProvider — State Management](#54-productprovider--state-management)
   - 5.5 [fetchProducts — API se Data Lena](#55-fetchproducts--api-se-data-lena)
   - 5.6 [addProduct — Naya Product Add Karna](#56-addproduct--naya-product-add-karna)
   - 5.7 [updateProduct — Product Update Karna](#57-updateproduct--product-update-karna)
   - 5.8 [deleteProduct — Product Delete Karna](#58-deleteproduct--product-delete-karna)
   - 5.9 [filteredProducts — Live Search](#59-filteredproducts--live-search)
6. [Components](#6-components)
   - 6.1 [Navbar](#61-navbar)
   - 6.2 [SearchBar](#62-searchbar)
   - 6.3 [ProductCard](#63-productcard)
   - 6.4 [DeleteModal](#64-deletemodal)
7. [Pages](#7-pages)
   - 7.1 [Home Page](#71-home-page)
   - 7.2 [ProductDetails Page](#72-productdetails-page)
   - 7.3 [ProductForm Page (Add & Edit)](#73-productform-page-add--edit)
8. [React Hook Form — Form Validation](#8-react-hook-form--form-validation)
9. [Shadcn/Radix Select Dropdown](#9-shadcnradix-select-dropdown)
10. [DummyJSON API — Kya Hota Hai?](#10-dummyjson-api--kya-hota-hai)
11. [Important Bug Fix — Pointer Events](#11-important-bug-fix--pointer-events)
12. [Key Terms Glossary](#12-key-terms-glossary)

---

## 1. Project Overview

Ye ek **React + TypeScript** application hai jo products ko manage karne ke liye bani hai.
Is app mein hum:
- Products ki **list dekh sakte hain** (DummyJSON API se)
- Kisi bhi product ki **detail page dekhh sakte hain**
- **Naya product add** kar sakte hain
- Existing product **edit** kar sakte hain
- Product **delete** kar sakte hain
- Products ko **search** kar sakte hain (live filtering)

**Tech Stack:**
| Technology | Kaam |
|---|---|
| React 19 | UI banane ke liye |
| TypeScript | Type safety ke liye |
| React Router v6 | Pages ke beech navigation |
| React Hook Form | Form validation |
| Radix UI / Shadcn | Professional Select dropdown |
| Lucide React | Icons |
| Tailwind CSS | Styling |
| DummyJSON API | Fake REST API for products |

---

## 2. Project Structure

```
src/
├── main.tsx              ← App ka entry point
├── App.tsx               ← Routing setup
├── context/
│   └── ProductContext.tsx ← Global state (Context API)
├── pages/
│   ├── Home.tsx          ← Product list page
│   ├── ProductDetails.tsx ← Single product detail
│   └── ProductForm.tsx   ← Add/Edit form
└── components/
    ├── Navbar.tsx        ← Top navigation bar
    ├── SearchBar.tsx     ← Search input
    ├── ProductCard.tsx   ← Single product card (grid mein)
    ├── DeleteModal.tsx   ← Confirmation popup
    └── ui/
        └── Select.tsx    ← Radix UI dropdown
```

---

## 3. Entry Point — `main.tsx`

Ye sabse pehli file hai jo browser run karta hai. Isme hum poori app ko wrap karte hain providers ke saath.

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>           {/* ← React Router enable karta hai */}
      <ProductProvider>       {/* ← Global state provide karta hai */}
        <App />
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Samajhne wali baatein:**
- `StrictMode` — Development mein extra warnings deta hai bugs dhundhne ke liye.
- `BrowserRouter` — URL-based navigation enable karta hai (e.g. `/product/5`).
- `ProductProvider` — Sabse important: ye global state (products, loading, etc.) ko poori app mein available karta hai.
- **Order important hai:** `BrowserRouter` pehle, `ProductProvider` baad mein.

---

## 4. Routing — `App.tsx`

React Router ke zariye hum alag-alag URLs par alag-alag pages dikhate hain.

```tsx
// App.tsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />  {/* ← Har page par dikhta hai */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/product/:id"   element={<ProductDetails />} />
          <Route path="/add"           element={<ProductForm />} />
          <Route path="/edit/:id"      element={<ProductForm />} />
        </Routes>
      </main>
    </div>
  );
}
```

**Routes ka matlab:**

| URL | Page | Kaam |
|---|---|---|
| `/` | `Home` | Saare products ki grid |
| `/product/5` | `ProductDetails` | ID=5 wale product ki detail |
| `/add` | `ProductForm` | Naya product add karo |
| `/edit/5` | `ProductForm` | ID=5 product edit karo |

**`:id` kya hai?**
Ye ek **dynamic segment** hai. Iska matlab hai ke URL mein koi bhi number aa sakta hai aur wo `:id` mein store ho jata hai. Hum use `useParams()` se pakar sakte hain.

---

## 5. Global State — `ProductContext`

### 5.1 Product Interface (TypeScript Type)

Pehle hum ye define karte hain ke ek `Product` object mein kya kya hoga:

```typescript
// ProductContext.tsx
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;   // ← main image URL
  images: string[];    // ← multiple images ka array
}
```

**Beginner tip:** `interface` TypeScript mein ek "blueprint" hai. Isse TypeScript check karta hai ke jo data aaya hai woh sahi format mein hai ya nahi.

---

### 5.2 `createContext`

Context ek global "store" hai — aik jagah data rakhna taake kisi bhi component se access ho sake.

```typescript
// Context Type — kya kya available hoga context mein
interface ProductContextType {
  products: Product[];                                    // ← tamam products
  loading: boolean;                                       // ← API call chal rahi hai?
  error: string | null;                                   // ← koi error?
  searchTerm: string;                                     // ← user ne kya likha search mein
  filteredProducts: Product[];                            // ← search ke baad filtered list
  setSearchTerm: (term: string) => void;                  // ← search update karna
  fetchProducts: () => Promise<void>;                     // ← API se dobara fetch karna
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

// Context banao — initially undefined
const ProductContext = createContext<ProductContextType | undefined>(undefined);
```

> **`Partial<Product>`** ka matlab: Product ke kuch hi fields required hain, sab nahi. Jab hum form se add/edit karte hain toh sab fields nahi hoti.

---

### 5.3 Custom Hook — `useProducts`

Ye ek helper function hai jo context access karna easy banata hai:

```typescript
// ProductContext.tsx
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  // Agar koi component context ke bahar use kare to error do
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};
```

**Kaise use karte hain:**
```tsx
// Kisi bhi component mein
import { useProducts } from '../context/ProductContext';

function MyComponent() {
  const { products, loading } = useProducts(); // ← itna simple hai!
}
```

> **`useContext` vs Custom Hook:** Seedha `useContext(ProductContext)` bhi use kar sakte hain, lekin custom hook `useProducts` zyada safe hai kyunke ye null check bhi karta hai aur import karna simple hota hai.

---

### 5.4 `ProductProvider` — State Management

Ye wo component hai jo actual data hold karta hai aur sab ko provide karta hai:

```tsx
// ProductContext.tsx
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── Local State ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);       // ← products array
  const [loading, setLoading] = useState<boolean>(false);        // ← loading state
  const [error, setError]     = useState<string | null>(null);   // ← error message
  const [searchTerm, setSearchTerm] = useState<string>('');      // ← search input

  // ... functions ...

  // ── useEffect: App kholte hi products fetch karo ─────────────────────────
  useEffect(() => {
    fetchProducts();
  }, []); // [] = sirf ek baar chalega (mount par)

  return (
    <ProductContext.Provider value={{ /* sab kuch yahan */ }}>
      {children}
    </ProductContext.Provider>
  );
};
```

**`useState` samajhna:**
```tsx
const [products, setProducts] = useState<Product[]>([]);
//         ↑           ↑               ↑           ↑
//      value       updater fn      type         initial value
```

Jab bhi `setProducts(...)` call hota hai, React component dobara render karta hai.

---

### 5.5 `fetchProducts` — API se Data Lena

```typescript
const fetchProducts = async () => {
  setLoading(true);    // ← loader show karo
  setError(null);      // ← purani error clear karo
  
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();  // ← JSON mein convert karo
    setProducts(data.products);          // ← state update karo
  } catch (err) {
    setError('Failed to fetch products');  // ← error save karo
    console.error(err);
  } finally {
    setLoading(false);  // ← loader hatao (chahe success ho ya error)
  }
};
```

**`async/await` kya hai?**
- `async` function ek "promise" return karta hai.
- `await` bolta hai: "yahan ruko jab tak ye operation complete na ho".
- `try/catch` errors handle karta hai — agar network down hai toh crash mat karo.
- `finally` hamesha chalta hai — success ya fail dono case mein.

---

### 5.6 `addProduct` — Naya Product Add Karna

```typescript
const addProduct = async (product: Partial<Product>) => {
  setLoading(true);
  try {
    // DummyJSON ko POST request bhejo
    const response = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),  // ← object ko string mein convert karo
    });
    const data = await response.json();

    // Local uniqueness ensure karo — DummyJSON hamesha same ID deta hai
    const newProduct = {
      ...data,               // ← server se aaya data
      id: Date.now(),        // ← unique ID (timestamp)
      images: product.images || [product.thumbnail || ''],
      rating: 0,
      stock: 10,
      brand: 'Generic'
    };

    // Naye product ko list ke UPAR add karo
    setProducts((prev) => [newProduct, ...prev]);
  } catch (err) {
    setError('Failed to add product');
  } finally {
    setLoading(false);
  }
};
```

**`Date.now()`** — current time milliseconds mein. Isko ID isliye use karte hain kyunke ye hamesha unique hota hai.

**`...data` (Spread Operator)** — iska matlab hai: "data ke saare properties copy karo aur phir jo hum override karna chahte hain unhe likho".

---

### 5.7 `updateProduct` — Product Update Karna

```typescript
const updateProduct = async (id: number, updatedData: Partial<Product>) => {
  setLoading(true);
  try {
    let data = updatedData;

    // ── DummyJSON sirf ID <= 100 wale products accept karta hai ──────────
    if (id <= 100) {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',                               // ← update ke liye PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        data = await response.json();
      }
    }
    // ID > 100 → locally added product → direct state update (no API call)

    // Local state mein update karo
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      //               ↑ agar ye product hai to merge karo, warna same rakho
    );
  } catch (err) {
    setError('Failed to update product');
  } finally {
    setLoading(false);
  }
};
```

**`.map()` ka use:** Poori array mein se sirf woh product update karo jiska ID match kare — baaki sab waisi hi rahein.

---

### 5.8 `deleteProduct` — Product Delete Karna

```typescript
const deleteProduct = async (id: number) => {
  setLoading(true);
  try {
    // Server par sirf original products (ID <= 100) exist karte hain
    if (id <= 100) {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });
    }

    // Local state se hamesha remove karo
    setProducts((prev) => prev.filter((p) => p.id !== id));
    //                              ↑ sirf woh products rakho jinki ID match nahi karti
  } catch (err) {
    setError('Failed to delete product');
  } finally {
    setLoading(false);
  }
};
```

**`.filter()` ka use:** Ek naya array banata hai jisme woh items nahi hote jo condition fail karein.

> **DummyJSON Limitation:** DummyJSON ek fake/mock API hai. DELETE call karne ke baad bhi actual server par product delete nahi hota. Hum sirf **local state** (memory) se hata dete hain. Page refresh karne par sab wapis aa jata hai.

---

### 5.9 `filteredProducts` — Live Search

```typescript
// ProductContext.tsx
const filteredProducts = products.filter((product) =>
  product.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

**Ye kaise kaam karta hai:**
1. User SearchBar mein kuch type karta hai → `setSearchTerm` call hoti hai.
2. `searchTerm` update hoti hai → context re-render hota hai.
3. `filteredProducts` dobara calculate hoti hai — sirf woh products jinka title, search term contain kare.
4. `Home` page automatically updated list dikhata hai.

> `.toLowerCase()` dono taraf isliye lagate hain taake "iPhone" aur "iphone" dono match karein (case-insensitive search).

---

## 6. Components

### 6.1 `Navbar`

Har page ke upar sticky navigation bar.

```tsx
// Navbar.tsx
import { Link } from 'react-router-dom';
import { Package, Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo — Home page par jata hai */}
        <Link to="/" className="flex items-center gap-2 group">
          <Package size={20} />
          <span>ProductManager</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/add">
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

**`Link` vs `<a>` tag:**
- `<a href="/add">` → page **reload** ho jata hai (full page refresh).
- `<Link to="/add">` → React Router sirf component change karta hai, **reload nahi hota** — ye zyada fast hai.

---

### 6.2 `SearchBar`

Real-time search input jo Context se connected hai.

```tsx
// SearchBar.tsx
import { useProducts } from '../context/ProductContext';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useProducts();

  return (
    <div className="relative max-w-2xl mx-auto mb-12">
      <input
        type="text"
        value={searchTerm}           // ← controlled input (Context se value)
        onChange={(e) => setSearchTerm(e.target.value)}  // ← har keystroke par update
        placeholder="Search for premium products..."
      />
    </div>
  );
}
```

**Controlled Input kya hai?**
- `value={searchTerm}` → input ki value React state se aati hai.
- `onChange` → user ke type karne par state update hoti hai.
- Ye **one-way data flow** hai — React ko hamesha pata hota hai input mein kya hai.

---

### 6.3 `ProductCard`

Grid mein har product ki card.

```tsx
// ProductCard.tsx
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Product } from '../context/ProductContext';

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;  // ← parent se aata hai (Home.tsx)
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const navigate = useNavigate();  // ← programmatically navigate karna

  return (
    <div className="group relative bg-slate-900/40 ... hover:-translate-y-2">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-slate-800">
        <img src={product.thumbnail} alt={product.title} />
        
        {/* ⚠️ IMPORTANT: pointer-events-none ZAROOR lagao overlay par */}
        <div className="absolute inset-0 bg-gradient-to-t ... pointer-events-none" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={() => navigate(`/product/${product.id}`)}>
          Details
        </button>
        <button onClick={() => navigate(`/edit/${product.id}`)}>
          <Edit2 />
        </button>
        <button onClick={() => onDelete(product.id)}>
          <Trash2 />
        </button>
      </div>
    </div>
  );
}
```

**`useNavigate`** — Programmatic navigation ke liye. Button click par URL change karo bina `<Link>` ke.

**`Props`** — Parent se child component ko data bhejne ka tarika. Yahan `product` aur `onDelete` props hain.

**`group` / `group-hover`** — Tailwind ka feature. Jab parent card (`group`) par hover ho to child elements ke styles change ho sakti hain (`group-hover:scale-110`).

---

### 6.4 `DeleteModal`

Confirmation popup jo delete se pehle dikhta hai.

```tsx
// DeleteModal.tsx
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, productName }: DeleteModalProps) {
  // Agar modal open nahi hai to kuch bhi render mat karo
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop — click karo to close */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
           onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-slate-900 ... rounded-3xl p-8">
        <h2>Delete Product?</h2>
        <p>Are you sure you want to delete "<strong>{productName}</strong>"?</p>

        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Delete</button>  {/* ← actual delete */}
      </div>
    </div>
  );
}
```

**`fixed inset-0`** — Modal ko poore screen par spread karta hai.
**`z-[60]`** — Z-index (layer order). Jitna zyada, upar dikhega — Navbar se bhi upar.
**`if (!isOpen) return null`** — React mein agar null return karo to component render nahi hota.

---

## 7. Pages

### 7.1 Home Page

Products ki grid, search bar, aur delete modal.

```tsx
// Home.tsx
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';

export default function Home() {
  const { filteredProducts, loading, error, deleteProduct } = useProducts();
  
  // Confirm karne se pehle selected product ka ID store karo
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Step 1: Card ka delete button click → modal kholo
  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);  // ← modal open ho jayega
  };

  // Step 2: Modal mein "Delete" click → actual delete karo
  const confirmDelete = async () => {
    if (selectedProductId) {
      await deleteProduct(selectedProductId);
      setSelectedProductId(null);  // ← modal band karo
    }
  };

  // Error UI
  if (error) return <div>Something went wrong: {error}</div>;

  return (
    <div>
      {/* Loading Spinner */}
      {loading && filteredProducts.length === 0 ? (
        <Loader2 className="animate-spin" />

      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>

      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}            // ← React ki zaroorat: unique key
              product={product}
              onDelete={handleDeleteClick} // ← function pass karo as prop
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
        onConfirm={confirmDelete}
        productName={filteredProducts.find(p => p.id === selectedProductId)?.title || ''}
      />
    </div>
  );
}
```

**`key` prop kyu zaroor hai?**
Jab hum list render karte hain, React ko har item ke liye unique identifier chahiye taake efficiently update kar sake. Bina `key` ke React ko nahi pata kya change hua.

**`?.` (Optional Chaining):** `product?.title` — agar `product` undefined hai to crash nahi hoga, sirf `undefined` return karega.

---

### 7.2 `ProductDetails` Page

Kisi bhi product ki full detail page — dynamic routing use karti hai.

```tsx
// ProductDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();  // ← URL se ID nikalo
  const navigate = useNavigate();
  const { products, loading: contextLoading, deleteProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>(''); // ← gallery selected image

  useEffect(() => {
    if (!id) return;
    const numId = parseInt(id);  // ← string to number

    // ── Strategy 1: Local state mein dhundho (sabse fast) ────────────────
    const localProduct = products.find((p) => p.id === numId);
    if (localProduct) {
      setProduct(localProduct);
      setActiveImage(localProduct.thumbnail);
      setLoading(false);
      return;  // ← yahan rok lo, API call ki zaroorat nahi
    }

    // ── Strategy 2: Context abhi load ho raha hai — wait karo ───────────
    if (contextLoading) return;

    // ── Strategy 3: API se fetch karo (original products ke liye) ───────
    if (numId <= 194) {
      fetch(`https://dummyjson.com/products/${numId}`)
        .then((r) => { if (!r.ok) throw new Error('Not found'); return r.json(); })
        .then((data: Product) => {
          setProduct(data);
          setActiveImage(data.thumbnail);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      // Locally created product (ID > 194) server par nahi hai
      setError('Product not found. It may have been deleted.');
      setLoading(false);
    }
  }, [id, products, contextLoading]); // ← dependencies: in badalney par re-run karo

  // Image gallery — click karo to active image change karo
  const handleImageClick = (img: string) => setActiveImage(img);

  // Delete from detail page
  const handleDelete = async () => {
    if (!product) return;
    if (window.confirm(`Delete "${product.title}"?`)) {
      await deleteProduct(product.id);
      navigate('/');  // ← delete ke baad home par jao
    }
  };
}
```

**`useParams`** — URL ke dynamic parts nikaalta hai. `/product/42` se `{ id: "42" }` milta hai.

**`useEffect` Dependencies Array:**
```tsx
useEffect(() => { /* ... */ }, [id, products, contextLoading]);
//                                ↑ in mein se koi bhi change ho to dobara run karo
```

**3-Strategy Pattern** (senior dev approach):
1. Local state mein dhundho → fastest, no network call
2. Context load ho raha hai → wait karo (race condition avoid)
3. API fetch karo → sirf jab zaroor ho

---

### 7.3 `ProductForm` Page (Add & Edit)

Ek hi component hai Add aur Edit dono ke liye. `isEditMode` se decide hota hai.

```tsx
// ProductForm.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useProducts } from '../context/ProductContext';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, products, loading: contextLoading } = useProducts();
  
  const isEditMode = Boolean(id);  // ← agar URL mein ID hai to Edit mode hai

  const [previewImage, setPreviewImage] = useState<string>('...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productLoaded, setProductLoaded] = useState(false);

  // ── React Hook Form setup ────────────────────────────────────────────────
  const {
    register,      // ← input ko form se connect karo
    handleSubmit,  // ← form submit handle karo
    setValue,      // ← manually field ki value set karo
    reset,         // ← form ko new values se re-initialize karo
    control,       // ← Controller component ke liye
    formState: { errors },  // ← validation errors
  } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      price: 0,
      category: '',
      description: '',
      thumbnail: '...',
    },
  });

  // ── Edit mode: existing data form mein load karo ─────────────────────────
  useEffect(() => {
    if (!isEditMode || !id) return;
    if (products.length === 0 && contextLoading) return;  // ← wait karo

    const existingProduct = products.find((p) => p.id === parseInt(id));
    if (existingProduct && !productLoaded) {
      reset({  // ← form ko existing values se fill karo
        title: existingProduct.title,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.description,
        thumbnail: existingProduct.thumbnail,
      });
      setPreviewImage(existingProduct.thumbnail);
      setProductLoaded(true);  // ← dobara load mat karo
    }
  }, [id, isEditMode, products, reset, contextLoading, productLoaded]);

  // ── Image upload handler ─────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);  // ← local file ka temporary URL
      setPreviewImage(objectUrl);
      setValue('thumbnail', objectUrl);  // ← form field update karo
    }
  };

  // ── Form submit ──────────────────────────────────────────────────────────
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateProduct(parseInt(id), data);
      } else {
        await addProduct(data);
      }
      navigate('/');  // ← success par home jao
    } catch {
      setServerError('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
}
```

---

## 8. React Hook Form — Form Validation

**React Hook Form (RHF)** form handling aur validation ko simple banata hai.

### `register` — Input Fields

```tsx
<input
  id="product-title"
  {...register('title', {
    required: 'Title is required',          // ← required validation
    minLength: { value: 3, message: 'Minimum 3 characters' },
  })}
  placeholder="e.g. iPhone 15 Pro"
/>
{/* Error show karo */}
{errors.title && <p className="text-red-400">{errors.title.message}</p>}
```

**`{...register('title', {...})}`** — ye `name`, `onChange`, `onBlur`, `ref` automatically set karta hai.

### `Controller` — Custom / Third-party Inputs

Radix UI Select jaise custom components ko RHF se connect karne ke liye `Controller` use hota hai:

```tsx
<Controller
  name="category"      // ← form field ka naam
  control={control}    // ← useForm se aaya control object
  rules={{ required: 'Category is required' }}
  render={({ field }) => (
    <Select
      value={field.value}
      onValueChange={(val) => field.onChange(val)}  // ← RHF ko batao value change hui
    >
      {/* ... */}
    </Select>
  )}
/>
```

### `handleSubmit`

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  {/* ...fields... */}
</form>
```

`handleSubmit(onSubmit)` pehle validation run karta hai. Agar sab valid hai tabhi `onSubmit` call hota hai.

### `reset`

```tsx
reset({ title: 'iPhone', price: 999 });
// ← Form ke saare fields ek baar mein update ho jate hain
```

---

## 9. Shadcn/Radix Select Dropdown

Category field ke liye hum ek professional accessible dropdown use karte hain.

```tsx
import {
  Select, SelectContent, SelectGroup,
  SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '../components/ui/Select';

// Usage
<Select value={field.value} onValueChange={(val) => field.onChange(val)}>
  <SelectTrigger id="product-category">
    <SelectValue placeholder="Select a category…" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Categories</SelectLabel>
      {CATEGORIES.map((cat) => (
        <SelectItem key={cat} value={cat}>
          {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          {/*  ↑ "mens-shoes" → "Mens Shoes"  */}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

**String transformation:**
```javascript
"mens-shoes"
  .replace(/-/g, ' ')           // → "mens shoes"
  .replace(/\b\w/g, c => c.toUpperCase())  // → "Mens Shoes"
```

---

## 10. DummyJSON API — Kya Hota Hai?

[DummyJSON](https://dummyjson.com) ek free **mock/fake REST API** hai testing ke liye.

| Operation | Method | URL |
|---|---|---|
| Saare products fetch karo | `GET` | `https://dummyjson.com/products` |
| Ek product fetch karo | `GET` | `https://dummyjson.com/products/{id}` |
| Naya product add karo | `POST` | `https://dummyjson.com/products/add` |
| Product update karo | `PUT` | `https://dummyjson.com/products/{id}` |
| Product delete karo | `DELETE` | `https://dummyjson.com/products/{id}` |

**Limitations (Important!):**
- DummyJSON **permanently kuch save nahi karta** — ye sirf response simulate karta hai.
- ID range: DummyJSON par sirf 1–194 range ke products exist karte hain.
- Hum locally added products ke liye `Date.now()` se ID generate karte hain (usually > 1700000000000), jo server par kabhi exist nahi hoti.

**Isliye humary rules:**
```typescript
if (id <= 100)  → API call karo (update/delete)
if (id <= 194)  → API se detail fetch karo
if (id >  194)  → sirf local state use karo
```

---

## 11. Important Bug Fix — Pointer Events

### Problem

```tsx
{/* ❌ GALAT — ye overlay poori card par bichha hai aur sab clicks kha jata hai */}
<div className="absolute inset-0 bg-gradient-to-t from-slate-950 opacity-60" />
```

`absolute inset-0` ka matlab hai ye div poori card ke upar hai. CPU ke nazariye se ye **top-most element** hai — sab mouse events (hover, click) is par land hote hain, buttons tak nahi pahunch pate.

### Solution

```tsx
{/* ✅ SAHI — pointer-events-none lagao taake clicks through ho jayein */}
<div className="absolute inset-0 bg-gradient-to-t from-slate-950 opacity-60 pointer-events-none" />
```

`pointer-events-none` CSS property se ye element sirf visual hai — koi bhi mouse event is par nahi ata, sab neeche ke elements tak pahunch jate hain.

**Senior Dev Rule:**
> Koi bhi decorative `absolute`/`fixed` overlay jo interactive elements ke upar ho — **hamesha `pointer-events-none` lagao**.

---

## 12. Key Terms Glossary

| Term | Matlab |
|---|---|
| **Context API** | React ka built-in global state system — props drilling se bachata hai |
| **useState** | Component ke andar local state rakhne ka hook |
| **useEffect** | Side effects (API calls, subscriptions) ke liye — render ke baad chalta hai |
| **useParams** | URL ke dynamic segments (`:id`) nikaalne ka hook |
| **useNavigate** | Programmatically page navigate karne ka hook |
| **Props** | Parent se child component ko data pass karne ka tarika |
| **TypeScript Interface** | Object ki shape define karna — type safety ke liye |
| **Partial\<T\>** | TypeScript type: saare fields optional ho jate hain |
| **async/await** | Asynchronous code ko synchronous style mein likhne ka tarika |
| **REST API** | HTTP methods (GET/POST/PUT/DELETE) use karne wala API standard |
| **Controlled Input** | Input jiska value React state se controlled ho |
| **pointer-events-none** | CSS: element mouse events nahi receive karta |
| **Dynamic Route** | URL segment jo badle (e.g. `/product/:id`) |
| **Mock API** | Fake API jo production data simulate kare (e.g. DummyJSON) |
| **Spread Operator** | `...obj` — object/array ki saari properties copy karna |
| **Optional Chaining** | `obj?.prop` — safe access, undefined par crash nahi karta |
| **useForm** | React Hook Form ka main hook — form state manage karta hai |
| **Controller** | RHF ka component — custom inputs ko form se connect karta hai |
| **z-index** | CSS layer ordering — bara number = upar dikhega |
| **backdrop-blur** | CSS: peeche ki cheeze blur hongi (glassmorphism effect) |

---

> **Yaad rakho:** Ye documentation live codebase ka reflection hai. Koi bhi feature change karo to yahan update karna mat bhoolna. Good documentation = good team culture. 🚀
