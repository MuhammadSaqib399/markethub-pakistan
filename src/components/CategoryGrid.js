"use client";

/**
 * CategoryGrid.js — MarketHub Pakistan
 * ─────────────────────────────────────────────────────────────
 * Displays a responsive grid of 12 marketplace categories, each
 * represented by an icon, name, and placeholder ad count.
 *
 * Clicking a category card navigates to /search?category=<name>.
 *
 * Dependencies:
 *  - next/link
 *  - react-icons/hi2
 */

import Link from "next/link";
import {
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
} from "react-icons/hi2";

/**
 * Category definitions.
 * Each entry: { name, icon: ReactIconComponent, count (placeholder) }
 */
const CATEGORIES = [
  { name: "Mobiles", icon: HiDevicePhoneMobile, count: "12,450" },
  { name: "Cars", icon: HiTruck, count: "8,230" },
  { name: "Property", icon: HiHome, count: "6,870" },
  { name: "Electronics", icon: HiComputerDesktop, count: "9,340" },
  { name: "Jobs", icon: HiBriefcase, count: "4,125" },
  { name: "Services", icon: HiWrenchScrewdriver, count: "3,560" },
  { name: "Fashion", icon: HiSparkles, count: "7,890" },
  { name: "Furniture", icon: HiCube, count: "2,745" },
  { name: "Animals", icon: HiHeart, count: "1,985" },
  { name: "Books", icon: HiBookOpen, count: "3,210" },
  { name: "Sports", icon: HiBolt, count: "2,100" },
  { name: "Kids", icon: HiFaceSmile, count: "4,670" },
];

export default function CategoryGrid() {
  return (
    <section className="py-10">
      {/* Section heading */}
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
        Browse Categories
      </h2>

      {/* Responsive grid: 2 cols on xs, 3 on sm, 4 on md, 6 on lg */}
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {CATEGORIES.map(({ name, icon: Icon, count }) => (
          <Link
            key={name}
            href={`/search?category=${encodeURIComponent(name)}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200
                       bg-white p-5 shadow-sm hover:border-green-300 hover:shadow-md
                       transition-all duration-200"
          >
            {/* Icon circle */}
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full
                         bg-green-50 text-green-600 transition-colors
                         group-hover:bg-green-600 group-hover:text-white"
            >
              <Icon className="h-7 w-7" />
            </div>

            {/* Category name */}
            <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
              {name}
            </span>

            {/* Ad count */}
            <span className="text-xs text-gray-400">{count} ads</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
