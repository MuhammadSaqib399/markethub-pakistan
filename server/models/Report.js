/**
 * Report Model
 * Handles user reports for ads and users (spam, fraud, etc.)
 */
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Report can target either an ad or a user
    targetType: {
      type: String,
      enum: ["ad", "user"],
      required: true,
    },
    targetAd: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ad",
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
      enum: [
        "spam",
        "fraud",
        "inappropriate",
        "duplicate",
        "wrong_category",
        "offensive",
        "other",
      ],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewNote: String,
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1 });
reportSchema.index({ targetType: 1, targetAd: 1 });

module.exports = mongoose.model("Report", reportSchema);
