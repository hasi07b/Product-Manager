# Task 5: Product Details Page (Roman Urdu)

Is page par kisi bhi ek product ki poori detail dikhayi jati hai jab user "Details" button par click karta hai.

## Dynamic Route

Route `App.tsx` mein define hai:
```tsx
<Route path="/product/:id" element={<ProductDetails />} />
```
`:id` ek dynamic segment hai jo URL se product ID extract karta hai. Har product card ka
button `navigate(\`/product/\${product.id}\`)` call karta hai — ye ID automatically set hoti hai.

---

## Three-Tier Data Fetching Strategy

Pehle wale implementation mein ek race-condition bug tha. Ab hum teen scenarios handle karte hain:

| Scenario | Kya Hota Hai |
|---|---|
| Product local state mein mil gaya | Seedha state se render karo |
| Context abhi loading hai | Wait karo — `useEffect` dobara chalega jab `products` fill ho |
| Products load ho gaye par ID nahi mili | DummyJSON API se fetch karo (sirf IDs ≤ 194) |
| Locally-created product (ID > 194) nahi mila | Error message dikhao |

```tsx
useEffect(() => {
  const localProduct = products.find(p => p.id === numId);
  if (localProduct) { setProduct(localProduct); return; }
  if (contextLoading) return; // wait for state to fill
  if (numId <= 194) { /* fetch from API */ }
  else { setError('Product not found.'); }
}, [id, products, contextLoading]);
```

---

## Key Features

1. **Dynamic Image Gallery** — Thumbnail images par click karke main picture change hoti hai.
2. **Edit & Delete Buttons** — Detail page par directly product edit ya delete kiya ja sakta hai.
3. **Price + Discount** — Original price, discounted price aur discount % clearly dikhaya gaya.
4. **Stock Info** — Stock > 0 → green badge; Stock = 0 → red "Out of stock".
5. **`cursor-pointer`** — Gallery thumbnails, back button, edit/delete, sab par pointer cursor.
6. **Unique Button IDs** — `detail-edit-btn-{id}`, `detail-delete-btn-{id}`, `gallery-thumb-{n}`.

---

## Implementation Details

- **`useParams`** — URL se product ID extract karta hai.
- **`useNavigate`** — Back button aur edit/delete redirect ke liye.
- **`activeImage` State** — Selected gallery image track karta hai.
- **`deleteProduct` from Context** — Detail page se delete karte hi home redirect ho jata hai.
