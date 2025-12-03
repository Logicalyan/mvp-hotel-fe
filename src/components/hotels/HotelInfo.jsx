import { Star, MapPin, Share2, Heart, Wifi, SquareParking, Coffee, Dumbbel, SquareParkingl, Tv, Bath, Dumbbell, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


const facilityIcons = {
  wifi: { icon: <Wifi className="h-4 w-4" />, color: "bg-blue-50 text-blue-700" },
  parking: { icon: <Car className="h-4 w-4" />, color: "bg-green-50 text-green-700" },
  breakfast: { icon: <Coffee className="h-4 w-4" />, color: "bg-amber-50 text-amber-700" },
  gym: { icon: <Dumbbell className="h-4 w-4" />, color: "bg-red-50 text-red-700" },
  tv: { icon: <Tv className="h-4 w-4" />, color: "bg-purple-50 text-purple-700" },
  bath: { icon: <Bath className="h-4 w-4" />, color: "bg-cyan-50 text-cyan-700" },
};

const getFacilityInfo = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return facilityIcons.wifi;
  if (lower.includes("parkir") || lower.includes("parking")) return facilityIcons.parking;
  if (lower.includes("sarapan") || lower.includes("breakfast")) return facilityIcons.breakfast;
  if (lower.includes("gym") || lower.includes("fitness")) return facilityIcons.gym;
  if (lower.includes("tv") || lower.includes("televisi")) return facilityIcons.tv;
  if (lower.includes("bathtub") || lower.includes("bak mandi") || lower.includes("bath")) return facilityIcons.bath;
  return { icon: null, color: "bg-gray-50 text-gray-700" };
};

export default function HotelInfo({ hotel }) {
  const rating = hotel.rating || 4.8;
  const reviewCount = hotel.review_count || 128;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel.name,
          text: `Cek hotel keren ini: ${hotel.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share dibatalkan");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link hotel berhasil disalin!");
    }
  };

  const handleSave = () => {
    toast.success("Hotel disimpan ke favorit");
  };

  const popularFacilities = hotel.facilities?.slice(0, 6) || [];

  return (
    <div className="space-y-6">
      {/* Header with Hotel Name and Rating */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Rating and Location */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-gray-600">({reviewCount} ulasan)</span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">
              {hotel.city?.name || hotel.district?.name || "Lokasi tidak tersedia"}
            </span>
          </div>
        </div>
      </div>

      {/* Popular Facilities */}
      {popularFacilities.length > 0 && (
        <div className="bg-gray-50 p-5 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-3">Fasilitas Populer</p>
          <div className="flex flex-wrap gap-3">
            {popularFacilities.map((facility) => {
              const { icon, color } = getFacilityInfo(facility.name);
              return (
                <Badge
                  key={facility.id}
                  variant="secondary"
                  className={`px-4 py-2 text-sm flex items-center gap-2 ${color}`}
                >
                  {icon}
                  {facility.name}
                </Badge>
              );
            })}
            {hotel.facilities?.length > 6 && (
              <Badge variant="outline" className="px-4 py-2 text-sm">
                +{hotel.facilities.length - 6} lainnya
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          <span>Bagikan</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex-1 sm:flex-none gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
          onClick={handleSave}
        >
          <Heart className="h-5 w-5" />
          <span>Simpan</span>
        </Button>
      </div>

      {/* Full Address */}
      <div className="border-t pt-6">
        <h3 className="font-semibold text-gray-900 mb-2">Alamat Lengkap</h3>
        <p className="text-gray-700 leading-relaxed">
          {hotel.address}
          {hotel.subDistrict && `, ${hotel.subDistrict.name}`}
          {hotel.district && `, ${hotel.district.name}`}
          {hotel.city && `, ${hotel.city.name}`}
          {hotel.province && `, ${hotel.province.name}`}
        </p>
      </div>
    </div>
  );
}