"use client";

import { useState } from "react";
import { Calendar, Users, Dog, Coffee, Car, Pillow, PillIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function HotelBookingCard({ hotel }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({ adults: 2, children: 1 });
  const [extras, setExtras] = useState({
    pet: true,
    breakfast: true,
    parking: true,
    extraPillow: false,
  });

  const basePrice = 301;
  const originalPrice = 376;
  const discount = 20;
  const nights = 1;

  const calculateTotal = () => {
    let total = basePrice * nights;
    
    // Add extras
    if (extras.breakfast) total += 10;
    if (extras.parking) total += 8;
    if (extras.extraPillow) total += 5;
    
    // Apply discount
    total = total * (1 - discount / 100);
    
    // Add service fee
    total += 31;
    
    return Math.round(total);
  };

  const handleBookNow = () => {
    toast.success("Booking berhasil! Anda akan diarahkan ke pembayaran.");
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-lg">
      {/* Price Display */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-gray-900">${basePrice}</span>
          <span className="text-gray-500">/ night</span>
          <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
        </div>
        <p className="text-sm text-gray-600">Price for {nights} night</p>
      </div>

      {/* Date Pickers */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4" />
            Check-in
          </label>
          <DatePicker
            selected={checkIn}
            onSelect={setCheckIn}
            placeholder="Select date"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4" />
            Check-out
          </label>
          <DatePicker
            selected={checkOut}
            onSelect={setCheckOut}
            placeholder="Select date"
            className="w-full"
          />
        </div>
      </div>

      {/* Guests Selector */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users className="h-4 w-4" />
          Guests
        </label>
        <div className="flex items-center gap-4">
          <Select defaultValue="2">
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Adults" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Adult{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select defaultValue="1">
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Children" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Children
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Extras */}
      <div className="space-y-4 mb-8">
        <h4 className="font-semibold text-gray-900">Extras</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dog className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Allow to bring pet</span>
            </div>
            <Switch
              checked={extras.pet}
              onCheckedChange={(checked) => setExtras({...extras, pet: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Breakfast a day per person</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">$10</span>
              <Switch
                checked={extras.breakfast}
                onCheckedChange={(checked) => setExtras({...extras, breakfast: checked})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Parking a day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">$8</span>
              <Switch
                checked={extras.parking}
                onCheckedChange={(checked) => setExtras({...extras, parking: checked})}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PillIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Extra pillow</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Free</span>
              <Switch
                checked={extras.extraPillow}
                onCheckedChange={(checked) => setExtras({...extras, extraPillow: checked})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-b py-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{nights} Nights</span>
            <span className="font-medium">${basePrice * nights}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Discount {discount}%</span>
            <span className="text-green-600 font-medium">-${Math.round(basePrice * nights * discount / 100)}</span>
          </div>
          
          {extras.breakfast && (
            <div className="flex justify-between">
              <span className="text-gray-600">Breakfast a day per person</span>
              <span className="font-medium">$10</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span className="font-medium">$31</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">Total Payment</span>
          <span className="text-2xl font-bold text-blue-600">${calculateTotal()}</span>
        </div>
        <p className="text-sm text-gray-500">You will not get charged yet</p>
      </div>

      {/* CTA Button */}
      <Button
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
        onClick={handleBookNow}
      >
        Book Now
      </Button>
    </div>
  );
}