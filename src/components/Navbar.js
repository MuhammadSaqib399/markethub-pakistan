"use client";

/**
 * Navbar.js — MarketHub Pakistan
 * ─────────────────────────────────────────────────────────────
 * Professional marketplace navigation bar with green accent corporate theme.
 *
 * Features:
 *  - Logo on the left
 *  - Expandable search bar in the centre (icon-only on mobile)
 *  - Post Ad, Messages (with notification dot), Login / Register links
 *  - Authenticated user dropdown with verified badge, favourites, logout
 *  - Admin dashboard link when the user has admin role
 *  - Fully responsive hamburger menu for mobile viewports
 *
 * Dependencies:
 *  - next/link, next/navigation
 *  - react-icons/hi2
 *  - @/context/AuthContext  (provides useAuth hook)
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiMagnifyingGlass,
  HiBars3,
  HiXMark,
  HiChatBubbleLeftRight,
  HiPlusCircle,
  HiUser,
  HiArrowRightOnRectangle,
  HiShieldCheck,
  HiHeart,
  HiChevronDown,
} from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // ── Local UI state ──────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // mobile search expansion
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  // Close the user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Handlers ────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  // ── Derived helpers ─────────────────────────────────────────
  const isAdmin = user?.role === "admin";
  const unreadMessages = user?.unreadMessages ?? 0;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <span className="text-2xl font-extrabold text-green-600">
              Market
            </span>
            <span className="text-2xl font-extrabold text-gray-800">Hub</span>
          </Link>

          {/* ── Desktop Search Bar ───────────────────────────── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm
                           focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-green-600 hover:text-green-700"
                aria-label="Search"
              >
                <HiMagnifyingGlass className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* ── Desktop Right-side Links ─────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Ad */}
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2
                         text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              <HiPlusCircle className="h-5 w-5" />
              Post Ad
            </Link>

            {/* Messages */}
            <Link
              href="/messages"
              className="relative inline-flex items-center gap-1 rounded-lg px-3 py-2
                         text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              <HiChatBubbleLeftRight className="h-5 w-5" />
              <span className="hidden lg:inline">Messages</span>
              {unreadMessages > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center
                             rounded-full bg-red-500 text-[10px] font-bold text-white"
                >
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Link>

            {/* Admin Link (conditional) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm
                           font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                <HiShieldCheck className="h-5 w-5 text-green-600" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {/* ── Auth / User Dropdown ──────────────────────── */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm
                             font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {/* Avatar placeholder */}
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full
                               bg-green-100 text-green-700 text-xs font-bold uppercase"
                  >
                    {user.name?.charAt(0) ?? "U"}
                  </span>
                  <span className="hidden lg:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  {/* Verified seller badge */}
                  {user.isVerified && (
                    <HiShieldCheck
                      className="h-4 w-4 text-green-500"
                      title="Verified Seller"
                    />
                  )}
                  <HiChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 origin-top-right rounded-lg
                               bg-white shadow-lg ring-1 ring-black/5 py-1 z-50 animate-in fade-in"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <HiUser className="h-4 w-4" /> My Profile
                    </Link>
                    <Link
                      href="/favourites"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <HiHeart className="h-4 w-4" /> Favourites
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <HiShieldCheck className="h-4 w-4 text-green-600" />{" "}
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <HiArrowRightOnRectangle className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest: Login / Register links */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700
                             hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-green-600 px-4 py-2 text-sm
                             font-semibold text-green-600 hover:bg-green-50 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile: search icon + hamburger ──────────────── */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Toggle search"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <HiXMark className="h-6 w-6" />
              ) : (
                <HiBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Search Expansion ───────────────────────── */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                autoFocus
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 pr-10 text-sm
                           focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-green-600"
                aria-label="Search"
              >
                <HiMagnifyingGlass className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Mobile Menu Drawer ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {/* Post Ad */}
            <Link
              href="/post-ad"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                         text-green-600 hover:bg-green-50"
            >
              <HiPlusCircle className="h-5 w-5" /> Post Ad
            </Link>

            {/* Messages */}
            <Link
              href="/messages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                         text-gray-700 hover:bg-gray-100"
            >
              <HiChatBubbleLeftRight className="h-5 w-5" /> Messages
              {unreadMessages > 0 && (
                <span
                  className="ml-auto flex h-5 w-5 items-center justify-center
                             rounded-full bg-red-500 text-[10px] font-bold text-white"
                >
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </Link>

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                           text-gray-700 hover:bg-gray-100"
              >
                <HiShieldCheck className="h-5 w-5 text-green-600" /> Admin
                Dashboard
              </Link>
            )}

            <hr className="border-gray-100" />

            {user ? (
              <>
                {/* User info row */}
                <div className="flex items-center gap-2 px-3 py-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full
                               bg-green-100 text-green-700 text-sm font-bold uppercase"
                  >
                    {user.name?.charAt(0) ?? "U"}
                  </span>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {user.name}
                  </span>
                  {user.isVerified && (
                    <HiShieldCheck className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HiUser className="h-5 w-5" /> My Profile
                </Link>
                <Link
                  href="/favourites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <HiHeart className="h-5 w-5" /> Favourites
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm
                             text-red-600 hover:bg-red-50"
                >
                  <HiArrowRightOnRectangle className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-center text-sm font-medium
                             text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg border border-green-600 px-3 py-2 text-center
                             text-sm font-semibold text-green-600 hover:bg-green-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
