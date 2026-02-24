"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HiBanknotes,
  HiArrowTrendingDown,
  HiClock,
  HiUser,
  HiFire,
  HiChatBubbleLeftRight,
  HiHandRaised,
  HiCheckCircle,
  HiXCircle,
  HiArrowPath,
} from "react-icons/hi2";

/* ── Live bargain items (demo data) ──────────────────────────── */
const LIVE_BARGAINS = [
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
    seller: "Ali Hassan",
    sellerCity: "Lahore",
    originalPrice: 285000,
    currentBid: 245000,
    minAccept: 240000,
    bids: 7,
    timeLeft: 1200,
    category: "Mobiles",
    hot: true,
  },
  {
    id: 2,
    title: "Honda Civic 2020 VTi Oriel",
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400&h=300&fit=crop",
    seller: "Usman Tariq",
    sellerCity: "Islamabad",
    originalPrice: 5800000,
    currentBid: 5350000,
    minAccept: 5200000,
    bids: 12,
    timeLeft: 3600,
    category: "Cars",
    hot: true,
  },
  {
    id: 3,
    title: "MacBook Air M2 2023",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    seller: "Ahmed Raza",
    sellerCity: "Karachi",
    originalPrice: 320000,
    currentBid: 278000,
    minAccept: 270000,
    bids: 5,
    timeLeft: 900,
    category: "Electronics",
    hot: false,
  },
  {
    id: 4,
    title: "Samsung Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop",
    seller: "Bilal Khan",
    sellerCity: "Rawalpindi",
    originalPrice: 250000,
    currentBid: 215000,
    minAccept: 210000,
    bids: 9,
    timeLeft: 2400,
    category: "Mobiles",
    hot: true,
  },
  {
    id: 5,
    title: "5 Marla House DHA Phase 6",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    seller: "Malik Properties",
    sellerCity: "Lahore",
    originalPrice: 18500000,
    currentBid: 17200000,
    minAccept: 17000000,
    bids: 4,
    timeLeft: 7200,
    category: "Property",
    hot: false,
  },
  {
    id: 6,
    title: "PlayStation 5 + 3 Games Bundle",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
    seller: "Hamza Ali",
    sellerCity: "Faisalabad",
    originalPrice: 145000,
    currentBid: 118000,
    minAccept: 115000,
    bids: 11,
    timeLeft: 1800,
    category: "Electronics",
    hot: true,
  },
  {
    id: 7,
    title: "Royal Enfield Classic 350",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop",
    seller: "Farhan Bikes",
    sellerCity: "Multan",
    originalPrice: 850000,
    currentBid: 740000,
    minAccept: 720000,
    bids: 6,
    timeLeft: 4500,
    category: "Cars",
    hot: false,
  },
  {
    id: 8,
    title: "L-Shaped Sofa Set Imported",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    seller: "Furniture Hub",
    sellerCity: "Peshawar",
    originalPrice: 95000,
    currentBid: 72000,
    minAccept: 68000,
    bids: 8,
    timeLeft: 5400,
    category: "Furniture",
    hot: false,
  },
];

