"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import {
  HiChartBarSquare,
  HiUsers,
  HiRectangleStack,
  HiFlag,
  HiMagnifyingGlass,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiShieldCheck,
  HiArrowTrendingUp,
  HiClock,
  HiEye,
  HiNoSymbol,
  HiChevronLeft,
  HiChevronRight,
  HiExclamationTriangle,
  HiUserGroup,
} from "react-icons/hi2";

const ADMIN_TABS = [
  { id: "dashboard", label: "Dashboard", icon: HiChartBarSquare },
  { id: "users", label: "Users", icon: HiUsers },
  { id: "ads", label: "Ads", icon: HiRectangleStack },
  { id: "reports", label: "Reports", icon: HiFlag },
];

const CATEGORY_COLORS = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-rose-500",
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // Dashboard data
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalAds: 0,
    pendingAds: 0,
    totalReports: 0,
    categoryStats: [],
  });

  // Users
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  // Ads
  const [ads, setAds] = useState([]);
  const [adsFilter, setAdsFilter] = useState("all");
  const [adsSearch, setAdsSearch] = useState("");
  const [adsPage, setAdsPage] = useState(1);
  const [adsTotalPages, setAdsTotalPages] = useState(1);

  // Reports
  const [reports, setReports] = useState([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotalPages, setReportsTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Fetch dashboard analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await adminAPI.getAnalytics();
      const data = res.data;
      setAnalytics({
        totalUsers: data?.totalUsers || data?.users || 0,
        totalAds: data?.totalAds || data?.ads || 0,
        pendingAds: data?.pendingAds || data?.pending || 0,
        totalReports: data?.totalReports || data?.reports || 0,
        categoryStats: data?.categoryStats || data?.categories || [],
      });
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, search = "") => {
    try {
      const res = await adminAPI.getUsers({ page, limit: 10, search });
      const data = res.data;
      setUsers(data?.users || data || []);
      setUsersTotalPages(data?.totalPages || data?.pages || 1);
      setUsersPage(page);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  // Fetch ads
  const fetchAds = useCallback(async (page = 1, status = "all", search = "") => {
    try {
      const params = { page, limit: 10 };
      if (status !== "all") params.status = status;
      if (search) params.search = search;
      const res = await adminAPI.getAds(params);
      const data = res.data;
      setAds(data?.ads || data || []);
      setAdsTotalPages(data?.totalPages || data?.pages || 1);
      setAdsPage(page);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    }
  }, []);

  // Fetch reports
  const fetchReports = useCallback(async (page = 1) => {
    try {
      const res = await adminAPI.getReports({ page, limit: 10 });
      const data = res.data;
      setReports(data?.reports || data || []);
      setReportsTotalPages(data?.totalPages || data?.pages || 1);
      setReportsPage(page);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const loadTabData = async () => {
      setLoading(true);
      switch (activeTab) {
        case "dashboard":
          await fetchAnalytics();
          break;
        case "users":
          await fetchUsers(1, usersSearch);
          break;
        case "ads":
          await fetchAds(1, adsFilter, adsSearch);
          break;
        case "reports":
          await fetchReports(1);
          break;
      }
      setLoading(false);
    };

    loadTabData();
  }, [activeTab, isAuthenticated, isAdmin, fetchAnalytics, fetchUsers, fetchAds, fetchReports]);

  // User Actions
  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      await adminAPI.toggleUserActive(userId, !currentActive);
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId ? { ...u, isActive: !currentActive, active: !currentActive } : u
        )
      );
      toast.success(`User ${currentActive ? "deactivated" : "activated"} successfully`);
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleVerifySeller = async (userId) => {
    try {
      await adminAPI.verifySeller(userId);
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId ? { ...u, verified: true } : u
        )
      );
      toast.success("Seller verified successfully");
    } catch (err) {
      toast.error("Failed to verify seller");
    }
  };

  // Ad Actions
  const handleApproveAd = async (adId) => {
    try {
      await adminAPI.approveAd(adId);
      setAds((prev) =>
        prev.map((a) =>
          (a._id || a.id) === adId ? { ...a, status: "active" } : a
        )
      );
      toast.success("Ad approved successfully");
    } catch (err) {
      toast.error("Failed to approve ad");
    }
  };

  const handleRejectAd = async (adId) => {
    try {
      await adminAPI.rejectAd(adId);
      setAds((prev) =>
        prev.map((a) =>
          (a._id || a.id) === adId ? { ...a, status: "rejected" } : a
        )
      );
      toast.success("Ad rejected");
    } catch (err) {
      toast.error("Failed to reject ad");
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      await adminAPI.deleteAd(adId);
      setAds((prev) => prev.filter((a) => (a._id || a.id) !== adId));
      toast.success("Ad deleted");
    } catch (err) {
      toast.error("Failed to delete ad");
    }
  };

  // Report Actions
  const handleResolveReport = async (reportId) => {
    try {
      await adminAPI.resolveReport(reportId);
      setReports((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reportId ? { ...r, status: "resolved" } : r
        )
      );
      toast.success("Report resolved");
    } catch (err) {
      toast.error("Failed to resolve report");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      sold: "bg-blue-100 text-blue-700",
      resolved: "bg-gray-100 text-gray-600",
    };
    return (
      <span
        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
          styles[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  const Pagination = ({ current, total, onChange }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Page {current} of {total}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onChange(current - 1)}
            disabled={current === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onChange(current + 1)}
            disabled={current === total}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">M</span>
                </div>
                <span className="text-lg font-extrabold text-gray-900">
                  Market<span className="text-green-600">Hub</span>
                </span>
              </Link>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                View Site
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-bold text-xs">
                    {(user?.name || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sticky top-24">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-30">
            <div className="flex">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pb-20 lg:pb-0">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-24 border border-gray-100" />
                ))}
              </div>
            ) : (
              <>
                {/* ============ DASHBOARD TAB ============ */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Admin Dashboard
                    </h1>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Total Users",
                          value: analytics.totalUsers,
                          icon: HiUserGroup,
                          color: "bg-blue-100 text-blue-600",
                        },
                        {
                          label: "Total Ads",
                          value: analytics.totalAds,
                          icon: HiRectangleStack,
                          color: "bg-green-100 text-green-600",
                        },
                        {
                          label: "Pending Approval",
                          value: analytics.pendingAds,
                          icon: HiClock,
                          color: "bg-yellow-100 text-yellow-600",
                        },
                        {
                          label: "Reports",
                          value: analytics.totalReports,
                          icon: HiFlag,
                          color: "bg-red-100 text-red-600",
                        },
                      ].map((card) => {
                        const Icon = card.icon;
                        return (
                          <div
                            key={card.label}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <HiArrowTrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                              {Number(card.value).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">{card.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Category Distribution Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Ads by Category
                      </h2>
                      {analytics.categoryStats.length > 0 ? (
                        <div className="space-y-3">
                          {analytics.categoryStats.map((cat, i) => {
                            const maxCount = Math.max(
                              ...analytics.categoryStats.map((c) => c.count || c.total || 0)
                            );
                            const count = cat.count || cat.total || 0;
                            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                            return (
                              <div key={cat.category || cat.name || i} className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 w-24 truncate">
                                  {cat.category || cat.name}
                                </span>
                                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                  <div
                                    className={`h-full ${
                                      CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                                    } rounded-lg transition-all duration-500`}
                                    style={{ width: `${Math.max(percentage, 2)}%` }}
                                  />
                                  <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-600">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <HiChartBarSquare className="h-12 w-12 mx-auto mb-2" />
                          <p>No category data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ============ USERS TAB ============ */}
                {activeTab === "users" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Manage Users
                      </h1>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                      <div className="relative">
                        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users by name or email..."
                          value={usersSearch}
                          onChange={(e) => setUsersSearch(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") fetchUsers(1, usersSearch);
                          }}
                          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                User
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Joined
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {users.length > 0 ? (
                              users.map((u) => (
                                <tr
                                  key={u._id || u.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-700 font-bold text-xs">
                                          {(u.name || "U").charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                                          {u.name}
                                          {u.verified && (
                                            <HiShieldCheck className="h-4 w-4 text-blue-500" />
                                          )}
                                        </p>
                                        {u.phone && (
                                          <p className="text-xs text-gray-400">
                                            {u.phone}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {u.email}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {dayjs(u.createdAt).format("MMM D, YYYY")}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                                        u.isActive !== false && u.active !== false
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {u.isActive !== false && u.active !== false
                                        ? "Active"
                                        : "Inactive"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          handleToggleUserActive(
                                            u._id || u.id,
                                            u.isActive !== false && u.active !== false
                                          )
                                        }
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          u.isActive !== false && u.active !== false
                                            ? "text-red-600 hover:bg-red-50"
                                            : "text-green-600 hover:bg-green-50"
                                        }`}
                                        title={
                                          u.isActive !== false && u.active !== false
                                            ? "Deactivate"
                                            : "Activate"
                                        }
                                      >
                                        {u.isActive !== false && u.active !== false ? (
                                          <HiNoSymbol className="h-4 w-4" />
                                        ) : (
                                          <HiCheckCircle className="h-4 w-4" />
                                        )}
                                      </button>
                                      {!u.verified && (
                                        <button
                                          onClick={() =>
                                            handleVerifySeller(u._id || u.id)
                                          }
                                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                          title="Verify Seller"
                                        >
                                          <HiShieldCheck className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-400">
                                  <HiUsers className="h-10 w-10 mx-auto mb-2" />
                                  <p>No users found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="px-6 pb-4">
                        <Pagination
                          current={usersPage}
                          total={usersTotalPages}
                          onChange={(p) => fetchUsers(p, usersSearch)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ============ ADS TAB ============ */}
                {activeTab === "ads" && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Manage Ads
                    </h1>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-2 flex-wrap">
                          {["all", "pending", "active", "rejected"].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setAdsFilter(status);
                                fetchAds(1, status, adsSearch);
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                adsFilter === status
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                        <div className="relative flex-1 min-w-[200px]">
                          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search ads..."
                            value={adsSearch}
                            onChange={(e) => setAdsSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                fetchAds(1, adsFilter, adsSearch);
                            }}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ads Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Ad
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Seller
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {ads.length > 0 ? (
                              ads.map((ad) => (
                                <tr
                                  key={ad._id || ad.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <Link
                                      href={`/ad/${ad._id || ad.id}`}
                                      className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-1 max-w-[200px] block"
                                    >
                                      {ad.title}
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                      {ad.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    Rs. {Number(ad.price).toLocaleString("en-PK")}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {ad.seller?.name || ad.user?.name || "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                    {getStatusBadge(ad.status)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {dayjs(ad.createdAt).format("MMM D")}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Link
                                        href={`/ad/${ad._id || ad.id}`}
                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                        title="View"
                                      >
                                        <HiEye className="h-4 w-4" />
                                      </Link>
                                      {ad.status === "pending" && (
                                        <>
                                          <button
                                            onClick={() =>
                                              handleApproveAd(ad._id || ad.id)
                                            }
                                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                            title="Approve"
                                          >
                                            <HiCheckCircle className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleRejectAd(ad._id || ad.id)
                                            }
                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                            title="Reject"
                                          >
                                            <HiXCircle className="h-4 w-4" />
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleDeleteAd(ad._id || ad.id)
                                        }
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                      >
                                        <HiTrash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-12 text-gray-400">
                                  <HiRectangleStack className="h-10 w-10 mx-auto mb-2" />
                                  <p>No ads found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="px-6 pb-4">
                        <Pagination
                          current={adsPage}
                          total={adsTotalPages}
                          onChange={(p) => fetchAds(p, adsFilter, adsSearch)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ============ REPORTS TAB ============ */}
                {activeTab === "reports" && (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Reports
                    </h1>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Report
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Ad
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Reporter
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {reports.length > 0 ? (
                              reports.map((report) => (
                                <tr
                                  key={report._id || report.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-start gap-2">
                                      <HiExclamationTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {report.reason}
                                        </p>
                                        {report.description && (
                                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                            {report.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Link
                                      href={`/ad/${report.adId || report.ad?._id || report.ad?.id}`}
                                      className="text-sm text-green-600 hover:text-green-700 font-medium line-clamp-1 max-w-[150px] block"
                                    >
                                      {report.ad?.title || "View Ad"}
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {report.reporter?.name || report.user?.name || "Anonymous"}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {dayjs(report.createdAt).format("MMM D, YYYY")}
                                  </td>
                                  <td className="px-6 py-4">
                                    {getStatusBadge(report.status || "pending")}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Link
                                        href={`/ad/${report.adId || report.ad?._id || report.ad?.id}`}
                                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                        title="View Ad"
                                      >
                                        <HiEye className="h-4 w-4" />
                                      </Link>
                                      {(report.status === "pending" || !report.status) && (
                                        <button
                                          onClick={() =>
                                            handleResolveReport(report._id || report.id)
                                          }
                                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                          title="Resolve"
                                        >
                                          <HiCheckCircle className="h-4 w-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          const adId =
                                            report.adId || report.ad?._id || report.ad?.id;
                                          if (adId) handleDeleteAd(adId);
                                        }}
                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete Ad"
                                      >
                                        <HiTrash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                  <HiFlag className="h-10 w-10 mx-auto mb-2" />
                                  <p>No reports found</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="px-6 pb-4">
                        <Pagination
                          current={reportsPage}
                          total={reportsTotalPages}
                          onChange={(p) => fetchReports(p)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
