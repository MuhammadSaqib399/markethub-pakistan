/**
 * Input Sanitization Middleware
 * Prevents NoSQL injection attacks by stripping MongoDB operators
 * from query parameters and request body
 *
 * Without this, attackers can send ?category[$ne]=null to bypass filters
 */

/**
 * Recursively remove keys starting with $ from an object
 * This prevents MongoDB operator injection ($gt, $ne, $regex, etc.)
 */
const stripDollarKeys = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(stripDollarKeys);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    // Block any key starting with $ (MongoDB operator)
    if (key.startsWith("$")) continue;

    const value = obj[key];
    // If value is an object, recurse to catch nested injection
    if (typeof value === "object" && value !== null) {
      clean[key] = stripDollarKeys(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

/**
 * Express middleware to sanitize req.query, req.body, and req.params
 */
const sanitizeQuery = (req, res, next) => {
  if (req.query) req.query = stripDollarKeys(req.query);
  if (req.body) req.body = stripDollarKeys(req.body);
  if (req.params) req.params = stripDollarKeys(req.params);
  next();
};

/**
 * Escape special regex characters to prevent ReDoS attacks
 * Used when user input is passed to MongoDB $regex
 */
const escapeRegex = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = { sanitizeQuery, stripDollarKeys, escapeRegex };
