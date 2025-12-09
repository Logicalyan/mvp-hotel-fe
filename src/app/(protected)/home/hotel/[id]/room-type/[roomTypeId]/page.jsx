"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getHotelDetail } from "@/lib/services/hotel";
import { getRoomTypeDetail } from "@/lib/services/hotel";
import HotelGallery from "@/components/hotels/HotelGallery";
import BookingModal from "@/components/hotels/BookingModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Users, Home, ChevronRight, Star, Wifi, Tv, Wind, Coffee, Bath } from "lucide-react";
import HotelBookingCard from "@/components/hotels/HotelBookingCard";

export default function RoomTypeDetailPage() {
  const params = useParams();
  console.log("params:", params);
  
  const hotelId = params.hotelId;
  const roomTypeId = params.roomTypeId;

  const [hotel, setHotel] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Debug params
        console.log('🔍 Params:', params);
        console.log('🔍 Hotel ID:', params.id);
        console.log('🔍 Room Type ID:', params.roomTypeId);
        
        // Pastikan params ada
        if (!params.id || !params.roomTypeId) {
          throw new Error('Missing parameters');
        }

        const [hotelData, roomTypeData] = await Promise.all([
          getHotelDetail(params.id),
          getRoomTypeDetail(params.id, params.roomTypeId)
        ]);

        setHotel(hotelData);
        setRoomType(roomTypeData);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.roomTypeId]);

  if (loading) return <RoomTypeDetailSkeleton />;
  if (!roomType || !hotel) return <div>Tipe kamar tidak ditemukan</div>;

  const price = roomType.prices?.[0] || {};
  const weekdayPrice = price.weekday_price || 0;
  const weekendPrice = price.weekend_price || 0;
  const discount = price.discount || 0;

  const getBedInfo = () => {
    if (!roomType.beds?.length) return "Tidak ada informasi tempat tidur";
    return roomType.beds.map(b => `${b.quantity} ${b.bedType?.name || "Kasur"}`).join(" + ");
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Beranda</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/hotel/${hotel.id}`} className="text-gray-500 hover:text-gray-700">
              {hotel.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{roomType.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Kamar */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{roomType.name}</h1>
              <HotelGallery images={roomType.images} hotelName={roomType.name} />
            </div>

            {/* Info Utama */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span className="flex items-center gap-2 text-lg">
                      <Users className="h-6 w-6" /> Maks. {roomType.capacity} Tamu
                    </span>
                    <span className="flex items-center gap-2 text-lg">
                      <Bed className="h-6 w-6" /> {getBedInfo()}
                    </span>
                  </div>
                  {roomType.description && (
                    <p className="text-gray-700 leading-relaxed mt-4">
                      {roomType.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Fasilitas Kamar */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Fasilitas Kamar</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {roomType.facilities?.map((fac) => (
                    <div key={fac.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wifi className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{fac.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking Card */}
        <HotelBookingCard/>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        roomType={roomType}
        hotel={hotel}
      />
    </>
  );
}

// Skeleton
function RoomTypeDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-10 w-96 mb-4" />
      <Skeleton className="h-96 w-full rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}