/**
 * Validation Middleware
 * Request body validation using express-validator
 */
const { body, query, validationResult } = require("express-validator");

// Process validation results and return errors if any
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// --- Auth Validations ---

const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone")
    .optional()
    .matches(/^(\+92|0)[0-9]{10}$/)
    .withMessage("Enter a valid Pakistani phone number"),
  handleValidation,
];

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

// --- Ad Validations ---

const validateAd = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage("Title must be 5-120 characters"),
  body("description")
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be 20-5000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("location.province").notEmpty().withMessage("Province is required"),
  body("location.city").notEmpty().withMessage("City is required"),
  handleValidation,
];

// --- Search Validations ---

const validateSearch = [
  query("q").optional().trim().escape(),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min price must be positive"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be positive"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  handleValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateAd,
  validateSearch,
  handleValidation,
};
