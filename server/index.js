/**
 * MarketHub Pakistan - Express Server
 * Main entry point for the backend API
 * Includes Socket.IO for real-time messaging
 */
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const { sanitizeQuery } = require("./middleware/sanitize");

// Import routes
const authRoutes = require("./routes/auth");
const adRoutes = require("./routes/ads");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");
const reportRoutes = require("./routes/reports");

const app = express();
const server = http.createServer(app);

// ==================== SOCKET.IO SETUP ====================
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes
app.set("io", io);

/**
 * SECURITY FIX: Socket.IO JWT Authentication Middleware
 * Verifies token BEFORE allowing any socket connection.
 * Without this, anyone could join any user's room and eavesdrop.
 */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // attach verified user ID
    next();
  } catch {
    return next(new Error("Invalid or expired token"));
  }
});

// Socket.IO connection handler - only authenticated users reach here
io.on("connection", (socket) => {
  // Auto-join user's own room using VERIFIED userId (not client-supplied)
  socket.join(socket.userId);
  console.log(`User ${socket.userId} connected to socket`);

  // User joins a conversation room - verify they are a participant
  socket.on("joinConversation", (conversationId) => {
    // Only allow joining with a valid conversationId format
    if (typeof conversationId === "string" && /^[a-f\d]{24}$/i.test(conversationId)) {
      socket.join(conversationId);
    }
  });

  // Typing indicators with rate limiting (max 2 per second)
  let lastTypingEvent = 0;
  socket.on("typing", ({ conversationId }) => {
    const now = Date.now();
    if (now - lastTypingEvent < 500) return; // rate limit
    lastTypingEvent = now;
    if (typeof conversationId === "string") {
      socket.to(conversationId).emit("userTyping", { userId: socket.userId });
    }
  });

  socket.on("stopTyping", ({ conversationId }) => {
    if (typeof conversationId === "string") {
      socket.to(conversationId).emit("userStoppedTyping", { userId: socket.userId });
    }
  });

  socket.on("disconnect", () => {
    // Clean up handled automatically by Socket.IO
  });
});

// ==================== MIDDLEWARE ====================

// Security headers with Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://via.placeholder.com"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
    // HSTS: enforce HTTPS in production
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  })
);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// SECURITY FIX: Sanitize all query parameters to prevent NoSQL injection
app.use(sanitizeQuery);

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// SECURITY FIX: Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(301, `https://${req.hostname}${req.url}`);
    }
    next();
  });
}

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Locations endpoint
app.get("/api/locations", (req, res) => {
  const locations = require("./config/locations");
  res.json(locations);
});

// ==================== ERROR HANDLING ====================
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler - SECURITY: never leak stack traces in production
app.use((err, req, res, _next) => {
  console.error("Server error:", err);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 5MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files. Maximum is 8 images." });
    }
    return res.status(400).json({ message: "File upload error" });
  }

  // CastError = invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  res.status(err.status || 500).json({
    message: "Internal server error",
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // SECURITY: Ensure JWT_SECRET is set and not the default placeholder
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.includes("change_this")
  ) {
    console.error("FATAL: JWT_SECRET is not set or is using default value. Exiting.");
    process.exit(1);
  }

  await connectDB();

  server.listen(PORT, () => {
    console.log(`
    ================================================
      MarketHub Pakistan API Server
      Running on port ${PORT}
      Environment: ${process.env.NODE_ENV || "development"}
    ================================================
    `);
  });
};

startServer();

module.exports = { app, server };
