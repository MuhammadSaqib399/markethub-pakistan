"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import { adsAPI } from "@/lib/api";
import {
  HiFunnel,
  HiXMark,
  HiMagnifyingGlass,
  HiChevronRight,
  HiAdjustmentsHorizontal,
  HiArrowsUpDown,
  HiChevronDown,
  HiChevronUp,
  HiRectangleStack,
} from "react-icons/hi2";

const CATEGORIES = [
  "Mobiles",
  "Cars",
  "Property",
  "Electronics",
  "Jobs",
  "Services",
  "Fashion",
  "Furniture",
  "Animals",
  "Books",
  "Sports",
  "Kids",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const PROVINCES_CITIES = {
  Punjab: [
    "Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala",
    "Sialkot", "Bahawalpur", "Sargodha", "Sahiwal", "Sheikhupura",
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Mingora", "Kohat",
  ],
  Balochistan: ["Quetta", "Turbat", "Khuzdar", "Gwadar", "Hub"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu & Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu"],
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    location: true,
    condition: true,
  });

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    province: searchParams.get("province") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    condition: searchParams.get("condition") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const fetchAds = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.category) params.category = filters.category;
      if (filters.province) params.province = filters.province;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.condition) params.condition = filters.condition;
      if (filters.sort) params.sort = filters.sort;
      params.page = page;
      params.limit = 12;

      const res = await adsAPI.search(params);
      const data = res.data;
      setAds(data?.ads || data?.results || data || []);
      setTotalCount(data?.total || data?.totalCount || 0);
      setTotalPages(data?.totalPages || data?.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Search failed:", err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAds(1);
  }, [fetchAds]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
      ...(key === "province" ? { city: "" } : {}),
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      q: filters.q,
      category: "",
      province: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      sort: "newest",
    };
    setFilters(cleared);
    updateURL(cleared);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = [
    filters.category,
    filters.province,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.condition,
  ].filter(Boolean).length;

  const cities = filters.province ? PROVINCES_CITIES[filters.province] || [] : [];

  const FilterSidebar = ({ mobile = false }) => (
    <div className={mobile ? "p-4" : ""}>
      {/* Active Filters Count */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-between text-sm text-red-600 hover:text-red-700 mb-4 py-2 px-3 bg-red-50 rounded-lg transition-colors"
        >
          <span>Clear all filters ({activeFilterCount})</span>
          <HiXMark className="h-4 w-4" />
        </button>
      )}

      {/* Category Filter */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
        >
          Category
          {expandedSections.category ? (
            <HiChevronUp className="h-4 w-4" />
          ) : (
            <HiChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  handleFilterChange("category", filters.category === cat ? "" : cat)
                }
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.category === cat
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
        >
          Price Range (PKR)
          {expandedSections.price ? (
            <HiChevronUp className="h-4 w-4" />
          ) : (
            <HiChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Location */}
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() => toggleSection("location")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
        >
          Location
          {expandedSections.location ? (
            <HiChevronUp className="h-4 w-4" />
          ) : (
            <HiChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.location && (
          <div className="space-y-3">
            <select
              value={filters.province}
              onChange={(e) => handleFilterChange("province", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">All Provinces</option>
              {Object.keys(PROVINCES_CITIES).map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              disabled={!filters.province}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection("condition")}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 mb-3"
        >
          Condition
          {expandedSections.condition ? (
            <HiChevronUp className="h-4 w-4" />
          ) : (
            <HiChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.condition && (
          <div className="space-y-1">
            {["", "new", "used", "refurbished"].map((cond) => (
              <label
                key={cond}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  filters.condition === cond
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={filters.condition === cond}
                  onChange={(e) => handleFilterChange("condition", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    filters.condition === cond ? "border-green-600" : "border-gray-300"
                  }`}
                >
                  {filters.condition === cond && (
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                  )}
                </div>
                <span className="text-sm capitalize">
                  {cond || "All Conditions"}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <HiChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Search Results</span>
          {filters.q && (
            <>
              <HiChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium">
                &ldquo;{filters.q}&rdquo;
              </span>
            </>
          )}
        </nav>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiAdjustmentsHorizontal className="h-5 w-5" />
                Filters
              </h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {filters.q
                    ? `Results for "${filters.q}"`
                    : filters.category || "All Listings"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {totalCount} {totalCount === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <HiFunnel className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <HiArrowsUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ads.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {ads.map((ad) => (
                    <AdCard key={ad._id || ad.id} ad={ad} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => fetchAds(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => fetchAds(page)}
                          className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-green-600 text-white"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => fetchAds(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <HiMagnifyingGlass className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any listings matching your search. Try
                  adjusting your filters or search with different keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HiFunnel className="h-5 w-5" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              <FilterSidebar mobile />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
