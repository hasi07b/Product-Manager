# Product Manager — README

A premium React + TypeScript product management dashboard powered by the [DummyJSON API](https://dummyjson.com/).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + TypeScript |
| Routing | React Router DOM v7 |
| State Management | React Context API |
| Forms | React Hook Form |
| UI Components | Custom shadcn-style (Radix UI) |
| Icons | Lucide React |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |

---

## Features

- ✅ **List Products** — Fetches 30 products from DummyJSON on load
- ✅ **Search** — Real-time filter by product title
- ✅ **View Details** — Dynamic route `/product/:id` with image gallery, specs, and discount info
- ✅ **Add Product** — Form with validation, image upload preview, and category dropdown
- ✅ **Edit Product** — Pre-fills form with existing product data (race-condition fixed)
- ✅ **Delete Product** — Confirmation modal before removal from local state
- ✅ **shadcn Select** — Radix UI-based accessible category dropdown in ProductForm
- ✅ **Cursor Pointer** — All interactive buttons show pointer cursor on hover
- ✅ **Unique IDs** — Every button has a unique HTML `id` (e.g. `edit-btn-42`)

---

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   └── Select.tsx        ← shadcn-style Radix UI dropdown
│   ├── DeleteModal.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── SearchBar.tsx
├── context/
│   └── ProductContext.tsx    ← Global state (products, CRUD fns)
├── lib/
│   └── utils.ts              ← cn() Tailwind merge utility
├── pages/
│   ├── Home.tsx
│   ├── ProductDetails.tsx    ← Dynamic /product/:id route
│   └── ProductForm.tsx       ← Add + Edit (shared form)
├── App.tsx
└── main.tsx
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Key Bug Fixes (Latest Session)

### 1. Edit Not Working (Race Condition)
**Problem:** `ProductForm` ran `products.find()` before the Context API finished loading
products from the API — always returning `undefined`.

**Fix:** Added a `productLoaded` flag + early return in `useEffect` when
`products.length === 0 && contextLoading`. Also added a direct API fallback for
IDs ≤ 100 that aren't yet in local state.

### 2. ProductDetails Not Showing for New Products
**Problem:** Locally-created products (ID > 100) weren't found in local state on
first render because the `useEffect` ran before Context was ready.

**Fix:** Three-tier strategy — check local state → wait if context loading → API fallback
for IDs ≤ 194 → show error only for unknown local IDs.

### 3. Delete Not Triggering (Modal Buttons)
**Problem:** Buttons in `DeleteModal` lacked `cursor-pointer` and had no unique IDs,
making them hard to interact with reliably.

**Fix:** Added `cursor-pointer` to all buttons in `DeleteModal`, `ProductCard`,
`ProductDetails`, and `ProductForm`.

### 4. No shadcn/Radix Components
**Fix:** Installed `@radix-ui/react-select` + helpers. Created `src/components/ui/Select.tsx`
and used it with React Hook Form's `Controller` in `ProductForm`.

---

## DummyJSON API Note

DummyJSON's POST/PUT/DELETE endpoints are **simulated** — they return success responses
but do not persist data permanently. All changes live in React local state for the session.
On page refresh, the original 30 products reload from the API.

---

## Documentation

Detailed Roman Urdu explanations for each task are in the `/docs` folder:

| File | Topic |
|---|---|
| `task1_context_api.md` | Context API & CRUD logic |
| `task2_routing.md` | React Router & dynamic routes |
| `task2_form_handling.md` | React Hook Form |
| `task3_ui_components.md` | Components + shadcn Select |
| `task4_home_page.md` | Home page & search |
| `task5_product_details.md` | Detail page & 3-tier fetch |
| `task6_add_edit.md` | Form + edit race-condition fix |
