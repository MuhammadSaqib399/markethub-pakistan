/**
 * Authentication Middleware
 * JWT verification with token versioning and role-based access control
 *
 * SECURITY FEATURES:
 * - Token version check: changing password invalidates all existing tokens
 * - Account lockout: 5 failed logins = 30 minute lockout
 * - Generic error messages: don't reveal whether email exists
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Account lockout settings
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// Verify JWT token and attach user to request
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized - no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request (exclude password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized - user not found" });
    }

    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "Account has been deactivated" });
    }

    // SECURITY: Check token version - reject tokens issued before password change
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res
        .status(401)
        .json({ message: "Token expired - please login again" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Authentication error" });
  }
};

// Restrict access to admin users only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied - admin only" });
};

// Optional auth - attaches user if token exists, but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch {
    // Silently continue without user
  }
  next();
};

/**
 * Generate JWT token with token version
 * Token version allows server-side invalidation on password change
 */
const generateToken = (userId, tokenVersion = 0) => {
  return jwt.sign(
    { id: userId, tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/**
 * Check and handle account lockout after failed login attempts
 * Returns true if account is locked
 */
const checkAccountLock = async (user) => {
  if (
    user.loginAttempts?.lockedUntil &&
    user.loginAttempts.lockedUntil > new Date()
  ) {
    return true; // Still locked
  }

  // Lock expired, reset attempts
  if (
    user.loginAttempts?.lockedUntil &&
    user.loginAttempts.lockedUntil <= new Date()
  ) {
    user.loginAttempts = { count: 0, lockedUntil: null };
    await user.save();
  }

  return false;
};

/**
 * Record a failed login attempt. Lock account after MAX_LOGIN_ATTEMPTS.
 */
const recordFailedLogin = async (user) => {
  const attempts = (user.loginAttempts?.count || 0) + 1;
  const update = { "loginAttempts.count": attempts };

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    update["loginAttempts.lockedUntil"] = new Date(Date.now() + LOCKOUT_DURATION_MS);
  }

  await User.findByIdAndUpdate(user._id, { $set: update });
};

/**
 * Reset login attempts on successful login
 */
const resetLoginAttempts = async (user) => {
  if (user.loginAttempts?.count > 0) {
    await User.findByIdAndUpdate(user._id, {
      $set: { "loginAttempts.count": 0, "loginAttempts.lockedUntil": null },
    });
  }
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth,
  generateToken,
  checkAccountLock,
  recordFailedLogin,
  resetLoginAttempts,
  MAX_LOGIN_ATTEMPTS,
};
