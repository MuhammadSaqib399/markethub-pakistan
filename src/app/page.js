"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import CategoryGrid from "@/components/CategoryGrid";
import SearchBar from "@/components/SearchBar";
import { adsAPI } from "@/lib/api";
import ParticleBackground from "@/components/ParticleBackground";
import {
  HiShieldCheck,
  HiUserGroup,
  HiMapPin,
  HiRectangleStack,
  HiArrowRight,
  HiStar,
  HiChatBubbleLeftRight,
  HiPhone,
  HiEnvelope,
  HiQuestionMarkCircle,
  HiClock,
  HiCheckBadge,
  HiCamera,
  HiChatBubbleBottomCenterText,
  HiHandThumbUp,
  HiBuildingOffice2,
} from "react-icons/hi2";

const dummyFeaturedAds = [
  {
    _id: "demo-1",
    title: "iPhone 15 Pro Max 256GB - PTA Approved",
    price: 520000,
    images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop" }],
    location: { city: "Lahore", province: "Punjab" },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    isFeatured: true,
    seller: { isVerified: true },
    category: "Mobiles",
  },
  {
    _id: "demo-2",
    title: "Toyota Corolla 2022 GLi Automatic - Low Mileage",
    price: 4850000,
    images: [{ url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop" }],
    location: { city: "Karachi", province: "Sindh" },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    isFeatured: true,
    seller: { isVerified: true },
    category: "Cars",
  },
  {
    _id: "demo-3",
    title: "5 Marla House for Sale - Bahria Town Phase 8",
    price: 18500000,
    images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" }],
    location: { city: "Rawalpindi", province: "Punjab" },
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    isFeatured: true,
    seller: { isVerified: true },
    category: "Property",
  },
  {
    _id: "demo-4",
    title: "Samsung 55\" Smart TV 4K UHD - Crystal Display",
    price: 145000,
    images: [{ url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop" }],
    location: { city: "Islamabad", province: "ICT" },
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    isFeatured: true,
    seller: { isVerified: false },
    category: "Electronics",
  },
];

const dummyRecentAds = [
  {
    _id: "demo-5",
    title: "MacBook Pro M3 14\" - 16GB RAM 512GB SSD",
    price: 680000,
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop" }],
    location: { city: "Islamabad", province: "ICT" },
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    isFeatured: false,
    seller: { isVerified: true },
    category: "Electronics",
  },
  {
    _id: "demo-6",
    title: "Honda CG 125 - 2023 Model First Owner",
    price: 285000,
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop" }],
    location: { city: "Peshawar", province: "KPK" },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    isFeatured: false,
    seller: { isVerified: false },
    category: "Cars",
  },
  {
    _id: "demo-7",
    title: "Office Furniture Set - Executive Desk & Chair",
    price: 85000,
    images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop" }],
    location: { city: "Faisalabad", province: "Punjab" },
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: true },
    category: "Furniture",
  },
  {
    _id: "demo-8",
    title: "Samsung Galaxy S24 Ultra 12/256 GB",
    price: 340000,
    images: [{ url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop" }],
    location: { city: "Karachi", province: "Sindh" },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: false },
    category: "Mobiles",
  },
  {
    _id: "demo-9",
    title: "3 BHK Apartment for Rent - Gulberg III",
    price: 95000,
    images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop" }],
    location: { city: "Lahore", province: "Punjab" },
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: true },
    category: "Property",
  },
  {
    _id: "demo-10",
    title: "Sony PlayStation 5 Slim with 2 Controllers",
    price: 135000,
    images: [{ url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop" }],
    location: { city: "Multan", province: "Punjab" },
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: false },
    category: "Electronics",
  },
  {
    _id: "demo-11",
    title: "Men's Formal Suit - Premium Wool Blend",
    price: 12500,
    images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop" }],
    location: { city: "Lahore", province: "Punjab" },
    createdAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: false },
    category: "Fashion",
  },
  {
    _id: "demo-12",
    title: "German Shepherd Puppies - Vaccinated & Healthy",
    price: 45000,
    images: [{ url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop" }],
    location: { city: "Rawalpindi", province: "Punjab" },
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    isFeatured: false,
    seller: { isVerified: true },
    category: "Animals",
  },
];

const customerReviews = [
  {
    id: 1,
    name: "Ahmed Khan",
    city: "Lahore",
    rating: 5,
    review: "Mujhe apni purani car yahan bechi, sirf 3 din mein buyer mil gaya! Bohat acha platform hai, highly recommended for everyone.",
    date: "2 weeks ago",
    avatar: "AK",
    bgColor: "bg-green-500",
  },
  {
    id: 2,
    name: "Fatima Noor",
    city: "Karachi",
    rating: 5,
    review: "As a woman seller, I felt very safe using Elyndra. Verified buyers, quick responses, and sold my furniture set within a week!",
    date: "1 week ago",
    avatar: "FN",
    bgColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Usman Ali",
    city: "Islamabad",
    rating: 4,
    review: "iPhone 14 Pro liya yahan se, seller verified tha aur phone bhi original. Price bhi market se kam mila. Great experience overall!",
    date: "3 days ago",
    avatar: "UA",
    bgColor: "bg-blue-500",
  },
  {
    id: 4,
    name: "Ayesha Tariq",
    city: "Rawalpindi",
    rating: 5,
    review: "Maine apna ghar rent pe diya Elyndra ke through. Bahut reliable tenants mile. Customer support ne bhi bohat help ki!",
    date: "5 days ago",
    avatar: "AT",
    bgColor: "bg-pink-500",
  },
  {
    id: 5,
    name: "Bilal Hussain",
    city: "Faisalabad",
    rating: 4,
    review: "Best marketplace in Pakistan! Bought a Honda CG 125, the chat feature made negotiation super easy. Seller was very cooperative.",
    date: "1 week ago",
    avatar: "BH",
    bgColor: "bg-amber-500",
  },
  {
    id: 6,
    name: "Sana Malik",
    city: "Multan",
    rating: 5,
    review: "I run a small clothing business and Elyndra helped me reach customers across Pakistan. Orders doubled in just one month!",
    date: "4 days ago",
    avatar: "SM",
    bgColor: "bg-teal-500",
  },
];

const supportFeatures = [
  {
    icon: HiChatBubbleLeftRight,
    title: "Live Chat Support",
    desc: "Get instant help from our support team. Available 24/7 to resolve your queries in real-time.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: HiPhone,
    title: "Phone Support",
    desc: "Call us at 0800-MARKET (627538). Our dedicated team speaks Urdu, English & regional languages.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: HiEnvelope,
    title: "Email Support",
    desc: "Email us at support@elyndra.pk. We respond within 2 hours during business hours.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: HiQuestionMarkCircle,
    title: "Help Center",
    desc: "Browse our comprehensive FAQ section with 200+ articles covering buying, selling & account help.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: HiShieldCheck,
    title: "Fraud Protection",
    desc: "Our team monitors suspicious activity 24/7. Report scams and we take action within 1 hour.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: HiClock,
    title: "Quick Resolution",
    desc: "95% of disputes resolved within 48 hours. Your satisfaction and safety is our top priority.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <HiStar
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [featuredAds, setFeaturedAds] = useState([]);
  const [recentAds, setRecentAds] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await adsAPI.getFeatured();
        const ads = res.data?.ads || res.data || [];
        setFeaturedAds(ads.length > 0 ? ads : dummyFeaturedAds);
      } catch (err) {
        console.error("Failed to fetch featured ads:", err);
        setFeaturedAds(dummyFeaturedAds);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const fetchRecent = async () => {
      try {
        const res = await adsAPI.getRecent();
        const ads = res.data?.ads || res.data || [];
        setRecentAds(ads.length > 0 ? ads : dummyRecentAds);
      } catch (err) {
        console.error("Failed to fetch recent ads:", err);
        setRecentAds(dummyRecentAds);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchFeatured();
    fetchRecent();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-700">
        {/* Interactive particle background */}
        <ParticleBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-5">
            {/* Brand Name — Unique Bold Design */}
            <div className="relative inline-block">
              {/* Background glow blur */}
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 scale-150" />
              <h1 className="relative brand-name brand-underline">
                <span className="block text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight brand-gradient-text brand-glow leading-none">
                  ELYNDRA
                </span>
              </h1>
            </div>

            {/* Slogan — Elegant & Animated */}
            <div className="slogan-reveal">
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
                <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-yellow-200/60" />
                <p className="brand-slogan text-base sm:text-lg lg:text-xl text-white/90 font-light tracking-widest uppercase">
                  We won&apos;t praise it
                </p>
                <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-yellow-200/60" />
              </div>
              <p className="brand-slogan text-xl sm:text-2xl lg:text-3xl text-yellow-100 font-semibold tracking-wide">
                You&apos;ll <span className="text-white font-extrabold italic">Experience</span> It.
              </p>
            </div>

            <p className="text-sm sm:text-base text-yellow-50/80 max-w-xl mx-auto pt-2 brand-slogan font-light tracking-wide">
              Pakistan&apos;s fastest growing marketplace. Discover great deals
              on mobiles, cars, property, electronics, and more near you.
            </p>

            <div className="max-w-3xl mx-auto pt-4">
              <SearchBar />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-yellow-50 text-sm">
              <span className="flex items-center gap-1.5">
                <HiShieldCheck className="h-5 w-5" />
                Verified Sellers
              </span>
              <span className="flex items-center gap-1.5">
                <HiMapPin className="h-5 w-5" />
                All Major Cities
              </span>
              <span className="flex items-center gap-1.5">
                <HiStar className="h-5 w-5" />
                Free to Post
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Browse Categories
            </h2>
            <p className="text-gray-500 mt-1">
              Find what you&apos;re looking for
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            View All <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-500 mt-2">Selling and buying has never been this easy</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white text-green-600 transition-all duration-300 group-hover:scale-110">
                <HiCamera className="h-8 w-8" />
              </div>
              <div className="bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto -mt-2 mb-3">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Post Your Ad</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Take photos, write a description, set your price. It&apos;s completely free and takes less than 2 minutes.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-all duration-300 group-hover:scale-110">
                <HiChatBubbleBottomCenterText className="h-8 w-8" />
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto -mt-2 mb-3">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get Responses</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Interested buyers will contact you via chat or phone. Negotiate the best deal with verified users.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white text-amber-600 transition-all duration-300 group-hover:scale-110">
                <HiHandThumbUp className="h-8 w-8" />
              </div>
              <div className="bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto -mt-2 mb-3">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Close the Deal</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Meet in a safe public place, inspect the item, and complete the transaction. It&apos;s that simple!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HiStar className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                  Featured
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured Listings
              </h2>
            </div>
            <Link
              href="/search?sort=featured"
              className="hidden sm:flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
            >
              See All <HiArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : featuredAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAds.slice(0, 8).map((ad) => (
                <AdCard key={ad._id || ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <HiRectangleStack className="h-12 w-12 mx-auto mb-3" />
              <p className="text-lg">No featured listings right now</p>
            </div>
          )}
        </div>
      </section>

      {/* Recently Posted */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Recently Posted
            </h2>
            <p className="text-gray-500 mt-1">Fresh deals added just now</p>
          </div>
          <Link
            href="/search?sort=newest"
            className="hidden sm:flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            See All <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingRecent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAds.slice(0, 8).map((ad) => (
              <AdCard key={ad._id || ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <HiRectangleStack className="h-12 w-12 mx-auto mb-3" />
            <p className="text-lg">No recent listings yet</p>
          </div>
        )}
      </section>

      {/* Customer Ratings & Reviews */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HiStar className="h-6 w-6 text-amber-400" />
              <HiStar className="h-6 w-6 text-amber-400" />
              <HiStar className="h-6 w-6 text-amber-400" />
              <HiStar className="h-6 w-6 text-amber-400" />
              <HiStar className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Trusted by over 100,000 buyers and sellers across Pakistan. Here&apos;s what they think about us.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">4.8/5</p>
                <p className="text-xs text-gray-400">Average Rating</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">25K+</p>
                <p className="text-xs text-gray-400">Reviews</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-xs text-gray-400">Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${review.bgColor} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{review.name}</h4>
                      <HiCheckBadge className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>
                    <p className="text-xs text-gray-400">{review.city}</p>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <StarRating rating={review.rating} />
                <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              <HiChatBubbleLeftRight className="h-3.5 w-3.5" />
              Always Here for You
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Customer Support
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              We&apos;re committed to making your buying and selling experience smooth and safe. Reach out anytime!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-gray-100 p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Need Immediate Help?</h3>
            <p className="text-green-100 mb-6 max-w-lg mx-auto text-sm">
              Our support team is available around the clock. Don&apos;t hesitate to reach out!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/help"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
              >
                <HiQuestionMarkCircle className="h-5 w-5" />
                Visit Help Center
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-green-500/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-green-500/30 transition-colors text-sm"
              >
                <HiEnvelope className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Popular Cities
          </h2>
          <p className="text-gray-500 mt-2">Browse listings in major cities across Pakistan</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { city: "Lahore", province: "Punjab", ads: "15,200", img: "https://images.unsplash.com/photo-1567527259232-a90f1e8e10c3?w=400&h=250&fit=crop" },
            { city: "Karachi", province: "Sindh", ads: "18,500", img: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=400&h=250&fit=crop" },
            { city: "Islamabad", province: "ICT", ads: "9,800", img: "https://images.unsplash.com/photo-1603912699214-92627f304eb6?w=400&h=250&fit=crop" },
            { city: "Rawalpindi", province: "Punjab", ads: "7,340", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop" },
            { city: "Faisalabad", province: "Punjab", ads: "5,120", img: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400&h=250&fit=crop" },
            { city: "Multan", province: "Punjab", ads: "4,250", img: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=400&h=250&fit=crop" },
            { city: "Peshawar", province: "KPK", ads: "3,870", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" },
            { city: "Quetta", province: "Balochistan", ads: "1,560", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop" },
          ].map((c) => (
            <Link
              key={c.city}
              href={`/search?province=${encodeURIComponent(c.province)}&city=${encodeURIComponent(c.city)}`}
              className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="relative h-32 sm:h-36">
                <Image
                  src={c.img}
                  alt={c.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1.5">
                    <HiBuildingOffice2 className="h-4 w-4 text-white/80" />
                    <h3 className="text-white font-bold text-sm">{c.city}</h3>
                  </div>
                  <p className="text-white/70 text-xs mt-0.5">{c.ads} ads available</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner Ad Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-200 rounded-2xl p-8 sm:p-12 text-center">
          <p className="text-green-700 font-semibold text-lg mb-1">
            Promote Your Business Here
          </p>
          <p className="text-green-600 text-sm mb-4">
            Reach millions of buyers across Pakistan
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
          >
            Advertise with Us
            <HiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <HiUserGroup className="h-7 w-7 text-green-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                100K+
              </p>
              <p className="text-gray-400 mt-1 text-sm font-medium uppercase tracking-wide">
                Active Users
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <HiRectangleStack className="h-7 w-7 text-green-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                50K+
              </p>
              <p className="text-gray-400 mt-1 text-sm font-medium uppercase tracking-wide">
                Live Listings
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <HiMapPin className="h-7 w-7 text-green-400" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">
                7
              </p>
              <p className="text-gray-400 mt-1 text-sm font-medium uppercase tracking-wide">
                Major Cities
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
