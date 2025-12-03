"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export default function HotelFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onApply({
      search: search || undefined,
      city_id: location || undefined,
      // Tambah filter lain nanti: facilities, price range, dll
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 -mt-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search hotel name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5 mr-2" />
          Search Hotels
        </Button>
      </div>
    </div>
  );
}