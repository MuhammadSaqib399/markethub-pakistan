"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import { adsAPI } from "@/lib/api";
import {
  HiChevronRight,
  HiArrowsUpDown,
  HiFunnel,
  HiXMark,
  HiMagnifyingGlass,
  HiDevicePhoneMobile,
  HiTruck,
  HiHome,
  HiComputerDesktop,
  HiBriefcase,
  HiWrenchScrewdriver,
  HiSparkles,
  HiCube,
  HiHeart,
  HiBookOpen,
  HiBolt,
  HiFaceSmile,
  HiRectangleStack,
  HiAdjustmentsHorizontal,
} from "react-icons/hi2";

const CATEGORY_DATA = {
  Mobiles: {
    icon: HiDevicePhoneMobile,
    hero: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&h=400&fit=crop",
    tagline: "Find the Best Mobile Deals in Pakistan",
    description: "From iPhones to Samsung, Xiaomi to Oppo - buy & sell new and used smartphones at the best prices.",
    color: "from-blue-600 to-indigo-700",
    ads: [
      { _id: "mob-1", title: "iPhone 15 Pro Max 256GB - PTA Approved", price: 520000, images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "mob-2", title: "Samsung Galaxy S24 Ultra 12/256GB", price: 340000, images: [{ url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "mob-3", title: "Xiaomi 14 Pro - 12GB RAM 256GB", price: 185000, images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "mob-4", title: "iPhone 14 128GB - Mint Condition", price: 320000, images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "mob-5", title: "Oppo Reno 12 Pro 5G - Brand New", price: 125000, images: [{ url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "mob-6", title: "Google Pixel 8 Pro - 128GB Obsidian", price: 245000, images: [{ url: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "mob-7", title: "Realme GT 5 Pro - Gaming Phone", price: 98000, images: [{ url: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 15*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "mob-8", title: "OnePlus 12 - 16GB/512GB Flowy Emerald", price: 210000, images: [{ url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 9*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
    ],
  },
  Cars: {
    icon: HiTruck,
    hero: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=400&fit=crop",
    tagline: "Buy & Sell Cars Across Pakistan",
    description: "Toyota, Honda, Suzuki, Hyundai - find your dream car or sell your vehicle quickly and safely.",
    color: "from-red-600 to-rose-700",
    ads: [
      { _id: "car-1", title: "Toyota Corolla 2022 GLi Automatic", price: 4850000, images: [{ url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 4*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "car-2", title: "Honda Civic 2023 Oriel - Top Variant", price: 7200000, images: [{ url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "car-3", title: "Suzuki Alto VXR 2024 - Zero Meter", price: 2950000, images: [{ url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "car-4", title: "Honda CG 125 - 2023 Model First Owner", price: 285000, images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "car-5", title: "Toyota Yaris 2021 ATIV X CVT", price: 4100000, images: [{ url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "car-6", title: "Hyundai Tucson 2022 - AWD Ultimate", price: 8500000, images: [{ url: "https://images.unsplash.com/photo-1606611013016-969c19ba27cc?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "car-7", title: "Suzuki Cultus VXL 2023 - AGS", price: 3200000, images: [{ url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 18*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "car-8", title: "KIA Sportage 2023 Alpha AWD", price: 9800000, images: [{ url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 7*3600000).toISOString(), seller: { isVerified: true } },
    ],
  },
  Property: {
    icon: HiHome,
    hero: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&h=400&fit=crop",
    tagline: "Find Your Dream Property in Pakistan",
    description: "Houses, apartments, plots, commercial spaces - buy, sell or rent property across all major cities.",
    color: "from-emerald-600 to-green-700",
    ads: [
      { _id: "prop-1", title: "5 Marla House for Sale - Bahria Town Phase 8", price: 18500000, images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "prop-2", title: "3 BHK Apartment for Rent - Gulberg III", price: 95000, images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "prop-3", title: "10 Marla Plot - DHA Phase 6", price: 32000000, images: [{ url: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "prop-4", title: "Studio Apartment - Bahria Town Karachi", price: 5500000, images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "prop-5", title: "1 Kanal House - F-7 Islamabad", price: 85000000, images: [{ url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 24*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "prop-6", title: "Commercial Shop - Johar Town", price: 12000000, images: [{ url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 16*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "prop-7", title: "2 Bed Flat - Clifton Block 5", price: 35000000, images: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 20*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "prop-8", title: "5 Marla Plot - Citi Housing Faisalabad", price: 4200000, images: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: false } },
    ],
  },
  Electronics: {
    icon: HiComputerDesktop,
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&h=400&fit=crop",
    tagline: "Best Electronics Deals in Pakistan",
    description: "Laptops, TVs, gaming consoles, cameras, home appliances - find the latest tech at great prices.",
    color: "from-violet-600 to-purple-700",
    ads: [
      { _id: "elec-1", title: "MacBook Pro M3 14\" - 16GB RAM 512GB", price: 680000, images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "elec-2", title: "Samsung 55\" Smart TV 4K UHD", price: 145000, images: [{ url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 4*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "elec-3", title: "Sony PlayStation 5 Slim with 2 Controllers", price: 135000, images: [{ url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "elec-4", title: "Dell XPS 15 - Core i7 13th Gen", price: 420000, images: [{ url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "elec-5", title: "Canon EOS R6 Mark II - Full Frame", price: 560000, images: [{ url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "elec-6", title: "AirPods Pro 2nd Gen - USB-C", price: 52000, images: [{ url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "elec-7", title: "LG Washing Machine 9KG Front Load", price: 95000, images: [{ url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 15*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "elec-8", title: "iPad Pro M2 12.9\" - 256GB WiFi", price: 295000, images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: true } },
    ],
  },
  Jobs: {
    icon: HiBriefcase,
    hero: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=400&fit=crop",
    tagline: "Find Jobs & Hire Talent in Pakistan",
    description: "Software development, marketing, accounting, teaching - discover career opportunities near you.",
    color: "from-amber-600 to-orange-700",
    ads: [
      { _id: "job-1", title: "Senior React Developer - Remote", price: 250000, images: [{ url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "job-2", title: "Digital Marketing Manager", price: 180000, images: [{ url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "job-3", title: "Accountant - CA Qualified", price: 120000, images: [{ url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "job-4", title: "Graphic Designer - Full Time", price: 80000, images: [{ url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "job-5", title: "English Teacher - O/A Levels", price: 90000, images: [{ url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "job-6", title: "Data Entry Operator - Part Time", price: 35000, images: [{ url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "job-7", title: "Sales Executive - FMCG Company", price: 70000, images: [{ url: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 18*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "job-8", title: "Full Stack Developer - Node/React", price: 300000, images: [{ url: "https://images.unsplash.com/photo-1537432376149-e89d40e8ff73?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
    ],
  },
  Services: {
    icon: HiWrenchScrewdriver,
    hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&h=400&fit=crop",
    tagline: "Hire Trusted Services in Pakistan",
    description: "Plumbing, electricians, movers, tutors, web development - find reliable service providers near you.",
    color: "from-teal-600 to-cyan-700",
    ads: [
      { _id: "srv-1", title: "Home Shifting & Packing Service - All Pakistan", price: 15000, images: [{ url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "srv-2", title: "AC Installation & Repair Service", price: 3000, images: [{ url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "srv-3", title: "Wedding Photography & Videography", price: 80000, images: [{ url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "srv-4", title: "Website Development - React/Next.js", price: 50000, images: [{ url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "srv-5", title: "Home Tuition - Matric & Inter", price: 8000, images: [{ url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "srv-6", title: "Car Wash & Detailing - Home Service", price: 2500, images: [{ url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "srv-7", title: "Plumbing & Sanitary Work", price: 5000, images: [{ url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 16*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "srv-8", title: "Interior Design & Renovation", price: 200000, images: [{ url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
    ],
  },
  Fashion: {
    icon: HiSparkles,
    hero: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=400&fit=crop",
    tagline: "Shop Fashion & Clothing in Pakistan",
    description: "Men's, women's & kids' clothing, shoes, watches, jewelry - buy & sell fashion items at great prices.",
    color: "from-pink-600 to-rose-700",
    ads: [
      { _id: "fash-1", title: "Men's Formal Suit - Premium Wool Blend", price: 12500, images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fash-2", title: "Bridal Lehenga - Heavy Embroidery", price: 85000, images: [{ url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "fash-3", title: "Nike Air Jordan 1 Retro - Size 42", price: 28000, images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "fash-4", title: "Casio G-Shock GA-2100 Watch", price: 18000, images: [{ url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fash-5", title: "Lawn Collection 2024 - Unstitched 3 Piece", price: 5500, images: [{ url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "fash-6", title: "Ray-Ban Aviator Sunglasses - Original", price: 22000, images: [{ url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fash-7", title: "Women's Handbag - Genuine Leather", price: 8500, images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 9*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "fash-8", title: "Gold Plated Jewelry Set - Wedding", price: 15000, images: [{ url: "https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: false } },
    ],
  },
  Furniture: {
    icon: HiCube,
    hero: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=400&fit=crop",
    tagline: "Buy & Sell Furniture in Pakistan",
    description: "Sofas, beds, dining tables, office furniture - furnish your home or office at affordable prices.",
    color: "from-yellow-600 to-amber-700",
    ads: [
      { _id: "fur-1", title: "Office Furniture Set - Executive Desk & Chair", price: 85000, images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "fur-2", title: "King Size Bed with Mattress", price: 65000, images: [{ url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "fur-3", title: "6 Seater Dining Table - Sheesham Wood", price: 45000, images: [{ url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fur-4", title: "L-Shaped Sofa Set - 7 Seater", price: 120000, images: [{ url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "fur-5", title: "Bookshelf - 5 Tier Wooden", price: 12000, images: [{ url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fur-6", title: "Computer Desk - Gaming Setup", price: 25000, images: [{ url: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "fur-7", title: "Wardrobe - 3 Door with Mirror", price: 35000, images: [{ url: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 18*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "fur-8", title: "Bean Bag Chair - XXL Premium", price: 5500, images: [{ url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 7*3600000).toISOString(), seller: { isVerified: false } },
    ],
  },
  Animals: {
    icon: HiHeart,
    hero: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1400&h=400&fit=crop",
    tagline: "Pets & Animals for Sale in Pakistan",
    description: "Dogs, cats, birds, fish, farm animals - find your new companion or sell pets responsibly.",
    color: "from-orange-600 to-red-700",
    ads: [
      { _id: "ani-1", title: "German Shepherd Puppies - Vaccinated", price: 45000, images: [{ url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "ani-2", title: "Persian Cat - 3 Months Old", price: 25000, images: [{ url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "ani-3", title: "Lovebirds Pair - Healthy & Active", price: 3500, images: [{ url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "ani-4", title: "Labrador Retriever Puppy - Golden", price: 35000, images: [{ url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "ani-5", title: "Fish Aquarium Complete Setup - 4ft", price: 15000, images: [{ url: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "ani-6", title: "Australian Parrot Pair - Talking", price: 8000, images: [{ url: "https://images.unsplash.com/photo-1544923246-77307dd270aa?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "ani-7", title: "Siberian Husky - 6 Months Old", price: 65000, images: [{ url: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 15*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "ani-8", title: "Bakra / Goat - Healthy Desi Breed", price: 55000, images: [{ url: "https://images.unsplash.com/photo-1524024973431-2ad916746264?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 20*3600000).toISOString(), seller: { isVerified: false } },
    ],
  },
  Books: {
    icon: HiBookOpen,
    hero: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&h=400&fit=crop",
    tagline: "Buy & Sell Books in Pakistan",
    description: "Textbooks, novels, competitive exam prep, religious books - find affordable reads near you.",
    color: "from-sky-600 to-blue-700",
    ads: [
      { _id: "book-1", title: "Medical Books Bundle - MBBS 1st Year", price: 8000, images: [{ url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "book-2", title: "CSS/PMS Preparation Books Set", price: 5500, images: [{ url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "book-3", title: "Harry Potter Complete Box Set", price: 6500, images: [{ url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "book-4", title: "O Level Past Papers - All Subjects", price: 3000, images: [{ url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "book-5", title: "Engineering Books - BE Civil 3rd Year", price: 4500, images: [{ url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "book-6", title: "Quran with Urdu Translation - Gift Edition", price: 2500, images: [{ url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "book-7", title: "IELTS Preparation Kit - Cambridge", price: 4000, images: [{ url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "book-8", title: "Children's Story Books Bundle - 20 Books", price: 3500, images: [{ url: "https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 18*3600000).toISOString(), seller: { isVerified: false } },
    ],
  },
  Sports: {
    icon: HiBolt,
    hero: "https://images.unsplash.com/photo-1461896836934-bd45ba9b847d?w=1400&h=400&fit=crop",
    tagline: "Sports Equipment & Gear in Pakistan",
    description: "Cricket, football, gym equipment, bicycles - buy & sell sports gear at the best prices.",
    color: "from-lime-600 to-green-700",
    ads: [
      { _id: "sport-1", title: "Cricket Kit Complete - English Willow Bat", price: 25000, images: [{ url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "sport-2", title: "Treadmill - Commercial Grade", price: 85000, images: [{ url: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "sport-3", title: "Mountain Bike - 21 Speed Shimano", price: 35000, images: [{ url: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "sport-4", title: "Home Gym Set - Dumbbells & Bench", price: 45000, images: [{ url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 4*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "sport-5", title: "Football - Adidas Official Match Ball", price: 5500, images: [{ url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=600&fit=crop" }], location: { city: "Sialkot", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "sport-6", title: "Badminton Rackets Pair - Yonex", price: 8000, images: [{ url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "sport-7", title: "Boxing Gloves - Professional Grade", price: 6500, images: [{ url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 7*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "sport-8", title: "Table Tennis Table - Foldable", price: 22000, images: [{ url: "https://images.unsplash.com/photo-1558657292-6aafe80b8f06?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 12*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
    ],
  },
  Kids: {
    icon: HiFaceSmile,
    hero: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1400&h=400&fit=crop",
    tagline: "Kids Items & Toys in Pakistan",
    description: "Toys, baby gear, strollers, kids clothing, school supplies - everything for your little ones.",
    color: "from-fuchsia-600 to-pink-700",
    ads: [
      { _id: "kid-1", title: "Baby Stroller - Joie Travel System", price: 35000, images: [{ url: "https://images.unsplash.com/photo-1586222515800-8e59bbe69d3d?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
      { _id: "kid-2", title: "LEGO City Set - 500+ Pieces", price: 8500, images: [{ url: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "kid-3", title: "Kids Electric Car - Remote Control", price: 28000, images: [{ url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "kid-4", title: "Baby Crib with Mattress - Wooden", price: 18000, images: [{ url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "kid-5", title: "Kids School Bag - Spider-Man Theme", price: 2500, images: [{ url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "kid-6", title: "Bicycle for Kids - 16 Inch with Training Wheels", price: 12000, images: [{ url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), seller: { isVerified: true } },
      { _id: "kid-7", title: "Baby Clothes Bundle - 0-12 Months", price: 4000, images: [{ url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 14*3600000).toISOString(), seller: { isVerified: false } },
      { _id: "kid-8", title: "Indoor Slide & Swing Set", price: 15000, images: [{ url: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 9*3600000).toISOString(), isFeatured: true, seller: { isVerified: true } },
    ],
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const CATEGORY_FILTERS = {
  Mobiles: {
    question: "What type of mobile are you looking for?",
    subcategories: ["Smartphones", "Feature Phones", "Tablets", "Accessories", "Spare Parts"],
    budgets: [
      { label: "Under 30K", min: 0, max: 30000 },
      { label: "30K - 60K", min: 30000, max: 60000 },
      { label: "60K - 100K", min: 60000, max: 100000 },
      { label: "1 Lac - 2 Lac", min: 100000, max: 200000 },
      { label: "2 Lac - 5 Lac", min: 200000, max: 500000 },
      { label: "5 Lac+", min: 500000, max: Infinity },
    ],
    conditions: ["New", "Used", "Refurbished"],
    brands: ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme", "OnePlus", "Google Pixel", "Huawei"],
  },
  Cars: {
    question: "What vehicle are you looking for?",
    subcategories: ["Sedans", "SUVs", "Hatchbacks", "Motorcycles", "Trucks", "Vans", "Spare Parts"],
    budgets: [
      { label: "Under 5 Lac", min: 0, max: 500000 },
      { label: "5 - 15 Lac", min: 500000, max: 1500000 },
      { label: "15 - 30 Lac", min: 1500000, max: 3000000 },
      { label: "30 - 50 Lac", min: 3000000, max: 5000000 },
      { label: "50 Lac - 1 Cr", min: 5000000, max: 10000000 },
      { label: "1 Crore+", min: 10000000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: ["Toyota", "Honda", "Suzuki", "Hyundai", "KIA", "Changan", "MG", "BMW", "Mercedes"],
  },
  Property: {
    question: "What property type interests you?",
    subcategories: ["Houses", "Apartments", "Plots", "Commercial", "Rooms", "Shops", "Offices"],
    budgets: [
      { label: "Under 50 Lac", min: 0, max: 5000000 },
      { label: "50 Lac - 1 Cr", min: 5000000, max: 10000000 },
      { label: "1 - 2 Crore", min: 10000000, max: 20000000 },
      { label: "2 - 5 Crore", min: 20000000, max: 50000000 },
      { label: "5 Crore+", min: 50000000, max: Infinity },
    ],
    conditions: ["For Sale", "For Rent"],
    brands: ["Bahria Town", "DHA", "Gulberg", "Model Town", "Clifton", "F-Sector", "Blue Area"],
  },
  Electronics: {
    question: "What electronics do you need?",
    subcategories: ["Laptops", "TVs", "Gaming", "Cameras", "Audio", "Home Appliances", "Accessories"],
    budgets: [
      { label: "Under 10K", min: 0, max: 10000 },
      { label: "10K - 30K", min: 10000, max: 30000 },
      { label: "30K - 80K", min: 30000, max: 80000 },
      { label: "80K - 2 Lac", min: 80000, max: 200000 },
      { label: "2 Lac - 5 Lac", min: 200000, max: 500000 },
      { label: "5 Lac+", min: 500000, max: Infinity },
    ],
    conditions: ["New", "Used", "Refurbished"],
    brands: ["Apple", "Samsung", "Sony", "Dell", "HP", "LG", "Canon", "Lenovo"],
  },
  Jobs: {
    question: "What job type are you looking for?",
    subcategories: ["IT & Software", "Marketing", "Accounting", "Teaching", "Sales", "Medical", "Engineering", "Part-Time"],
    budgets: [
      { label: "Under 30K/mo", min: 0, max: 30000 },
      { label: "30K - 60K/mo", min: 30000, max: 60000 },
      { label: "60K - 100K/mo", min: 60000, max: 100000 },
      { label: "1 - 2 Lac/mo", min: 100000, max: 200000 },
      { label: "2 - 5 Lac/mo", min: 200000, max: 500000 },
      { label: "5 Lac+/mo", min: 500000, max: Infinity },
    ],
    conditions: ["Full-Time", "Part-Time", "Contract", "Remote"],
    brands: [],
  },
  Services: {
    question: "What service do you need?",
    subcategories: ["Home Services", "Repair", "Tutoring", "Web/IT", "Photography", "Moving", "Beauty", "Car Services"],
    budgets: [
      { label: "Under 5K", min: 0, max: 5000 },
      { label: "5K - 15K", min: 5000, max: 15000 },
      { label: "15K - 50K", min: 15000, max: 50000 },
      { label: "50K - 1 Lac", min: 50000, max: 100000 },
      { label: "1 Lac+", min: 100000, max: Infinity },
    ],
    conditions: ["One-Time", "Monthly", "Hourly"],
    brands: [],
  },
  Fashion: {
    question: "What fashion items are you looking for?",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Watches", "Jewelry", "Bags", "Sunglasses", "Kids Wear"],
    budgets: [
      { label: "Under 2K", min: 0, max: 2000 },
      { label: "2K - 5K", min: 2000, max: 5000 },
      { label: "5K - 15K", min: 5000, max: 15000 },
      { label: "15K - 50K", min: 15000, max: 50000 },
      { label: "50K+", min: 50000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: ["Nike", "Adidas", "Gul Ahmed", "Khaadi", "Junaid Jamshed", "Casio", "Ray-Ban"],
  },
  Furniture: {
    question: "What furniture do you need?",
    subcategories: ["Sofas", "Beds", "Tables", "Chairs", "Wardrobes", "Office Furniture", "Outdoor", "Decor"],
    budgets: [
      { label: "Under 10K", min: 0, max: 10000 },
      { label: "10K - 30K", min: 10000, max: 30000 },
      { label: "30K - 60K", min: 30000, max: 60000 },
      { label: "60K - 1 Lac", min: 60000, max: 100000 },
      { label: "1 Lac+", min: 100000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: [],
  },
  Animals: {
    question: "What pet/animal are you looking for?",
    subcategories: ["Dogs", "Cats", "Birds", "Fish", "Farm Animals", "Rabbits", "Pet Food", "Accessories"],
    budgets: [
      { label: "Under 5K", min: 0, max: 5000 },
      { label: "5K - 15K", min: 5000, max: 15000 },
      { label: "15K - 30K", min: 15000, max: 30000 },
      { label: "30K - 60K", min: 30000, max: 60000 },
      { label: "60K+", min: 60000, max: Infinity },
    ],
    conditions: ["Vaccinated", "Not Vaccinated"],
    brands: [],
  },
  Books: {
    question: "What type of books do you need?",
    subcategories: ["Textbooks", "Novels", "Competitive Exams", "Religious", "Children", "Comics", "IELTS/TOEFL", "Engineering"],
    budgets: [
      { label: "Under 500", min: 0, max: 500 },
      { label: "500 - 2K", min: 500, max: 2000 },
      { label: "2K - 5K", min: 2000, max: 5000 },
      { label: "5K - 10K", min: 5000, max: 10000 },
      { label: "10K+", min: 10000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: [],
  },
  Sports: {
    question: "What sports equipment do you need?",
    subcategories: ["Cricket", "Football", "Gym Equipment", "Cycling", "Badminton", "Boxing", "Swimming", "Table Tennis"],
    budgets: [
      { label: "Under 5K", min: 0, max: 5000 },
      { label: "5K - 15K", min: 5000, max: 15000 },
      { label: "15K - 40K", min: 15000, max: 40000 },
      { label: "40K - 80K", min: 40000, max: 80000 },
      { label: "80K+", min: 80000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: ["Nike", "Adidas", "Yonex", "Kookaburra", "Reebok", "Under Armour"],
  },
  Kids: {
    question: "What kids items are you looking for?",
    subcategories: ["Toys", "Baby Gear", "Strollers", "Kids Clothing", "School Supplies", "Bikes", "Cribs", "Educational"],
    budgets: [
      { label: "Under 3K", min: 0, max: 3000 },
      { label: "3K - 8K", min: 3000, max: 8000 },
      { label: "8K - 20K", min: 8000, max: 20000 },
      { label: "20K - 50K", min: 20000, max: 50000 },
      { label: "50K+", min: 50000, max: Infinity },
    ],
    conditions: ["New", "Used"],
    brands: [],
  },
};

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

export default function CategoryPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug);
  const category = CATEGORY_DATA[slug];

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const filters = CATEGORY_FILTERS[slug];

  const fetchCategoryAds = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adsAPI.getByCategory(slug, { sort, limit: 20 });
      const fetched = res.ads || res.data?.ads || [];
      setAds(fetched.length > 0 ? fetched : (category?.ads || []));
    } catch {
      setAds(category?.ads || []);
    } finally {
      setLoading(false);
    }
  }, [slug, sort, category]);

  useEffect(() => {
    fetchCategoryAds();
  }, [fetchCategoryAds]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <HiRectangleStack className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
            <p className="text-gray-500 mb-6">The category &ldquo;{slug}&rdquo; does not exist.</p>
            <Link href="/" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = category.icon;
  const activeFilterCount = [selectedSubcategory, selectedBudget, selectedCondition, selectedCity, selectedBrand].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedSubcategory("");
    setSelectedBudget(null);
    setSelectedCondition("");
    setSelectedCity("");
    setSelectedBrand("");
  };

  const filteredAds = ads.filter((ad) => {
    if (selectedBudget) {
      const price = ad.price || 0;
      if (price < selectedBudget.min || price > selectedBudget.max) return false;
    }
    if (selectedCity) {
      const city = ad.location?.city || "";
      if (city !== selectedCity) return false;
    }
    return true;
  });

  const sortedAds = [...filteredAds].sort((a, b) => {
    if (sort === "price_asc") return (a.price || 0) - (b.price || 0);
    if (sort === "price_desc") return (b.price || 0) - (a.price || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Banner */}
      <section className={`relative overflow-hidden bg-gradient-to-r ${category.color}`}>
        <div className="absolute inset-0 opacity-20">
          <Image
            src={category.hero}
            alt={slug}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
                {slug}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">{category.tagline}</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl text-sm sm:text-base">
            {category.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/post-ad`}
              className="bg-white text-gray-900 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              Post Ad in {slug}
            </Link>
            <Link
              href={`/search?category=${encodeURIComponent(slug)}`}
              className="bg-white/20 backdrop-blur text-white border border-white/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/30 transition-colors"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Wizard */}
      {filters && showFilters && (
        <section className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <HiFunnel className="h-5 w-5 text-green-600" />
                  {filters.question}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Select your preferences to find the best results</p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>

            {/* Subcategory */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2.5">Category Type</p>
              <div className="flex flex-wrap gap-2">
                {filters.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? "" : sub)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedSubcategory === sub
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2.5">
                {slug === "Jobs" ? "Salary Range" : slug === "Property" && selectedCondition === "For Rent" ? "Rent Budget" : "Budget Range"}
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.budgets.map((b, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedBudget(selectedBudget?.label === b.label ? null : b)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedBudget?.label === b.label
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    Rs. {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2.5">
                {slug === "Jobs" ? "Job Type" : slug === "Property" ? "Listing Type" : "Condition"}
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => setSelectedCondition(selectedCondition === cond ? "" : cond)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedCondition === cond
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands - only show if available */}
            {filters.brands && filters.brands.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2.5">
                  {slug === "Property" ? "Location / Society" : "Brand"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(selectedBrand === brand ? "" : brand)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedBrand === brand
                          ? "bg-green-600 text-white border-green-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* City */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2.5">City</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(selectedCity === city ? "" : city)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedCity === city
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Row */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-green-600">{activeFilterCount}</span> filter{activeFilterCount > 1 ? "s" : ""} applied
                  {" "}&middot;{" "}
                  <span className="font-semibold text-green-600">{sortedAds.length}</span> results
                </span>
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <HiXMark className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <HiChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{slug}</span>
        </nav>

        {/* Show filters toggle + active filter chips */}
        {!showFilters && (
          <button
            onClick={() => setShowFilters(true)}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <HiFunnel className="h-4 w-4 text-green-600" />
            Show Filters
            {activeFilterCount > 0 && (
              <span className="bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory("")} className="hover:text-green-900"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            )}
            {selectedBudget && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                Rs. {selectedBudget.label}
                <button onClick={() => setSelectedBudget(null)} className="hover:text-green-900"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            )}
            {selectedCondition && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                {selectedCondition}
                <button onClick={() => setSelectedCondition("")} className="hover:text-green-900"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                {selectedBrand}
                <button onClick={() => setSelectedBrand("")} className="hover:text-green-900"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                {selectedCity}
                <button onClick={() => setSelectedCity("")} className="hover:text-green-900"><HiXMark className="h-3.5 w-3.5" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 hover:text-red-600 font-medium px-2 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {slug} Listings
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {sortedAds.length} ads available
            </p>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <HiArrowsUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedAds.map((ad) => (
              <AdCard key={ad._id || ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <HiMagnifyingGlass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-6">Be the first to post an ad in {slug}!</p>
            <Link
              href="/post-ad"
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
            >
              Post Free Ad
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Browse Other Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(CATEGORY_DATA)
              .filter(([name]) => name !== slug)
              .map(([name, data]) => {
                const CatIcon = data.icon;
                return (
                  <Link
                    key={name}
                    href={`/category/${encodeURIComponent(name)}`}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-green-300 hover:shadow-md transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-green-600 transition-colors">{name}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
