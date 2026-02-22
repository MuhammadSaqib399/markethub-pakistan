"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HiChevronDown, HiMagnifyingGlass } from "react-icons/hi2";

const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Click on 'Create an Account' from the login page. Fill in your name, email, and password. Optionally, you can add your phone number for easier communication with buyers.",
      },
      {
        q: "Is it free to post ads?",
        a: "Yes! Posting ads on MarketHub is completely free. Simply create an account, click 'Post Ad', and fill in the details of what you want to sell.",
      },
      {
        q: "How do I search for items?",
        a: "Use the search bar on the homepage or visit the Browse page. You can filter by category, location, price range, and condition to find exactly what you need.",
      },
    ],
  },
  {
    title: "Buying & Selling",
    items: [
      {
        q: "How do I contact a seller?",
        a: "Click on any listing and use the 'Chat with Seller' button to send a message directly through our platform. You can also view the seller's phone number if they have chosen to display it.",
      },
      {
        q: "How do I post an ad?",
        a: "Go to 'Post Ad' from the navigation bar. Fill in the title, category, description, price, location, and upload photos of your item. Your ad will be reviewed and published shortly.",
      },
      {
        q: "Can I edit my ad after posting?",
        a: "Yes! Go to your Dashboard, find the ad you want to edit, and click the 'Edit' button. You can update the title, description, price, and images.",
      },
      {
        q: "How do I mark my item as sold?",
        a: "Go to your Dashboard, find the active ad, and click 'Mark Sold'. This will update the status so buyers know it is no longer available.",
      },
    ],
  },
  {
    title: "Safety & Security",
    items: [
      {
        q: "How do I stay safe when buying or selling?",
        a: "Always meet in public places, check items before paying, never send money in advance, and use our in-app messaging to communicate. Report any suspicious listings using the 'Report' button.",
      },
      {
        q: "How do I report a suspicious listing?",
        a: "On any ad detail page, click 'Report this ad' at the bottom. Select a reason and submit. Our team reviews all reports within 24 hours.",
      },
      {
        q: "What are verified sellers?",
        a: "Verified sellers have been confirmed by our team as genuine and trustworthy. Look for the blue verification badge on seller profiles.",
      },
    ],
  },
  {
    title: "Account Management",
    items: [
      {
        q: "How do I change my password?",
        a: "Go to Dashboard > Settings tab. Enter your current password and your new password to update it.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Dashboard > Settings tab and scroll down to the 'Danger Zone' section. Click 'Delete Account'. This action is permanent and will remove all your ads and data.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Click 'Forgot password?' on the login page and enter your email. We will send you instructions to reset your password.",
      },
    ],
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !search ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Help & FAQ
          </h1>
          <p className="text-gray-500 mt-2">
            Find answers to commonly asked questions
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {section.items.map((item, idx) => {
                  const key = `${section.title}-${idx}`;
                  const isOpen = openIndex === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-900 pr-4">
                          {item.q}
                        </span>
                        <HiChevronDown
                          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-0">
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm mb-4">
                No results found for &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-green-600 text-sm font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-green-50 rounded-2xl border border-green-100 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still need help?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Our support team is here to help you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
          >
            Contact Support
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
