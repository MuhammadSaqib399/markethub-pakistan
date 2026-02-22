/**
 * Admin Routes
 * Manage users, ads, reports, and view analytics
 * All routes require admin role
 */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Ad = require("../models/Ad");
const Report = require("../models/Report");
const { protect, adminOnly } = require("../middleware/auth");
const { deleteImage } = require("../utils/cloudinary");
const { escapeRegex } = require("../middleware/sanitize");

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ==================== DASHBOARD ANALYTICS ====================
router.get("/analytics", async (req, res) => {
  try {
    const [
      totalUsers,
      totalAds,
      activeAds,
      pendingAds,
      pendingReports,
      // Get user registrations for last 30 days
      recentUsers,
      // Get ads posted for last 30 days
      recentAds,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Ad.countDocuments(),
      Ad.countDocuments({ status: "active" }),
      Ad.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "pending" }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Ad.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    // Ads per category breakdown
    const categoryStats = await Ad.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalAds,
        activeAds,
        pendingAds,
        pendingReports,
        recentUsers,
        recentAds,
      },
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching analytics" });
  }
});

// ==================== MANAGE USERS ====================
router.get("/users", async (req, res) => {
  try {
    const { page = 1, search, role } = req.query;
    const limit = 20;
    const filter = {};

    if (search) {
      // SECURITY: Escape regex special chars to prevent ReDoS attacks
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ];
    }
    if (role) filter.role = role;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle user active status
router.patch("/users/:id/toggle-active", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify seller
router.patch("/users/:id/verify-seller", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerifiedSeller: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Seller verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== MANAGE ADS ====================
router.get("/ads", async (req, res) => {
  try {
    const { page = 1, status, category } = req.query;
    const limit = 20;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * limit)
        .limit(limit)
        .populate("seller", "name email")
        .lean(),
      Ad.countDocuments(filter),
    ]);

    res.json({
      ads,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve ad
router.patch("/ads/:id/approve", async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { status: "active", moderatedBy: req.user._id },
      { new: true }
    );
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    res.json({ message: "Ad approved", ad });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Reject ad
router.patch("/ads/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason || "Does not meet posting guidelines",
        moderatedBy: req.user._id,
      },
      { new: true }
    );
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    res.json({ message: "Ad rejected", ad });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove ad (spam/violation)
router.delete("/ads/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Delete images from Cloudinary
    for (const img of ad.images) {
      await deleteImage(img.publicId);
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Ad removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== MANAGE REPORTS ====================
router.get("/reports", async (req, res) => {
  try {
    const { page = 1, status = "pending" } = req.query;
    const limit = 20;

    const [reports, total] = await Promise.all([
      Report.find({ status })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * limit)
        .limit(limit)
        .populate("reporter", "name email")
        .populate("targetAd", "title")
        .populate("targetUser", "name email")
        .lean(),
      Report.countDocuments({ status }),
    ]);

    res.json({
      reports,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Review report
router.patch("/reports/:id", async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote, reviewedBy: req.user._id },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report updated", report });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
