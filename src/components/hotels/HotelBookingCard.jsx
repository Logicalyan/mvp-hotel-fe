"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays, isWeekend, eachDayOfInterval } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Users, Bed, Loader2, Star, AlertCircle, CreditCard, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createReservation } from "@/lib/services/reservation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HotelBookingCard({ hotel, roomType }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState({
    nights: 0,
    weekdayNights: 0,
    weekendNights: 0,
    subtotal: 0,
    discountAmount: 0,
    tax: 0,
    grandTotal: 0
  });

  // Dapatkan harga dasar dari roomType
  const basePrice = roomType?.prices?.[0];
  const weekdayPrice = basePrice?.weekday_price || 0;
  const weekendPrice = basePrice?.weekend_price || 0;
  const discount = basePrice?.discount || 0;
  const capacity = roomType?.capacity || 2;

  // Fungsi untuk menghitung harga di frontend
  const calculatePriceFrontend = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) {
      setCalculatedPrice({
        nights: 0,
        weekdayNights: 0,
        weekendNights: 0,
        subtotal: 0,
        discountAmount: 0,
        tax: 0,
        grandTotal: 0
      });
      return;
    }

    const nights = differenceInDays(checkOutDate, checkInDate);
    if (nights <= 0) return;

    // Generate array tanggal untuk setiap malam
    const dates = eachDayOfInterval({
      start: checkInDate,
      end: new Date(checkOutDate.getTime() - 1) // Hingga sebelum check-out
    });

    // Hitung jumlah weekday dan weekend
    let weekdayNights = 0;
    let weekendNights = 0;
    
    dates.forEach(date => {
      if (isWeekend(date)) {
        weekendNights++;
      } else {
        weekdayNights++;
      }
    });

    // Hitung subtotal sebelum diskon
    const subtotalBeforeDiscount = (weekdayNights * weekdayPrice) + (weekendNights * weekendPrice);
    
    // Hitung diskon jika ada
    const discountMultiplier = discount > 0 ? (100 - discount) / 100 : 1;
    const subtotal = discount > 0 ? subtotalBeforeDiscount * discountMultiplier : subtotalBeforeDiscount;
    const discountAmount = discount > 0 ? subtotalBeforeDiscount - subtotal : 0;

    // Hitung pajak (misalnya 10%)
    const taxRate = 0.1;
    const tax = subtotal * taxRate;
    
    // Total akhir
    // const grandTotal = subtotal + tax;
    const grandTotal = subtotal;

    setCalculatedPrice({
      nights,
      weekdayNights,
      weekendNights,
      subtotal: Math.round(subtotal),
      discountAmount: Math.round(discountAmount),
      tax: Math.round(tax),
      grandTotal: Math.round(grandTotal)
    });
  };

  // Recalculate price when dates change
  useEffect(() => {
    console.log('roomType data:', roomType);
  console.log('prices:', roomType?.prices);
    calculatePriceFrontend(checkIn, checkOut);
  }, [checkIn, checkOut, weekdayPrice, weekendPrice, discount]);

  const handleBook = async () => {
  if (!checkIn || !checkOut) {
    toast.error("Harap pilih tanggal check-in dan check-out");
    return;
  }

  if (!guestName || !guestPhone) {
    toast.error("Harap isi nama lengkap dan nomor telepon");
    return;
  }

  if (calculatedPrice.nights === 0) {
    toast.error("Durasi menginap minimal 1 malam");
    return;
  }

  setSubmitting(true);
  try {
    const payload = {
      room_type_id: roomType.id,
      check_in_date: format(checkIn, "yyyy-MM-dd"),
      check_out_date: format(checkOut, "yyyy-MM-dd"),
      guest_name: guestName,
      guest_phone: guestPhone,
      guest_email: guestEmail || null,
      total_amount: calculatedPrice.grandTotal
    };

    console.log('📤 Booking payload:', payload);
    
    const reservation = await createReservation(payload);
    
    console.log('✅ Reservation created:', reservation);
    
    toast.success("Reservasi berhasil dibuat!");  
    
    // Redirect ke halaman detail
    router.push(`/reservation/${reservation.id}`);
    
  } catch (err) {
    console.error("❌ Booking error:", err);
    toast.error(err.response?.data?.message || "Gagal membuat reservasi");
  } finally {
    setSubmitting(false);
  }
};

  const getDateRangeText = () => {
    if (!checkIn || !checkOut) return "Pilih tanggal";
    
    const formattedCheckIn = format(checkIn, "dd MMM yyyy", { locale: id });
    const formattedCheckOut = format(checkOut, "dd MMM yyyy", { locale: id });
    
    return `${formattedCheckIn} - ${formattedCheckOut}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{roomType?.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Kapasitas: {capacity} orang • {roomType?.square_meter || 20} m²
            </p>
          </div>
          {discount > 0 ? (
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1">
              <Tag className="h-3 w-3 mr-1" />
              Diskon {discount}%
            </Badge>
          ) : (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Terpopuler
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Informasi Harga Dasar */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Harga Weekday</p>
              <p className="text-lg font-bold text-blue-600">
                Rp {Number(weekdayPrice).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Harga Weekend</p>
              <p className="text-lg font-bold text-blue-600">
                Rp {Number(weekendPrice).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          {discount > 0 && (
            <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-700 font-medium flex items-center">
                <Check className="h-4 w-4 mr-2" />
                Dapatkan diskon {discount}% untuk semua malam!
              </p>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Check-in
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn("w-full justify-start text-left h-12", !checkIn && "text-gray-400")}
                >
                  {checkIn ? format(checkIn, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Check-out
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left h-12", !checkOut && "text-gray-400")}
                  disabled={!checkIn}
                >
                  {checkOut ? format(checkOut, "dd MMM yyyy", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => !checkIn || date <= checkIn}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Selected Dates Info */}
        {checkIn && checkOut && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Durasi Menginap</p>
                <p className="font-medium text-gray-800">{calculatedPrice.nights} Malam</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Periode</p>
                <p className="font-medium text-gray-800">{getDateRangeText()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Room Details */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{capacity} Tamu</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Bed className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Non-refundable</span>
          </div>
        </div>

        {/* Guest Information */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-800 mb-4 block">Data Tamu</Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Nama Lengkap *</Label>
              <Input 
                placeholder="Masukkan nama lengkap sesuai KTP" 
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700">Nomor Telepon *</Label>
              <Input 
                placeholder="Contoh: 081234567890" 
                value={guestPhone} 
                onChange={(e) => setGuestPhone(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 flex items-center gap-2">
                Email
                <span className="text-sm font-normal text-gray-500">(opsional)</span>
              </Label>
              <Input 
                placeholder="Contoh: nama@email.com" 
                value={guestEmail} 
                onChange={(e) => setGuestEmail(e.target.value)}
                className="h-12"
                type="email"
              />
              <p className="text-xs text-gray-500">
                Digunakan untuk mengirim konfirmasi reservasi
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mb-6">
          <Label className="text-lg font-semibold text-gray-800 mb-4 block">
            Rincian Harga
            {calculatedPrice.nights > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({calculatedPrice.nights} malam)
              </span>
            )}
          </Label>
          
          <div className="space-y-3">
            {calculatedPrice.nights === 0 ? (
              <div className="text-center p-4 text-gray-500 bg-gray-50 rounded-lg">
                Pilih tanggal check-in dan check-out untuk melihat rincian harga
              </div>
            ) : (
              <>
                {/* Detail per malam */}
                {calculatedPrice.weekdayNights > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Weekday ({calculatedPrice.weekdayNights} malam) 
                      <span className="text-gray-500 text-sm ml-2">× Rp {weekdayPrice.toLocaleString("id-ID")}</span>
                    </span>
                    <span className="font-medium">
                      Rp {(calculatedPrice.weekdayNights * weekdayPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                
                {calculatedPrice.weekendNights > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Weekend ({calculatedPrice.weekendNights} malam)
                      <span className="text-gray-500 text-sm ml-2">× Rp {weekendPrice.toLocaleString("id-ID")}</span>
                    </span>
                    <span className="font-medium">
                      Rp {(calculatedPrice.weekendNights * weekendPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                
                {/* Subtotal sebelum diskon */}
                <div className="flex justify-between text-gray-700 pt-2">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    Rp {((calculatedPrice.weekdayNights * weekdayPrice) + (calculatedPrice.weekendNights * weekendPrice)).toLocaleString("id-ID")}
                  </span>
                </div>
                
                {/* Diskon */}
                {calculatedPrice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon ({discount}%)</span>
                    <span className="font-medium">- Rp {calculatedPrice.discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                
                {/* <Separator className="my-2" /> */}
                
                {/* Subtotal setelah diskon */}
                {/* <div className="flex justify-between text-gray-700 font-semibold">
                  <span>Subtotal Setelah Diskon</span>
                  <span>Rp {calculatedPrice.subtotal.toLocaleString("id-ID")}</span>
                </div> */}
                
                {/* Pajak
                <div className="flex justify-between text-gray-700">
                  <span>Pajak & Biaya (10%)</span>
                  <span className="font-medium">Rp {calculatedPrice.tax.toLocaleString("id-ID")}</span>
                </div> */}
                
                {/* Total */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg text-gray-900">Total Pembayaran</div>
                      <div className="text-sm text-gray-500 mt-1">1 kamar, {calculatedPrice.nights} malam</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        Rp {calculatedPrice.grandTotal.toLocaleString("id-ID")}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Termasuk pajak</div>
                    </div>
                  </div>
                </div>
                
                {/* Info tambahan */}
                <div className="text-xs text-gray-500 pt-2">
                  * Harga sudah termasuk semua pajak dan biaya yang berlaku
                  <br />
                  * Pembayaran menggunakan metode yang tersedia
                </div>
              </>
            )}
          </div>
        </div>

        

        {/* Terms & Booking Button */}
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Penting:</span> Reservasi ini bersifat 
              <span className="font-semibold"> non-refundable</span>. Pastikan data dan tanggal sudah benar sebelum melakukan pembayaran.
            </p>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleBook}
            disabled={submitting || !checkIn || !checkOut || !guestName || !guestPhone || calculatedPrice.nights === 0}
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Memproses Pembayaran...
              </>
            ) : (
              <>
                <CreditCard className="mr-3 h-5 w-5" />
                {calculatedPrice.nights > 0 
                  ? `Bayar Rp ${calculatedPrice.grandTotal.toLocaleString("id-ID")}`
                  : "Pilih Tanggal Terlebih Dahulu"
                }
              </>
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-3">
            Dengan mengklik "Bayar", Anda menyetujui{" "}
            <a href="#" className="text-blue-600 hover:underline">Syarat & Ketentuan</a>{" "}
            dan <a href="#" className="text-blue-600 hover:underline">Kebijakan Privasi</a> kami
          </p>
        </div>
      </div>
    </div>  
  );
}