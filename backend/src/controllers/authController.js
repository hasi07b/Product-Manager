const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  console.log("POST /api/auth/register - Email:", req.body.email);
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.warn("Registration failed: User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();
    console.log("User registered successfully:", email);

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    console.log("JWT generated for registered user:", email);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  console.log("POST /api/auth/login - Email:", req.body.email);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("Login failed: User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn("Login failed: Incorrect password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    console.log("Login successful, JWT generated for:", email);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
