"use client";

/**
 * AdCard.js — MarketHub Pakistan
 * ─────────────────────────────────────────────────────────────
 * Reusable card component for displaying a single classified ad
 * in grid / list views.
 *
 * Features:
 *  - First image with Next.js <Image /> and blur placeholder
 *  - Title (2-line clamp) and formatted PKR price
 *  - Location + relative time (via dayjs)
 *  - "Featured" badge overlay
 *  - Heart icon to save / un-save the ad
 *  - Verified seller badge
 *  - Entire card is a link to /ad/[id]
 *
 * Dependencies:
 *  - next/image, next/link
 *  - dayjs + relativeTime plugin
 *  - react-icons/hi2
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  HiHeart,
  HiMapPin,
  HiClock,
  HiShieldCheck,
} from "react-icons/hi2";

// Activate the relativeTime plugin once
dayjs.extend(relativeTime);

/**
 * Format a number as Pakistani Rupees:  Rs. 1,250,000
 * Uses the "en-PK" style grouping (Indian/Pakistan numbering system).
 */
function formatPrice(price) {
  if (price == null) return "Contact for Price";
  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
}

/**
 * @param {Object}  props
 * @param {Object}  props.ad              — ad document / object
 * @param {string}  props.ad._id          — unique identifier
 * @param {string}  props.ad.title        — ad title
 * @param {number}  props.ad.price        — price in PKR
 * @param {string[]} props.ad.images      — array of image URLs
 * @param {string}  props.ad.location     — city / area label
 * @param {string}  props.ad.createdAt    — ISO date string
 * @param {boolean} props.ad.isFeatured   — whether ad is promoted
 * @param {Object}  props.ad.seller       — seller object
 * @param {boolean} props.ad.seller.isVerified — verified seller flag
 * @param {boolean} [props.isSaved]       — initial saved state (from user's favourites)
 * @param {Function} [props.onToggleSave] — callback(adId) when heart is clicked
 */
export default function AdCard({ ad, isSaved = false, onToggleSave }) {
  const [saved, setSaved] = useState(isSaved);

  // Destructure with safe defaults
  const {
    _id: id,
    title = "Untitled Ad",
    price,
    images = [],
    location = "",
    createdAt,
    isFeatured = false,
    seller,
  } = ad ?? {};

  const imageUrl = (typeof images[0] === "object" ? images[0]?.url : images[0]) || "/placeholder-ad.png";
  const sellerVerified = seller?.isVerified || seller?.isVerifiedSeller || false;
  const locationText =
    typeof location === "object" && location?.city
      ? `${location.city}, ${location.province}`
      : location || "";

  // ── Save / Un-save handler ──────────────────────────────────
  const handleToggleSave = (e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    setSaved((prev) => !prev);
    onToggleSave?.(id);
  };

  return (
    <Link
      href={`/ad/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200
                 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ── Image Section ────────────────────────────────────── */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
        />

        {/* Featured badge */}
        {isFeatured && (
          <span
            className="absolute top-2 left-2 rounded-md bg-yellow-400 px-2 py-0.5
                       text-[11px] font-bold uppercase text-yellow-900 shadow"
          >
            Featured
          </span>
        )}

        {/* Heart (save / un-save) */}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? "Remove from favourites" : "Save to favourites"}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full
                     bg-white/80 backdrop-blur hover:bg-white transition"
        >
          <HiHeart
            className={`h-5 w-5 transition ${
              saved ? "text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* ── Content Section ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-between p-3">
        {/* Title — 2-line clamp */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
          {title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-green-600 mb-2">
          {formatPrice(price)}
        </p>

        {/* Meta row: location, time, verified badge */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {locationText && (
            <span className="inline-flex items-center gap-0.5 truncate">
              <HiMapPin className="h-3.5 w-3.5 flex-shrink-0" />
              {locationText}
            </span>
          )}
          {createdAt && (
            <span className="inline-flex items-center gap-0.5">
              <HiClock className="h-3.5 w-3.5 flex-shrink-0" />
              {dayjs(createdAt).fromNow()}
            </span>
          )}
          {sellerVerified && (
            <span
              className="ml-auto inline-flex items-center gap-0.5 text-green-600"
              title="Verified Seller"
            >
              <HiShieldCheck className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
