const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

console.log("Product Routes - Initializing...");

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Routes
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
