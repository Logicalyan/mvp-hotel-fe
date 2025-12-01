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
import { ArrowLeft, Calendar, User, Phone, Mail, Home, CreditCard, Clock, Printer, CheckCircle, XCircle, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

import { getReservationDetail } from "@/lib/services/hotels/reservation";
// import { updateReservationStatus } from "@/lib/services/hotels/reservation";
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

    // FUNGSI PEMBAYARAN — PAKAI API NEXT.JS (SUDAH JALAN!)
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

            // Tunggu snap siap (safety)
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
                    // Refresh data
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
            await updateReservationStatus(hotelId, reservationId, newStatus);
            setReservation(prev => ({ ...prev, reservation_status: newStatus }));
            toast.success(`Status diubah menjadi ${getStatusLabel(newStatus)}`);
        } catch (err) {
            toast.error("Gagal mengubah status");
        }
    };

    const getStatusBadge = (status, type = "reservation") => {
        const config = {
            reservation: {
                booked: ["bg-blue-100 text-blue-800", "Dipesan"],
                checked_in: ["bg-green-100 text-green-800", "Check In"],
                checked_out: ["bg-gray-100 text-gray-800", "Check Out"],
                cancelled: ["bg-red-100 text-red-800", "Dibatalkan"],
            },
            payment: {
                pending: ["bg-orange-100 text-orange-800", "Belum Dibayar"],
                paid: ["bg-green-100 text-green-800", "Lunas"],
                refunded: ["bg-red-100 text-red-800", "Dikembalikan"],
            }
        };
        const [variant, label] = config[type][status] || ["bg-gray-100 text-gray-800", status];
        return <Badge className={variant}>{label}</Badge>;
    };

    const getStatusLabel = (status) => {
        const map = { checked_in: "Check In", checked_out: "Check Out", cancelled: "Dibatalkan" };
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

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-6">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${currentHotelId}/reservations`}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Reservasi
                </Button>
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Detail Reservasi</h1>
                    <p className="text-muted-foreground">
                        {hotel?.name} • Kode: <span className="font-mono font-bold text-lg">{reservation.reservation_code}</span>
                    </p>
                </div>
                <Button onClick={() => window.print()} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak Invoice
                </Button>

                {/* TOMBOL BAYAR BESAR — KALAU BELUM DIBAYAR */}
                {reservation.payment_status === "pending" && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800">Pembayaran Belum Dilakukan</h3>
                                    <p className="text-green-700">Total Tagihan: <strong>Rp {Number(reservation.total_price).toLocaleString("id-ID")}</strong></p>
                                </div>
                                <Button
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    {isPaying ? "Memproses..." : "Bayar Sekarang"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Kalau sudah lunas */}
                {reservation.payment_status === "paid" && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6 text-center">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <h3 className="text-2xl font-bold text-green-800">Pembayaran Lunas</h3>
                            <p className="text-green-700">Terima kasih telah melakukan pembayaran</p>
                        </CardContent>
                    </Card>
                )}
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Info Tamu & Kamar */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info Tamu */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Tamu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                    <p className="font-medium">{reservation.guest_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telepon</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {reservation.guest_phone}
                                    </p>
                                </div>
                                {reservation.guest_email && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {reservation.guest_email}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Kamar & Tanggal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="h-5 w-5" />
                                Kamar & Jadwal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipe Kamar</p>
                                    <p className="font-semibold text-lg">{reservation.room?.room_type.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Nomor Kamar</p>
                                    <p className="font-semibold text-lg">
                                        Kamar {reservation.room?.number || reservation.room?.id}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Check In</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">
                                                {format(new Date(reservation.check_in_date), "EEEE, dd MMMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        {reservation.planned_check_in && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <Badge variant="secondary" className="text-xs">
                                                    {(reservation.planned_check_in)}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Check Out</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Calendar className="h-4 w-4 text-red-600" />
                                            <span className="font-medium">
                                                {format(new Date(reservation.check_out_date), "EEEE, dd MMMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        {reservation.planned_check_out && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <Badge variant="outline" className="text-xs">
                                                    {(reservation.planned_check_out)}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm text-muted-foreground">Durasi Menginap</p>
                                    <p className="text-3xl font-bold text-blue-600">{reservation.nights} malam</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Tagihan</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        Rp {Number(reservation.total_price).toLocaleString("id-ID")}
                                    </p>
                                    {reservation.payment_status === "paid" && (
                                        <Badge className="mt-2" variant="default">Lunas</Badge>
                                    )}
                                    {reservation.payment_status === "pending" && (
                                        <Badge className="mt-2" variant="secondary">Menunggu Pembayaran</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Breakdown Harga */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Breakdown Harga per Malam</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {reservation.prices?.map((price, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{format(new Date(price.date), "dd MMM yyyy", { locale: id })}</span>
                                            <span className="text-sm text-muted-foreground">
                                                ({format(new Date(price.date), "EEEE", { locale: id })})
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            Rp {Number(price.price).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Status & Aksi */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Reservasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Reservasi</span>
                                {getStatusBadge(reservation.reservation_status, "reservation")}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Pembayaran</span>
                                {getStatusBadge(reservation.payment_status, "payment")}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    {reservation.reservation_status !== "cancelled" ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                    <div>
                                        <p className="font-medium">Reservasi Dibuat</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(reservation.created_at), "dd MMM yyyy HH:mm", { locale: id })}
                                        </p>
                                    </div>
                                </div>
                                {reservation.reservation_status === "checked_in" && (
                                    <div className="flex items-center gap-3">
                                        <LogIn className="h-5 w-5 text-green-600" />
                                        <div>Check In Manual</div>
                                    </div>
                                )}
                                {reservation.reservation_status === "checked_out" && (
                                    <div className="flex items-center gap-3">
                                        <LogOut className="h-5 w-5 text-blue-600" />
                                        <div>Check Out Manual</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aksi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {reservation.reservation_status === "booked" && (
                                <>
                                    {/* <Button
                                        className="w-full"
                                        onClick={() => handleStatusChange("checked_in")}
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Check In Sekarang
                                    </Button> */}
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
