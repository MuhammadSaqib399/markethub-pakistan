"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { adsAPI, authAPI, reportsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  HiHeart,
  HiMapPin,
  HiChatBubbleLeftRight,
  HiPhone,
  HiShare,
  HiFlag,
  HiChevronRight,
  HiShieldCheck,
  HiStar,
  HiClock,
  HiEye,
  HiChevronLeft,
  HiTag,
  HiCheckBadge,
} from "react-icons/hi2";

dayjs.extend(relativeTime);

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [relatedAds, setRelatedAds] = useState([]);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await adsAPI.getById(params.id);
        setAd(res.ad || res.data?.ad || res.data);
        if (res.isSaved) setSaved(true);
      } catch (err) {
        console.error("Failed to fetch ad:", err);
        toast.error("Ad not found or has been removed");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchAd();
  }, [params.id]);

  // Fetch related ads when ad is loaded
  useEffect(() => {
    const fetchRelated = async () => {
      if (!ad?.category) return;
      try {
        const res = await adsAPI.getAll({ category: ad.category, limit: 4 });
        const ads = (res.ads || res.data?.ads || []).filter(
          (a) => (a._id || a.id) !== params.id
        );
        setRelatedAds(ads.slice(0, 3));
      } catch {}
    };
    fetchRelated();
  }, [ad?.category, params.id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save ads");
      router.push("/login");
      return;
    }
    try {
      const res = await authAPI.toggleSaveAd(params.id);
      setSaved(res.saved);
      toast.success(res.saved ? "Ad saved to your wishlist" : "Removed from saved ads");
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error("Please login to chat with seller");
      router.push("/login");
      return;
    }
    router.push(`/messages?adId=${params.id}&sellerId=${ad?.seller?._id || ad?.seller?.id}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: `Check out this listing on MarketHub: ${ad?.title}`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to report an ad");
      setShowReportModal(false);
      router.push("/login");
      return;
    }
    if (!reportReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    setReportSubmitting(true);
    try {
      await reportsAPI.submit({ adId: params.id, reason: reportReason });
      toast.success("Report submitted. We will review it shortly.");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Contact for Price";
    return `Rs. ${Number(price).toLocaleString("en-PK")}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />
                  ))}
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mt-6" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-2xl" />
                <div className="h-32 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ad Not Found</h1>
            <p className="text-gray-500 mb-6">
              This ad may have been removed or is no longer available.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = ad.images || [];
  const seller = ad.seller || {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <HiChevronRight className="h-4 w-4" />
          <Link
            href={`/search?category=${ad.category}`}
            className="hover:text-green-600 transition-colors"
          >
            {ad.category}
          </Link>
          <HiChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {ad.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-gray-100">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage]?.url || images[selectedImage]}
                    alt={ad.title}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <HiTag className="h-16 w-16" />
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <HiChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <HiChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}

                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                  {selectedImage + 1} / {images.length || 1}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index
                          ? "border-green-500 ring-1 ring-green-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img?.url || img}
                        alt={`${ad.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {ad.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-2xl font-extrabold text-green-600">
                      {formatPrice(ad.price)}
                    </span>
                    {ad.negotiable && (
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className={`p-2.5 rounded-xl border transition-all ${
                      saved
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                    }`}
                  >
                    <HiHeart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-green-600 hover:border-green-200 transition-all"
                  >
                    <HiShare className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <HiMapPin className="h-4 w-4" />
                  {ad.location?.city || ad.city}, {ad.location?.province || ad.province}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiClock className="h-4 w-4" />
                  {dayjs(ad.createdAt).fromNow()}
                </span>
                {ad.views !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <HiEye className="h-4 w-4" />
                    {ad.views} views
                  </span>
                )}
                {ad.condition && (
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                    {ad.condition}
                  </span>
                )}
              </div>

              {/* Divider */}
              <hr className="my-6 border-gray-100" />

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </div>
              </div>

              {/* Report */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <HiFlag className="h-4 w-4" />
                  Report this ad
                </button>
              </div>
            </div>

            {/* Related Ads */}
            {relatedAds.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Related Ads
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {relatedAds.map((relAd) => (
                    <Link
                      key={relAd._id || relAd.id}
                      href={`/ad/${relAd._id || relAd.id}`}
                      className="group bg-gray-50 border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        {relAd.images?.[0] ? (
                          <Image
                            src={relAd.images[0]?.url || relAd.images[0]}
                            alt={relAd.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <HiTag className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors">
                          {relAd.title}
                        </p>
                        <p className="text-sm font-bold text-green-600 mt-0.5">
                          {formatPrice(relAd.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Seller & Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Seller Information
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold text-xl">
                    {(seller.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {seller.name || "MarketHub User"}
                    </h4>
                    {seller.verified && (
                      <HiCheckBadge className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  {seller.rating && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <HiStar className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-gray-600">
                        {seller.rating} rating
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Member since{" "}
                    {dayjs(seller.createdAt || seller.memberSince).format("MMM YYYY")}
                  </p>
                </div>
              </div>

              {seller.verified && (
                <div className="flex items-center gap-2 mb-4 bg-green-50 rounded-lg px-3 py-2">
                  <HiShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">
                    Verified Seller
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleChat}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm"
                >
                  <HiChatBubbleLeftRight className="h-5 w-5" />
                  Chat with Seller
                </button>

                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-green-700 py-3 px-4 rounded-xl font-semibold border-2 border-green-200 hover:bg-green-50 transition-colors text-sm"
                >
                  <HiPhone className="h-5 w-5" />
                  {showPhone && seller.phone
                    ? seller.phone
                    : "Show Phone Number"}
                </button>

                <button
                  onClick={handleSave}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold border-2 transition-colors text-sm ${
                    saved
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <HiHeart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                  {saved ? "Saved" : "Save to Wishlist"}
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <h3 className="text-sm font-semibold text-amber-800 mb-3">
                Safety Tips
              </h3>
              <ul className="space-y-2 text-xs text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">1.</span>
                  Meet in a public place for transactions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">2.</span>
                  Check the item before making payment.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">3.</span>
                  Never send money in advance to a seller.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">4.</span>
                  Report suspicious listings immediately.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report this Ad
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Please tell us why you are reporting this listing.
            </p>

            <div className="space-y-2 mb-4">
              {[
                "Spam or misleading",
                "Prohibited item",
                "Fraud / Scam",
                "Duplicate listing",
                "Wrong category",
                "Other",
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reportReason === reason
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      reportReason === reason
                        ? "border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {reportReason === reason && (
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
