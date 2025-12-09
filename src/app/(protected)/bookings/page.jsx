"use client";

import React, { useState, useEffect } from "react";
import { getHotelDetail } from "@/lib/services/hotel";
import HotelGallery from "@/components/hotels/HotelGallery";
import HotelInfo from "@/components/hotels/HotelInfo";
import RoomTypeCard from "@/components/hotels/RoomTypeCard";
import BookingCard from "@/components/hotels/BookingCard";
import BookingModal from "@/components/hotels/BookingModal";
import HotelTabs from "@/components/hotels/HotelTabs";
import { Skeleton } from "@/components/ui/skeleton";
import HotelBookingCard from "@/components/hotels/HotelBookingCard";

export default function HotelDetail({ params }) {
  const { id } = React.use(params);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelDetail(id);
        setHotel(data);
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const openBooking = (roomType) => {
    setSelectedRoomType(roomType);
    setIsBookingOpen(true);
  };

  if (loading) {
    return <HotelDetailSkeleton />;
  }

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Hotel Tidak Ditemukan</h2>
        <p className="text-gray-500">Hotel yang Anda cari tidak tersedia.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gallery Section */}
        <div className="mb-8">
          <HotelGallery images={hotel.images} hotelName={hotel.name} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Information */}
            <HotelInfo hotel={hotel} />

            {/* Hotel Details Tabs */}
            <HotelTabs hotel={hotel} />

            {/* Room Types Section */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Pilih Tipe Kamar</h2>
                <span className="text-sm text-gray-500">
                  {hotel.room_types?.length || 0} tipe kamar tersedia
                </span>
              </div>
              
              <div className="space-y-6">
                {hotel.room_types?.length > 0 ? (
                  hotel.room_types.map((roomType) => (
                    <RoomTypeCard
                      key={roomType.id}
                      roomType={roomType}
                      onBook={() => openBooking(roomType)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                    <p className="text-gray-500">Tidak ada kamar tersedia saat ini</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        roomType={selectedRoomType}
        hotel={hotel}
      />
    </>
  );
}

// Skeleton Loader Component
function HotelDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Skeleton className="h-96 w-full rounded-2xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}