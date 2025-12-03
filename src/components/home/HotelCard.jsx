import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Wifi, Car, Coffee } from "lucide-react";

export default function HotelCard({ hotel }) {
  const firstImage = hotel.images?.[0]?.image_url
    ? `${process.env.NEXT_PUBLIC_URL}/storage/${hotel.images[0].image_url}`
    : "/placeholder-hotel.jpg";

  const facilitiesIcon = {
    wifi: <Wifi className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
    breakfast: <Coffee className="h-4 w-4" />,
  };

  return (
    <Link href={`/home/hotel/${hotel.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64">
          <img
            src={firstImage}
            alt={hotel.name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-800 backdrop-blur">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              4.8
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition">
            {hotel.name}
          </h3>

          <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
            <MapPin className="h-4 w-4" />
            {hotel.city?.name || "Location"}, {hotel.province?.name || ""}
          </p>

          <div className="flex gap-3 mb-4 text-gray-600">
            {hotel.facilities?.slice(0, 3).map((fac) => (
              <span key={fac.id} className="flex items-center gap-1 text-xs">
                {facilitiesIcon[fac.name.toLowerCase()] || null}
                {fac.name}
              </span>
            ))}
            {hotel.facilities?.length > 3 && (
              <span className="text-xs text-gray-500">+{hotel.facilities.length - 3} more</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ${hotel.starting_price || 89}
              </span>
              <span className="text-sm text-gray-500"> / night</span>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}