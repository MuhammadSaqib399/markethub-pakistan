/**
 * Ad Routes
 * Full CRUD for marketplace listings with search, filtering, and pagination
 */
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Ad = require("../models/Ad");
const { protect, optionalAuth } = require("../middleware/auth");
const { validateAd, validateSearch } = require("../middleware/validate");
const { adPostLimiter } = require("../middleware/rateLimiter");
const { upload, uploadMultiple, deleteImage } = require("../utils/cloudinary");

// SECURITY: Middleware to validate :id param is a valid ObjectId
const validateObjectId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};

// Apply to all routes with :id param
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
});

// ==================== GET ALL ADS (with filters) ====================
router.get("/", validateSearch, async (req, res) => {
  try {
    const {
      q,
      category,
      province,
      city,
      minPrice,
      maxPrice,
      condition,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter query
    const filter = { status: "active" };

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Location filters
    if (province) filter["location.province"] = province;
    if (city) filter["location.city"] = city;

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Condition filter
    if (condition) {
      filter.condition = condition;
    }

    // Sort options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { price: 1 },
      price_high: { price: -1 },
      popular: { views: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    // Pagination - SECURITY: cap limit to prevent data dumping
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 50);
    const skip = (safePage - 1) * safeLimit;

    // Execute query with pagination
    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(safeLimit)
        .populate("seller", "name avatar isVerifiedSeller rating")
        .lean(),
      Ad.countDocuments(filter),
    ]);

    res.json({
      ads,
      pagination: {
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalAds: total,
        hasMore: skip + ads.length < total,
      },
    });
  } catch (error) {
    console.error("Get ads error:", error);
    res.status(500).json({ message: "Server error fetching ads" });
  }
});

// ==================== GET FEATURED ADS ====================
router.get("/featured", async (req, res) => {
  try {
    const ads = await Ad.find({
      status: "active",
      isFeatured: true,
      featuredUntil: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("seller", "name avatar isVerifiedSeller")
      .lean();

    res.json({ ads });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET RECENT ADS ====================
router.get("/recent", async (req, res) => {
  try {
    const ads = await Ad.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(16)
      .populate("seller", "name avatar isVerifiedSeller")
      .lean();

    res.json({ ads });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET ADS BY CATEGORY ====================
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { sort = "newest", page = 1, limit = 20, minPrice, maxPrice, condition, province, city } = req.query;

    const filter = { status: "active", category };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (condition) filter.condition = condition;
    if (province) filter["location.province"] = province;
    if (city) filter["location.city"] = city;

    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { views: -1 },
    };
    const sortBy = sortOptions[sort] || sortOptions.newest;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 50);
    const skip = (safePage - 1) * safeLimit;

    const [ads, total] = await Promise.all([
      Ad.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(safeLimit)
        .populate("seller", "name avatar isVerifiedSeller rating")
        .lean(),
      Ad.countDocuments(filter),
    ]);

    res.json({
      ads,
      category,
      pagination: {
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalAds: total,
        hasMore: skip + ads.length < total,
      },
    });
  } catch (error) {
    console.error("Get category ads error:", error);
    res.status(500).json({ message: "Server error fetching category ads" });
  }
});

// ==================== GET SINGLE AD ====================
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate(
      "seller",
      "name avatar phone isVerifiedSeller rating createdAt location"
    );

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Increment view count (don't count seller's own views)
    if (!req.user || req.user._id.toString() !== ad.seller._id.toString()) {
      ad.views += 1;
      await ad.save();
    }

    // Check if current user has saved this ad
    let isSaved = false;
    if (req.user) {
      isSaved = req.user.savedAds.some(
        (id) => id.toString() === ad._id.toString()
      );
    }

    // SECURITY: Hide phone number if seller only wants chat contact
    const adObj = ad.toObject();
    if (adObj.contactPreference === "chat" && adObj.seller) {
      delete adObj.seller.phone;
    }

    res.json({ ad: adObj, isSaved });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== CREATE NEW AD ====================
router.post(
  "/",
  protect,
  adPostLimiter,
  upload.array("images", 8),
  validateAd,
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        category,
        subCategory,
        location,
        condition,
        priceNegotiable,
        contactPreference,
      } = req.body;

      // Upload images to Cloudinary from memory buffers
      const images = req.files && req.files.length > 0
        ? await uploadMultiple(req.files)
        : [];

      if (images.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one image is required" });
      }

      // Parse location if it's a string
      const parsedLocation =
        typeof location === "string" ? JSON.parse(location) : location;

      const ad = await Ad.create({
        title,
        description,
        price: Number(price),
        category,
        subCategory,
        location: parsedLocation,
        images,
        condition,
        priceNegotiable: priceNegotiable === "true" || priceNegotiable === true,
        contactPreference,
        seller: req.user._id,
        // Auto-approve for verified sellers, pending for others
        status: req.user.isVerifiedSeller ? "active" : "pending",
      });

      res.status(201).json({
        message: req.user.isVerifiedSeller
          ? "Ad posted successfully"
          : "Ad submitted for review",
        ad,
      });
    } catch (error) {
      console.error("Create ad error:", error);
      res.status(500).json({ message: "Server error creating ad" });
    }
  }
);

