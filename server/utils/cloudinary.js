/**
 * Cloudinary Configuration
 * Handles image upload, transformation, and deletion
 * Uses multer memory storage + direct Cloudinary upload (v2 compatible)
 *
 * SECURITY:
 * - SVG files blocked (can contain embedded JavaScript = XSS)
 * - File extension whitelist enforced
 * - Magic byte validation to prevent MIME spoofing
 * - Files stored in memory only, never written to disk
 */
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Allowed image MIME types (NO SVG - SVG can contain JavaScript)
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Allowed extensions
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

// Magic bytes for validating actual file content
const MAGIC_BYTES = {
  "image/jpeg": [Buffer.from([0xff, 0xd8, 0xff])],
  "image/jpg": [Buffer.from([0xff, 0xd8, 0xff])],
  "image/png": [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  "image/webp": [Buffer.from("RIFF")], // RIFF header (WebP starts with RIFF....WEBP)
};

/**
 * Validate file buffer against known magic bytes
 * Prevents MIME type spoofing (e.g., uploading .exe as .jpg)
 */
const validateMagicBytes = (buffer, mimetype) => {
  const signatures = MAGIC_BYTES[mimetype];
  if (!signatures) return false;

  return signatures.some((sig) => {
    const fileSig = buffer.subarray(0, sig.length);
    return sig.every((byte, i) => byte === fileSig[i]);
  });
};

// Multer stores files in memory as Buffers (then we upload to Cloudinary)
const storage = multer.memoryStorage();

// Multer middleware for handling file uploads
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per image
    files: 8, // Max 8 images per ad
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type against whitelist
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WebP images are allowed"), false);
    }

    // Check file extension
    if (!ALLOWED_EXTENSIONS.test(file.originalname)) {
      return cb(new Error("Invalid file extension"), false);
    }

    cb(null, true);
  },
});

/**
 * Upload a single buffer to Cloudinary
 * Validates magic bytes before uploading
 * Returns { url, publicId }
 */
const uploadToCloudinary = (fileBuffer, mimetype, options = {}) => {
  // SECURITY: Validate actual file content matches claimed MIME type
  if (!validateMagicBytes(fileBuffer, mimetype)) {
    return Promise.reject(new Error("File content does not match its type"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "markethub",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 900, crop: "limit" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Upload multiple files (from multer req.files) to Cloudinary
 * Returns array of { url, publicId }
 */
const uploadMultiple = async (files) => {
  const uploads = files.map((file) =>
    uploadToCloudinary(file.buffer, file.mimetype)
  );
  return Promise.all(uploads);
};

// Delete image from Cloudinary by public ID
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error);
  }
};

module.exports = { cloudinary, upload, uploadToCloudinary, uploadMultiple, deleteImage };
