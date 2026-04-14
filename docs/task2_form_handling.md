# Task 2: Advanced Form Handling & Image Upload (Roman Urdu)

Is task mein humne `ProductForm` ko optimize kiya hai aur naye features add kiye hain jaise ke **React Hook Form** aur **Image Upload**.

## Key Features
1. **React Hook Form**: Form submission aur validation ko handle karne ke liye use kiya gaya hai. Isse page refresh nahi hota aur errors real-time mein nazar aate hain.
2. **File Upload (Image)**: User ab browse karke apni image upload kar sakta hai.
3. **Image Preview**: Upload ke waqt user ko product ki image ka preview nazar aata hai.

## Code Logic Explanation

### React Hook Form Setup
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>();

// Form inputs ko register karna
<input {...register('title', { required: 'Title is required' })} />
```
`register` function input ko form state se connect karta hai aur validation rules apply karta hai.

### Image Upload Logic
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Local URL banana preview ke liye
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    // Value set karna form state mein
    setValue('thumbnail', objectUrl);
  }
};
```
Jab user file select karta hai, `URL.createObjectURL` ek temporary link banata hai jo session ke dauraan image dikhane ke kaam aata hai.

## Validation Benefits
- **Title**: Kam se kam 3 characters lazmi hain.
- **Price**: 0 se zyada honi chahiye.
- **Description**: Minimum 10 characters hone chahiye.
- **Errors**: Agar koi field miss ho jaye toh red color mein error message show hota hai.

## UI/UX Improvements
- Glassmorphism effects aur smooth gradients use kiye gaye hain.
- Buttons par hover aur active state transitions add kiye hain.
- Form responsive hai, mobile aur desktop dono par premium lagta hai.
