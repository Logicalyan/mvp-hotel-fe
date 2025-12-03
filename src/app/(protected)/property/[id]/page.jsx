import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Wifi, BedDouble, Bath, Coffee, Dumbbell, Share2, Heart, Star, Users } from "lucide-react";
import { format } from "date-fns";

export default function PropertyDetail() {
  return (
    <>
      {/* Header tetap sama kayak homepage */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold">STATU</span>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#" className="text-gray-700 hover:text-blue-600">Buy</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Sell</a>
              <a href="#" className="text-blue-600 font-semibold">Rent</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Compare</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block relative">
              <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border rounded-full w-64" />
              <button className="absolute left-3 top-2.5 bg-blue-600 text-white p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Jackson Pierce</p>
                <p className="text-xs text-gray-500">California, US</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Images + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-96 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1618778616588-2d7e4b19e952?w=1200" alt="Room" fill className="object-cover" />
              </div>
              <div className="space-y-4">
                <div className="relative h-48 bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1598928506835-cd3e7f8e6049?w=800" alt="Pool" fill className="object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-44 bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" alt="View" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">+12 Photos</span>
                    </div>
                  </div>
                  <div className="relative h-44 bg-gray-200">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800" alt="Bedroom" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating & Title */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Badge className="bg-green-100 text-green-800">5.0 Perfect</Badge>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Hotels · New Building · Top Value</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Maxone Ascent Hotel Luxury Kota Malang</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Jln. Diponegoro V No.12, Kec. Lowokwaru, Kota Malang
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="virtual">Virtual</TabsTrigger>
                <TabsTrigger value="price">Price & Task history</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6 text-gray-700 leading-relaxed">
                A studio apartment in strategic location in Malang. Located nearby Universitas Muhammadiyah Malang, Universitas Negeri Malang and Universitas Brawijaya. This is perfect for students and academics. This is in the main road to Batu, the main tourist attractions in East Java. So, it is well suited for tourists. This has a stunning Arjuna Mountain view with misty ambience in morning. It has kitchen, and cozy sofa and bunk bed & it caters up to 3 guests. It has two pools, gyms, futsal field, minimarket and coffee shop.
              </TabsContent>
              <TabsContent value="features" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-6 w-6 text-blue-600" />
                    <span>Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BedDouble className="h-6 w-6 text-blue-600" />
                    <span>King Bed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="h-6 w-6 text-blue-600" />
                    <span>Bathtub</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coffee className="h-6 w-6 text-blue-600" />
                    <span>Breakfast</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-6 w-6 text-blue-600" />
                    <span>4m x 6m</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl sticky top-24">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold">$301</span>
                    <span className="text-gray-600">/night</span>
                    <span className="text-sm text-gray-500 line-through ml-2">$376</span>
                  </div>
                  <Badge className="bg-red-100 text-red-700">20% off</Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          Check-in
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={new Date("2025-10-07")} />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          Check-out
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={new Date("2025-10-08")} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Adult</SelectItem>
                      <SelectItem value="2">2 Adults, 1 Children</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3 my-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Checkbox id="pet" />
                    <Label htmlFor="pet" className="flex justify-between w-full">
                      <span>Allow to bring pet</span>
                      <span className="text-gray-600">$13</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="breakfast" defaultChecked />
                    <Label htmlFor="breakfast" className="flex justify-between w-full">
                      <span>Breakfast a day per person</span>
                      <span className="text-gray-600">$10</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="parking" defaultChecked />
                    <Label htmlFor="parking" className="flex justify-between w-full">
                      <span>Parking a day</span>
                      <span className="text-gray-600">$8</span>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="pillow" />
                    <Label htmlFor="pillow" className="flex justify-between w-full">
                      <span>Extra pillow</span>
                      <span className="text-green-600">Free</span>
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm mt-6">
                  <div className="flex justify-between">
                    <span>1 Nights</span>
                    <span>$301</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount 20%</span>
                    <span>-$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast a day per person</span>
                    <span>$10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>$5</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Total Payment</span>
                    <span className="text-blue-600">$316</span>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Book Now
                </Button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  You will not get charged yet
                </p>

                <div className="flex justify-center gap-6 mt-6">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}