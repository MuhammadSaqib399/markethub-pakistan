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

const DEMO_ADS = {
  "demo-1": { _id: "demo-1", title: "iPhone 15 Pro Max 256GB - PTA Approved", price: 520000, images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), category: "Mobiles", condition: "used", views: 342, description: "iPhone 15 Pro Max 256GB Natural Titanium.\n\nPTA approved, 98% battery health. Complete box with all accessories included.\n\n- Face ID working perfectly\n- All cameras working flawlessly\n- No scratches or dents\n- Always used with case and screen protector\n\nSerious buyers only. Price is slightly negotiable.", seller: { name: "Ahmed Electronics", isVerified: true, isVerifiedSeller: true, phone: "0321-1234567", rating: 4.8, createdAt: "2023-06-15" } },
  "demo-2": { _id: "demo-2", title: "Toyota Corolla 2022 GLi Automatic - Low Mileage", price: 4850000, images: [{ url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 5*3600000).toISOString(), category: "Cars", condition: "used", views: 891, description: "Toyota Corolla 2022 GLi Automatic 1.6L.\n\nFirst owner, only 22,000 km driven. Islamabad registered.\n\n- Automatic transmission (CVT)\n- Multimedia with Android Auto\n- Genuine leather seat covers\n- All original documents available\n- Complete auction sheet available\n\nBank transfer or cash accepted.", seller: { name: "Ali Motors", isVerified: true, isVerifiedSeller: true, phone: "0300-9876543", rating: 4.9, createdAt: "2022-01-10" } },
  "demo-3": { _id: "demo-3", title: "5 Marla House for Sale - Bahria Town Phase 8", price: 18500000, images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 8*3600000).toISOString(), category: "Property", views: 1243, description: "Beautiful 5 Marla house in Bahria Town Phase 8, Rawalpindi.\n\n- 3 bedrooms with attached bathrooms\n- Drawing room, dining room, TV lounge\n- Fully fitted kitchen with granite countertops\n- Servant quarter\n- Car porch for 2 cars\n- 24/7 security and gated community\n\nIdeal for families. Near masjid, school, and commercial area.\n\nPrice is final. Visit anytime.", seller: { name: "Bahria Properties", isVerified: true, isVerifiedSeller: true, phone: "0333-5551234", rating: 4.7, createdAt: "2021-08-20" } },
  "demo-4": { _id: "demo-4", title: "Samsung 55\" Smart TV 4K UHD - Crystal Display", price: 145000, images: [{ url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 3*3600000).toISOString(), category: "Electronics", condition: "new", views: 156, description: "Samsung 55\" Crystal UHD 4K Smart TV (2024 model).\n\nBrand new, sealed in box with official Samsung Pakistan warranty.\n\n- 4K Ultra HD resolution\n- Crystal Processor 4K\n- Smart TV with Tizen OS\n- Built-in WiFi and Bluetooth\n- Multiple HDMI and USB ports\n- Wall mount included free\n\nFree home delivery in Islamabad/Rawalpindi.", seller: { name: "Tech World Islamabad", isVerified: false, phone: "0345-6789012", createdAt: "2024-01-15" } },
  "demo-5": { _id: "demo-5", title: "MacBook Pro M3 14\" - 16GB RAM 512GB SSD", price: 680000, images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop" }], location: { city: "Islamabad", province: "ICT" }, createdAt: new Date(Date.now() - 30*60000).toISOString(), category: "Electronics", condition: "used", views: 89, description: "MacBook Pro 14-inch with M3 chip.\n\n- Apple M3 chip, 8-core CPU, 10-core GPU\n- 16GB unified memory\n- 512GB SSD storage\n- 14.2\" Liquid Retina XDR display\n- Battery cycle count: 45\n- macOS Sonoma installed\n\n98% condition. Minor scratch on bottom, screen is perfect.\nCharger and box included.", seller: { name: "Usman IT Solutions", isVerified: true, isVerifiedSeller: true, phone: "0312-3456789", rating: 4.6, createdAt: "2023-03-01" } },
  "demo-6": { _id: "demo-6", title: "Honda CG 125 - 2023 Model First Owner", price: 285000, images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop" }], location: { city: "Peshawar", province: "KPK" }, createdAt: new Date(Date.now() - 45*60000).toISOString(), category: "Cars", condition: "used", views: 234, description: "Honda CG 125 - 2023 Model.\n\nFirst owner, well maintained bike.\n\n- Only 8,000 km driven\n- Self start & kick start both working\n- New tires installed recently\n- All documents clear\n- Peshawar number plate\n\nGenuine buyers contact only.", seller: { name: "Khan Motors", isVerified: false, phone: "0346-1112233", createdAt: "2024-06-01" } },
  "demo-7": { _id: "demo-7", title: "Office Furniture Set - Executive Desk & Chair", price: 85000, images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop" }], location: { city: "Faisalabad", province: "Punjab" }, createdAt: new Date(Date.now() - 1*3600000).toISOString(), category: "Furniture", condition: "new", views: 67, description: "Complete Office Furniture Set.\n\n- Executive desk (5ft x 2.5ft) in walnut finish\n- Executive revolving chair with lumbar support\n- 3-drawer filing cabinet\n- Small bookshelf\n\nHigh quality wood with laminate finish. Brand new, factory packed.\nDelivery available in Faisalabad.", seller: { name: "Furniture Gallery", isVerified: true, isVerifiedSeller: true, phone: "0300-8887766", rating: 4.5, createdAt: "2022-11-01" } },
  "demo-8": { _id: "demo-8", title: "Samsung Galaxy S24 Ultra 12/256 GB", price: 340000, images: [{ url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop" }], location: { city: "Karachi", province: "Sindh" }, createdAt: new Date(Date.now() - 2*3600000).toISOString(), category: "Mobiles", condition: "used", views: 445, description: "Samsung Galaxy S24 Ultra 12/256GB.\n\nPTA approved. 10/10 condition.\n\n- S Pen included\n- 200MP camera working perfectly\n- Always used with case\n- No burn-in on screen\n- Battery health excellent\n\nComplete box with original charger.\nCan exchange with iPhone 15 Pro.", seller: { name: "Mobile Zone", isVerified: false, phone: "0321-5556677", createdAt: "2024-02-15" } },
  "demo-9": { _id: "demo-9", title: "3 BHK Apartment for Rent - Gulberg III", price: 95000, images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 4*3600000).toISOString(), category: "Property", views: 567, description: "3 Bedroom Apartment for Rent in Gulberg III, Lahore.\n\n- 3 bedrooms with attached baths\n- Drawing/dining combined\n- Fully fitted kitchen\n- Servant quarter available\n- 2nd floor with lift\n- Parking for 1 car\n- 24hr security\n\nRent: Rs. 95,000/month\nAdvance: 6 months\n\nAvailable immediately. Families preferred.", seller: { name: "Lahore Properties", isVerified: true, isVerifiedSeller: true, phone: "0334-9990000", rating: 4.4, createdAt: "2021-05-10" } },
  "demo-10": { _id: "demo-10", title: "Sony PlayStation 5 Slim with 2 Controllers", price: 135000, images: [{ url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop" }], location: { city: "Multan", province: "Punjab" }, createdAt: new Date(Date.now() - 6*3600000).toISOString(), category: "Electronics", condition: "used", views: 198, description: "Sony PlayStation 5 Slim Disc Edition.\n\n- 2 DualSense controllers (black & white)\n- 4 games included (GTA V, FIFA 24, Spider-Man 2, God of War)\n- HDMI cable and power cable\n- Original box\n\nUsed for 3 months only. Selling because relocating.\nNo scratches, perfect condition.", seller: { name: "Gamer's Hub", isVerified: false, phone: "0305-1234567", createdAt: "2024-04-01" } },
  "demo-11": { _id: "demo-11", title: "Men's Formal Suit - Premium Wool Blend", price: 12500, images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=600&fit=crop" }], location: { city: "Lahore", province: "Punjab" }, createdAt: new Date(Date.now() - 7*3600000).toISOString(), category: "Fashion", condition: "new", views: 78, description: "Premium Men's Formal Suit.\n\n- Wool blend fabric (70% wool, 30% polyester)\n- Available sizes: M, L, XL\n- Colors: Navy Blue, Charcoal Grey, Black\n- Slim fit design\n- Single breasted, 2-button closure\n\nPerfect for weddings, office, and formal events.\nFree alteration included.\nCash on delivery available in Lahore.", seller: { name: "Fashion Hub", isVerified: false, phone: "0311-2223344", createdAt: "2024-03-01" } },
  "demo-12": { _id: "demo-12", title: "German Shepherd Puppies - Vaccinated & Healthy", price: 45000, images: [{ url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&fit=crop" }], location: { city: "Rawalpindi", province: "Punjab" }, createdAt: new Date(Date.now() - 10*3600000).toISOString(), category: "Animals", views: 312, description: "Pure German Shepherd Puppies.\n\n- 2 months old\n- Fully vaccinated (first dose complete)\n- Dewormed\n- Both male and female available\n- Parents on premises\n- Health certificate available\n\nImported bloodline. Excellent temperament.\nHome delivery available in Rawalpindi/Islamabad.\n\nCall or WhatsApp for more pictures and videos.", seller: { name: "K9 Kennel Club", isVerified: true, isVerifiedSeller: true, phone: "0333-4445566", rating: 4.9, createdAt: "2022-07-15" } },
};

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
      // Check if this is a demo ad
      if (DEMO_ADS[params.id]) {
        setAd(DEMO_ADS[params.id]);
        setLoading(false);
        return;
      }
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
          text: `Check out this listing on Elyndra: ${ad?.title}`,
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
            href={`/category/${encodeURIComponent(ad.category)}`}
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
                      {seller.name || "Elyndra User"}
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
