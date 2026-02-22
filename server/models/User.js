/**
 * User Model
 * Handles user accounts, authentication, and profile data
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    phone: {
      type: String,
      match: [/^(\+92|0)[0-9]{10}$/, "Please enter a valid Pakistani phone number"],
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerifiedSeller: {
      type: Boolean,
      default: false,
    },
    // Seller subscription plan
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      expiresAt: Date,
    },
    // User rating (calculated from reviews)
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    // Location preference
    location: {
      province: String,
      city: String,
    },
    // Saved / wishlisted ad IDs
    savedAds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
    // Blocked users
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    // OTP for phone verification (hashed for security)
    otp: {
      code: String, // Store hashed OTP
      expiresAt: Date,
    },
    // SECURITY: Token version - incremented on password change to invalidate old JWTs
    tokenVersion: {
      type: Number,
      default: 0,
    },
    // SECURITY: Failed login attempt tracking for account lockout
    loginAttempts: {
      count: { type: Number, default: 0 },
      lockedUntil: Date,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for faster queries (email index created by unique:true above)
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
