"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays, isFriday, isSaturday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, Users, Bed, Loader2, CheckCircle } from "lucide-react";
import { calculatePrice, createReservation } from "@/lib/services/reservation";
import { toast } from "sonner";

export default function BookingModal({ isOpen, onClose, roomType, hotel }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCheckIn(null);
      setCheckOut(null);
      setPrice(null);
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setAdults(2);
      setChildren(0);
      setRooms(1);
    }
  }, [isOpen]);

  // Hitung harga otomatis saat tanggal berubah
  useEffect(() => {
    if (checkIn && checkOut && roomType) {
      const fetchPrice = async () => {
        setLoading(true);
        try {
          const roomId = roomType.rooms?.[0]?.id; // Ambil kamar pertama (nanti bisa pilih)
          if (!roomId) return;

          const data = await calculatePrice(roomId, format(checkIn, "yyyy-MM-dd"), format(checkOut, "yyyy-MM-dd"));
          setPrice(data);
        } catch (err) {
          toast.error("Gagal menghitung harga");
        } finally {
          setLoading(false);
        }
      };
      fetchPrice();
    } else {
      setPrice(null);
    }
  }, [checkIn, checkOut, roomType]);

  const handleBook = async () => {
    if (!checkIn || !checkOut || !guestName || !guestPhone) {
      toast.error("Lengkapi semua data");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        room_id: roomType.rooms[0].id,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail || null,
        check_in_date: format(checkIn, "yyyy-MM-dd"),
        check_out_date: format(checkOut, "yyyy-MM-dd"),
      };

      const reservation = await createReservation(payload);

      toast.success("Reservasi berhasil dibuat!");
      onClose();
      // Bisa redirect ke halaman konfirmasi
      // router.push(`/booking/${reservation.reservation_code}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat reservasi");
    } finally {
      setSubmitting(false);
    }
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pesan Kamar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">{roomType?.name}</h3>
              <p className="text-gray-600">{hotel?.name}</p>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !checkIn && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "dd MMM yyyy") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()} />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !checkOut && "text-muted-foreground")} disabled={!checkIn}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "dd MMM yyyy") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => !checkIn || date <= checkIn} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest */}
            <div className="space-y-4 border-t pt-4">
              <Label>Jumlah Tamu & Kamar</Label>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Label className="text-xs">Dewasa</Label>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Button size="icon" onClick={() => setAdults(Math.max(1, adults - 1))}>-</Button>
                    <span className="w-8">{adults}</span>
                    <Button size="icon" onClick={() => setAdults(adults + 1)}>+</Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Anak</Label>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Button size="icon" onClick={() => setChildren(Math.max(0, children - 1))}>-</Button>
                    <span className="w-8">{children}</span>
                    <Button size="icon" onClick={() => setChildren(children + 1)}>+</Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Kamar</Label>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Button size="icon" onClick={() => setRooms(Math.max(1, rooms - 1))}>-</Button>
                    <span className="w-8">{rooms}</span>
                    <Button size="icon" onClick={() => setRooms(rooms + 1)}>+</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-4 border-t pt-4">
              <Label>Informasi Tamu</Label>
              <Input placeholder="Nama Lengkap" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              <Input placeholder="Nomor Telepon" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
              <Input placeholder="Email (opsional)" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
            </div>
          </div>

          {/* Right: Price Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-4">Rincian Harga</h4>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : price ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{nights} malam × Rp {Number(price.weekday_price).toLocaleString()}</span>
                    <span>Rp {price.total_weekday.toLocaleString()}</span>
                  </div>
                  {price.total_weekend > 0 && (
                    <div className="flex justify-between">
                      <span>{price.weekend_nights} malam akhir pekan</span>
                      <span>Rp {price.total_weekend.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 font-bold text-lg flex justify-between">
                    <span>Total</span>
                    <span className="text-orange-600">Rp {price.grand_total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Sudah termasuk pajak & biaya layanan</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Pilih tanggal untuk melihat harga</p>
              )}
            </div>

            <Button
              className="w-full text-lg py-6 bg-orange-500 hover:bg-orange-600"
              onClick={handleBook}
              disabled={!price || submitting || !guestName || !guestPhone}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Pesan Sekarang"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}