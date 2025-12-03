"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, CalendarIcon, Users, Search, Home, Building2, Building } from "lucide-react";

export default function HeroSearchBar({ onSearch }) {
  const [activeTab, setActiveTab] = useState("hotel");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    onSearch({
      search: location,
      check_in: checkIn ? format(checkIn, "yyyy-MM-dd") : undefined,
      check_out: checkOut ? format(checkOut, "yyyy-MM-dd") : undefined,
      adults: adults,
      children: children,
      rooms: rooms,
    });
  };

  return (
    <div className="relative h-96 bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/40" />
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "hotel", label: "Hotel", icon: Building2 },
            { id: "villa", label: "Villa", icon: Home },
            { id: "apartment", label: "Apartemen", icon: Building },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "secondary"}
              className={`rounded-full ${activeTab === tab.id ? "bg-white text-blue-900" : "bg-white/20 text-white"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 -mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Kota, hotel, tempat wisata"
                className="pl-12 h-14 text-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Check In - Out */}
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-14 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {checkIn ? format(checkIn, "dd MMM yyyy") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-14 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {checkOut ? format(checkOut, "dd MMM yyyy") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest & Room */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-14 justify-start">
                  <Users className="mr-2 h-5 w-5" />
                  {adults} Dewasa, {children} Anak, {rooms} Kamar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Dewasa</Label>
                    <div className="flex items-center gap-3">
                      <Button size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}>-</Button>
                      <span className="w-8 text-center">{adults}</span>
                      <Button size="icon" onClick={() => setAdults(adults + 1)}>+</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Anak</Label>
                    <div className="flex items-center gap-3">
                      <Button size="icon" onClick={() => setChildren(Math.max(0, children - 1))}>-</Button>
                      <span className="w-8 text-center">{children}</span>
                      <Button size="icon" onClick={() => setChildren(children + 1)}>+</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Kamar</Label>
                    <div className="flex items-center gap-3">
                      <Button size="icon" onClick={() => setRooms(Math.max(1, rooms - 1))}>-</Button>
                      <span className="w-8 text-center">{rooms}</span>
                      <Button size="icon" onClick={() => setRooms(rooms + 1)}>+</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Button */}
            <Button size="lg" className="h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg" onClick={handleSearch}>
              <Search className="mr-2 h-6 w-6" />
              Cari
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}