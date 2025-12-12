// app/reservation/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, differenceInSeconds } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CreditCard, AlertTriangle, Download, QrCode, User, Calendar, Home } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { getReservation } from "@/lib/services/reservation";

const PAYMENT_TIMEOUT = 15 * 60; // 15 menit

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id;

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);

  useEffect(() => {
    const fetchReservation = async () => {
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

    if (reservationId) fetchReservation();
  }, [reservationId, router]);

  // Countdown
  useEffect(() => {
    if (!reservation || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto cancel kalau habis
          toast.warning("Waktu pembayaran habis. Reservasi dibatalkan.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePayNow = () => {
    if (reservation.snap_token) {
      window.snap.pay(reservation.snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          router.refresh();
        },
        onPending: () => toast.info("Menunggu pembayaran"),
        onError: () => toast.error("Pembayaran gagal"),
        onClose: () => toast.info("Popup pembayaran ditutup"),
      });
    } else {
      toast.error("Token pembayaran belum tersedia");
    }
  };

  const downloadInvoice = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Invoice ${reservation.reservation_code}</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <h1>Invoice Reservasi</h1>
          <p><strong>Kode:</strong> ${reservation.reservation_code}</p>
          <p><strong>Hotel:</strong> ${reservation.room?.roomType?.hotel?.name}</p>
          <p><strong>Tamu:</strong> ${reservation.guest_name}</p>
          <p><strong>Check-in:</strong> ${format(reservation.check_in_date, "dd MMMM yyyy")}</p>
          <p><strong>Check-out:</strong> ${format(reservation.check_out_date, "dd MMMM yyyy")}</p>
          <p><strong>Total:</strong> Rp ${reservation.total_price.toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat reservasi...</p>
        </div>
      </div>
    );
  }

  if (!reservation) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="overflow-hidden shadow-2xl border-0">
          {/* Header Sukses */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-10">
            <div className="flex items-center gap-6">
              <CheckCircle className="h-16 w-16" />
              <div>
                <h1 className="text-4xl font-bold">Reservasi Berhasil!</h1>
                <p className="text-xl mt-2 opacity-90">
                  Terima kasih telah memilih {reservation.room?.roomType?.hotel?.name}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 text-yellow-100">
              <Clock className="h-8 w-8" />
              <div>
                <p className="text-2xl font-bold">
                  {minutes}:{seconds < 10 ? "0" : ""}{seconds}
                </p>
                <p className="text-lg">Selesaikan pembayaran sebelum waktu habis</p>
              </div>
              {timeLeft < 300 && <AlertTriangle className="h-8 w-8 ml-auto" />}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Kiri: Detail */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Detail Reservasi</h2>
                <div className="space-y-5 text-gray-700">
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Kode Reservasi</span>
                    <span className="font-mono font-bold text-lg">{reservation.reservation_code}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Hotel</span>
                    <span className="text-right">{reservation.room?.roomType?.hotel?.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Tipe Kamar</span>
                    <span>{reservation.room?.roomType?.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-3 border-b">
                    <div>
                      <span className="font-medium block">Check-in</span>
                      <span className="text-lg">{format(reservation.check_in_date, "EEEE, dd MMM yyyy")}</span>
                    </div>
                    <div>
                      <span className="font-medium block">Check-out</span>
                      <span className="text-lg">{format(reservation.check_out_date, "EEEE, dd MMM yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="font-medium">Tamu</span>
                    <div className="text-right">
                      <p className="font-medium">{reservation.guest_name}</p>
                      <p className="text-sm text-gray-500">{reservation.guest_phone}</p>
                      {reservation.guest_email && <p className="text-sm text-gray-500">{reservation.guest_email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <p className="font-semibold mb-6 text-lg">QR Code Check-in</p>
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                  <QRCode value={reservation.reservation_code} size={180} />
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  Tunjukkan kode ini saat check-in di hotel
                </p>
              </div>
            </div>

            {/* Kanan: Pembayaran */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Ringkasan Pembayaran</h2>
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>{reservation.nights} malam</span>
                      <span className="font-medium">Rp {reservation.total_price.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-dashed pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Total Bayar</span>
                        <span className="text-4xl font-bold text-green-600">
                          Rp {reservation.total_price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-8 text-xl font-bold rounded-2xl shadow-xl"
                onClick={handlePayNow}
                disabled={timeLeft <= 0}
              >
                <CreditCard className="mr-3 h-7 w-7" />
                {timeLeft <= 0 ? "Waktu Habis" : "Bayar Sekarang"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full py-8 text-lg rounded-2xl"
                onClick={downloadInvoice}
              >
                <Download className="mr-3 h-7 w-7" />
                Download E-Ticket
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}