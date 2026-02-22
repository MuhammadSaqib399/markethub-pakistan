/**
 * Database Seeder
 * Creates admin user and sample data for development
 * Run: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Ad = require("../models/Ad");
const connectDB = require("../config/db");

const sampleAds = [
  {
    title: "iPhone 15 Pro Max 256GB - Brand New",
    description:
      "Brand new iPhone 15 Pro Max 256GB Natural Titanium. PTA approved, complete box with all accessories. Warranty card included. Serious buyers only.",
    price: 520000,
    category: "Mobiles",
    condition: "new",
    location: { province: "Punjab", city: "Lahore" },
    images: [{ url: "https://via.placeholder.com/800x600?text=iPhone+15", publicId: "sample_1" }],
  },
  {
    title: "Toyota Corolla 2022 GLi - Excellent Condition",
    description:
      "Toyota Corolla 2022 GLi 1.3 automatic. White color, first owner, maintained at Toyota dealership. Genuine condition, no accident. Documents clear.",
    price: 4850000,
    category: "Cars",
    condition: "used",
    location: { province: "Sindh", city: "Karachi" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Corolla+2022", publicId: "sample_2" }],
  },
  {
    title: "5 Marla House for Sale - Bahria Town",
    description:
      "Beautiful 5 marla house in Bahria Town Phase 8. 3 bedrooms, 3 bathrooms, drawing room, lounge, kitchen, car porch. Near park and mosque. Hot location.",
    price: 18500000,
    category: "Property",
    location: { province: "Punjab", city: "Rawalpindi" },
    images: [{ url: "https://via.placeholder.com/800x600?text=House+Bahria", publicId: "sample_3" }],
  },
  {
    title: 'Samsung 55" Smart TV 4K Crystal UHD',
    description:
      'Samsung 55 inch Smart TV Crystal UHD 4K. Model 2024. Smart features with built-in apps. Perfect condition. With original remote and box.',
    price: 145000,
    category: "Electronics",
    condition: "used",
    location: { province: "Islamabad Capital Territory", city: "Islamabad" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Samsung+TV", publicId: "sample_4" }],
  },
  {
    title: "Web Developer Required - Remote Work",
    description:
      "Looking for an experienced React/Next.js developer for a startup project. Remote work, flexible hours. Minimum 2 years experience required. Competitive salary.",
    price: 150000,
    category: "Jobs",
    location: { province: "Punjab", city: "Lahore" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Job+Opening", publicId: "sample_5" }],
  },
  {
    title: "Honda CG 125 - 2023 Model",
    description:
      "Honda CG 125 2023 model. Red color. Only 5000 km driven. First owner, complete documents. Engine perfect condition.",
    price: 285000,
    category: "Cars",
    condition: "used",
    location: { province: "Khyber Pakhtunkhwa", city: "Peshawar" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Honda+CG125", publicId: "sample_6" }],
  },
  {
    title: "Office Furniture Set - Complete",
    description:
      "Complete office furniture set including executive desk, chair, bookshelf, and filing cabinet. Slightly used, excellent condition. Ideal for home office or startup.",
    price: 85000,
    category: "Furniture",
    condition: "used",
    location: { province: "Punjab", city: "Faisalabad" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Office+Furniture", publicId: "sample_7" }],
  },
  {
    title: "Samsung Galaxy S24 Ultra - Like New",
    description:
      "Samsung Galaxy S24 Ultra 12GB/256GB. Titanium Black color. PTA approved. Used for 2 months only. Complete box. No scratch, screen protector since day one.",
    price: 340000,
    category: "Mobiles",
    condition: "used",
    location: { province: "Sindh", city: "Karachi" },
    images: [{ url: "https://via.placeholder.com/800x600?text=Galaxy+S24", publicId: "sample_8" }],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Ad.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@markethub.pk",
      password: process.env.ADMIN_PASSWORD || "Admin@123456",
      phone: "+923001234567",
      role: "admin",
      isVerifiedSeller: true,
      phoneVerified: true,
    });
    console.log("Admin user created:", admin.email);

    // Create sample seller user
    const seller = await User.create({
      name: "Ali Hassan",
      email: "seller@markethub.pk",
      password: "Seller@123",
      phone: "+923009876543",
      role: "user",
      isVerifiedSeller: true,
      phoneVerified: true,
      location: { province: "Punjab", city: "Lahore" },
    });
    console.log("Sample seller created:", seller.email);

    // Create sample buyer user
    const buyer = await User.create({
      name: "Sara Khan",
      email: "buyer@markethub.pk",
      password: "Buyer@123",
      phone: "+923211234567",
      role: "user",
      location: { province: "Sindh", city: "Karachi" },
    });
    console.log("Sample buyer created:", buyer.email);

    // Create sample ads
    const ads = await Ad.insertMany(
      sampleAds.map((ad) => ({
        ...ad,
        seller: seller._id,
        status: "active",
      }))
    );
    console.log(`${ads.length} sample ads created`);

    console.log("\nSeed completed successfully!");
    console.log("Admin login: admin@markethub.pk / Admin@123456");
    console.log("Seller login: seller@markethub.pk / Seller@123");
    console.log("Buyer login: buyer@markethub.pk / Buyer@123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();
