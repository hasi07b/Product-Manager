const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory data storage (simulates a database)
let products = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    description: "The latest iPhone with titanium design and A17 Pro chip.",
    price: 999,
    discountPercentage: 15,
    category: "smartphones",
    thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    images: ["https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"],
    rating: 4.5,
    stock: 50,
    brand: "Apple"
  },
  {
    id: 2,
    title: "MacBook Pro 14",
    description: "M3 chip, 14-inch Liquid Retina XDR display.",
    price: 1599,
    discountPercentage: 10,
    category: "laptops",
    thumbnail: "https://cdn.dummyjson.com/product-images/6/thumbnail.jpg",
    images: ["https://cdn.dummyjson.com/product-images/6/thumbnail.jpg"],
    rating: 4.8,
    stock: 25,
    brand: "Apple"
  }
];

// GET /products - Fetch all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET /products/:id - Fetch a single product
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// POST /products - Add a new product
app.post('/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: Date.now(),
    rating: 0,
    stock: 10,
    discountPercentage: 0,
    brand: req.body.brand || "Generic",
    images: req.body.images || [req.body.thumbnail]
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id - Update an existing product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// DELETE /products/:id - Delete a product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length < initialLength) {
    res.json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend connected successfully" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});