"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SearchSidebar() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-24">
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
          FOR RENT
        </Button>
        <Button className="bg-red-600 hover:bg-red-700">
          FOR SALE
        </Button>
      </div>

      <Input placeholder="Keyword" />
      <Input placeholder="Search Location..." />

      <Select>
        <SelectTrigger>
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="studio">Studio</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span>Bedrooms</span>
          <span className="text-gray-500">All</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Bathrooms</span>
          <span className="text-gray-500">All</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Min Area (SqFt)</span>
            <span>1700</span>
          </div>
          <input type="range" className="w-full" defaultValue={1700} max={10000} />

          <div className="flex justify-between text-sm">
            <span>Max Area (SqFt)</span>
            <span>8400</span>
          </div>
          <input type="range" className="w-full" defaultValue={8400} max={10000} />
        </div>
      </div>

      <Button className="w-full bg-red-600 hover:bg-red-700">
        Find Properties
      </Button>
    </div>
  );
}