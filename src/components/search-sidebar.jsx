"use client";

import { useState } from "react";
import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export function SearchSidebar({ onSearch }) {
    const [filters, setFilters] = useState({
        type: "FOR RENT",
        keyword: "",
        location: "All",
        propertyType: "All",
        priceMin: 0,
        priceMax: 100000,
    });

    const handleSearch = () => {
        if (onSearch) {
            onSearch(filters);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-black mb-6">Search</h2>

            {/* FOR RENT / FOR SALE Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                    onClick={() => setFilters({ ...filters, type: "FOR RENT" })}
                    className={`py-2 px-4 rounded font-medium transition-colors ${filters.type === "FOR RENT"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    FOR RENT
                </button>
                <button
                    onClick={() => setFilters({ ...filters, type: "FOR SALE" })}
                    className={`py-2 px-4 rounded font-medium transition-colors ${filters.type === "FOR SALE"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    FOR SALE
                </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-4">
                <label className="text-sm font-medium text-black mb-2 block">
                    Keyword
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search Keyword"
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Location */}
            <div className="mb-4">
                <label className="text-sm font-medium text-black mb-2 block">
                    Location
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-black focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option>All</option>
                        <option>Jakarta</option>
                        <option>Bali</option>
                        <option>Bandung</option>
                        <option>Surabaya</option>
                    </select>
                </div>
            </div>

            {/* Property Type */}
            <div className="mb-6">
                <label className="text-sm font-medium text-black mb-2 block">
                    Property Type
                </label>
                <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={filters.propertyType}
                        onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-black focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option>All</option>
                        <option>Hotel</option>
                        <option>Resort</option>
                        <option>Villa</option>
                        <option>Apartment</option>
                    </select>
                </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
                <label className="text-sm font-medium text-black mb-2 block">
                    Price Range
                </label>
                <div className="space-y-3">
                    {/* Price Display */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">${filters.priceMin.toLocaleString()}</span>
                        <span className="text-gray-600">${filters.priceMax.toLocaleString()}</span>
                    </div>

                    {/* Range Slider Container */}
                    <div className="relative h-2">
                        {/* Background Track */}
                        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

                        {/* Active Range Track */}
                        <div
                            className="absolute h-2 bg-blue-600 rounded-full"
                            style={{
                                left: `${(filters.priceMin / 100000) * 100}%`,
                                right: `${100 - (filters.priceMax / 100000) * 100}%`
                            }}
                        ></div>

                        {/* Min Range Input */}
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={filters.priceMin}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value < filters.priceMax) {
                                    setFilters({ ...filters, priceMin: value });
                                }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                        />

                        {/* Max Range Input */}
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={filters.priceMax}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > filters.priceMin) {
                                    setFilters({ ...filters, priceMax: value });
                                }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                        />
                    </div>
                </div>
            </div>

            {/* Find Properties Button */}
            <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
                Find Properties
            </Button>
        </div>
    );
}
