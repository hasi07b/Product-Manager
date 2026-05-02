# Task 7: Full-Stack Integration (React + Node.js/Express)

Is task mein humne apne React frontend ko real Node.js/Express backend se connect kiya hai. Pehle hum DummyJSON use kar rahe the, lekin ab humara data humare apne server se aa raha hai.

## Kaise Test Karein?

Aap ke paas ab do tareeqe hain app chalane ke:

### Tareeqa 1: Dono ek saath chalayein (Recommended)
Main folder mein ye command likhein:
```bash
npm run dev:all
```
Isse Frontend aur Backend dono ek saath start ho jayenge!

### Tareeqa 2: Alag alag chalayein
1.  **Frontend**: Main folder mein `npm run dev`
2.  **Backend**: `backend` folder mein `npm run dev`

---

## 1. Backend Setup (Node.js/Express)

Humne `backend/server.js` mein CRUD endpoints banaye hain:

- **GET `/products`**: Saare products fetch karne ke liye.
- **GET `/products/:id`**: Ek specific product ki details lane ke liye.
- **POST `/products`**: Naya product add karne ke liye.
- **PUT `/products/:id`**: Maujooda product ko update karne ke liye.
- **DELETE `/products/:id`**: Product ko delete karne ke liye.

Humne data ko store karne ke liye ek **In-memory Array** use kiya hai. Iska matlab hai ke jab server restart hoga, data reset ho jayega.

## 2. Frontend Connection (Axios)

Humne `fetch` ki jagah **Axios** use kiya hai kyunke ye zyada reliable aur simple hai.

- **API Service**: Humne `src/lib/api.ts` banaya hai jahan Axios ka instance aur saare endpoints define kiye hain.
- **Context API**: `ProductContext.tsx` ab `productApi` use kar raha hai server se baat karne ke liye.

## 3. Main Features Explained

### Fetching Products
Jab app load hoti hai, `useEffect` call hota hai jo server se products lata hai aur use `useState` mein store karta hai.

### Adding Product
Jab aap form submit karte hain, hum POST request bhejte hain aur response milne par local state ko update karte hain taake page refresh na karna pare.

### Updating Product
Edit form pre-fill hota hai server se data lakar. PUT request se server par data update hota hai aur UI foran reflect karta hai.

### Deleting Product
DELETE request bhejne ke baad hum product ko foran list se filter out kar dete hain.

## 4. Concepts Used

- **Loading State**: `loading` variable use kiya gaya hai.
- **Error Handling**: Agar API fail ho jaye, toh hum error message show karte hain.
- **Empty State**: Agar list empty ho, toh appropriate message show hota hai.

---
Ab humara system mukammal tor par "Full-Stack" hai!
