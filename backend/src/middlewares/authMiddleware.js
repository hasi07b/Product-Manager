const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log("Auth Middleware - Verifying token...");
  // 1. Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn("Auth Middleware - No token or invalid format");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log("Auth Middleware - Token verified, userId:", decoded.userId);
    
    // 3. Find user from DB and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.warn("Auth Middleware - User not found in database for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Auth Middleware - Access granted to:", user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware - Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
