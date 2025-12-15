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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getHotelById } from "@/lib/services/hotel";
import { getRoomTypesByHotel } from "@/lib/services/hotels/roomType";
import { createReservationByHotel } from "@/lib/services/hotels/reservation";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
    room_type_id: z.string().min(1, "Pilih tipe kamar terlebih dahulu"),
    guest_name: z.string().min(2, "Nama tamu minimal 2 karakter"),
    guest_phone: z.string().min(8, "No. telepon tidak valid"),
    guest_email: z.string().email().or(z.literal("")).optional(),
    check_in_date: z.date({
        required_error: "Tanggal check-in wajib diisi",
    }),
    check_out_date: z.date({
        required_error: "Tanggal check-out wajib diisi",
    }),
    planned_check_in: z.string().optional(),
    planned_check_out: z.string().optional(),
}).refine((data) => data.check_out_date > data.check_in_date, {
    message: "Tanggal check-out harus setelah check-in",
    path: ["check_out_date"],
});


const isPriceCoveringRange = (prices, checkIn, checkOut) => {
    if (!prices || prices.length === 0) return false;

    const checkInStr = format(checkIn, "yyyy-MM-dd");
    const checkOutStr = format(checkOut, "yyyy-MM-dd");

    return prices.some(price => {
        const isCovering =
            price.is_active &&
            price.start_date <= checkInStr &&
            price.end_date >= checkOutStr;

        console.log("[DEBUG] Price coverage check:", {
            price_id: price.id,
            start: price.start_date,
            end: price.end_date,
            checkIn: checkInStr,
            checkOut: checkOutStr,
            isCovering,
        });

        return isCovering;
    });
};

