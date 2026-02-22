/**
 * Authentication Routes
 * POST /api/auth/register - Create new account
 * POST /api/auth/login    - Login with email/password
 * GET  /api/auth/me       - Get current user profile
 * PUT  /api/auth/profile  - Update profile
 *
 * SECURITY:
 * - Account lockout after 5 failed login attempts (30 min)
 * - Password change invalidates all existing tokens via tokenVersion
 * - Profile update validates all fields
 * - Phone number conditionally exposed based on contact preference
 */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/User");
const {
  protect,
  generateToken,
  checkAccountLock,
  recordFailedLogin,
  resetLoginAttempts,
} = require("../middleware/auth");
const { validateRegister, validateLogin, handleValidation } = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");

// ==================== REGISTER ====================
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user (only whitelisted fields - prevents role injection)
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    // Generate token with tokenVersion for future invalidation
    const token = generateToken(user._id, user.tokenVersion);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ==================== LOGIN ====================
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // SECURITY: Same message for wrong email or password
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // SECURITY: Check account lockout
    const isLocked = await checkAccountLock(user);
    if (isLocked) {
      return res.status(423).json({
        message: "Account temporarily locked due to too many failed attempts. Try again in 30 minutes.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "Account has been deactivated. Contact support." });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // SECURITY: Record failed attempt for lockout
      await recordFailedLogin(user);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Successful login - reset failed attempts
    await resetLoginAttempts(user);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.tokenVersion);

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// ==================== GET CURRENT USER ====================
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "savedAds",
      "title price images slug status"
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== UPDATE PROFILE ====================
// SECURITY: Validate profile fields to prevent XSS via avatar URL etc.
const validateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("phone")
    .optional()
    .matches(/^(\+92|0)[0-9]{10}$/)
    .withMessage("Enter a valid Pakistani phone number"),
  body("avatar")
    .optional()
    .isURL({ protocols: ["https"], require_protocol: true })
    .withMessage("Avatar must be a valid HTTPS URL"),
  body("location.province").optional().trim().escape(),
  body("location.city").optional().trim().escape(),
  handleValidation,
];

router.put("/profile", protect, validateProfile, async (req, res) => {
  try {
    const { name, phone, location, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (location) updates.location = location;
    // SECURITY: Only allow Cloudinary URLs for avatar
    if (avatar && avatar.includes("res.cloudinary.com")) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// ==================== CHANGE PASSWORD ====================
// SECURITY: Validate new password + rate limit + invalidate old tokens
const validatePasswordChange = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  handleValidation,
];

router.put("/change-password", protect, authLimiter, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password and increment tokenVersion to invalidate all existing tokens
    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    // Issue new token with updated version
    const token = generateToken(user._id, user.tokenVersion);

    res.json({
      message: "Password changed successfully. Please login again on other devices.",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error changing password" });
  }
});

// ==================== TOGGLE SAVE AD (WISHLIST) ====================
router.post("/save-ad/:adId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const adId = req.params.adId;

    // SECURITY: Validate ObjectId format
    if (!/^[a-f\d]{24}$/i.test(adId)) {
      return res.status(400).json({ message: "Invalid ad ID" });
    }

    const index = user.savedAds.findIndex((id) => id.toString() === adId);

    if (index > -1) {
      user.savedAds.splice(index, 1);
      await user.save();
      res.json({ message: "Ad removed from wishlist", saved: false });
    } else {
      user.savedAds.push(adId);
      await user.save();
      res.json({ message: "Ad saved to wishlist", saved: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== DELETE ACCOUNT ====================
router.delete("/delete-account", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all user's ads
    const Ad = require("../models/Ad");
    const { deleteImage } = require("../utils/cloudinary");
    const userAds = await Ad.find({ seller: req.user._id });
    for (const ad of userAds) {
      for (const img of ad.images) {
        await deleteImage(img.publicId);
      }
    }
    await Ad.deleteMany({ seller: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error deleting account" });
  }
});

module.exports = router;
