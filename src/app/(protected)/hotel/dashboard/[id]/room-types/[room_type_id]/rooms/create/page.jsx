// ============================================
// 2. CREATE ROOM BY ROOM TYPE
// app/hotel/dashboard/[id]/room-types/[room_type_id]/rooms/create/page.jsx
// ============================================
"use client"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { createRoom } from "@/lib/services/hotels/room"
import { getRoomTypeById } from "@/lib/services/hotels/roomType"
import { getHotelById } from "@/lib/services/hotel"
import { useAuth } from "@/hooks/useAuth"

// Validasi Zod (room_type_id sudah dari URL)
const schema = z.object({
    room_number: z.string().min(1, "Room number is required").max(50),
    floor: z.number().min(1, "Floor must be at least 1"),
    status: z.enum(["available", "occupied", "maintenance", "cleaning"], {
        required_error: "Status is required"
    }),
    is_active: z.boolean().default(true),
})

export default function CreateRoomByRoomTypePage() {
    const router = useRouter()
    const params = useParams()
    const hotelId = parseInt(params.id)
    const roomTypeId = parseInt(params.room_type_id)

    const { hotelId: authHotelId, role, loading: authLoading } = useAuth()

    const [hotel, setHotel] = useState(null)
    const [roomType, setRoomType] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accessDenied, setAccessDenied] = useState(false)

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            room_number: "",
            floor: 1,
            status: "available",
            is_active: true,
        }
    })

    // Security: Validasi akses
    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            if (authHotelId && hotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to create room for different hotel')
                setAccessDenied(true)
            }
        }
    }, [authLoading, role, hotelId, authHotelId])

    // Load data
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const [hotelData, roomTypeData] = await Promise.all([
                    getHotelById(hotelId),
                    getRoomTypeById(hotelId, roomTypeId)
                ])
                setHotel(hotelData)
                setRoomType(roomTypeData)
            } catch (error) {
                console.error("Failed to load data:", error)
                toast.error("Failed to load form data")
            } finally {
                setLoading(false)
            }
        }

        if (hotelId && roomTypeId) {
            loadData()
        }
    }, [hotelId, roomTypeId])

    const onSubmit = async (values) => {
        try {
            // Tambahkan room_type_id dari URL
            const payload = {
                ...values,
                room_type_id: roomTypeId
            }

            console.log('📦 Submitting room data:', payload)

            await createRoom(hotelId, payload)

            toast.success("Kamar berhasil dibuat", {
                description: `Kamar ${values.room_number} telah ditambahkan ke ${roomType?.name}`
            })

            router.push(`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}/rooms`)
        } catch (err) {
            console.error("Failed to create room:", err)
            toast.error("Gagal membuat kamar", {
                description: err?.response?.data?.message || err?.message || "An unexpected error occurred."
            })
        }
    }

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        )
    }

    // Access denied
    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this hotel.</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}/rooms`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Rooms
                </Button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Kamar</h1>
                        <p className="text-muted-foreground">
                            Buat kamar baru untuk <strong>{roomType?.name || 'Loading...'}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {hotel?.name}
                        </p>
                    </div>

                    {/* Room Type Info (Read-only) */}
                    <div className="bg-muted p-4 rounded-lg">
                        <Label className="text-muted-foreground">Tipe Kamar</Label>
                        <p className="font-medium">{roomType?.name}</p>
                    </div>

                    {/* Room Number */}
                    <div>
                        <Label>Nomor Kamar *</Label>
                        <Input
                            placeholder="e.g., 201"
                            maxLength={50}
                            {...register("room_number")}
                        />
                        {errors.room_number && (
                            <p className="text-sm text-red-500">{errors.room_number.message}</p>
                        )}
                    </div>

                    {/* Floor */}
                    <div>
                        <Label>Lantai *</Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 2"
                            {...register("floor", { valueAsNumber: true })}
                        />
                        {errors.floor && (
                            <p className="text-sm text-red-500">{errors.floor.message}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <Label>Status *</Label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Tersedia</SelectItem>
                                        <SelectItem value="occupied">Terisi</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-sm text-red-500">{errors.status.message}</p>
                        )}
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            {...register("is_active")}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="is_active" className="font-normal cursor-pointer">
                            Aktifkan kamar ini
                        </Label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}/rooms`}>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Membuat..." : "Buat Kamar"}
                    </Button>
                </div>
            </form>
        </div>
    )
}