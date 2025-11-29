"use client";

import { useState } from "react";
import { PropertyCard } from "@/components/property-card.jsx";
import { SearchSidebar } from "@/components/search-sidebar.jsx";
import { LayoutGrid, List } from "lucide-react";

// Sample property data
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    name: "Casa Lomas De Mach Mach",
    location: "21 Vegus Street, San Francisco, California",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 1250,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 600,
    badges: ["FOR SALE"],
    isFeatured: true,
    agent: { name: "Amanda Smith" },
  },
  {
    id: 2,
    name: "Villa Del Mar Retreat, Malibu",
    location: "8502 Ocean Drive, Los Angeles, California",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    price: 950,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 800,
    badges: ["FOR RENT"],
    isFeatured: true,
    agent: { name: "Sarah Wilson" },
  },
  {
    id: 3,
    name: "Rancho Vista Verde, Santa Barbara",
    location: "37 Vegus Street, San Francisco, California",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    price: 1650,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 600,
    badges: ["FOR SALE"],
    isFeatured: true,
    agent: { name: "Ralph Edwards" },
  },
  {
    id: 4,
    name: "Sunset Heights Estate, Beverly Hills",
    location: "1840 Ocean Santa Monica, California",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    price: 950,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 600,
    badges: ["FOR RENT"],
    isFeatured: false,
    agent: { name: "Jacob Jones" },
  },
  {
    id: 5,
    name: "Coastal Serenity Cottage",
    location: "21 Vegus Street, Beverly Hills, California",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 1750,
    bedrooms: 6,
    bathrooms: 5,
    sqft: 900,
    badges: ["FOR SALE"],
    isFeatured: true,
    agent: { name: "Kathryn Martin" },
  },
  {
    id: 6,
    name: "Lakeview Haven, Lake Tahoe",
    location: "37 Vegus Street, San Francisco, California",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    price: 850,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 600,
    badges: ["FOR RENT"],
    isFeatured: false,
    agent: { name: "Lloyd Miles" },
  },
  {
    id: 7,
    name: "Sunset Heights Estate, Beverly Hills",
    location: "1840 Ocean Santa Monica, California",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    price: 930,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 600,
    badges: ["FOR SALE"],
    isFeatured: true,
    agent: { name: "Jacob Jones" },
  },
  {
    id: 8,
    name: "Coastal Serenity Cottage",
    location: "21 Vegus Drive, Beverly Hills, California",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    price: 1290,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 800,
    badges: ["FOR RENT"],
    isFeatured: false,
    agent: { name: "Kathryn Murphy" },
  },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState("grid");

  const handleSearch = (filters) => {
    console.log("Search filters:", filters);
    // TODO: Implement filtering logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Search Sidebar - Left */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <SearchSidebar onSearch={handleSearch} />
          </div>

          {/* Main Content - Right */}
          <div className="flex-1">
            {/* Toolbar with Sort and View Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">80 Per Page</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  Showing {SAMPLE_PROPERTIES.length} results
                </span>
              </div>

              <div className="flex items-center gap-4">
                <select className="text-sm border border-gray-300 rounded px-3 py-2 text-gray-600">
                  <option>Sort by (Default)</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>

                <div className="flex gap-1 border border-gray-300 rounded p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {SAMPLE_PROPERTIES.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">
                  1
                </button>
                <button className="w-10 h-10 bg-white text-gray-600 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="w-10 h-10 bg-white text-gray-600 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="w-10 h-10 bg-white text-gray-600 rounded border border-gray-300 hover:bg-gray-50 transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
