/**
 * Footer.js — Elyndra
 * ─────────────────────────────────────────────────────────────
 * Professional four-column footer for the marketplace.
 *
 * Columns:
 *  1. About — brand description
 *  2. Categories — popular marketplace categories
 *  3. Quick Links — sitemap essentials
 *  4. Contact — company contact details
 *
 * Includes social media icon placeholders, "Made in Pakistan"
 * tagline, and copyright notice.
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Column 1: About ─────────────────────────────── */}
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="text-2xl font-extrabold text-green-500">
                Elyn
              </span>
              <span className="text-2xl font-extrabold text-white">dra</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Elyndra is Pakistan&apos;s trusted online marketplace connecting
              buyers and sellers across the nation. Buy &amp; sell everything
              from mobiles and cars to property and services — quickly, safely,
              and locally.
            </p>

            {/* Social Icons (placeholders) */}
            <div className="mt-5 flex items-center gap-3">
              {["Facebook", "Twitter", "Instagram", "YouTube"].map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full
                             bg-gray-800 text-gray-400 text-xs font-bold
                             hover:bg-green-600 hover:text-white transition"
                >
                  {name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Categories ────────────────────────── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Mobiles",
                "Cars",
                "Property",
                "Electronics",
                "Jobs",
                "Services",
                "Fashion",
                "Furniture",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/search?category=${encodeURIComponent(cat)}`}
                    className="hover:text-green-400 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Quick Links ───────────────────────── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Post an Ad", href: "/post-ad" },
                { label: "My Ads", href: "/dashboard" },
                { label: "Messages", href: "/messages" },
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Help / FAQ", href: "/help" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-green-400 transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ───────────────────────────── */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="block text-gray-500 text-xs uppercase">
                  Email
                </span>
                <a
                  href="mailto:support@elyndra.pk"
                  className="hover:text-green-400 transition"
                >
                  support@elyndra.pk
                </a>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase">
                  Phone
                </span>
                <a
                  href="tel:+92-21-1234567"
                  className="hover:text-green-400 transition"
                >
                  +92-21-1234567
                </a>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase">
                  Address
                </span>
                <p className="text-gray-400">
                  Elyndra HQ, I.I. Chundrigar Road,
                  <br />
                  Karachi, Pakistan
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5
                     flex flex-col items-center gap-2 sm:flex-row sm:justify-between"
        >
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Elyndra. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with{" "}
            <span className="text-green-500" aria-label="love">
              &#9829;
            </span>{" "}
            in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
