// app/hotel/dashboard/[id]/reservations/[reservationId]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatTime } from "@/lib/utils/formatTime";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Calendar,
    User,
    Phone,
    Mail,
    Home,
    CreditCard,
    Clock,
    Printer,
    CheckCircle,
    XCircle,
    LogIn,
    LogOut,
    DollarSign,
    CalendarDays,
    Bed,
    Hash
} from "lucide-react";
import { toast } from "sonner";

import { getReservationDetail, expireReservation } from "@/lib/services/hotels/reservation";
import { updateReservationStatus } from "@/lib/services/hotels/reservation";
import { useAuth } from "@/hooks/useAuth";
import { getHotelById } from "@/lib/services/hotel";

export default function ReservationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const hotelId = parseInt(params.id);
    const reservationId = params.reservationId;
    const [isPaying, setIsPaying] = useState(false);

    const { hotelId: authHotelId, role } = useAuth();

    const [reservation, setReservation] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    function PaymentCountdownDetail({
        dueAt,
        paymentStatus,
        reservationId,
        onExpired
    }) {
        const [remaining, setRemaining] = useState(0);
        const [expiredCalled, setExpiredCalled] = useState(false);

        useEffect(() => {
            if (!dueAt || paymentStatus !== "pending") return;

            const tick = async () => {
                const diff = Math.floor(
                    (new Date(dueAt).getTime() - Date.now()) / 1000
                );

                setRemaining(diff);

                // 🔥 WAKTU HABIS → HIT API SEKALI
                if (diff <= 0 && !expiredCalled) {
                    setExpiredCalled(true);

                    try {
                        await expireReservation(reservationId);
                        onExpired?.(); // refresh data parent
                    } catch (err) {
                        console.error("Expire reservation failed", err);
                    }
                }
            };

            tick();
            const interval = setInterval(tick, 1000);
            return () => clearInterval(interval);
        }, [dueAt, paymentStatus, reservationId, expiredCalled, onExpired]);

        if (paymentStatus !== "pending") return null;

        if (remaining <= 0) {
            return (
                <Badge variant="destructive" className="mt-2">
                    ⛔ Waktu pembayaran habis
                </Badge>
            );
        }

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        return (
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 mt-2">
                <Clock className="h-4 w-4" />
                <span>
                    Sisa waktu pembayaran: {minutes}:{String(seconds).padStart(2, "0")}
                </span>
            </div>
        );
    }

    const refreshReservation = async () => {
        try {
            const updated = await getReservationDetail(hotelId, reservationId);
            setReservation(updated);
        } catch (err) {
            console.error("Gagal refresh reservasi", err);
        }
    };


    useEffect(() => {
        async function loadData() {
            try {
                const [resData, hotelData] = await Promise.all([
                    getReservationDetail(hotelId, reservationId),
                    getHotelById(hotelId)
                ]);
                setReservation(resData);
                setHotel(hotelData);
            } catch (err) {
                toast.error("Gagal memuat detail reservasi");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [hotelId, reservationId]);

    const handlePayment = async () => {
        if (isPaying) return;
        setIsPaying(true);

        try {
            toast.loading("Membuat pembayaran...", { id: "midtrans" });

            const response = await fetch("/api/midtrans/reservation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reservation_id: reservation.id,
                    hotel_id: hotelId,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Gagal membuat pembayaran");

            toast.dismiss("midtrans");
            toast.loading("Membuka Midtrans...", { duration: 5000 });

            if (!window.snap?.pay) {
                await new Promise(resolve => {
                    const check = setInterval(() => {
                        if (window.snap?.pay) {
                            clearInterval(check);
                            resolve();
                        }
                    }, 100);
                });
            }

            window.snap.pay(data.token, {
                onSuccess: () => {
                    toast.success("Pembayaran berhasil! Status otomatis update");
                    getReservationDetail(hotelId, reservationId).then(setReservation);
                    setIsPaying(false);
                },
                onPending: () => {
                    toast.info("Menunggu pembayaran...");
                    setIsPaying(false);
                },
                onError: () => {
                    toast.error("Pembayaran gagal");
                    setIsPaying(false);
                },
                onClose: () => setIsPaying(false),
            });

        } catch (err) {
            toast.error(err.message || "Gagal memulai pembayaran");
            setIsPaying(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            // await updateReservationStatus(hotelId, reservationId, newStatus);
            // setReservation(prev => ({ ...prev, reservation_status: newStatus }));
            // toast.success(`Status diubah menjadi ${getStatusLabel(newStatus)}`);

            // // Refresh data untuk mendapatkan actual_check_in/actual_check_out terbaru
            // const updatedData = await getReservationDetail(hotelId, reservationId);
            // setReservation(updatedData);
        } catch (err) {
            toast.error("Gagal mengubah status");
        }
    };

    const getStatusBadge = (status, type = "reservation") => {
        const config = {
            reservation: {
                booked: ["bg-blue-100 text-blue-800", "Dipesan"],
                checked_in: ["bg-green-100 text-green-800", "Check In"],
                checked_out: ["bg-purple-100 text-purple-800", "Check Out"],
                cancelled: ["bg-red-100 text-red-800", "Dibatalkan"],
            },
            payment: {
                pending: ["bg-orange-100 text-orange-800", "Belum Dibayar"],
                paid: ["bg-green-100 text-green-800", "Lunas"],
                refunded: ["bg-red-100 text-red-800", "Dikembalikan"],
                failed: ["bg-red-100 text-red-800", "Gagal"],
            }
        };
        const [variant, label] = config[type][status] || ["bg-gray-100 text-gray-800", status];
        return <Badge className={variant}>{label}</Badge>;
    };

    const getStatusLabel = (status) => {
        const map = {
            booked: "Dipesan",
            checked_in: "Check In",
            checked_out: "Check Out",
            cancelled: "Dibatalkan"
        };
        return map[status] || status;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Memuat detail reservasi...</p>
                </div>
            </div>
        );
    }

    if (!reservation) {
        return <div className="p-8 text-center text-red-500">Reservasi tidak ditemukan</div>;
    }

    const currentHotelId = role === "admin" ? hotelId : authHotelId;

    const isExpired =
        reservation.payment_status === "pending" &&
        reservation.payment_due_at &&
        new Date(reservation.payment_due_at).getTime() <= Date.now();


    return (
        <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-6">
            {/* Header Section */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={`/hotel/dashboard/${currentHotelId}/reservations`}>
                            <Button variant="ghost" size="sm" className="mb-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Daftar Reservasi
                            </Button>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Detail Reservasi</h1>
                        <p className="text-muted-foreground mt-1">
                            {hotel?.name} • Kode: <span className="font-mono font-bold text-base md:text-lg">{reservation.reservation_code}</span>
                        </p>
                    </div>
                    <Button onClick={() => window.print()} variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak
                    </Button>
                </div>

                {/* Payment Banner */}
                {reservation.payment_status === "pending" && (
                    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-center md:text-left">
                                    <h3 className="text-lg md:text-xl font-semibold text-green-800">Pembayaran Belum Dilakukan</h3>
                                    <p className="text-green-700 mt-1">
                                        Total Tagihan: <strong>Rp {Number(reservation.total_price).toLocaleString("id-ID")}</strong>
                                    </p>
                                </div>

                                {/* 🔥 COUNTDOWN DI SINI */}
                                <PaymentCountdownDetail
                                    dueAt={reservation.payment_due_at}
                                    paymentStatus={reservation.payment_status}
                                    reservationId={reservation.id}
                                    onExpired={refreshReservation}
                                />

                                <Button
                                    size="lg"
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6"
                                    onClick={handlePayment}
                                    disabled={isPaying || isExpired}
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    {isExpired ? "Waktu Habis" : isPaying ? "Memproses..." : "Bayar Sekarang"}
                                </Button>

                            </div>
                        </CardContent>
                    </Card>
                )}

                {reservation.payment_status === "paid" && (
                    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col items-center text-center">
                                <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-600 mb-3" />
                                <h3 className="text-xl md:text-2xl font-bold text-green-800">Pembayaran Lunas</h3>
                                <p className="text-green-700 mt-1">Terima kasih telah melakukan pembayaran</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {["expired", "failed"].includes(reservation.payment_status) && (
                    <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm">
                        <CardContent className="p-4 md:p-6">
                            <div className="flex flex-col items-center text-center">
                                <XCircle className="h-10 w-10 md:h-12 md:w-12 text-red-600 mb-3" />
                                <h3 className="text-xl md:text-2xl font-bold text-red-800">
                                    Pembayaran Gagal
                                </h3>
                                <p className="text-red-700 mt-1">
                                    Waktu pembayaran telah berakhir atau transaksi tidak berhasil.
                                </p>

                                <p className="text-sm text-muted-foreground mt-2">
                                    Silakan buat reservasi ulang untuk melanjutkan pemesanan.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Guest & Room Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Guest Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Informasi Tamu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                    <p className="font-medium text-base">{reservation.guest_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Telepon</p>
                                    <p className="font-medium text-base flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {reservation.guest_phone}
                                    </p>
                                </div>
                                {reservation.guest_email && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium text-base flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {reservation.guest_email}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Room & Schedule Information */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Home className="h-5 w-5" />
                                Kamar & Jadwal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Tipe Kamar</p>
                                    <div className="flex items-center gap-2">
                                        <Bed className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-semibold text-lg">{reservation.room?.room_type?.name || "Tidak tersedia"}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Nomor Kamar</p>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-semibold text-lg">
                                            Kamar {reservation.room?.room_number || reservation.room?.id || "Tidak tersedia"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Check In Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">Check In</p>
                                        <Badge variant="outline" className="bg-blue-50">
                                            Dijadwalkan
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium">
                                                {format(new Date(reservation.check_in_date), "EEEE, dd MMMM yyyy", { locale: id })}
                                            </p>
                                            {reservation.planned_check_in && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <Clock className="inline h-3 w-3 mr-1" />
                                                    {(reservation.planned_check_in)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actual Check In */}
                                    {reservation.actual_check_in && (
                                        <>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-sm font-medium text-muted-foreground">Check In Aktual</p>
                                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                                    Terlaksana
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                <LogIn className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium">
                                                        {format(new Date(reservation.actual_check_in), "EEEE, dd MMMM yyyy", { locale: id })}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        <Clock className="inline h-3 w-3 mr-1" />
                                                        {format(new Date(reservation.actual_check_in), "HH:mm", { locale: id })}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Check Out Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">Check Out</p>
                                        <Badge variant="outline" className="bg-red-50">
                                            Dijadwalkan
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-red-600" />
                                        <div>
                                            <p className="font-medium">
                                                {format(new Date(reservation.check_out_date), "EEEE, dd MMMM yyyy", { locale: id })}
                                            </p>
                                            {reservation.planned_check_out && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <Clock className="inline h-3 w-3 mr-1" />
                                                    {(reservation.planned_check_out)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actual Check Out */}
                                    {reservation.actual_check_out && (
                                        <>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-sm font-medium text-muted-foreground">Check Out Aktual</p>
                                                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                                    Terlaksana
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                <LogOut className="h-5 w-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium">
                                                        {format(new Date(reservation.actual_check_out), "EEEE, dd MMMM yyyy", { locale: id })}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        <Clock className="inline h-3 w-3 mr-1" />
                                                        {format(new Date(reservation.actual_check_out), "HH:mm", { locale: id })}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Summary Section */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Durasi Menginap</p>
                                    <p className="text-2xl md:text-3xl font-bold text-blue-600">{reservation.nights} malam</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-sm text-muted-foreground">Total Tagihan</p>
                                    <p className="text-2xl md:text-3xl font-bold text-green-600">
                                        Rp {Number(reservation.total_price).toLocaleString("id-ID")}
                                    </p>
                                    <div className="mt-2">
                                        {getStatusBadge(reservation.payment_status, "payment")}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Price Breakdown */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <DollarSign className="h-5 w-5" />
                                Breakdown Harga per Malam
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {reservation.prices?.map((price, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <span className="font-medium">
                                                    {format(new Date(price.date), "dd MMM yyyy", { locale: id })}
                                                </span>
                                                <span className="text-sm text-muted-foreground ml-2">
                                                    ({format(new Date(price.date), "EEEE", { locale: id })})
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-semibold">
                                            Rp {Number(price.price).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))}
                                {reservation.prices && reservation.prices.length > 0 && (
                                    <div className="flex justify-between items-center py-3 font-bold text-lg">
                                        <span>Total</span>
                                        <span>Rp {Number(reservation.total_price).toLocaleString("id-ID")}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status & Actions */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Status Reservasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Reservasi</span>
                                </div>
                                {getStatusBadge(reservation.reservation_status, "reservation")}
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Pembayaran</span>
                                </div>
                                {getStatusBadge(reservation.payment_status, "payment")}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Batas pembayaran:{" "}
                                {format(new Date(reservation.payment_due_at), "dd MMM yyyy HH:mm", {
                                    locale: id,
                                })}
                            </p>

                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-1 rounded-full ${reservation.reservation_status !== "cancelled" ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {reservation.reservation_status !== "cancelled" ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">Reservasi Dibuat</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(reservation.created_at), "dd MMM yyyy • HH:mm", { locale: id })}
                                        </p>
                                    </div>
                                </div>

                                {reservation.actual_check_in && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-green-100">
                                            <LogIn className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Check In Aktual</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(reservation.actual_check_in), "dd MMM yyyy • HH:mm", { locale: id })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {reservation.actual_check_out && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-purple-100">
                                            <LogOut className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Check Out Aktual</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(reservation.actual_check_out), "dd MMM yyyy • HH:mm", { locale: id })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reservation.reservation_status === "booked" && (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => handleStatusChange("checked_in")}
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Check In Sekarang
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => handleStatusChange("cancelled")}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Batalkan Reservasi
                                    </Button>
                                </>
                            )}
                            {reservation.reservation_status === "checked_in" && (
                                <Button
                                    className="w-full"
                                    onClick={() => handleStatusChange("checked_out")}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Check Out Sekarang
                                </Button>
                            )}
                            {(reservation.reservation_status === "checked_out" || reservation.reservation_status === "cancelled") && (
                                <Button variant="secondary" className="w-full" disabled>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Selesai
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}