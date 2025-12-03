"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, MapPin, BarChart, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HotelTabsSection({ hotel }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <Tabs defaultValue="description">
        <div className="border-b">
          <TabsList className="w-full grid grid-cols-4 h-14 bg-white">
            <TabsTrigger value="description" className="data-[state=active]:bg-gray-50 h-full">
              <Building className="h-4 w-4 mr-2" />
              Description
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-gray-50 h-full">
              <span className="mr-2">📊</span>
              Features
            </TabsTrigger>
            <TabsTrigger value="virtual" className="data-[state=active]:bg-gray-50 h-full">
              <Camera className="h-4 w-4 mr-2" />
              Virtual
            </TabsTrigger>
            <TabsTrigger value="price" className="data-[state=active]:bg-gray-50 h-full">
              <BarChart className="h-4 w-4 mr-2" />
              Price & Tax History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="description" className="p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-bold text-gray-900 mb-2">Perfect For Students & Academics</h4>
              <p className="text-gray-700">
                Located within walking distance to major universities, this property offers 
                the ideal environment for academic pursuits and student life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Interior Details</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Fully furnished studio apartment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Modern kitchenette with appliances
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Cozy living area with sofa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Comfortable bunk bed for 3 guests
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Building Amenities</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Two swimming pools (indoor & outdoor)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Modern gym and fitness center
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Futsal field for sports enthusiasts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    24/7 security and CCTV
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "High-speed WiFi",
              "Air Conditioning",
              "Smart TV",
              "Kitchenette",
              "Private Bathroom",
              "Daily Housekeeping",
              "Laundry Service",
              "Elevator Access",
              "Parking Space",
              "Coffee Shop",
              "Minimarket",
              "Meeting Room"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <span className="text-blue-600">✓</span>
                </div>
                <span className="font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="virtual" className="p-6">
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-10 w-10 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Virtual Tour Available</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Experience this property through our immersive 360° virtual tour. 
              See every corner of the apartment before you book.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Virtual Tour
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="price" className="p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">Price History</h4>
              <div className="space-y-3">
                {[
                  { date: "Jan 2024", price: "$390", change: "+5%" },
                  { date: "Dec 2023", price: "$385", change: "+2%" },
                  { date: "Nov 2023", price: "$378", change: "-3%" },
                  { date: "Oct 2023", price: "$390", change: "+4%" },
                  { date: "Sep 2023", price: "$376", change: "Current" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">{item.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{item.price}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        item.change.startsWith('+') ? 'bg-green-100 text-green-700' :
                        item.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">Tax Information</h4>
              <p className="text-gray-700 mb-3">
                All prices include applicable taxes and service fees. No hidden charges.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Hotel tax: 10% included</li>
                <li>• Service charge: 11% included</li>
                <li>• VAT: 10% included in final price</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}   