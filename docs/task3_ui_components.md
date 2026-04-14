# Task 3: UI Components Build (Roman Urdu)

Is task mein humne app ke main reusable components banaye hain jo app ko premium look aur feel denge.

## Components List

1. **Navbar** — Top navigation bar jis mein Logo aur "Add Product" ka button hai.
2. **SearchBar** — Real-time product search bar, seedha `ProductContext` se connected.
3. **ProductCard** — Product ki basic info (Image, Title, Price, Category) dikhane wala card.
4. **DeleteModal** — Premium confirmation modal delete se pehle user se confirm karta hai.
5. **`ui/Select.tsx`** _(naya)_ — Radix UI par based shadcn-style accessible dropdown component.

---

## shadcn-Style Select Component

Humne `@radix-ui/react-select` install kar ke ek custom `Select` component banaya hai:

```
src/
  components/
    ui/
      Select.tsx   ← naya shadcn-style dropdown
  lib/
    utils.ts       ← cn() helper function (clsx + tailwind-merge)
```

Install kiye gaye packages:
```bash
npm install @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-toast
            class-variance-authority clsx tailwind-merge
```

`cn()` utility Tailwind classes ko safely merge karti hai:
```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

---

## ProductCard — Key Updates

- **`cursor-pointer`** — Har button / link par hover mein pointer cursor ab kaam karta hai.
- **Dynamic unique IDs** — Har card ke buttons ko unique ID milti hai:
  - `details-btn-{id}`, `edit-btn-{id}`, `delete-btn-{id}`
- **`useNavigate` se navigation** — `<Link>` ki jagah `navigate()` use ki gayi hai taake
  TypeScript typed IDs properly pass hon.

---

## DeleteModal — Key Updates

- **`cursor-pointer`** — Backdrop, Cancel aur Delete buttons par cursor pointer dikhta hai.
- **Unique button IDs** — `modal-close-btn`, `modal-cancel-btn`, `modal-confirm-delete-btn`.

---

## Modern Design Details

- **Glassmorphism** — `backdrop-blur` aur transparency ka use.
- **Micro-animations** — Cards hover par upar move karte hain, buttons `active:scale-95`.
- **Lucide Icons** — Consistent icon set across the entire app.
