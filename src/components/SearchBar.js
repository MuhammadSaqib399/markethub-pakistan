"use client";

/**
 * SearchBar.js — Elyndra Pakistan
 * ─────────────────────────────────────────────────────────────
 * Large hero search bar for the homepage.
 *
 * Layout:
 *  - Text input for the search query
 *  - Province dropdown (all major provinces / territories)
 *  - Green "Search" button
 *
 * On submit the component navigates to:
 *   /search?q=<query>&province=<province>
 *
 * Dependencies:
 *  - next/navigation (useRouter)
 *  - react-icons/hi2
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMagnifyingGlass, HiMapPin } from "react-icons/hi2";

/**
 * List of provinces / regions of Pakistan used in the location dropdown.
 */
const PROVINCES = [
  "All Pakistan",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("All Pakistan");

  /**
   * Build the search URL and navigate.
   * Only appends params that carry meaningful values.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    if (province && province !== "All Pakistan") {
      params.set("province", province);
    }

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:rounded-xl sm:border
                   sm:border-gray-300 sm:bg-white sm:shadow-lg sm:overflow-hidden"
      >
        {/* ── Search Query Input ──────────────────────────────── */}
        <div className="relative flex-1">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400
                       pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full rounded-xl sm:rounded-none border border-gray-300 sm:border-0
                       bg-white py-3.5 pl-10 pr-4 text-sm text-gray-800
                       placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-green-300 sm:focus:ring-0"
          />
        </div>

        {/* ── Vertical Divider (desktop only) ────────────────── */}
        <div className="hidden sm:block w-px bg-gray-200 my-2" />

        {/* ── Province Dropdown ───────────────────────────────── */}
        <div className="relative sm:w-52">
          <HiMapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400
                       pointer-events-none"
          />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full appearance-none rounded-xl sm:rounded-none border border-gray-300
                       sm:border-0 bg-white py-3.5 pl-10 pr-8 text-sm text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-green-300 sm:focus:ring-0
                       cursor-pointer"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* ── Search Button ──────────────────────────────────── */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl sm:rounded-none
                     bg-green-600 px-8 py-3.5 text-sm font-semibold text-white
                     hover:bg-green-700 active:bg-green-800 transition"
        >
          <HiMagnifyingGlass className="h-5 w-5" />
          Search
        </button>
      </div>
    </form>
  );
}
