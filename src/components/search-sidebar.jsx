"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { getAllFacilities, getAllLocations, getAllPropertyTypes } from "@/lib/services/facilities";

export function SearchSidebar({ onSearch }) {
    console.log('🎯 SearchSidebar component mounted');
    
    const [isClient, setIsClient] = useState(false);

    const [filters, setFilters] = useState({
        facilities: [],
        keyword: "",
        location: "All",
        propertyType: "All",
        priceMin: 0,
        priceMax: 100000,
    });

    const [facilitiesList, setFacilitiesList] = useState([]);
    const [loadingFacilities, setLoadingFacilities] = useState(true);

    const [locationsList, setLocationsList] = useState([]);
    const [loadingLocations, setLoadingLocations] = useState(true);

    const [propertyTypesList, setPropertyTypesList] = useState([]);
    const [loadingPropertyTypes, setLoadingPropertyTypes] = useState(true);

    // Mark component as hydrated on client-side
    useEffect(() => {
        console.log('✅ SearchSidebar: Client hydrated');
        setIsClient(true);
    }, []);

    // Fetch facilities from API
    useEffect(() => {
        async function fetchFacilities() {
            try {
                console.log('🔍 Fetching facilities...');
                const data = await getAllFacilities();
                console.log('✅ Facilities response:', data);
                if (Array.isArray(data)) {
                    console.log('📊 Facilities count:', data.length);
                    setFacilitiesList(data);
                } else {
                    console.warn('⚠️ Facilities response is not array:', typeof data);
                    setFacilitiesList([]);
                }
            } catch (error) {
                console.error("❌ Failed to fetch facilities:", error.message);
                console.error("Error details:", error.response?.data || error);
                setFacilitiesList([]);
            } finally {
                setLoadingFacilities(false);
            }
        }
        fetchFacilities();
    }, []);

    // Fetch locations from API
    useEffect(() => {
        async function fetchLocations() {
            try {
                console.log('🔍 Fetching locations...');
                const data = await getAllLocations();
                console.log('✅ Locations response:', data);
                if (Array.isArray(data)) {
                    console.log('📊 Locations count:', data.length);
                    setLocationsList(data);
                } else {
                    console.warn('⚠️ Locations response is not array:', typeof data);
                    setLocationsList([]);
                }
            } catch (error) {
                console.error("❌ Failed to fetch locations:", error.message);
                console.error("Error details:", error.response?.data || error);
                setLocationsList([]);
            } finally {
                setLoadingLocations(false);
            }
        }
        fetchLocations();
    }, []);

    // Fetch property types from API
    useEffect(() => {
        async function fetchPropertyTypes() {
            try {
                console.log('🔍 Fetching property types...');
                const data = await getAllPropertyTypes();
                console.log('✅ Property types response:', data);
                if (Array.isArray(data)) {
                    console.log('📊 Property types count:', data.length);
                    setPropertyTypesList(data);
                } else {
                    console.warn('⚠️ Property types response is not array:', typeof data);
                    setPropertyTypesList([]);
                }
            } catch (error) {
                console.error("❌ Failed to fetch property types:", error.message);
                console.error("Error details:", error.response?.data || error);
                setPropertyTypesList([]);
            } finally {
                setLoadingPropertyTypes(false);
            }
        }
        fetchPropertyTypes();
    }, []);

    const handleSearch = () => {
        if (onSearch) {
            onSearch(filters);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-black mb-6">Search</h2>

            {/* Keyword Search */}
            <div className="mb-4">
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

            {/* Fasilitas (Facilities) */}
            <div className="mb-6">
                <label className="text-sm font-medium text-black mb-3 block">
                    Fasilitas
                </label>
                {loadingFacilities ? (
                    <div className="text-sm text-gray-500 py-2">Loading facilities...</div>
                ) : facilitiesList.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No facilities available</div>
                ) : (
                    <div className="space-y-2">
                        {facilitiesList.map((facility) => (
                            <label key={facility.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.facilities?.includes(facility.nama_fasilitas)}
                                    onChange={(e) => {
                                        const facilities = filters.facilities || [];
                                        setFilters({
                                            ...filters,
                                            facilities: e.target.checked
                                                ? [...facilities, facility.nama_fasilitas]
                                                : facilities.filter(f => f !== facility.nama_fasilitas)
                                        });
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{facility.nama_fasilitas}</span>
                            </label>
                        ))}
                    </div>
                )}
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
                        disabled={loadingLocations}
                    >
                        <option value="All">All</option>
                        {locationsList.map((location) => (
                            <option key={location.id} value={location.nama_kota}>
                                {location.nama_kota}
                            </option>
                        ))}
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
                        disabled={loadingPropertyTypes}
                    >
                        <option value="All">All</option>
                        {propertyTypesList.map((type) => (
                            <option key={type.id} value={type.nama_tipe_bed}>
                                {type.nama_tipe_bed}
                            </option>
                        ))}
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
