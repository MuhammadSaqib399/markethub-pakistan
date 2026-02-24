"use client";

/**
 * ChatBox.js — Elyndra Pakistan
 * ─────────────────────────────────────────────────────────────
 * Real-time messaging component for buyer–seller conversations.
 *
 * Features:
 *  - Ad info banner at the top of the chat
 *  - Message bubbles — left for the other party, right for self
 *  - Typing indicator (animated dots)
 *  - Auto-scroll to the newest message
 *  - Text input with send button at the bottom
 *
 * Dependencies:
 *  - @/lib/api  (messagesAPI)
 *  - react-icons/hi2
 *  - dayjs for timestamp formatting
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import {
  HiPaperAirplane,
  HiPhoto,
  HiArrowLeft,
  HiShieldCheck,
} from "react-icons/hi2";
import { messagesAPI } from "@/lib/api";

/**
 * @param {Object}  props
 * @param {string}  props.conversationId   — unique conversation ID
 * @param {Object}  props.currentUser      — the logged-in user { _id, name }
 * @param {Object}  props.otherUser        — the chat partner { _id, name, isVerified }
 * @param {Object}  [props.ad]             — linked ad { _id, title, price, images }
 * @param {boolean} [props.isOtherTyping]  — external typing indicator flag
 * @param {Function} [props.onBack]        — callback for the back button (mobile)
 */
export default function ChatBox({
  conversationId,
  currentUser,
  otherUser,
  ad,
  isOtherTyping = false,
  onBack,
}) {
  // ── State ───────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Fetch conversation messages ─────────────────────────────
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const res = await messagesAPI.getMessages(conversationId);
      setMessages(res.data ?? res ?? []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ── Auto-scroll to the newest message ───────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  // ── Send a message ──────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || sending) return;

    // Optimistic UI update
    const optimistic = {
      _id: `temp-${Date.now()}`,
      sender: currentUser._id,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    inputRef.current?.focus();

    try {
      setSending(true);
      const res = await messagesAPI.sendMessage(conversationId, { text });
      // Replace the optimistic message with the server response
      setMessages((prev) =>
        prev.map((m) => (m._id === optimistic._id ? (res.data ?? res) : m))
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove the optimistic message on failure
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      setNewMessage(text); // restore the draft
    } finally {
      setSending(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────
  const isSelf = (msg) => msg.sender === currentUser?._id;

  const formatTime = (date) =>
    dayjs(date).format("h:mm A");

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">

      {/* ── Header: Ad info + other user ────────────────────── */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        {/* Back button (mobile) */}
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Back"
          >
            <HiArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Ad thumbnail */}
        {ad && (
          <div className="hidden sm:block relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={ad.images?.[0] || "/placeholder-ad.png"}
              alt={ad.title || "Ad"}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}

        {/* Ad title + other user */}
        <div className="flex-1 min-w-0">
          {ad && (
            <p className="text-sm font-semibold text-gray-800 truncate">
              {ad.title}
            </p>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="truncate">{otherUser?.name ?? "User"}</span>
            {otherUser?.isVerified && (
              <HiShieldCheck className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Ad price */}
        {ad?.price != null && (
          <span className="text-sm font-bold text-green-600 flex-shrink-0">
            Rs. {Number(ad.price).toLocaleString("en-PK")}
          </span>
        )}
      </div>

      {/* ── Messages Area ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          /* Loading skeleton */
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
            <span className="text-sm">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <HiPhoto className="h-10 w-10 mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          /* Message bubbles */
          messages.map((msg) => {
            const self = isSelf(msg);
            return (
              <div
                key={msg._id}
                className={`flex ${self ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                    ${
                      self
                        ? "bg-green-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                    }`}
                >
                  {/* Message text */}
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  {/* Timestamp */}
                  <span
                    className={`mt-1 block text-[10px] text-right ${
                      self ? "text-green-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* ── Typing Indicator ────────────────────────────────── */}
        {isOtherTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white border border-gray-200 px-4 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Message Input ───────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-200 bg-white px-4 py-3"
      >
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm
                     placeholder:text-gray-400 focus:border-green-500 focus:ring-2
                     focus:ring-green-200 outline-none transition"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600
                     text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed
                     transition"
          aria-label="Send message"
        >
          <HiPaperAirplane className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
