import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Wifi, Car, Coffee, Dumbbell, Bath, Tv, Wind, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const facilityIcons = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  breakfast: <Coffee className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  bath: <Bath className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
  ac: <Wind className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
};

export default function HotelTabs({ hotel }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 p-1 rounded-xl">
        <TabsTrigger 
          value="description" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
        >
          Deskripsi
        </TabsTrigger>
        <TabsTrigger 
          value="facilities"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
        >
          Fasilitas
        </TabsTrigger>
        <TabsTrigger 
          value="location"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
        >
          Lokasi
        </TabsTrigger>
        <TabsTrigger 
          value="reviews"
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
        >
          Ulasan
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Tentang Hotel</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {hotel.description || "Hotel ini belum memiliki deskripsi."}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="facilities" className="mt-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Fasilitas Hotel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotel.facilities?.map((facility) => {
              const lowerName = facility.name.toLowerCase();
              let icon = facilityIcons.wifi; // default
              
              if (lowerName.includes("parkir")) icon = facilityIcons.parking;
              else if (lowerName.includes("sarapan")) icon = facilityIcons.breakfast;
              else if (lowerName.includes("gym")) icon = facilityIcons.gym;
              else if (lowerName.includes("tv")) icon = facilityIcons.tv;
              else if (lowerName.includes("ac")) icon = facilityIcons.ac;
              else if (lowerName.includes("restoran")) icon = facilityIcons.restaurant;
              else if (lowerName.includes("bath")) icon = facilityIcons.bath;

              return (
                <div key={facility.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {icon}
                  </div>
                  <span className="font-medium">{facility.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="location" className="mt-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-lg">Lokasi Hotel</h3>
          </div>
          
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">Peta Lokasi</p>
              <p className="text-sm text-gray-500">Tersedia dalam mode desktop</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Alamat Lengkap:</p>
            <p className="text-gray-600">
              {hotel.address}
              {hotel.subDistrict && `, ${hotel.subDistrict.name}`}
              {hotel.district && `, ${hotel.district.name}`}
              {hotel.city && `, ${hotel.city.name}`}
              {hotel.province && `, ${hotel.province.name}`}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Ulasan Tamu</h3>
          {hotel.reviews && hotel.reviews.length > 0 ? (
            <div className="space-y-6">
              {hotel.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.user_name}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {review.rating} ★
                    </Badge>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h4 className="font-semibold text-gray-700 mb-2">Belum Ada Ulasan</h4>
              <p className="text-gray-500">Jadilah yang pertama memberikan ulasan untuk hotel ini</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}