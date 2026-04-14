# Task 2: Routing Setup (Roman Urdu)

App mein multiple pages (Home, Details, Add, Edit) ke beech navigate karne ke liye
humne `react-router-dom` ka istemal kiya hai.

## Key Concepts

1. **BrowserRouter** — Poori app ko routing enable karne ke liye HTML5 history API use karta hai.
2. **Routes & Route** — Batate hain ke kis URL path par kaunsa component render ho.
3. **`useNavigate`** — Programmatically ek route se doosre par jaane ke liye (preferred over `<Link>` for buttons).
4. **`useParams`** — Dynamic URL segments (`:id`) se value extract karta hai.

---

## Routing Structure

| URL Path | Component | Description |
|---|---|---|
| `/` | `Home` | Product list + search |
| `/product/:id` | `ProductDetails` | Dynamic detail page |
| `/add` | `ProductForm` | New product form |
| `/edit/:id` | `ProductForm` | Edit existing product |

---

## App.tsx Routes

```tsx
<Routes>
  <Route path="/"            element={<Home />} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/add"         element={<ProductForm />} />
  <Route path="/edit/:id"    element={<ProductForm />} />
</Routes>
```

---

## Dynamic ID Routing — Kaise Kaam Karta Hai?

`ProductCard` mein har product ke button par **product ka actual ID** pass hota hai:

```tsx
// ✅ Dynamic — har product ka apna ID
<button onClick={() => navigate(`/product/${product.id}`)}>Details</button>
<button onClick={() => navigate(`/edit/${product.id}`)}>Edit</button>
```

`ProductDetails` aur `ProductForm` mein:
```tsx
const { id } = useParams<{ id: string }>();
const numId = parseInt(id); // URL string → number
```

---

## main.tsx Setup

```tsx
<BrowserRouter>
  <ProductProvider>
    <App />
  </ProductProvider>
</BrowserRouter>
```

`BrowserRouter` aur `ProductProvider` dono wrap kiye hue hain taake routing aur
global state dono mil sakein across sari app.
