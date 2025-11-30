"use client";

import { useState, useEffect } from "react";
import { PropertyCard } from "@/components/property-card.jsx";
import { SearchSidebar } from "@/components/search-sidebar.jsx";
import { LayoutGrid, List } from "lucide-react";
import { getHotels } from "@/lib/services/client/hotels";

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);

  // Fetch hotels on mount
  useEffect(() => {
    fetchHotels();
  }, []);

  // Fetch hotels from API
  async function fetchHotels(searchFilters = {}, page = 1) {
    try {
      setLoading(true);
      console.log('📍 Dashboard: Fetching hotels with filters:', searchFilters, 'Page:', page);
      
      const response = await getHotels(page, searchFilters, 10);
      console.log('📍 Dashboard: Received response:', response);
      
      const hotelData = response.hotels || [];
      const meta = response.meta || {};
      
      console.log('📍 Dashboard: Hotels data:', hotelData);
      console.log('📍 Dashboard: Meta:', meta);
      console.log('📍 Dashboard: Hotels count:', hotelData?.length || 0);
      
      if (!Array.isArray(hotelData)) {
        console.warn('⚠️ Dashboard: Hotels is not an array, received:', typeof hotelData);
        setHotels([]);
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const storageUrl = apiUrl.replace('/api', '');

      // Map hotels data to add required fields for PropertyCard
      const mappedHotels = hotelData.map(hotel => ({
        id: hotel.id,
        name: hotel.name || 'Unnamed Hotel',
        location: hotel.city?.name || hotel.address || 'Location not available',
        image: hotel.images?.[0]?.image_url 
          ? `${storageUrl}/storage/${hotel.images[0].image_url}`
          : null,
        price: hotel.min_price || hotel.price || 0,
        bedrooms: hotel.total_rooms || 0,
        bathrooms: hotel.total_rooms || 0,
        sqft: 0,
        badges: hotel.facilities?.map(f => f.name).slice(0, 3) || [],
        agent: hotel.email || null,
        isFeatured: false,
        description: hotel.description,
        phone: hotel.phone_number,
        email: hotel.email,
        province: hotel.province?.name,
        city: hotel.city?.name,
        district: hotel.district?.name,
        subDistrict: hotel.sub_district?.name,
        facilities: hotel.facilities,
      }));
      
      setHotels(mappedHotels);
      setCurrentPage(meta.current_page || 1);
      setTotalPages(meta.last_page || 1);
      setTotalHotels(meta.total || 0);
      
    } catch (error) {
      console.error("❌ Dashboard: Failed to fetch hotels:", error);
      console.error("Error details:", error.response?.data || error.message);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (filters) => {
    console.log("Search filters:", filters);
    setFilters(filters);
    fetchHotels(filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Search Sidebar - Left */}
          <div className="w-80 shrink-0">
            <SearchSidebar onSearch={handleSearch} />
          </div>

          {/* Main Content - Right */}
          <div className="flex-1">
            {/* Toolbar with Sort and View Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">10 Per Page</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  Showing {hotels.length} of {totalHotels} results (Page {currentPage}/{totalPages})
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

            {/* Hotels Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading hotels...</p>
                </div>
              ) : hotels.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">No hotels found</p>
                </div>
              ) : (
                hotels.map((hotel) => (
                  <PropertyCard
                    key={hotel.id}
                    property={hotel}
                    viewMode={viewMode}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
