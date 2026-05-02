const Product = require('../models/product');

// @desc    Get all products with pagination, search, and filter
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  console.log("GET /api/products - Query:", req.query);
  try {
    const { page = 1, limit = 10, title, category } = req.query;
    
    // Build query object
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    console.log("Searching with query:", query);

    // Execute query with pagination
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(query);
    console.log(`Found ${count} products. Returning ${products.length} for page ${page}`);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count
    });
  } catch (err) {
    console.error("Error in getProducts:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  console.log(`GET /api/products/${req.params.id}`);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn("Product not found with ID:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error in getProductById:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  console.log("POST /api/products - Body:", req.body);
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    console.log("Product created successfully:", savedProduct._id);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(400).json({ message: "Bad Request", error: err.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  console.log(`PUT /api/products/${req.params.id} - Body:`, req.body);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      console.warn("Product not found for update with ID:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product updated successfully:", req.params.id);
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error in updateProduct:", err);
    res.status(400).json({ message: "Bad Request", error: err.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  console.log(`DELETE /api/products/${req.params.id}`);
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      console.warn("Product not found for deletion with ID:", req.params.id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product deleted successfully:", req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
