"use client";

import { useEffect, useState } from "react";
import { Search, Instagram } from "lucide-react";

interface Order {
  name: string;
  token: string;
  status?: string;
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/sheets");
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error);
      }

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
    const normalized = status.toLowerCase();
    if (normalized === "completed" || normalized === "complete") {
      return "#86efac";
    } else if (normalized === "pending") {
      return "#93c5fd";
    }
    return "#6b7280";
  };

  const getStatusTextColor = (status?: string) => {
    if (!status) return "#fff";
    const normalized = status.toLowerCase();
    if (normalized === "completed" || normalized === "complete") {
      return "#166534";
    } else if (normalized === "pending") {
      return "#1e40af";
    }
    return "#fff";
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.token.toLowerCase().includes(search.toLowerCase()) ||
      (order.status ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8 "
      style={{ backgroundColor: "#edebde" }}
    >
     

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center flex flex-col gap-4 items-center justify-center">
          <img src="/banner.jpg" alt="banner" className="pt-8 rounded-xl" />
          {/* 
          <button className="text-white bg-transprant font-mono flex py-1 text-bold px-5 rounded-full  bg-[#653f18]">
            follow&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25"
              height="25"
              fill="#fff"
              viewBox="0 0 30 30"
            >
              <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
            </svg>
          </button> */}

          <h1
            className="text-3xl sm:text-3xl font-bold mb-2 font-mono"
            style={{ color: "#472e21" }}
          >
            Order Tokens
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center gap-4 mt-6 font-mono">
          <label
            htmlFor="bar"
            className="text-black flex justify-center items-center rounded-xl px-4 border border-[#472e21] bg-white"
          >
            <Search />
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            name="bar"
            placeholder="Search by name, token or status..."
            className="w-full max-w-md px-4 py-3 rounded-xl shadow-md border focus:bg-black focus:border-green-300"
            style={{
              borderColor: "#8b6f47",
              backgroundColor: "#fff",
              color: "#472e21",
            }}
          />
        </div>

        {/* Table */}
        <div
          className="overflow-hidden rounded-2xl shadow-xl"
          style={{ backgroundColor: "#fff" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "#d4c4a8", color: "#472e21" }}>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase">
                  Name
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase">
                  Token
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => {
                  if (index == 0) return null;

                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #e8dcc4",
                      }}
                    >
                      <td
                        className="px-3 py-4 font-medium text-sm"
                        style={{ color: "#472e21" }}
                      >
                        {order.name}
                      </td>
                      <td
                        className="px-3 py-4 font-bold text-lg text-center"
                        style={{ color: "#8b6f47" }}
                      >
                        {order.token}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <span
                          className="inline-block px-2 py-1 rounded-full font-semibold text-xs uppercase tracking-wide"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            color: getStatusTextColor(order.status),
                          }}
                        >
                          {order.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-6 text-center font-semibold"
                    style={{ color: "#472e21" }}
                  >
                    No matching results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button - Bottom Right */}
      <button
        onClick={fetchOrders}
        disabled={loading}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
        style={{
          backgroundColor: "#8b6f47",
          color: "#fff",
        }}
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

      <div className="h-22 w-full bg-white rounded-3xl mt-8 text-center font-mono text-gray-400 flex flex-col items-center justify-center">

          {/* <button className="text-white bg-transprant font-mono flex py-1 text-bold px-5 rounded-full  bg-[#653f18]">
            follow&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="25"
              height="25"
              fill="#fff"
              viewBox="0 0 30 30"
            >
              <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
            </svg>
          </button> */}

        {/* <p>
          Made 
         
          by{" "}
          <a
            className="text-blue-300"
            href="https://instagram.com/dilwalekochi"
          >
            {" "}
            @dilwalekochi
          </a>
        </p> */}

        <p>© 2025 the chai couples chafe</p>
      </div>
    </div>
  );
}
