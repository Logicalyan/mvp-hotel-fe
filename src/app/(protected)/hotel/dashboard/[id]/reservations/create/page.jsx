// app/hotel/dashboard/[id]/reservations/create/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, User, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getHotelById } from "@/lib/services/hotel";
import { getRoomsByHotel } from "@/lib/services/hotels/room"; // kamu pasti punya ini
import { createReservationByHotel, getReservationsByHotel } from "@/lib/services/hotels/reservation";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
    room_id: z.string().min(1, "Pilih kamar terlebih dahulu"),
    guest_name: z.string().min(2, "Nama tamu minimal 2 karakter"),
    guest_phone: z.string().min(8, "No. telepon tidak valid"),
    guest_email: z.string().email().or(z.literal("")).optional(),
    check_in_date: z.date({
        required_error: "Tanggal check-in wajib diisi",
    }),
    check_out_date: z.date({
        required_error: "Tanggal check-out wajib diisi",
    }).refine((date) => date > new Date(), "Check-out tidak boleh hari ini atau kemarin"),
    planned_check_in: z.string().optional(),
    planned_check_out: z.string().optional(),
}).refine((data) => data.check_out_date > data.check_in_date, {
    message: "Tanggal check-out harus setelah check-in",
    path: ["check_out_date"],
});

export default function CreateReservationPage() {
    const router = useRouter();
    const params = useParams();
    const hotelId = parseInt(params.id);

    const { hotelId: authHotelId, role, loading: authLoading } = useAuth();
    const [accessDenied, setAccessDenied] = useState(false);

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [hotelLoading, setHotelLoading] = useState(true);
    const [roomsLoading, setRoomsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            guest_name: "",
            guest_phone: "",
            guest_email: "",
            planned_check_in: "14:00",
            planned_check_out: "12:00",
        },
    });

    const checkInDate = watch("check_in_date");
    const checkOutDate = watch("check_out_date");
    const selectedRoomId = watch("room_id");

    // === SECURITY: Cek akses staff hotel ===
    useEffect(() => {
        if (!authLoading && role === "hotel") {
            if (authHotelId && hotelId !== authHotelId) {
                setAccessDenied(true);
            }
        }
    }, [authLoading, role, hotelId, authHotelId]);

    // Load hotel & rooms
    useEffect(() => {
        async function loadData() {
            try {
                setHotelLoading(true);
                const hotelData = await getHotelById(hotelId);
                setHotel(hotelData);
            } catch (err) {
                toast.error("Gagal memuat data hotel");
            } finally {
                setHotelLoading(false);
            }
        }

        async function loadRooms() {
            try {
                setRoomsLoading(true);
                const data = await getRoomsByHotel(hotelId);
                setRooms(data.rooms || data); // sesuaikan struktur response kamu
            } catch (err) {
                toast.error("Gagal memuat daftar kamar");
            } finally {
                setRoomsLoading(false);
            }
        }

        if (hotelId) {
            loadData();
            loadRooms();
        }
    }, [hotelId]);

    const onSubmit = async (values) => {
        const payload = {
            ...values,
            check_in_date: format(values.check_in_date, "yyyy-MM-dd"),
            check_out_date: format(values.check_out_date, "yyyy-MM-dd"),
            planned_check_in: values.planned_check_in || undefined,
            planned_check_out: values.planned_check_out || undefined,
        };

        try {
            await createReservationByHotel(hotelId, payload);

            toast.success("Reservasi berhasil dibuat!", {
                description: `${values.guest_name} - ${format(values.check_in_date, "dd MMM yyyy", { locale: id })} s/d ${format(values.check_out_date, "dd MMM yyyy", { locale: id })}`,
            });

            router.push(`/hotel/dashboard/${hotelId}/reservations`);
        } catch (err) {
            toast.error("Gagal membuat reservasi", {
                description: err?.response?.data?.message || "Terjadi kesalahan",
            });
        }
    };

    // Loading state
    if (authLoading || hotelLoading || roomsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-600 mt-2">Anda tidak memiliki akses ke hotel ini.</p>
                <Link href="/dashboard"><Button className="mt-4">Ke Dashboard</Button></Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Link href={`/hotel/dashboard/${hotelId}/reservations`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Reservasi
                </Button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Buat Reservasi Baru</h1>
                    <p className="text-muted-foreground">
                        Tambah reservasi manual untuk <strong>{hotel?.name}</strong>
                    </p>
                </div>

                {/* Pilih Kamar */}
                <div className="space-y-2">
                    <Label>Kamar *</Label>
                    <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...register("room_id")}
                    >
                        <option value="">Pilih kamar...</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.room_type.name} - Kamar {room.room_number}
                            </option>
                        ))}
                    </select>
                    {errors.room_id && <p className="text-sm text-red-500">{errors.room_id.message}</p>}
                </div>

                {/* Tanggal Check In & Out */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Check In *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {checkInDate ? format(checkInDate, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={checkInDate}
                                    onSelect={(date) => setValue("check_in_date", date)}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.check_in_date && <p className="text-sm text-red-500">{errors.check_in_date.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Check Out *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {checkOutDate ? format(checkOutDate, "dd MMMM yyyy", { locale: id }) : "Pilih tanggal"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={checkOutDate}
                                    onSelect={(date) => setValue("check_out_date", date)}
                                    disabled={(date) => !checkInDate || date <= checkInDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.check_out_date && <p className="text-sm text-red-500">{errors.check_out_date.message}</p>}
                    </div>
                </div>

                {/* Waktu Rencana */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>Waktu Check In (opsional)</Label>
                        <Input type="time" defaultValue="14:00" {...register("planned_check_in")} />
                    </div>
                    <div>
                        <Label>Waktu Check Out (opsional)</Label>
                        <Input type="time" defaultValue="12:00" {...register("planned_check_out")} />
                    </div>
                </div>

                {/* Data Tamu */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Data Tamu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Nama Tamu *</Label>
                            <Input placeholder="John Doe" {...register("guest_name")} />
                            {errors.guest_name && <p className="text-sm text-red-500">{errors.guest_name.message}</p>}
                        </div>
                        <div>
                            <Label>No. Telepon *</Label>
                            <Input placeholder="081234567890" {...register("guest_phone")} />
                            {errors.guest_phone && <p className="text-sm text-red-500">{errors.guest_phone.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <Label>Email (opsional)</Label>
                            <Input type="email" placeholder="john@example.com" {...register("guest_email")} />
                            {errors.guest_email && <p className="text-sm text-red-500">{errors.guest_email.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Link href={`/hotel/dashboard/${hotelId}/reservations`}>
                        <Button type="button" variant="outline">Batal</Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting || !selectedRoomId || !checkInDate || !checkOutDate}>
                        {isSubmitting ? "Membuat..." : "Buat Reservasi"}
                    </Button>
                </div>
            </form>
        </div>
    );
}