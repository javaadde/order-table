"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronUp, ChevronDown, X } from "lucide-react";
import Link from "next/link";

interface Order {
  name: string;
  token: string;
  status?: string;
}

type SortOrder = "asc" | "desc" | null;
type StatusFilter = "all" | "completed" | "pending";

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/sheets");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setOrders(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "#6b7280";
    const n = status.toLowerCase();
    if (n === "completed" || n === "complete") return "#86efac";
    if (n === "pending") return "#93c5fd";
    return "#6b7280";
  };

  const getStatusTextColor = (status?: string) => {
    if (!status) return "#fff";
    const n = status.toLowerCase();
    if (n === "completed" || n === "complete") return "#166534";
    if (n === "pending") return "#1e40af";
    return "#fff";
  };

  // Simple search - trim all whitespace and compare
  const searchMatch = (name: string, searchTerm: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    // Remove ALL spaces and convert to lowercase for comparison
    const cleanName = name.replace(/\s/g, "").toLowerCase();
    const cleanSearch = searchTerm.replace(/\s/g, "").toLowerCase();
    
    return cleanName.includes(cleanSearch);
  };

  const filteredOrders = orders
    .slice(1) // Skip first row (header row)
    .filter((order) => {
      // Name search
      if (!searchMatch(order.name, search)) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all") {
        const s = (order.status ?? "").toLowerCase();
        if (statusFilter === "completed" && s !== "completed" && s !== "complete") return false;
        if (statusFilter === "pending" && s !== "pending") return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortOrder) return 0;
      const tokenA = parseInt(a.token) || 0;
      const tokenB = parseInt(b.token) || 0;
      return sortOrder === "asc" ? tokenA - tokenB : tokenB - tokenA;
    });

  const clearFilters = () => {
    setSortOrder(null);
    setStatusFilter("all");
    setSearch("");
  };

  const hasActiveFilters = sortOrder || statusFilter !== "all" || search;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#edebde" }}>
      {/* Marquee Announcement Bar */}
    
      <Link href="/updates">
      <div
        className="w-full py-2"
        style={{ backgroundColor: "#472e21", overflow: "hidden" }}
      >
        <div className="marquee-animate" style={{
          display: "flex",
          whiteSpace: "nowrap"
        }}>
          <span className="mx-6 text-sm font-mono" style={{ color: "#edebde" }}>
            🎉 NEW UPDATE: Improved search functionality! &nbsp;&nbsp;&nbsp;
            ✨ NEW: Filter by status & sort by token! &nbsp;&nbsp;&nbsp;
            🔍 Tap the filter button to access options. &nbsp;&nbsp;&nbsp;
            🎉 NEW UPDATE: Improved search functionality! &nbsp;&nbsp;&nbsp;
            ✨ NEW: Filter by status & sort by token! &nbsp;&nbsp;&nbsp;
            🔍 Tap the filter button to access options. &nbsp;&nbsp;&nbsp;
            🎉 NEW UPDATE: Improved search functionality! &nbsp;&nbsp;&nbsp;
            ✨ NEW: Filter by status & sort by token! &nbsp;&nbsp;&nbsp;
            🔍 Tap the filter button to access options.
          </span>
        </div>
      </div>
       </Link>

      <div className="p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 text-center flex flex-col gap-3 sm:gap-4 items-center justify-center">
            <img src="/banner.jpg" alt="banner" className="pt-2 sm:pt-4 rounded-xl w-full max-w-md sm:max-w-lg" />
          <h1 className="text-3xl sm:text-3xl font-bold mb-2 font-mono" style={{ color: "#472e21" }}>
            Order Tokens
          </h1>
        </div>

        {/* Search Bar + Filter Button */}
        <div className="mb-4 flex justify-center gap-2 mt-6 font-mono">
          <label
            htmlFor="bar"
            className="text-black flex justify-center items-center rounded-xl px-4 border border-[#472e21] bg-white"
          >
            <Search size={20} />
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="bar"
            placeholder="Search by name..."
            className="w-full max-w-md px-4 py-3 rounded-xl shadow-md border focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            style={{ borderColor: "#8b6f47", backgroundColor: "#fff", color: "#472e21" }}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-md border transition-all ${
              showFilters ? "ring-2 ring-[#472e21]" : ""
            }`}
            style={{
              borderColor: "#8b6f47",
              backgroundColor: hasActiveFilters ? "#8b6f47" : "#fff",
              color: hasActiveFilters ? "#fff" : "#472e21",
            }}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filter Panel - Mobile Responsive */}
        {showFilters && (
          <div
            className="mb-6 p-3 sm:p-4 rounded-xl shadow-md font-mono"
            style={{ backgroundColor: "#fff", border: "1px solid #8b6f47" }}
          >
            <div className="flex flex-col gap-4">
              {/* Sort by Token */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span style={{ color: "#472e21" }} className="text-sm font-semibold">
                  Sort by Token:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                      sortOrder === "asc" ? "ring-2 ring-[#472e21]" : ""
                    }`}
                    style={{
                      borderColor: "#8b6f47",
                      backgroundColor: sortOrder === "asc" ? "#8b6f47" : "#fff",
                      color: sortOrder === "asc" ? "#fff" : "#472e21",
                    }}
                  >
                    <ChevronUp size={16} /> Asc
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                      sortOrder === "desc" ? "ring-2 ring-[#472e21]" : ""
                    }`}
                    style={{
                      borderColor: "#8b6f47",
                      backgroundColor: sortOrder === "desc" ? "#8b6f47" : "#fff",
                      color: sortOrder === "desc" ? "#fff" : "#472e21",
                    }}
                  >
                    <ChevronDown size={16} /> Desc
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span style={{ color: "#472e21" }} className="text-sm font-semibold">
                  Status:
                </span>
                <div className="flex gap-2">
                  {(["all", "completed", "pending"] as StatusFilter[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-lg border transition-all capitalize text-sm ${
                        statusFilter === status ? "ring-2 ring-[#472e21]" : ""
                      }`}
                      style={{
                        borderColor: "#8b6f47",
                        backgroundColor: statusFilter === status ? "#8b6f47" : "#fff",
                        color: statusFilter === status ? "#fff" : "#472e21",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 rounded-lg border transition-all hover:bg-red-50"
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                >
                  <X size={16} /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div
          className="overflow-x-auto rounded-2xl shadow-xl"
          style={{ backgroundColor: "#fff" }}
        >
          <table className="w-full min-w-0">
            <thead>
              <tr style={{ backgroundColor: "#d4c4a8", color: "#472e21" }}>
                <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-bold uppercase">Name</th>
                <th className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs font-bold uppercase">Token</th>
                <th className="px-2 sm:px-3 py-2 sm:py-3 text-center text-xs font-bold uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                    <tr
                      key={index}
                      style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8dcc4" }}
                    >
                      <td className="px-2 sm:px-3 py-3 sm:py-4 font-medium text-xs sm:text-sm" style={{ color: "#472e21" }}>
                        {order.name}
                      </td>
                      <td className="px-2 sm:px-3 py-3 sm:py-4 font-bold text-base sm:text-lg text-center" style={{ color: "#8b6f47" }}>
                        {order.token}
                      </td>
                      <td className="px-2 sm:px-3 py-3 sm:py-4 text-center">
                        <span
                          className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold text-xs uppercase tracking-wide"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            color: getStatusTextColor(order.status),
                          }}
                        >
                          {order.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center font-semibold" style={{ color: "#472e21" }}>
                    No matching results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchOrders}
        disabled={loading}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
        style={{ backgroundColor: "#8b6f47", color: "#fff" }}
        title="Refresh orders"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={loading ? "animate-spin" : ""}
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>

      <div className="py-4 sm:py-6 w-full bg-white rounded-2xl sm:rounded-3xl mt-6 sm:mt-8 text-center font-mono text-gray-400 flex flex-col items-center justify-center text-xs sm:text-sm">
        <p>© 2025 the chai couples chafe</p>
      </div>
      </div>
      </div>

    
  );
}