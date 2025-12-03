"use client";

import { Home, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function HotelHeader() {
  const [activeTab, setActiveTab] = useState("buy");

  const tabs = [
    { id: "buy", label: "Buy", icon: <Home className="h-5 w-5" /> },
    { id: "sell", label: "Sell", icon: <DollarSign className="h-5 w-5" /> },
    { id: "rent", label: "Rent", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "compare", label: "Compare", icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">STATU</div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 text-gray-700 hover:text-blue-600">
              Sign In
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto py-2 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 mx-1 rounded-lg
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
                }
              `}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}