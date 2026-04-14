# Task 1: Context API Setup (Roman Urdu)

Is task mein humne `ProductContext` create kiya hai jo hamari app ki global state ko manage karega. Iska matlab hai ke products ka data, loading state, aur search term puri app mein kahin bhi access kiye ja sakte hain.

## Key Concepts
1. **createContext**: Ek naya context banane ke liye use hota hai.
2. **Provider**: Ye component app ke baaki components ko data supply karta hai.
3. **useContext**: Context se data nikaalne ke liye use hota hai.

## Code Explanation

```typescript
// Context create karna
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider Component
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // API se products fetch karne ka function
  const fetchProducts = async () => {
    // ... logic to fetch from dummyjson
  };

  // Robust Update Function
  const updateProduct = async (id: number, updatedData: Partial<Product>) => {
    // Hum check karte hain agar ID > 100 hai (matlab newly added product),
    // toh hum API ko bypass karke direct local state update karte hain.
    // Isse dynamic routing aur detail page mein error nahi aata.
  };

  // Robust Delete Function
  const deleteProduct = async (id: number) => {
    // Similarly, local products ko state se remove karte hain manually
    // kyunke server par wo exist nahi karte.
  };
}
```

## Robust Navigation & Local FetchING
Hamne `ProductDetails` page par ek improvent ki hai:
- Jab bhi koi user detail page par jata hai, hum pehle **local Context state** mein check karte hain.
- Agar product local state mein mil jata hai (e.g. naya add kiya hua product), toh hum API call nahi karte.
- Is se naye products (IDs > 100) bhi detail page par sahi nazar aate hain.

## DummyJSON Note
DummyJSON's POST/PUT/DELETE operations are simulated. They return the updated object but do not persist changes permanently on the server. The local state (Context) will be updated to reflect these changes during the session.

Iska matlab hai ke jab aap product delete karenge to wo hamare `products` state se nikal jayega, lekin server par permanently delete nahi hoga. Page refresh karne par sab wapis aa jayega.
