"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { adsAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  HiPhoto,
  HiXMark,
  HiCloudArrowUp,
  HiMapPin,
  HiCurrencyRupee,
  HiTag,
  HiPencilSquare,
  HiChatBubbleLeftRight,
  HiPhone,
  HiCheckCircle,
  HiArrowLeft,
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

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

const CONTACT_PREFERENCES = [
  { value: "chat", label: "Chat Only", icon: HiChatBubbleLeftRight },
  { value: "phone", label: "Phone Only", icon: HiPhone },
  { value: "both", label: "Chat & Phone", icon: HiCheckCircle },
];

const PROVINCES_CITIES = {
  Punjab: [
    "Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala",
    "Sialkot", "Bahawalpur", "Sargodha", "Sahiwal", "Sheikhupura",
    "Rahim Yar Khan", "Jhelum", "Gujrat", "Kasur", "Mianwali",
    "Chiniot", "Attock", "Dera Ghazi Khan", "Okara", "Hafizabad",
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah",
    "Mirpur Khas", "Thatta", "Jacobabad", "Khairpur", "Dadu",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Mingora", "Kohat",
    "Bannu", "Dera Ismail Khan", "Charsadda", "Nowshera", "Mansehra",
  ],
  Balochistan: [
    "Quetta", "Turbat", "Khuzdar", "Gwadar", "Hub",
    "Chaman", "Zhob", "Sibi", "Loralai", "Mastung",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu & Kashmir": [
    "Muzaffarabad", "Mirpur", "Rawalakot", "Bagh", "Kotli",
    "Bhimber", "Pallandri", "Athmuqam",
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Chilas", "Hunza", "Ghizer",
  ],
};

const MAX_IMAGES = 8;

export default function PostAdPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    }>
      <PostAdPage />
    </Suspense>
  );
}

function PostAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    description: "",
    price: "",
    negotiable: false,
    province: "",
    city: "",
    contactPreference: "both",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(!!editId);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to post an ad");
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load existing ad data for editing
  useEffect(() => {
    if (!editId || !isAuthenticated) return;
    const fetchAd = async () => {
      try {
        const res = await adsAPI.getById(editId);
        const ad = res.ad || res.data?.ad || res.data;
        setFormData({
          title: ad.title || "",
          category: ad.category || "",
          condition: ad.condition || "",
          description: ad.description || "",
          price: ad.price?.toString() || "",
          negotiable: ad.negotiable || ad.priceNegotiable || false,
          province: ad.location?.province || ad.province || "",
          city: ad.location?.city || ad.city || "",
          contactPreference: ad.contactPreference || "both",
        });
        const imgs = ad.images || [];
        setExistingImages(imgs);
        setImagePreviews(imgs.map((img) => img?.url || img));
      } catch (err) {
        toast.error("Failed to load ad for editing");
        router.push("/dashboard");
      } finally {
        setEditLoading(false);
      }
    };
    fetchAd();
  }, [editId, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "province" ? { city: "" } : {}),
    }));
  };

  const handleImageSelect = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          return false;
        }
        return true;
      });

      const remaining = MAX_IMAGES - images.length;
      if (validFiles.length > remaining) {
        toast.error(`You can only upload ${MAX_IMAGES} images total`);
      }

      const filesToAdd = validFiles.slice(0, remaining);

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });

      setImages((prev) => [...prev, ...filesToAdd]);
    },
    [images.length]
  );

  const removeImage = (index) => {
    // If removing an existing image (in edit mode)
    if (editId && index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = editId ? index - existingImages.length : index;
      setImages((prev) => prev.filter((_, i) => i !== newIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleImageSelect(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.category) return toast.error("Please select a category");
    if (!formData.description.trim()) return toast.error("Description is required");
    if (!formData.price || Number(formData.price) <= 0) return toast.error("Please enter a valid price");
    if (!formData.province) return toast.error("Please select a province");
    if (!formData.city) return toast.error("Please select a city");
    const totalImages = (editId ? existingImages.length : 0) + images.length;
    if (totalImages === 0) return toast.error("Please upload at least one image");

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("category", formData.category);
      fd.append("condition", formData.condition);
      fd.append("description", formData.description.trim());
      fd.append("price", formData.price);
      fd.append("negotiable", formData.negotiable);
      fd.append("location", JSON.stringify({ province: formData.province, city: formData.city }));
      fd.append("contactPreference", formData.contactPreference);

      images.forEach((file) => {
        fd.append("images", file);
      });

      if (editId) {
        // If new images were added or existing removed, mark as replace
        if (images.length > 0 && existingImages.length === 0) {
          fd.append("replaceImages", "true");
        }
        await adsAPI.update(editId, fd);
        toast.success("Ad updated successfully!");
      } else {
        await adsAPI.create(fd);
        toast.success("Ad posted successfully! It will be reviewed shortly.");
      }
      router.push("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to post ad. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || editLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const cities = formData.province ? PROVINCES_CITIES[formData.province] || [] : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors mb-4"
          >
            <HiArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {editId ? "Edit Your Ad" : "Post Your Ad"}
          </h1>
          <p className="text-gray-500 mt-1">
            {editId
              ? "Update the details of your listing"
              : "Fill in the details to list your item on MarketHub Pakistan"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <HiPencilSquare className="h-5 w-5 text-green-600" />
              Basic Details
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ad Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  maxLength={100}
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., iPhone 15 Pro Max 256GB - Brand New"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {formData.title.length}/100
                </p>
              </div>

              {/* Category & Condition Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Condition</option>
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  maxLength={2000}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item in detail. Include features, condition, reason for selling, etc."
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white resize-none"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {formData.description.length}/2000
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <HiCurrencyRupee className="h-5 w-5 text-green-600" />
              Pricing
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (PKR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium text-sm">
                    Rs.
                  </span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-green-600 peer-checked:border-green-600 transition-all flex items-center justify-center">
                    {formData.negotiable && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Price is negotiable
                </span>
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <HiMapPin className="h-5 w-5 text-green-600" />
              Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  id="province"
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Select Province</option>
                  {Object.keys(PROVINCES_CITIES).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.province}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm bg-gray-50 focus:bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.province ? "Select City" : "Select province first"}
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <HiPhoto className="h-5 w-5 text-green-600" />
              Photos
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Upload up to {MAX_IMAGES} photos. First image will be the cover.
            </p>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
              } ${images.length >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageSelect(e.target.files)}
                className="hidden"
              />
              <HiCloudArrowUp className={`h-10 w-10 mx-auto mb-3 ${dragActive ? "text-green-500" : "text-gray-400"}`} />
              <p className="text-sm font-medium text-gray-700">
                {dragActive ? "Drop images here" : "Drag & drop images here"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or click to browse (JPEG, PNG, max 5MB each)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {images.length}/{MAX_IMAGES} uploaded
              </p>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        COVER
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <HiXMark className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Preference */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <HiChatBubbleLeftRight className="h-5 w-5 text-green-600" />
              Contact Preference
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTACT_PREFERENCES.map((pref) => {
                const Icon = pref.icon;
                const isSelected = formData.contactPreference === pref.value;
                return (
                  <label
                    key={pref.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="contactPreference"
                      value={pref.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Icon
                      className={`h-5 w-5 ${isSelected ? "text-green-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {pref.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 px-8 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  {editId ? "Updating..." : "Posting..."}
                </>
              ) : (
                <>
                  <HiTag className="h-5 w-5" />
                  {editId ? "Update Ad" : "Post Ad"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
