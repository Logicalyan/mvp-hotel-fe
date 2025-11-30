"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PropertyCard } from "@/components/property-card.jsx";
import { getHotelById } from "@/lib/services/hotel";
import { getRoomTypesByHotel } from "@/lib/services/hotels/roomType";
import { ArrowLeft } from "lucide-react";

export default function HotelRoomTypesPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id;

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelData();
  }, [hotelId]);

  async function fetchHotelData() {
    try {
      setLoading(true);
      console.log('🏨 Hotel ID:', hotelId);
      
      const hotelData = await getHotelById(hotelId);
      console.log('✅ Hotel data:', hotelData);
      
      const roomTypesResponse = await getRoomTypesByHotel(hotelId);
      console.log('✅ Room types response:', roomTypesResponse);
      console.log('📊 Room types count:', roomTypesResponse.roomTypesByHotel?.length || 0);
      
      setHotel(hotelData);
      setRoomTypes(roomTypesResponse.roomTypesByHotel || []);
    } catch (error) {
      console.error("❌ Failed to fetch hotel data:", error);
      console.error("Error details:", error.response?.data || error.message);
      setHotel(null);
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Hotels</span>
        </button>

        {/* Hotel Header */}
        {hotel && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.location}</p>
          </div>
        )}

        {/* Room Types Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading room types...</p>
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No room types available for this hotel</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((roomType) => (
                <PropertyCard
                  key={roomType.id}
                  property={roomType}
                  linkPath={`/dashboard/room/${roomType.id}`}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
