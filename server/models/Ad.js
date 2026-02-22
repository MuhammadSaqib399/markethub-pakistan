/**
 * Ad Model
 * Core listing model for the marketplace
 * Supports categories, location filtering, boosting, and auto-expiry
 */
const mongoose = require("mongoose");
const slugify = require("slugify");

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ad title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    priceNegotiable: {
      type: Boolean,
      default: false,
    },
    // Category hierarchy
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Mobiles",
        "Cars",
        "Property",
        "Electronics",
        "Jobs",
        "Services",
        "Fashion",
        "Furniture",
        "Animals",
        "Books",
        "Sports",
        "Kids",
      ],
    },
    subCategory: {
      type: String,
      default: "",
    },
    // Location
    location: {
      province: {
        type: String,
        required: [true, "Province is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
    },
    // Images stored on Cloudinary
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    // Seller reference
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Condition for physical items
    condition: {
      type: String,
      enum: ["new", "used", "refurbished", ""],
      default: "",
    },
    // Ad status lifecycle
    status: {
      type: String,
      enum: ["pending", "active", "sold", "expired", "rejected", "removed"],
      default: "pending",
    },
    // Boosted/featured ad settings
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: Date,
    // View counter for analytics
    views: {
      type: Number,
      default: 0,
    },
    // Auto-expiry date (30 days from posting)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    // Admin moderation
    rejectionReason: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Contact preference
    contactPreference: {
      type: String,
      enum: ["chat", "phone", "both"],
      default: "both",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search performance
adSchema.index({ title: "text", description: "text" }); // Full-text search
adSchema.index({ category: 1, status: 1 });
adSchema.index({ "location.province": 1, "location.city": 1 });
adSchema.index({ price: 1 });
adSchema.index({ seller: 1 });
adSchema.index({ createdAt: -1 });
adSchema.index({ isFeatured: 1, featuredUntil: 1 });
adSchema.index({ expiresAt: 1 }); // For TTL / expiry queries

// Generate slug before saving
adSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now().toString(36);
  }
  next();
});

// Virtual for checking if ad is expired
adSchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date();
});

// Ensure virtuals are included in JSON
adSchema.set("toJSON", { virtuals: true });
adSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Ad", adSchema);
