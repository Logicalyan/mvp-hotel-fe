"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Users, Wifi, Coffee, Car, Dumbbell, Bed, Bath, Maximize, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

// Sample property data (same as dashboard)
const SAMPLE_PROPERTIES = [
  {
    id: 1,
    name: "Maxone Ascent Hotel Luxury Kota Malang",
    location: "Jln. Diponegoro V No. 12, Kec. Lowokwaru, Kota Malang",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    ],
    price: 301,
    originalPrice: 351,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 600,
    rating: 5.0,
    reviews: 245,
    badges: ["Perfect", "Hotels", "New Building", "Top Value"],
    description: "A studio apartment in strategic location in Malang. Located nearby Univ Muhammadiyah Malang, Univ Negeri Malang and Univ Brawijaya, this is perfect for students and academics. This is in the main road to Batu, the main tourist attractions in East Java. So, it is well suited for tourists. This has a stunning Arjuno Mountain view with misty ambience in morning. It has kitchen, and cozy sofa and bunk bed & it caters up 3 guests. It has two pools, gyms, futsal field, minimarket and coffee shop.",
    features: [
      { icon: Wifi, label: "Wi-Fi" },
      { icon: Bed, label: "Kings Bed" },
      { icon: Coffee, label: "Bathtub" },
      { icon: Coffee, label: "Breakfast" },
      { icon: Maximize, label: "4m x 6m" },
    ],
    checkIn: "Oct 7, 2021",
    checkOut: "Oct 8, 2021",
  },
  // Add more properties as needed
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = parseInt(params.id);
  
  // Find property by ID
  const property = SAMPLE_PROPERTIES.find(p => p.id === propertyId) || SAMPLE_PROPERTIES[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState("2 Adults, 1 Children");
  const [checkIn, setCheckIn] = useState(property.checkIn);
  const [checkOut, setCheckOut] = useState(property.checkOut);
  const [features, setFeatures] = useState({
    breakfast: true,
    parking: false,
    extraPillow: false,
  });

  const nights = 1;
  const discount = 200;
  const breakfastFee = features.breakfast ? 10 : 0;
  const serviceFee = 5;
  const totalPayment = (property.price * nights) - discount + breakfastFee + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Main Image */}
                <div className="col-span-2 relative h-80 rounded-lg overflow-hidden">
                  <img
                    src={property.images[selectedImage]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded text-sm font-medium">
                    +12 Photos
                  </div>
                </div>
                
                {/* Thumbnail Images */}
                {property.images.slice(1, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx + 1)}
                    className="relative h-40 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Rating & Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
                  {property.rating} Perfect
                </span>
                {property.badges.slice(0, 3).map((badge, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
                    {badge}
                  </span>
                ))}
                <div className="flex gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-black mb-2">{property.name}</h1>
              
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{property.location}</span>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-medium">
                    Description
                  </button>
                  <button className="pb-3 text-gray-600 hover:text-black">
                    Features
                  </button>
                  <button className="pb-3 text-gray-600 hover:text-black">
                    Virtual
                  </button>
                  <button className="pb-3 text-gray-600 hover:text-black">
                    Price & Task history
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {property.description}
              </p>

              {/* Hotel Features */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Hotels features</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-black">${property.price}</span>
                  <span className="text-gray-500">/night</span>
                  {property.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">${property.originalPrice}</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      -20% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Check-in / Check-out */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Check-In</label>
                  <Input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="text-black"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Check-Out</label>
                  <Input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="text-black"
                  />
                </div>
              </div>

              {/* Guest */}
              <div className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">Guest</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>2 Adults, 1 Children</option>
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                </select>
              </div>

              {/* Features (NOT Extra Features) */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-black mb-3">Features</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={features.breakfast}
                        onChange={(e) => setFeatures({ ...features, breakfast: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Breakfast a day per person</span>
                    </div>
                    <span className="text-sm font-medium text-black">${breakfastFee}</span>
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={features.parking}
                        onChange={(e) => setFeatures({ ...features, parking: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Parking a day</span>
                    </div>
                    <span className="text-sm font-medium text-black">$0</span>
                  </label>
                  <label className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={features.extraPillow}
                        onChange={(e) => setFeatures({ ...features, extraPillow: e.target.checked })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Extra pillow</span>
                    </div>
                    <span className="text-sm text-gray-700">Free</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h4 className="text-sm font-semibold text-black mb-3">Price</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{nights} Nights</span>
                    <span className="text-black">${property.price * nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount 20%</span>
                    <span className="text-red-500">-${discount}</span>
                  </div>
                  {breakfastFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breakfast a day per person</span>
                      <span className="text-black">${breakfastFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-black">${serviceFee}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-black">Total Payment</span>
                  <span className="text-2xl font-bold text-black">${totalPayment}</span>
                </div>
              </div>

              {/* Book Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold">
                Book Now
              </Button>
              
              <p className="text-center text-xs text-gray-500 mt-3">
                You will not get charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