export default function CreateReservationPage() {
    const router = useRouter();
    const params = useParams();
    const hotelId = parseInt(params.id);

    const { hotelId: authHotelId, role, loading: authLoading } = useAuth();
    const [accessDenied, setAccessDenied] = useState(false);

    const [hotel, setHotel] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [hotelLoading, setHotelLoading] = useState(true);
    const [roomTypesLoading, setRoomTypesLoading] = useState(false);

    const {
        register,
        handleSubmit,
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
    const selectedRoomTypeId = watch("room_type_id");

    // === SECURITY: Cek akses staff hotel ===
    useEffect(() => {
        if (!authLoading && role === "hotel") {
            if (authHotelId && hotelId !== authHotelId) {
                setAccessDenied(true);
            }
        }
    }, [authLoading, role, hotelId, authHotelId]);

    // Load hotel data
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

        if (hotelId) {
            loadData();
        }
    }, [hotelId]);

    // ✅ Load room types HANYA JIKA check-in & check-out sudah dipilih
    useEffect(() => {
        async function loadRoomTypes() {
            if (!checkInDate || !checkOutDate) {
                console.log("[DEBUG] RoomType skipped: date not selected");
                setRoomTypes([]);
                setValue("room_type_id", "", { shouldValidate: true });
                return;
            }

            try {
                setRoomTypesLoading(true);

                const filters = {
                    start_date: format(checkInDate, "yyyy-MM-dd"),
                    end_date: format(checkOutDate, "yyyy-MM-dd"),
                };

                console.log("[DEBUG] Fetch room types with filters:", {
                    hotelId,
                    filters,
                });

                const data = await getRoomTypesByHotel(hotelId, 1, filters, 100);

                console.log("[DEBUG] Raw room types response:", data);

                const availableRoomTypes = data.roomTypesByHotel.filter(type => {
                    const hasValidPrice = isPriceCoveringRange(
                        type.prices,
                        checkInDate,
                        checkOutDate
                    );

                    if (!hasValidPrice) return false;

                    console.log("[DEBUG] RoomType availability summary:", {
                        room_type_id: type.id,
                        name: type.name,
                        available_rooms_count: type.available_rooms_count,
                    });

                    // ✅ PAKAI HASIL BACKEND
                    return (type.available_rooms_count ?? 0) > 0;
                });

                console.log("[DEBUG] Available room types:", availableRoomTypes);

                setRoomTypes(availableRoomTypes);

                if (availableRoomTypes.length === 0) {
                    toast.info("Tidak ada tipe kamar tersedia");
                }
            } catch (err) {
                console.error("[ERROR] Load room types failed:", err);
                setRoomTypes([]);
            } finally {
                setRoomTypesLoading(false);
            }
        }

        loadRoomTypes();
    }, [hotelId, checkInDate, checkOutDate, setValue]);



    // Helper: Hitung harga untuk rentang tanggal
    const calculatePriceRange = (prices, checkIn, checkOut) => {
        if (!prices || prices.length === 0) return null;

        const checkInStr = format(checkIn, "yyyy-MM-dd");
        const checkOutStr = format(checkOut, "yyyy-MM-dd");

        const validPrices = prices.filter(price =>
            price.is_active &&
            price.start_date <= checkInStr &&
            price.end_date >= checkOutStr
        );

        if (validPrices.length === 0) return null;

        const weekdayPrices = validPrices.map(p => Number(p.weekday_price));
        const weekendPrices = validPrices.map(p => Number(p.weekend_price));

        return {
            min: Math.min(...weekdayPrices, ...weekendPrices),
            max: Math.max(...weekdayPrices, ...weekendPrices),
            currency: validPrices[0].currency,
        };
    };


    const onSubmit = async (values) => {
        const payload = {
            room_type_id: values.room_type_id,
            guest_name: values.guest_name,
            guest_phone: values.guest_phone,
            guest_email: values.guest_email || undefined,
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
    if (authLoading || hotelLoading) {
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

                {/* ✅ STEP 1: Pilih Tanggal Check In & Out DULU */}
                <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-start gap-2 mb-4">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                Langkah 1: Pilih Tanggal
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Pilih tanggal check-in dan check-out terlebih dahulu untuk melihat ketersediaan kamar
                            </p>
                        </div>
                    </div>

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
                </div>

                {/* ✅ STEP 2: Pilih Tipe Kamar (muncul setelah tanggal dipilih) */}
                {checkInDate && checkOutDate && (
                    <div className="space-y-2">
                        <Label>Tipe Kamar *</Label>
                        {roomTypesLoading ? (
                            <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                <span className="text-sm">Memuat tipe kamar tersedia...</span>
                            </div>
                        ) : roomTypes.length > 0 ? (
                            <>
                                <select
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    {...register("room_type_id")}
                                >
                                    <option value="">Pilih tipe kamar...</option>
                                    {roomTypes.map((type) => {
                                        const priceRange = calculatePriceRange(type.prices, checkInDate, checkOutDate);
                                        return (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                                {type.capacity && ` - ${type.capacity} orang`}
                                                {priceRange && ` - ${priceRange.currency} ${priceRange.min.toLocaleString('id-ID')}${priceRange.min !== priceRange.max ? ` - ${priceRange.max.toLocaleString('id-ID')}` : ''}`}
                                                {` (${type.available_rooms_count} kamar tersedia)`}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.room_type_id && (
                                    <p className="text-sm text-red-500">{errors.room_type_id.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Sistem akan otomatis memilihkan kamar yang tersedia
                                </p>
                            </>
                        ) : (
                            <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    Tidak ada tipe kamar tersedia untuk tanggal yang dipilih. Silakan pilih tanggal lain.
                                </p>
                            </div>
                        )}
                    </div>
                )}

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
                    <Button
                        type="submit"
                        disabled={isSubmitting || !selectedRoomTypeId || !checkInDate || !checkOutDate || roomTypes.length === 0}
                    >
                        {isSubmitting ? "Membuat..." : "Buat Reservasi"}
                    </Button>
                </div>
            </form>
        </div>
    );
}