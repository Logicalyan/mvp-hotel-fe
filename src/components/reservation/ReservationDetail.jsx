// components/reservation/ReservationDetailPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInSeconds } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CreditCard, AlertTriangle, Download, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { getReservation } from "@/lib/services/reservation";

const PAYMENT_TIMEOUT = 15 * 60; // 15 menit

export default function ReservationDetailPage({ reservationId }) {
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReservation(reservationId);
        setReservation(data);
      } catch (err) {
        toast.error("Reservasi tidak ditemukan");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reservationId, router]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePay = () => {
    if (reservation.snap_token) {
      window.snap.pay(reservation.snap_token);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!reservation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold">Reservasi Berhasil!</h1>
                <p>Selesaikan pembayaran dalam waktu {minutes}:{seconds < 10 ? "0" : ""}{seconds} menit</p>
              </div>
            </div>
            {timeLeft < 300 && (
              <div className="mt-4 flex items-center gap-2 text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Waktu hampir habis!</span>
              </div>
            )}
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kiri */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Detail Reservasi</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Nomor Reservasi</p>
                    <p className="font-mono text-lg font-bold">{reservation.reservation_code}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-medium">{format(reservation.check_in_date, "EEEE, dd MMMM yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-medium">{format(reservation.check_out_date, "EEEE, dd MMMM yyyy")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tamu</p>
                    <p className="font-medium">{reservation.guest_name}</p>
                    <p className="text-sm text-gray-600">{reservation.guest_phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-4">QR Code Check-in</p>
                <div className="inline-block p-4 bg-white rounded-lg">
                  <QRCode value={reservation.reservation_code} size={160} />
                </div>
                <p className="text-xs text-gray-500 mt-4">Tunjukkan di resepsionis</p>
              </div>
            </div>

            {/* Kanan */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Ringkasan Pembayaran</h2>
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                  <div className="flex justify-between">
                    <span>{reservation.nights} malam × {reservation.room_type?.name}</span>
                    <span>Rp {reservation.total_price.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-green-600">Rp {reservation.total_price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                onClick={handlePay}
                disabled={timeLeft <= 0}
              >
                <CreditCard className="mr-3 h-6 w-6" />
                Bayar Sekarang
              </Button>

              <Button variant="outline" className="w-full py-6" onClick={() => window.print()}>
                <Download className="mr-3 h-6 w-6" />
                Download E-Ticket
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}