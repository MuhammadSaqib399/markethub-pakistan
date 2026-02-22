"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdCard from "@/components/AdCard";
import { useAuth } from "@/context/AuthContext";
import { adsAPI, authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  HiRectangleStack,
  HiHeart,
  HiUserCircle,
  HiCog6Tooth,
  HiEye,
  HiPencilSquare,
  HiTrash,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiPlusCircle,
  HiArrowTrendingUp,
  HiShieldCheck,
  HiEyeSlash,
  HiLockClosed,
  HiPhone,
  HiMapPin,
} from "react-icons/hi2";

const TABS = [
  { id: "ads", label: "My Ads", icon: HiRectangleStack },
  { id: "saved", label: "Saved Ads", icon: HiHeart },
  { id: "profile", label: "Profile", icon: HiUserCircle },
  { id: "settings", label: "Settings", icon: HiCog6Tooth },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("ads");
  const [myAds, setMyAds] = useState([]);
  const [savedAds, setSavedAds] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [adsRes, savedRes] = await Promise.allSettled([
          adsAPI.getMyAds(),
          adsAPI.getSaved(),
        ]);

        if (adsRes.status === "fulfilled") {
          const adsData = adsRes.value.data?.ads || adsRes.value.data || [];
          setMyAds(adsData);
          const active = adsData.filter((a) => a.status === "active").length;
          const totalViews = adsData.reduce((sum, a) => sum + (a.views || 0), 0);
          setStats({ total: adsData.length, active, views: totalViews });
        }

        if (savedRes.status === "fulfilled") {
          setSavedAds(savedRes.value.data?.ads || savedRes.value.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        province: user.province || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleDeleteAd = async (adId) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      await adsAPI.delete(adId);
      setMyAds((prev) => prev.filter((a) => (a._id || a.id) !== adId));
      toast.success("Ad deleted successfully");
    } catch (err) {
      toast.error("Failed to delete ad");
    }
  };

  const handleMarkSold = async (adId) => {
    try {
      await adsAPI.markSold(adId);
      setMyAds((prev) =>
        prev.map((a) =>
          (a._id || a.id) === adId ? { ...a, status: "sold" } : a
        )
      );
      toast.success("Ad marked as sold");
    } catch (err) {
      toast.error("Failed to update ad");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error("Name is required");
    setProfileLoading(true);
    try {
      await authAPI.updateProfile(profileForm);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) return toast.error("Enter current password");
    if (passwordForm.newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast.error("Passwords do not match");

    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      sold: "bg-blue-100 text-blue-700",
      expired: "bg-gray-100 text-gray-600",
    };
    const icons = {
      active: HiCheckCircle,
      pending: HiClock,
      rejected: HiXCircle,
      sold: HiShieldCheck,
      expired: HiEyeSlash,
    };
    const Icon = icons[status] || HiClock;
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user?.name || "User"}
            </p>
          </div>
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm"
          >
            <HiPlusCircle className="h-5 w-5" />
            Post New Ad
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                <HiRectangleStack className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Ads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                <HiCheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">Active Ads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                <HiEye className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.views.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* My Ads Tab */}
            {activeTab === "ads" && (
              <div>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex gap-4 p-4 border border-gray-100 rounded-xl">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myAds.length > 0 ? (
                  <div className="space-y-3">
                    {myAds.map((ad) => (
                      <div
                        key={ad._id || ad.id}
                        className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {ad.images?.[0] ? (
                            <Image
                              src={ad.images[0]?.url || ad.images[0]}
                              alt={ad.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <HiRectangleStack className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/ad/${ad._id || ad.id}`}
                                className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-1"
                              >
                                {ad.title}
                              </Link>
                              <p className="text-green-600 font-bold text-sm mt-0.5">
                                Rs. {Number(ad.price).toLocaleString("en-PK")}
                              </p>
                            </div>
                            {getStatusBadge(ad.status)}
                          </div>

                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <HiEye className="h-3.5 w-3.5" />
                              {ad.views || 0} views
                            </span>
                            <span>{dayjs(ad.createdAt).format("MMM D, YYYY")}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            <Link
                              href={`/post-ad?edit=${ad._id || ad.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                              <HiPencilSquare className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            {ad.status === "active" && (
                              <button
                                onClick={() => handleMarkSold(ad._id || ad.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              >
                                <HiCheckCircle className="h-3.5 w-3.5" />
                                Mark Sold
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAd(ad._id || ad.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <HiTrash className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiRectangleStack className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No ads yet
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Start selling by posting your first ad.
                    </p>
                    <Link
                      href="/post-ad"
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
                    >
                      <HiPlusCircle className="h-5 w-5" />
                      Post Your First Ad
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved Ads Tab */}
            {activeTab === "saved" && (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-64" />
                    ))}
                  </div>
                ) : savedAds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {savedAds.map((ad) => (
                      <AdCard key={ad._id || ad.id} ad={ad} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiHeart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      No saved ads
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Save ads you like to find them easily later.
                    </p>
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm"
                    >
                      Browse Listings
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Edit Profile
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <HiUserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <HiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="03XX XXXXXXX"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <HiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={profileForm.city ? `${profileForm.city}, ${profileForm.province}` : ""}
                        onChange={(e) =>
                          setProfileForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        placeholder="City, Province"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      {profileLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {[
                    { key: "currentPassword", label: "Current Password", show: "current" },
                    { key: "newPassword", label: "New Password", show: "new" },
                    { key: "confirmPassword", label: "Confirm New Password", show: "confirm" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <HiLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords[field.show] ? "text" : "password"}
                          value={passwordForm[field.key]}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          className="block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              [field.show]: !prev[field.show],
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords[field.show] ? (
                            <HiEyeSlash className="h-5 w-5" />
                          ) : (
                            <HiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                    >
                      {passwordLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-red-600 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete your account? This action cannot be undone."
                        )
                      ) {
                        authAPI
                          .deleteAccount()
                          .then(() => {
                            logout();
                            toast.success("Account deleted");
                            router.push("/");
                          })
                          .catch(() => toast.error("Failed to delete account"));
                      }
                    }}
                    className="px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
