// app/hotel/dashboard/[id]/room-types/[room_type_id]/edit/page.jsx
"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash, ArrowLeft, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Services
import { getRoomTypeByHotel, updateRoomTypeByHotel } from "@/lib/services/hotels/roomType"
import { getRoomTypeFacilities, getBedTypes } from "@/lib/services/reference"
import { getHotelById } from "@/lib/services/hotel"
import FacilitiesField from "@/components/facilities/FacilitiesField"
import { useAuth } from "@/hooks/useAuth"

// Validation schema (TANPA hotel_id)
const schema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
    capacity: z.number().min(1, "Capacity min 1"),
    facilities: z.array(z.string()).min(1, "At least 1 facility required"),
    images: z.any().optional(),
    beds: z.array(z.object({
        bed_type_id: z.number({ required_error: "Bed type required" }),
        quantity: z.number().min(1, "Quantity min 1")
    })).min(1, "At least 1 bed required"),
    prices: z.array(z.object({
        weekday_price: z.number({ required_error: "Weekday price required" }).min(0),
        weekend_price: z.number({ required_error: "Weekend price required" }).min(0),
        currency: z.string().min(1, "Currency required").max(10),
        start_date: z.string().min(1, "Start date required"),
        end_date: z.string().min(1, "End date required"),
    })).min(1, "At least 1 price required"),
})

