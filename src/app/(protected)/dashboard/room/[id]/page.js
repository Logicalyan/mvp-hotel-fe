"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoomById } from "@/lib/services/rooms";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Wifi, Car, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomDetail();
  }, [roomId]);

  async function fetchRoomDetail() {
    try {
      setLoading(true);
      const data = await getRoomById(roomId);
      setRoom(data);
    } catch (error) {
      console.error("Failed to fetch room detail:", error);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Room not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-6">
              <img
                src={room.image || "/placeholder-room.jpg"}
                alt={room.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{room.location}</span>
              </div>

              {/* Room Stats */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{room.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{room.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{room.sqft} SqFt</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {room.description || "Experience luxury and comfort in this beautifully designed room. Perfect for both business and leisure travelers."}
                </p>
              </div>

              {/* Facilities */}
              {room.facilities && room.facilities.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  ${room.price?.toLocaleString()}
                </div>
                <div className="text-gray-600">per night</div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                Book Now
              </Button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Room Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Free cancellation</li>
                  <li>✓ No prepayment needed</li>
                  <li>✓ Confirmation is immediate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