// ==================== UPDATE AD ====================
router.put("/:id", protect, upload.array("images", 8), async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Only the seller or admin can update
    if (
      ad.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update this ad" });
    }

    // Update fields
    const allowedUpdates = [
      "title", "description", "price", "category", "subCategory",
      "location", "condition", "priceNegotiable", "contactPreference",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "location" && typeof req.body[field] === "string") {
          ad[field] = JSON.parse(req.body[field]);
        } else {
          ad[field] = req.body[field];
        }
      }
    });

    // Handle new images - upload to Cloudinary from memory
    if (req.files && req.files.length > 0) {
      const newImages = await uploadMultiple(req.files);

      // If replacing all images, delete old ones from Cloudinary
      if (req.body.replaceImages === "true") {
        for (const img of ad.images) {
          await deleteImage(img.publicId);
        }
        ad.images = newImages;
      } else {
        // Append new images (max 8 total)
        ad.images = [...ad.images, ...newImages].slice(0, 8);
      }
    }

    await ad.save();

    res.json({ message: "Ad updated successfully", ad });
  } catch (error) {
    console.error("Update ad error:", error);
    res.status(500).json({ message: "Server error updating ad" });
  }
});

// ==================== DELETE AD ====================
router.delete("/:id", protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (
      ad.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this ad" });
    }

    // Delete images from Cloudinary
    for (const img of ad.images) {
      await deleteImage(img.publicId);
    }

    await Ad.findByIdAndDelete(req.params.id);

    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting ad" });
  }
});

// ==================== MARK AD AS SOLD ====================
router.patch("/:id/sold", protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ad.status = "sold";
    await ad.save();

    res.json({ message: "Ad marked as sold", ad });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET SAVED ADS ====================
router.get("/saved", protect, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user._id);
    if (!user || !user.savedAds || user.savedAds.length === 0) {
      return res.json({ ads: [] });
    }

    const ads = await Ad.find({
      _id: { $in: user.savedAds },
      status: "active",
    })
      .populate("seller", "name avatar isVerifiedSeller")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ ads });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching saved ads" });
  }
});

// ==================== GET MY ADS ====================
router.get("/user/my-ads", protect, async (req, res) => {
  try {
    const { status, page = 1 } = req.query;
    const filter = { seller: req.user._id };
    if (status) filter.status = status;

    const limit = 20;
    const skip = (Number(page) - 1) * limit;

    const [ads, total] = await Promise.all([
      Ad.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Ad.countDocuments(filter),
    ]);

    res.json({
      ads,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalAds: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
