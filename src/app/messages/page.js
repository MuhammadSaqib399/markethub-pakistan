"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import { useAuth } from "@/context/AuthContext";
import { messagesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  HiChatBubbleLeftRight,
  HiArrowLeft,
  HiMagnifyingGlass,
  HiEllipsisVertical,
  HiInboxStack,
} from "react-icons/hi2";

dayjs.extend(relativeTime);

export default function MessagesPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    }>
      <MessagesPage />
    </Suspense>
  );
}

function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await messagesAPI.getConversations();
      const data = res.data?.conversations || res.data || [];
      setConversations(data);

      // Auto-select from query params
      const adId = searchParams.get("adId");
      const sellerId = searchParams.get("sellerId");
      if (adId && sellerId) {
        const existing = data.find(
          (c) =>
            (c.adId === adId || c.ad?._id === adId || c.ad?.id === adId) &&
            (c.otherUser?._id === sellerId ||
              c.otherUser?.id === sellerId ||
              c.sellerId === sellerId)
        );
        if (existing) {
          setSelectedConversation(existing);
          setMobileShowChat(true);
        } else {
          // Create new conversation context
          setSelectedConversation({
            adId,
            otherUser: { _id: sellerId, id: sellerId },
            isNew: true,
          });
          setMobileShowChat(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  // Poll for new messages
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchConversations]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setMobileShowChat(true);

    // Mark as read
    if (conv.unreadCount > 0) {
      const convId = conv._id || conv.id;
      messagesAPI.markRead(convId).catch(() => {});
      setConversations((prev) =>
        prev.map((c) =>
          (c._id || c.id) === convId ? { ...c, unreadCount: 0 } : c
        )
      );
    }
  };

  const handleBackToList = () => {
    setMobileShowChat(false);
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name = conv.otherUser?.name || "";
    const lastMsg = conv.lastMessage?.text || conv.lastMessage || "";
    const adTitle = conv.ad?.title || "";
    const q = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      String(lastMsg).toLowerCase().includes(q) ||
      adTitle.toLowerCase().includes(q)
    );
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)] flex">
          {/* Conversation List */}
          <div
            className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${
              mobileShowChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* List Header */}
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HiChatBubbleLeftRight className="h-5 w-5 text-green-600" />
                Messages
              </h2>

              {/* Search */}
              <div className="relative mt-3">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-1 p-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length > 0 ? (
                <div className="p-2 space-y-0.5">
                  {filteredConversations.map((conv) => {
                    const isSelected =
                      (selectedConversation?._id || selectedConversation?.id) ===
                      (conv._id || conv.id);
                    const otherUser = conv.otherUser || {};
                    const lastMsg =
                      typeof conv.lastMessage === "string"
                        ? conv.lastMessage
                        : conv.lastMessage?.text || "";
                    const unread = conv.unreadCount || 0;

                    return (
                      <button
                        key={conv._id || conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                          isSelected
                            ? "bg-green-50 border border-green-100"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm">
                              {(otherUser.name || "U").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3
                              className={`text-sm truncate ${
                                unread > 0
                                  ? "font-bold text-gray-900"
                                  : "font-medium text-gray-700"
                              }`}
                            >
                              {otherUser.name || "User"}
                            </h3>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {conv.updatedAt
                                ? dayjs(conv.updatedAt).fromNow(true)
                                : ""}
                            </span>
                          </div>
                          {conv.ad?.title && (
                            <p className="text-[11px] text-green-600 truncate">
                              {conv.ad.title}
                            </p>
                          )}
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                            }`}
                          >
                            {lastMsg || "Start a conversation"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <HiInboxStack className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {searchQuery ? "No results" : "No conversations yet"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {searchQuery
                      ? "Try a different search term"
                      : "Start chatting by messaging a seller on their ad"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`flex-1 flex flex-col ${
              mobileShowChat ? "flex" : "hidden md:flex"
            }`}
          >
            {selectedConversation ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <HiArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 font-bold text-sm">
                      {(
                        selectedConversation.otherUser?.name || "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {selectedConversation.otherUser?.name || "User"}
                    </h3>
                    {selectedConversation.ad?.title && (
                      <p className="text-xs text-gray-500 truncate">
                        Re: {selectedConversation.ad.title}
                      </p>
                    )}
                  </div>

                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <HiEllipsisVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* ChatBox Component */}
                <div className="flex-1 overflow-hidden">
                  <ChatBox
                    conversationId={selectedConversation._id || selectedConversation.id}
                    adId={selectedConversation.adId || selectedConversation.ad?._id || selectedConversation.ad?.id}
                    otherUserId={
                      selectedConversation.otherUser?._id ||
                      selectedConversation.otherUser?.id
                    }
                    currentUser={user}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <HiChatBubbleLeftRight className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Your Messages
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Select a conversation from the list to start chatting, or
                  visit an ad page and click &ldquo;Chat with Seller&rdquo; to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
