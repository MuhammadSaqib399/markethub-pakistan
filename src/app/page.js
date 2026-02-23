"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import CategoryGrid from "@/components/CategoryGrid";
import SearchBar from "@/components/SearchBar";
import { adsAPI } from "@/lib/api";
import {
  HiShieldCheck,
  HiUserGroup,
  HiMapPin,
  HiRectangleStack,
  HiArrowRight,
  HiStar,
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
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300 rounded-full mix-blend-overlay filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Buy & Sell{" "}
              <span className="text-green-200">Anything</span>
              <br />
              in Pakistan
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
              Pakistan&apos;s fastest growing marketplace. Discover great deals
              on mobiles, cars, property, electronics, and more near you.
            </p>

            <div className="max-w-3xl mx-auto pt-4">
              <SearchBar />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-green-100 text-sm">
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
