"use client";

import PropertyCard from "./HotelCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3X3, List } from "lucide-react";

const mockData = [
  {
    featured: true,
    type: "STUDIO",
    title: "Casa Lomas De Machali Machas",
    address: "9 33 Maple Street, San Francisco, California",
    beds: 3, baths: 2, area: "805 SqFt",
    price: "$750.00/sqft",
    agent: "Arlene McCoy",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
  },
  {
    featured: true,
    type: "APARTMENT",
    title: "Villa Del Mar Retreat, Malibu",
    address: "72 Sunset Avenue, Los Angeles, California",
    beds: 3, baths: 2, area: "600 SqFt",
    price: "$250.00/month",
    agent: "Annette Black",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
  },
  // Tambah lagi sesuai gambar...
].concat([ /* duplikat buat ngisi grid */ ]);

export default function PropertyGrid() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2">
          <Button variant="outline" size="icon"><Grid3X3 className="h-5 w-5" /></Button>
          <Button variant="outline" size="icon"><List className="h-5 w-5" /></Button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">10 Per Page</span>
          <Select defaultValue="default">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by (Default)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort by (Default)</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockData.concat(mockData).slice(0, 8).map((prop, i) => (
          <PropertyCard key={i} property={prop} />
        ))}
      </div>
    </div>
  );
}