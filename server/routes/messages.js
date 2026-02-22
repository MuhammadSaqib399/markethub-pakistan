/**
 * Messaging Routes
 * In-app chat system between buyers and sellers
 */
const express = require("express");
const router = express.Router();
const { Message, Conversation } = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");
const { messageLimiter } = require("../middleware/rateLimiter");

// SECURITY: Helper to validate MongoDB ObjectId format
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==================== GET USER'S CONVERSATIONS ====================
router.get("/conversations", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name avatar isVerifiedSeller")
      .populate("ad", "title price images slug")
      .sort({ updatedAt: -1 })
      .lean();

    // Add unread count for current user to each conversation
    const withUnread = conversations.map((conv) => ({
      ...conv,
      myUnreadCount: conv.unreadCount?.get?.(req.user._id.toString()) || 0,
    }));

    res.json({ conversations: withUnread });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching conversations" });
  }
});

// ==================== START OR GET CONVERSATION ====================
router.post("/conversations", protect, async (req, res) => {
  try {
    const { adId, sellerId } = req.body;

    // SECURITY: Validate IDs before querying database
    if (!isValidId(adId) || !isValidId(sellerId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Can't message yourself
    if (sellerId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Check if seller exists and if user is blocked
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }
    if (seller.blockedUsers?.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "You cannot message this user" });
    }

    // Check for existing conversation about this ad between these users
    let conversation = await Conversation.findOne({
      ad: adId,
      participants: { $all: [req.user._id, sellerId] },
    })
      .populate("participants", "name avatar isVerifiedSeller")
      .populate("ad", "title price images slug");

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        ad: adId,
        participants: [req.user._id, sellerId],
        unreadCount: new Map(),
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "name avatar isVerifiedSeller")
        .populate("ad", "title price images slug");
    }

    res.json({ conversation });
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET MESSAGES IN A CONVERSATION ====================
router.get("/conversations/:conversationId", protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // SECURITY: Proper ObjectId comparison for participant check
    if (!conversation.participants.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { page = 1 } = req.query;
    const limit = 50;
    const skip = (Number(page) - 1) * limit;

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name avatar")
      .lean();

    // Mark messages as read for current user
    await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    // Reset unread count
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching messages" });
  }
});

// ==================== MARK CONVERSATION AS READ ====================
router.patch("/conversations/:conversationId/read", protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.some((id) => id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Message.updateMany(
      {
        conversation: conversation._id,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== SEND MESSAGE ====================
router.post(
  "/conversations/:conversationId/messages",
  protect,
  messageLimiter,
  async (req, res) => {
    try {
      const { text } = req.body;
      const conversation = await Conversation.findById(
        req.params.conversationId
      );

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      if (!conversation.participants.some((id) => id.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ message: "Message text is required" });
      }
      if (text.length > 2000) {
        return res.status(400).json({ message: "Message cannot exceed 2000 characters" });
      }

      // Create message
      const message = await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        text: text.trim(),
      });

      // Update conversation's last message
      conversation.lastMessage = {
        text: text.trim(),
        sender: req.user._id,
        createdAt: new Date(),
      };

      // Increment unread count for the other participant
      const otherUser = conversation.participants.find(
        (p) => p.toString() !== req.user._id.toString()
      );
      const currentUnread =
        conversation.unreadCount.get(otherUser.toString()) || 0;
      conversation.unreadCount.set(otherUser.toString(), currentUnread + 1);

      await conversation.save();

      const populated = await Message.findById(message._id).populate(
        "sender",
        "name avatar"
      );

      // Emit socket event for real-time messaging
      const io = req.app.get("io");
      if (io) {
        io.to(otherUser.toString()).emit("newMessage", {
          message: populated,
          conversationId: conversation._id,
        });
      }

      res.status(201).json({ message: populated });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Server error sending message" });
    }
  }
);

module.exports = router;
