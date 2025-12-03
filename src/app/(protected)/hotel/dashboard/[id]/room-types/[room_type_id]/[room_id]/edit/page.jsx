// app/hotel/dashboard/[id]/room-types/[room_type_id]/rooms/[room_id]/edit/page.jsx
"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Services
import { getRoomById, updateRoom } from "@/lib/services/hotels/room"
import { getRoomTypeById } from "@/lib/services/hotels/roomType"
import { getHotelById } from "@/lib/services/hotel"
import { useAuth } from "@/hooks/useAuth"

// Validation schema
const schema = z.object({
    room_number: z.string().min(1, "Room number is required").max(20),
    floor: z.number().min(0, "Floor must be at least 0"),
    status: z.enum(['available', 'occupied', 'maintenance', 'out_of_service'], {
        required_error: "Status is required"
    }),
    is_active: z.boolean(),
    notes: z.string().optional(),
})

// Status options
const statusOptions = [
    { value: 'available', label: 'Available', color: 'text-green-600' },
    { value: 'occupied', label: 'Occupied', color: 'text-blue-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-600' },
    { value: 'out_of_service', label: 'Out of Service', color: 'text-red-600' },
]

export default function EditRoomPage() {
    const router = useRouter()
    const params = useParams()
    const hotelId = parseInt(params.id)
    const roomTypeId = parseInt(params.room_type_id)
    const roomId = parseInt(params.room_id)

    // ✅ Get auth info untuk validasi
    const { hotelId: authHotelId, role, loading: authLoading } = useAuth()

    const [hotel, setHotel] = useState(null)
    const [roomType, setRoomType] = useState(null)
    const [loading, setLoading] = useState(true)
    const [accessDenied, setAccessDenied] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            room_number: "",
            floor: 0,
            status: 'available',
            is_active: true,
            notes: "",
        }
    })

    // ✅ SECURITY: Validasi akses
    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            if (authHotelId && hotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to edit room of different hotel')
                setAccessDenied(true)
            }
        }
    }, [authLoading, role, hotelId, authHotelId])

    // Fetch reference data
    useEffect(() => {
        async function loadReferences() {
            try {
                const [hotelData, roomTypeData] = await Promise.all([
                    getHotelById(hotelId),
                    getRoomTypeById(hotelId, roomTypeId)
                ])

                setHotel(hotelData)
                setRoomType(roomTypeData)
            } catch (error) {
                console.error("Failed to load references:", error)
                toast.error("Failed to load form data")
            }
        }

        if (hotelId && roomTypeId) {
            loadReferences()
        }
    }, [hotelId, roomTypeId])

    // Fetch room detail
    useEffect(() => {
        if (accessDenied || !hotelId || !roomTypeId || !roomId) return

        async function fetchData() {
            try {
                setLoading(true)
                const room = await getRoomById(hotelId, roomTypeId, roomId)

                // ✅ Reset form dengan data existing
                reset({
                    room_number: room.room_number,
                    floor: room.floor,
                    status: room.status,
                    is_active: room.is_active === 1 || room.is_active === true,
                    notes: room.notes || "",
                })
            } catch (error) {
                console.error("Failed to load room:", error)
                toast.error("Failed to load room data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [hotelId, roomTypeId, roomId, accessDenied, reset])

    const onSubmit = async (values) => {
        try {
            const payload = {
                room_number: values.room_number,
                floor: values.floor,
                status: values.status,
                is_active: values.is_active ? 1 : 0,
                notes: values.notes || null,
            }

            console.log('📦 Updating room:', roomId, 'for hotel:', hotelId, 'room type:', roomTypeId)
            console.log('Payload:', payload)

            await updateRoom(hotelId, roomTypeId, roomId, payload)

            toast.success("Room updated successfully", {
                description: `Room ${values.room_number} has been updated`
            })

            router.push(`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}`)
        } catch (err) {
            console.error("❌ Failed to update room:", err)
            toast.error("Failed to update room", {
                description: err?.response?.data?.message || err?.message || "An unexpected error occurred."
            })
        }
    }

    // ✅ Loading state
    if (authLoading || loading) {
        return <EditRoomSkeleton />
    }

    // ✅ Access denied
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
        <div className="container mx-auto p-6 max-w-3xl">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Room Type Detail
                </Button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Edit Room</h1>
                    <p className="text-muted-foreground">
                        Update room for <strong>{roomType?.name}</strong> at <strong>{hotel?.name || 'Loading...'}</strong>
                    </p>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Update room number and floor details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Room Number */}
                        <div>
                            <Label>Room Number *</Label>
                            <Input
                                placeholder="e.g., 101, A-205"
                                maxLength={20}
                                {...register("room_number")}
                            />
                            {errors.room_number && (
                                <p className="text-sm text-red-500 mt-1">{errors.room_number.message}</p>
                            )}
                        </div>

                        {/* Floor */}
                        <div>
                            <Label>Floor *</Label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="e.g., 1, 2, 3"
                                {...register("floor", { valueAsNumber: true })}
                            />
                            {errors.floor && (
                                <p className="text-sm text-red-500 mt-1">{errors.floor.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                Ground floor = 0, First floor = 1, etc.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Status & Availability */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status & Availability</CardTitle>
                        <CardDescription>Set room status and active state</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Status */}
                        <div>
                            <Label>Room Status *</Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <span className={option.color}>
                                                        {option.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                            )}
                        </div>

                        {/* Is Active */}
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label>Active Room</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable this room for booking
                                </p>
                            </div>
                            <Controller
                                control={control}
                                name="is_active"
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Notes</CardTitle>
                        <CardDescription>Add any special notes or remarks about this room</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="e.g., Recently renovated, Has a balcony, Special maintenance required..."
                            rows={4}
                            {...register("notes")}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-500 mt-2">{errors.notes.message}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}`}>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Room"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

// Skeleton Loading Component
function EditRoomSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-3xl space-y-6">
            <Skeleton className="h-9 w-40" />
            
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}