/**
 * Report Routes
 * Users can report ads or other users for violations
 *
 * SECURITY: Input validation, rate limiting, ObjectId validation
 */
const express = require("express");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const router = express.Router();
const Report = require("../models/Report");
const { protect } = require("../middleware/auth");
const { handleValidation } = require("../middleware/validate");
const rateLimit = require("express-rate-limit");

// Rate limit report submissions - prevent report flooding
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 reports per hour
  message: { message: "Too many reports submitted. Please try again later." },
});

// Validation rules for report submission
const validateReport = [
  body("targetType")
    .isIn(["ad", "user"])
    .withMessage("Target type must be 'ad' or 'user'"),
  body("targetId")
    .notEmpty()
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid target ID"),
  body("reason")
    .isIn(["spam", "fraud", "inappropriate", "duplicate", "wrong_category", "offensive", "other"])
    .withMessage("Invalid report reason"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .escape(), // Sanitize HTML
  handleValidation,
];

// ==================== SUBMIT A REPORT ====================
router.post("/", protect, reportLimiter, validateReport, async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    // Prevent duplicate reports from the same user
    const existing = await Report.findOne({
      reporter: req.user._id,
      [`target${targetType === "ad" ? "Ad" : "User"}`]: targetId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already reported this. It is under review.",
      });
    }

    const reportData = {
      reporter: req.user._id,
      targetType,
      reason,
      description,
    };

    if (targetType === "ad") {
      reportData.targetAd = targetId;
    } else {
      reportData.targetUser = targetId;
    }

    const report = await Report.create(reportData);

    res.status(201).json({ message: "Report submitted. We will review it shortly.", report });
  } catch (error) {
    res.status(500).json({ message: "Server error submitting report" });
  }
});

module.exports = router;
