import { Bed, Users, Wifi, Tv, Wind, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const facilityIcons = {
  wifi: <Wifi className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  ac: <Wind className="h-4 w-4" />,
  breakfast: <Coffee className="h-4 w-4" />,
};

export default function RoomTypeCard({ roomType, hotelId, onBook }) {
  const price = roomType.prices?.[0];
  const weekday = price?.weekday_price || 0;
  const weekend = price?.weekend_price || 0;
  const discount = price?.discount || 0;

  // AMAN: pake hotelId dari props, atau fallback ke roomType.hotel.id
  const currentHotelId = hotelId || roomType.hotel?.id;

  const getBedInfo = () => {
    if (!roomType.beds || roomType.beds.length === 0) return "Tidak ada informasi tempat tidur";
    return roomType.beds
      .map(bed => `${bed.quantity} ${bed.bedType?.name || "Tempat Tidur"}`)
      .join(", ");
  };

  const getMainImage = () => {
    const imageUrl = roomType.images?.[0]?.image_url;
    return imageUrl 
      ? `${process.env.NEXT_PUBLIC_URL}/storage/${imageUrl}`
      : "/placeholder-room.jpg";
  };

  return (
    <div className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-1/3 h-64 md:h-auto">
          <div className="absolute top-4 left-4 z-10">
            {discount > 0 && (
              <Badge className="bg-red-500 text-white px-3 py-1">
                -{discount}%
              </Badge>
            )}
          </div>
          <img
            src={getMainImage()}
            alt={roomType.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{roomType.name}</h3>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {roomType.capacity} Tamu
              </span>
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {getBedInfo()}
              </span>
            </div>
          </div>

          {/* Facilities */}
          {roomType.facilities && roomType.facilities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {roomType.facilities.slice(0, 4).map((facility) => {
                const lowerName = facility.name.toLowerCase();
                let icon = facilityIcons.wifi;
                if (lowerName.includes("tv")) icon = facilityIcons.tv;
                else if (lowerName.includes("ac") || lowerName.includes("air")) icon = facilityIcons.ac;
                else if (lowerName.includes("sarapan")) icon = facilityIcons.breakfast;

                return (
                  <Badge
                    key={facility.id}
                    variant="outline"
                    className="flex items-center gap-1.5 px-3 py-1 text-sm"
                  >
                    {icon}
                    {facility.name}
                  </Badge>
                );
              })}
              {roomType.facilities.length > 4 && (
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  +{roomType.facilities.length - 4} lainnya
                </Badge>
              )}
            </div>
          )}

          {/* Description */}
          {roomType.description && (
            <p className="text-gray-600 mb-6 line-clamp-2 flex-1">
              {roomType.description}
            </p>
          )}

          {/* Footer with Price and CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  Rp {Number(weekday).toLocaleString("id-ID")}
                </span>
                {weekend > weekday && (
                  <span className="text-sm text-gray-500">
                    Rp {Number(weekend).toLocaleString("id-ID")} (weekend)
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">per malam • Termasuk pajak</p>
            </div>

            {/* PAKAI currentHotelId → pasti aman */}
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 px-8">
              <Link href={`/home/hotel/${currentHotelId}/room-type/${roomType.id}`}>
                Pilih Kamar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}