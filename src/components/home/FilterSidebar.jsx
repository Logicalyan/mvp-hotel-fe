"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const priceRanges = [
  { label: "Di bawah Rp500.000", value: "0,500000" },
  { label: "Rp500.000 - Rp1.000.000", value: "500000,1000000" },
  { label: "Rp1.000.000 - Rp2.000.000", value: "1000000,2000000" },
  { label: "Di atas Rp2.000.000", value: "2000000,999999999" },
];

const facilities = ["WiFi", "Kolam Renang", "Parkir", "Restoran", "Gym", "Spa", "AC", "TV"];

export default function FilterSidebar({ onApply }) {
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  const handleApply = () => {
    const filters = {};
    if (selectedPrice) {
      const [min, max] = selectedPrice.split(",");
      filters.price_min = min;
      filters.price_max = max;
    }
    if (selectedFacilities.length > 0) {
      filters.facilities = selectedFacilities.join(",");
    }
    onApply(filters);
  };

  const toggleFacility = (fac) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 sticky top-24">
      <h3 className="text-xl font-bold">Filter Pencarian</h3>

      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold">Harga per Malam</Label>
        <div className="mt-3 space-y-2">
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={range.value}
                checked={selectedPrice === range.value}
                onCheckedChange={() => setSelectedPrice(selectedPrice === range.value ? "" : range.value)}
              />
              <Label htmlFor={range.value} className="cursor-pointer">
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Facilities */}
      <div>
        <Label className="text-base font-semibold">Fasilitas Hotel</Label>
        <div className="mt-3 space-y-2">
          {facilities.map((fac) => (
            <div key={fac} className="flex items-center space-x-2">
              <Checkbox
                id={fac}
                checked={selectedFacilities.includes(fac)}
                onCheckedChange={() => toggleFacility(fac)}
              />
              <Label htmlFor={fac} className="cursor-pointer">
                {fac}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
        Terapkan Filter
      </Button>
    </div>
  );
}