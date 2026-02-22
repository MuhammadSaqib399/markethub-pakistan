/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS
 */
const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    message: "Too many authentication attempts, please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for ad posting (prevent spam)
const adPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 ads per hour
  message: {
    message: "Ad posting limit reached. You can post up to 10 ads per hour.",
  },
});

// Limiter for messaging (prevent spam)
const messageLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: {
    message: "Message rate limit reached. Please slow down.",
  },
});

module.exports = { apiLimiter, authLimiter, adPostLimiter, messageLimiter };
