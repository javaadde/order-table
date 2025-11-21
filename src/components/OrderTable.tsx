'use client';

import { useEffect, useState } from 'react';

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
      const res = await fetch('/api/sheets');
      const json = await res.json();
      
      if (!json.success) {
        throw new Error(json.error);
      }
      
      setOrders(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return '#6b7280';
    const normalized = status.toLowerCase();
    if (normalized === 'completed' || normalized === 'complete') {
      return '#86efac';
    } else if (normalized === 'pending') {
      return '#93c5fd';
    }
    return '#6b7280';
  };

  const getStatusTextColor = (status?: string) => {
    if (!status) return '#fff';
    const normalized = status.toLowerCase();
    if (normalized === 'completed' || normalized === 'complete') {
      return '#166534';
    } else if (normalized === 'pending') {
      return '#1e40af';
    }
    return '#fff';
  };

  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(search.toLowerCase()) ||
    order.token.toLowerCase().includes(search.toLowerCase()) ||
    (order.status ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#edebde' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 text-center">
          <img src="/banner.jpg" alt="banner" className='py-12 rounded-xl'/>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 font-mono" style={{ color: '#472e21'}}>
            Order Tokens
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, token or status..."
            className="w-full max-w-md px-4 py-3 rounded-xl shadow-md border"
            style={{
              borderColor: '#8b6f47',
              backgroundColor: '#fff',
              color: '#472e21'
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl shadow-xl" style={{ backgroundColor: '#fff' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#d4c4a8', color: '#472e21' }}>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase">Name</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase">Token</th>
                <th className="px-3 py-3 text-center text-xs font-bold uppercase">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: '#fff',
                      borderBottom: '1px solid #e8dcc4'
                    }}
                  >
                    <td className="px-3 py-4 font-medium text-sm" style={{ color: '#472e21' }}>{order.name}</td>
                    <td className="px-3 py-4 font-bold text-lg text-center" style={{ color: '#8b6f47' }}>{order.token}</td>
                    <td className="px-3 py-4 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded-full font-semibold text-xs uppercase tracking-wide"
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          color: getStatusTextColor(order.status)
                        }}
                      >
                        {order.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center font-semibold" style={{ color: '#472e21' }}>
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
          backgroundColor: '#8b6f47',
          color: '#fff'
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
          className={loading ? 'animate-spin' : ''}
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>
    </div>
  );
}