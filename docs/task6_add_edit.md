# Task 6: Add & Edit Product (Roman Urdu)

Is task mein humne ek multipurpose form banaya hai jo naya product add karne aur purane
product ko edit karne, dono ke liye kaam karta hai.

## Key Features

1. **Conditional Rendering** — URL mein ID hai ya nahi, is par depend karke form ka
   title aur button text automatic change hota hai.
2. **Pre-filled Data (Fixed)** — Edit mode mein form data ab correctly bhar jata hai.
3. **shadcn Select Dropdown** — Category field ab ek accessible Radix UI dropdown hai
   jis mein 24 DummyJSON categories listed hain.
4. **Validation** — Saare fields required hain; React Hook Form errors clearly dikhata hai.
5. **Loading States** — Submit hote waqt spinner chalta hai; edit mode load hone tak
   full-screen spinner dikhta hai.
6. **`cursor-pointer`** — Cancel aur Submit button par hover mein pointer cursor.
7. **Back Button** — Form par ek back button bhi hai jo `navigate(-1)` karta hai.

---

## Bug Fix: Edit Mode Race Condition

**Pehle kya galat tha?**

`useEffect` immediately chalta tha lekin `products` array abhi empty hota tha
(API se data load ho raha hota). Is wajah se `find()` `undefined` return karta aur
"Product not found" error aata tha.

**Ab kya fix kiya?**

```tsx
const [productLoaded, setProductLoaded] = useState(false);

useEffect(() => {
  if (!isEditMode || !id) return;
  if (products.length === 0 && contextLoading) return; // ← WAIT
  
  const existing = products.find(p => p.id === parseInt(id));
  if (existing && !productLoaded) {
    reset({ ...existingProductData });
    setProductLoaded(true);     // ← sirf ek baar populate karo
  } else if (!contextLoading && !existing) {
    // Server se fetch karo agar ID ≤ 100
    fetch(`https://dummyjson.com/products/${id}`).then(...)
  }
}, [id, products, contextLoading, productLoaded]);
```

`productLoaded` flag ensure karta hai ke form repeatedly reset na ho jab `products`
state update ho (e.g., search filter lagane par).

---

## shadcn Select Component Usage

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Controller } from 'react-hook-form';

<Controller
  name="category"
  control={control}
  rules={{ required: 'Category is required' }}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger><SelectValue placeholder="Select a category…" /></SelectTrigger>
      <SelectContent>
        {CATEGORIES.map(cat => (
          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
```

`Controller` wrapper zaroori hai kyunke Radix Select ek controlled component hai —
directly `register()` se kaam nahi karta.

---

## Implementation Details

- **`isEditMode`** — `Boolean(id)` se check kiya jata hai.
- **`useForm` + `reset()`** — Data milne par form fields populate karta hai.
- **`Controller`** — Radix primitive ko React Hook Form ke saath link karta hai.
- **Image Upload** — File pick karne par `URL.createObjectURL()` se preview banti hai.

---

## DummyJSON Note

DummyJSON par actual changes server par save nahi hote. Submit ke baad home page par
updated data nazar aayega, lekin page refresh karne par wo wapis purana ho jayega
(kyunke changes sirf local React state mein hain).