function formatPKR(n) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lakh`;
  return `Rs ${n.toLocaleString("en-PK")}`;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function BargainCard({ item, onBid }) {
  const [timeLeft, setTimeLeft] = useState(item.timeLeft);
  const [currentBid, setCurrentBid] = useState(item.currentBid);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidInput, setShowBidInput] = useState(false);
  const [bidStatus, setBidStatus] = useState(null); // 'success' | 'rejected' | null

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const discount = Math.round(((item.originalPrice - currentBid) / item.originalPrice) * 100);
  const isUrgent = timeLeft < 600;

  const handleBid = () => {
    const amount = parseInt(bidAmount);
    if (!amount || amount >= currentBid) return;

    if (amount >= item.minAccept) {
      setCurrentBid(amount);
      setBidStatus("success");
      setTimeout(() => setBidStatus(null), 3000);
    } else {
      setBidStatus("rejected");
      setTimeout(() => setBidStatus(null), 3000);
    }
    setBidAmount("");
    setShowBidInput(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.hot && (
            <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <HiFire className="h-3 w-3" /> HOT
            </span>
          )}
          <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        </div>
        {/* Timer */}
        <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isUrgent ? "bg-red-500 text-white animate-pulse" : "bg-black/60 text-white"}`}>
          <HiClock className="h-3 w-3" />
          {timeLeft > 0 ? formatTime(timeLeft) : "ENDED"}
        </div>
        {/* Category */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base truncate">{item.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <HiUser className="h-3.5 w-3.5" />
          <span>{item.seller}</span>
          <span className="text-gray-300">|</span>
          <span>{item.sellerCity}</span>
        </div>

        {/* Pricing */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">{formatPKR(item.originalPrice)}</span>
            <HiArrowTrendingDown className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-extrabold text-green-600">{formatPKR(currentBid)}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {item.bids} bids
            </span>
          </div>
        </div>

        {/* Bid Status */}
        {bidStatus === "success" && (
          <div className="mt-2 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg">
            <HiCheckCircle className="h-4 w-4" /> Bid accepted! New lowest price set.
          </div>
        )}
        {bidStatus === "rejected" && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg">
            <HiXCircle className="h-4 w-4" /> Seller rejected. Try a higher amount.
          </div>
        )}

        {/* Bid Input */}
        {showBidInput ? (
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Below ${formatPKR(currentBid)}`}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              autoFocus
            />
            <button
              onClick={handleBid}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
            >
              Send
            </button>
            <button
              onClick={() => setShowBidInput(false)}
              className="text-gray-400 hover:text-gray-600 px-2"
            >
              <HiXCircle className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => timeLeft > 0 && setShowBidInput(true)}
              disabled={timeLeft === 0}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiHandRaised className="h-4 w-4" />
              {timeLeft > 0 ? "Place Bargain" : "Ended"}
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              <HiChatBubbleLeftRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BargainPage() {
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const categories = ["all", "Mobiles", "Cars", "Property", "Electronics", "Furniture"];

  const filteredItems = filter === "all"
    ? LIVE_BARGAINS
    : LIVE_BARGAINS.filter((b) => b.category === filter);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE NOW
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-3">
              Live Bargain
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
              Real-time mol-tol! Place your offer, bargain directly with sellers, and get the best deals across Pakistan.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <HiFire className="h-5 w-5" />
                <span><strong>{LIVE_BARGAINS.filter(b => b.hot).length}</strong> Hot Deals</span>
              </div>
              <div className="flex items-center gap-2">
                <HiBanknotes className="h-5 w-5" />
                <span><strong>{LIVE_BARGAINS.length}</strong> Active Bargains</span>
              </div>
              <div className="flex items-center gap-2">
                <HiUser className="h-5 w-5" />
                <span><strong>142</strong> Online Buyers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === cat
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {cat === "all" ? "All Deals" : cat}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-orange-600 hover:border-orange-300 transition ${refreshing ? "animate-spin" : ""}`}
          >
            <HiArrowPath className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* How it works banner */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-3">How Live Bargain Works?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <p className="font-semibold text-gray-700">Choose a Deal</p>
                <p className="text-gray-500">Browse live bargains with countdown timers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <p className="font-semibold text-gray-700">Place Your Offer</p>
                <p className="text-gray-500">Enter your bargain price below the current bid</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <p className="font-semibold text-gray-700">Get the Deal!</p>
                <p className="text-gray-500">If seller accepts, the deal is yours at your price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <BargainCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <HiBanknotes className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No bargains in this category</h3>
            <p className="text-gray-400 mt-1">Check other categories or come back later</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Want to Sell with Bargain?</h2>
          <p className="text-green-100 max-w-lg mx-auto mb-6">
            Post your ad with Live Bargain enabled and let buyers compete for the best price. More exposure, faster sales!
          </p>
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3 rounded-xl text-sm font-bold hover:bg-green-50 transition shadow-lg"
          >
            Post Ad with Live Bargain
          </Link>
        </div>
      </div>
    </div>
  );
}