export default function EditRoomTypeByHotelPage() {
    const router = useRouter()
    const params = useParams()
    const hotelId = parseInt(params.id)
    const roomTypeId = parseInt(params.room_type_id)

    // ✅ Get auth info untuk validasi
    const { hotelId: authHotelId, role, loading: authLoading } = useAuth()

    const [hotel, setHotel] = useState(null)
    const [bedTypes, setBedTypes] = useState([])
    const [facilities, setFacilities] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [removedImages, setRemovedImages] = useState([])
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
            name: "",
            description: "",
            capacity: 1,
            facilities: [],
            images: [],
            beds: [],
            prices: [],
        }
    })

    const { fields: bedFields, append: appendBed, remove: removeBed } = useFieldArray({
        control,
        name: "beds"
    })

    const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
        control,
        name: "prices"
    })

    // ✅ SECURITY: Validasi akses
    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            if (authHotelId && hotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to edit room type of different hotel')
                setAccessDenied(true)
            }
        }
    }, [authLoading, role, hotelId, authHotelId])

    // Fetch reference data
    useEffect(() => {
        async function loadReferences() {
            try {
                const [hotelData, bedTypesData, facilitiesData] = await Promise.all([
                    getHotelById(hotelId),
                    getBedTypes(),
                    getRoomTypeFacilities()
                ])

                setHotel(hotelData)
                setBedTypes(bedTypesData)
                setFacilities(facilitiesData)
            } catch (error) {
                console.error("Failed to load references:", error)
                toast.error("Failed to load form data")
            }
        }

        if (hotelId) {
            loadReferences()
        }
    }, [hotelId])

    // Fetch room type detail
    useEffect(() => {
        if (accessDenied || !hotelId || !roomTypeId) return

        async function fetchData() {
            try {
                setLoading(true)
                const roomType = await getRoomTypeByHotel(hotelId, roomTypeId)

                // ✅ Reset form dengan data existing
                reset({
                    name: roomType.name,
                    description: roomType.description || "",
                    capacity: roomType.capacity,
                    facilities: roomType.facilities.map((f) => String(f.id)),
                    beds: roomType.beds.map((b) => ({
                        bed_type_id: b.bed_type_id || b.bed_type?.id,
                        quantity: b.quantity
                    })),
                    prices: roomType.prices.map((p) => ({
                        weekday_price: p.weekday_price,
                        weekend_price: p.weekend_price,
                        currency: p.currency,
                        start_date: p.start_date,
                        end_date: p.end_date,
                    })),
                    images: [] // Kosongkan untuk upload baru
                })

                setExistingImages(roomType.images || [])
            } catch (error) {
                console.error("Failed to load room type:", error)
                toast.error("Failed to load room type data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [hotelId, roomTypeId, accessDenied, reset])

    // ✅ Remove image handler
    const handleRemoveImage = (img) => {
        setRemovedImages((prev) => [...prev, img.id])
        setExistingImages((prev) => prev.filter((i) => i.id !== img.id))
    }

    const onSubmit = async (values) => {
        try {
            const formData = new FormData()
            formData.append('_method', 'PUT')

            // ✅ Basic fields
            formData.append("name", values.name)
            if (values.description) {
                formData.append("description", values.description)
            }
            formData.append("capacity", values.capacity)

            // ✅ Facilities
            values.facilities.forEach((f, index) => {
                formData.append(`facilities[${index}]`, f)
            })

            // ✅ New Images
            if (values.images && values.images.length > 0) {
                Array.from(values.images).forEach((file, index) => {
                    formData.append(`images[${index}]`, file)
                })
            }

            // ✅ Removed Images
            removedImages.forEach((id, index) => {
                formData.append(`remove_images[${index}]`, id)
            })

            // ✅ Beds
            values.beds.forEach((bed, index) => {
                formData.append(`beds[${index}][bed_type_id]`, bed.bed_type_id)
                formData.append(`beds[${index}][quantity]`, bed.quantity)
            })

            // ✅ Prices
            values.prices.forEach((price, index) => {
                formData.append(`prices[${index}][weekday_price]`, price.weekday_price)
                formData.append(`prices[${index}][weekend_price]`, price.weekend_price)
                formData.append(`prices[${index}][currency]`, price.currency)
                formData.append(`prices[${index}][start_date]`, price.start_date)
                formData.append(`prices[${index}][end_date]`, price.end_date)
            })

            // ✅ Debug
            console.log('📦 Updating room type:', roomTypeId, 'for hotel:', hotelId)
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1])
            }

            await updateRoomTypeByHotel(hotelId, roomTypeId, formData)

            toast.success("Room type updated successfully", {
                description: `${values.name} has been updated`
            })

            router.push(`/hotel/dashboard/${hotelId}/room-types`)
        } catch (err) {
            console.error("❌ Failed to update room type:", err)
            toast.error("Failed to update room type", {
                description: err?.response?.data?.message || err?.message || "An unexpected error occurred."
            })
        }
    }

    // ✅ Loading state
    if (authLoading || loading) {
        return <EditRoomTypeSkeleton />
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
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Detail
                </Button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Room Type</h1>
                        <p className="text-muted-foreground">
                            Update room type for <strong>{hotel?.name || 'Loading...'}</strong>
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <Label>Room Type Name *</Label>
                        <Input
                            placeholder="e.g., Deluxe Double Room"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Describe the room type..."
                            rows={4}
                            {...register("description")}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>

                    {/* Capacity */}
                    <div>
                        <Label>Capacity (Max Guests) *</Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 2"
                            {...register("capacity", { valueAsNumber: true })}
                        />
                        {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
                    </div>
                </div>

                {/* Facilities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Facilities *</CardTitle>
                        <CardDescription>Select or add facilities available in this room type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Controller
                            control={control}
                            name="facilities"
                            render={({ field }) => (
                                <FacilitiesField
                                    facilities={facilities}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.facilities && <p className="text-sm text-red-500 mt-2">{errors.facilities.message}</p>}
                    </CardContent>
                </Card>

                {/* Existing Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Images</CardTitle>
                        <CardDescription>
                            {existingImages.length > 0
                                ? `${existingImages.length} image(s) currently uploaded. Click X to remove.`
                                : 'No images uploaded yet.'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative group">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_URL}/storage/${img.image_url}`}
                                        alt="Room"
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(img)}
                                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {existingImages.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                No images. Upload new images below.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Add New Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Images</CardTitle>
                        <CardDescription>Upload additional images (JPG, PNG, max 2MB each)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png"
                            {...register("images")}
                        />
                        {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images.message}</p>}
                    </CardContent>
                </Card>

                {/* Beds */}
                <Card>
                    <CardHeader>
                        <CardTitle>Beds Configuration *</CardTitle>
                        <CardDescription>Specify bed types and quantities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bedFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end p-4 border rounded-lg">
                                <div className="flex-1">
                                    <Label>Bed Type</Label>
                                    <Controller
                                        control={control}
                                        name={`beds.${index}.bed_type_id`}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={field.value ? String(field.value) : ""}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Bed Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {bedTypes?.map((bt) => (
                                                        <SelectItem key={bt.id} value={String(bt.id)}>
                                                            {bt.name} ({bt.size})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.beds?.[index]?.bed_type_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.beds[index].bed_type_id.message}</p>
                                    )}
                                </div>
                                <div className="w-32">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        {...register(`beds.${index}.quantity`, { valueAsNumber: true })}
                                    />
                                    {errors.beds?.[index]?.quantity && (
                                        <p className="text-sm text-red-500 mt-1">{errors.beds[index].quantity.message}</p>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeBed(index)}
                                    disabled={bedFields.length === 1}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendBed({ bed_type_id: undefined, quantity: 1 })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Bed
                        </Button>
                        {errors.beds && typeof errors.beds.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.beds.message}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Prices */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing *</CardTitle>
                        <CardDescription>Set prices for different periods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {priceFields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Price Period {index + 1}</h3>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removePrice(index)}
                                        disabled={priceFields.length === 1}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Weekday Price *</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 350000"
                                            {...register(`prices.${index}.weekday_price`, { valueAsNumber: true })}
                                        />
                                        {errors.prices?.[index]?.weekday_price && (
                                            <p className="text-sm text-red-500 mt-1">{errors.prices[index].weekday_price.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Weekend Price *</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 400000"
                                            {...register(`prices.${index}.weekend_price`, { valueAsNumber: true })}
                                        />
                                        {errors.prices?.[index]?.weekend_price && (
                                            <p className="text-sm text-red-500 mt-1">{errors.prices[index].weekend_price.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label>Currency *</Label>
                                        <Input
                                            placeholder="e.g., IDR"
                                            maxLength={10}
                                            {...register(`prices.${index}.currency`)}
                                        />
                                        {errors.prices?.[index]?.currency && (
                                            <p className="text-sm text-red-500 mt-1">{errors.prices[index].currency.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Start Date *</Label>
                                        <Input
                                            type="date"
                                            {...register(`prices.${index}.start_date`)}
                                        />
                                        {errors.prices?.[index]?.start_date && (
                                            <p className="text-sm text-red-500 mt-1">{errors.prices[index].start_date.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label>End Date *</Label>
                                        <Input
                                            type="date"
                                            {...register(`prices.${index}.end_date`)}
                                        />
                                        {errors.prices?.[index]?.end_date && (
                                            <p className="text-sm text-red-500 mt-1">{errors.prices[index].end_date.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendPrice({
                                weekday_price: 0,
                                weekend_price: 0,
                                currency: "IDR",
                                start_date: "",
                                end_date: ""
                            })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Price Period
                        </Button>
                        {errors.prices && typeof errors.prices.message === 'string' && (
                            <p className="text-sm text-red-500">{errors.prices.message}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}`}>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Room Type"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

// Skeleton Loading Component
function EditRoomTypeSkeleton() {
    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            <Skeleton className="h-9 w-40" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}