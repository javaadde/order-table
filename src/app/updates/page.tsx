"use client";

import { ArrowLeft, Search, Filter, ArrowUpDown, CheckCircle, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

interface Update {
  version: string;
  date: string;
  title: string;
  description: string;
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const updates: Update[] = [
  {
    version: "1.1.0",
    date: "November 2025",
    title: "Search & Filter Update",
    description: "We've completely revamped the search functionality and added powerful new filtering options to help you find your orders faster.",
    features: [
      {
        icon: <Search size={20} />,
        title: "Improved Search",
        description: "Search now works better with names containing spaces or special characters. Simply type any part of a name to find matching orders instantly."
      },
      {
        icon: <Filter size={20} />,
        title: "Status Filtering",
        description: "Filter your orders by status - view All orders, only Completed orders, or only Pending orders with a single tap."
      },
      {
        icon: <ArrowUpDown size={20} />,
        title: "Token Sorting",
        description: "Sort orders by token number in ascending or descending order. Great for finding the latest or earliest orders quickly."
      },
      {
        icon: <Sparkles size={20} />,
        title: "Mobile Responsive",
        description: "The entire interface including filters is now fully responsive and works beautifully on all screen sizes."
      }
    ]
  },
//   {
//     version: "1.0.0",
//     date: "October 2025",
//     title: "Initial Launch",
//     description: "The first version of our Order Token system, allowing customers to track their order status in real-time.",
//     features: [
//       {
//         icon: <CheckCircle size={20} />,
//         title: "Order Tracking",
//         description: "View your order token number and current status (Completed or Pending) in real-time."
//       },
//       {
//         icon: <Clock size={20} />,
//         title: "Live Updates",
//         description: "Orders are synced with our system and update automatically. Use the refresh button to get the latest status."
//       }
//     ]
//   }
];

export default function UpdatesPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#edebde" }}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-mono text-sm transition-all hover:opacity-80"
          style={{ backgroundColor: "#472e21", color: "#edebde" }}
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl sm:text-4xl font-bold mb-2 font-mono"
            style={{ color: "#472e21" }}
          >
            What's New
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#8b6f47" }}>
            Latest updates and improvements to Order Tokens
          </p>
        </div>

        {/* Updates List */}
        <div className="space-y-6">
          {updates.map((update, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg overflow-hidden"
              style={{ backgroundColor: "#fff" }}
            >
              {/* Update Header */}
              <div 
                className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                style={{ backgroundColor: "#d4c4a8" }}
              >
                <div>
                  <h2 
                    className="text-xl sm:text-2xl font-bold font-mono"
                    style={{ color: "#472e21" }}
                  >
                    {update.title}
                  </h2>
                  <p className="text-sm" style={{ color: "#5c4433" }}>
                    {update.date}
                  </p>
                </div>
                <span 
                  className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase"
                  style={{ backgroundColor: "#472e21", color: "#edebde" }}
                >
                  v{update.version}
                </span>
              </div>

              {/* Update Content */}
              <div className="px-4 sm:px-6 py-4">
                <p 
                  className="mb-4 text-sm sm:text-base"
                  style={{ color: "#5c4433" }}
                >
                  {update.description}
                </p>

                {/* Features */}
                <div className="space-y-4">
                  {update.features.map((feature, fIndex) => (
                    <div 
                      key={fIndex}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "#f9f7f2" }}
                    >
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#8b6f47", color: "#fff" }}
                      >
                        {feature.icon}
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-sm sm:text-base mb-1"
                          style={{ color: "#472e21" }}
                        >
                          {feature.title}
                        </h3>
                        <p 
                          className="text-xs sm:text-sm"
                          style={{ color: "#6b5c4c" }}
                        >
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="py-6 mt-8 text-center font-mono text-gray-400 text-xs sm:text-sm">
          <p>© 2025 the chai couples chafe</p>
        </div>
      </div>
    </div>
  );
}