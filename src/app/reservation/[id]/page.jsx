"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Download, 
  AlertCircle,
  Building,
  Bed,
  Calendar,
  User,
  Phone,
  Mail,
  Receipt,
  ShieldCheck,
  Copy,
  Loader2
} from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { getReservation } from "@/lib/services/reservation";

const PAYMENT_TIMEOUT = 15 * 60; // 15 menit dalam detik

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = params.id;

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT);
  const [copied, setCopied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Check payment success from URL params
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Pembayaran berhasil diproses!', { duration: 5000 });
      // Refresh reservation data
      if (reservationId) {
        getReservation(reservationId).then(data => {
          setReservation(data);
        }).catch(err => {
          console.error('Error refreshing reservation:', err);
        });
      }
    }
  }, [searchParams, reservationId]);

  // Fetch reservation data
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        console.log('🔍 Fetching reservation:', reservationId);
        const data = await getReservation(reservationId);
        console.log('✅ Reservation data:', data);
        setReservation(data);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        toast.error("Reservasi tidak ditemukan");
        setTimeout(() => router.push("/"), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId, router]);

  // Countdown timer
  useEffect(() => {
    if (!reservation || timeLeft <= 0 || reservation.payment_status === 'paid') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          toast.warning("Waktu pembayaran habis!", { duration: 5000 });
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [reservation, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePayNow = async () => {
    if (isPaying) return;
    
    setIsPaying(true);
    
    try {
      toast.loading("Membuat pembayaran...", { id: "payment" });

      // Call Next.js API route untuk create Midtrans token
      const response = await fetch("/api/midtrans/reservation/user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          reservation_id: reservation.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pembayaran");
      }

      toast.dismiss("payment");
      toast.loading("Membuka Midtrans...", { id: "midtrans", duration: 2000 });

      // Wait for snap.js to load
      const waitForSnap = () => new Promise((resolve, reject) => {
        if (window.snap?.pay) return resolve();
        
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        const checkSnap = setInterval(() => {
          attempts++;
          
          if (window.snap?.pay) {
            clearInterval(checkSnap);
            resolve();
          }
          
          if (attempts >= maxAttempts) {
            clearInterval(checkSnap);
            reject(new Error('Midtrans tidak dapat dimuat'));
          }
        }, 100);
      });

      await waitForSnap();
      toast.dismiss("midtrans");

      // Open Midtrans payment popup
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          console.log('✅ Payment success:', result);
          toast.success("Pembayaran berhasil!", { duration: 5000 });
          setIsPaying(false);
          
          // Redirect ke halaman ini dengan success param
          setTimeout(() => {
            window.location.href = `/reservation/${reservation.id}?payment=success`;
          }, 1500);
        },
        onPending: (result) => {
          console.log('⏳ Payment pending:', result);
          toast.info("Pembayaran sedang diproses. Cek email untuk instruksi selanjutnya.", { duration: 7000 });
          setIsPaying(false);
        },
        onError: (error) => {
          console.error('❌ Payment error:', error);
          toast.error("Pembayaran gagal. Silakan coba lagi.");
          setIsPaying(false);
        },
        onClose: () => {
          console.log('Payment popup closed');
          toast.info("Popup pembayaran ditutup");
          setIsPaying(false);
        },
      });

    } catch (err) {
      console.error('❌ Payment error:', err);
      toast.dismiss();
      toast.error(err.message || "Gagal memulai pembayaran. Silakan coba lagi.");
      setIsPaying(false);
    }
  };

  const downloadInvoice = () => {
    window.print();
  };

  const copyReservationCode = () => {
    navigator.clipboard.writeText(reservation.reservation_code);
    setCopied(true);
    toast.success("Kode reservasi disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Memuat detail reservasi</p>
            <p className="text-sm text-gray-500 mt-1">Harap tunggu sebentar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="p-8 max-w-md text-center shadow-xl border-0">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Reservasi Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">
            Reservasi yang Anda cari tidak ditemukan atau telah kadaluarsa.
          </p>
          <Button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Kembali ke Beranda
          </Button>
        </Card>
      </div>
    );
  }

  const isPaid = reservation.payment_status === 'paid';
  const isExpired = timeLeft <= 0 && !isPaid;
  const nights = reservation.nights || 1;
  const pricePerNight = Math.round(reservation.total_price / nights);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Status Banner */}
        <div className={`mb-8 rounded-2xl shadow-lg overflow-hidden ${isPaid 
          ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600' 
          : isExpired 
            ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600'
            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600'
        }`}>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isPaid ? 'bg-emerald-100' : isExpired ? 'bg-rose-100' : 'bg-blue-100'}`}>
                  <CheckCircle className={`h-8 w-8 ${isPaid ? 'text-emerald-600' : isExpired ? 'text-rose-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {isPaid ? 'Pembayaran Berhasil!' : isExpired ? 'Waktu Pembayaran Habis' : 'Reservasi Berhasil!'}
                  </h1>
                  <p className="text-white/90 mt-1">
                    {reservation.room_type?.hotel?.name || reservation.hotel?.name}
                  </p>
                </div>
              </div>

              {!isPaid && !isExpired && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-white" />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white font-mono tracking-wider">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                      </div>
                      <p className="text-white/90 text-sm mt-1">Selesaikan pembayaran</p>
                    </div>
                  </div>
                </div>
              )}

              {isPaid && (
                <Badge className="bg-white text-emerald-600 hover:bg-white/90 px-4 py-2 text-lg">
                  <ShieldCheck className="h-5 w-5 mr-2" />
                  Lunas
                </Badge>
              )}
            </div>

            {isExpired && (
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-white" />
                  <p className="text-white">
                    Waktu pembayaran telah habis. Reservasi akan otomatis dibatalkan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Reservation Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reservation Card */}
            <Card className="p-6 md:p-8 shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Receipt className="h-7 w-7 text-blue-600" />
                  Detail Reservasi
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Kode:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyReservationCode}
                    className="font-mono font-bold hover:bg-blue-50"
                  >
                    {reservation.reservation_code}
                    <Copy className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Hotel Info */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <Building className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">Hotel</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reservation.room_type?.hotel?.name || reservation.hotel?.name}
                    </p>
                  </div>
                </div>

                {/* Room Info */}
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <Bed className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">Tipe Kamar</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {reservation.room_type?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">
                        {reservation.room_type?.capacity} Tamu
                      </span>
                      {reservation.room_type?.facilities && (
                        <span className="text-sm text-gray-600">
                          {reservation.room_type.facilities.length} Fasilitas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Check-in</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {format(new Date(reservation.check_in_date), "EEEE, dd MMM yyyy", { locale: localeId })}
                    </p>
                    <p className="text-gray-600 text-sm">Mulai 14:00 WIB</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Check-out</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {format(new Date(reservation.check_out_date), "EEEE, dd MMM yyyy", { locale: localeId })}
                    </p>
                    <p className="text-gray-600 text-sm">Sampai 12:00 WIB</p>
                  </div>
                </div>

                <Separator />

                {/* Guest Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Informasi Tamu</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="font-medium">{reservation.guest_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Nomor Telepon</p>
                        <p className="font-medium">{reservation.guest_phone}</p>
                      </div>
                    </div>
                    
                    {reservation.guest_email && (
                      <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{reservation.guest_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* QR Code Card */}
            <Card className="p-8 shadow-xl border-0">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">E-Ticket Digital</h3>
                <p className="text-gray-600 mb-6">Tunjukkan kode QR saat check-in di hotel</p>
                
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-100">
                  <QRCode 
                    value={reservation.reservation_code} 
                    size={200}
                    fgColor="#1e40af"
                    bgColor="#ffffff"
                  />
                </div>
                
                <div className="mt-6 space-y-3">
                  <p className="font-mono font-bold text-lg tracking-wider">
                    {reservation.reservation_code}
                  </p>
                  <p className="text-sm text-gray-500">
                    Kode ini valid untuk 1 kali check-in
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Payment & Actions */}
          <div className="space-y-8">
            {/* Payment Summary */}
            <Card className="p-6 shadow-xl border-0">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Ringkasan Pembayaran
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Harga per malam</span>
                  <span className="font-semibold">
                    Rp {pricePerNight.toLocaleString('id-ID')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Jumlah malam</span>
                  <span className="font-semibold">{nights} malam</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    Rp {Number(reservation.total_price).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">Total Bayar</p>
                      <p className="text-sm text-gray-600">Sudah termasuk pajak & biaya</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-600">
                        Rp {Number(reservation.total_price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                {!isPaid && !isExpired && (
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-7 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePayNow}
                    disabled={isPaying}
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-6 w-6 mr-3" />
                        Bayar Sekarang
                      </>
                    )}
                  </Button>
                )}

                {isPaid && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6 text-center">
                    <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-xl font-bold text-emerald-800">Pembayaran Lunas</p>
                    <p className="text-sm text-emerald-700 mt-2">Terima kasih atas pembayaran Anda!</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full py-7 text-lg rounded-xl border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                  onClick={downloadInvoice}
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download E-Ticket
                </Button>

                <Button
                  variant="ghost"
                  className="w-full py-6 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => router.push("/")}
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </Card>

            {/* Help Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Butuh Bantuan?</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">?</span>
                  </div>
                  <p className="text-gray-600">
                    Hubungi customer service di <strong>1500-123</strong>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">!</span>
                  </div>
                  <p className="text-gray-600">
                    Simpan e-ticket untuk proses check-in yang lebih cepat
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}