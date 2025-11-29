// app/hotel/dashboard/[id]/room-types/create/page.jsx
"use client"
import { useState, useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Services
import { getRoomTypeFacilities, getBedTypes } from "@/lib/services/reference"
import { createRoomTypeByHotel } from "@/lib/services/hotels/roomType"
import { getHotelById } from "@/lib/services/hotel"
import FacilitiesField from "@/components/facilities/FacilitiesField"
import { useAuth } from "@/hooks/useAuth"

// --- Validasi Zod (TANPA hotel_id karena dari URL) ---
const schema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().optional(),
    capacity: z.number().min(1, "Capacity min 1"),
    facilities: z.array(z.string()).nonempty("At least 1 facility required"),
    images: z.any().refine((files) => files?.length > 0, "At least 1 image required"),
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

export default function CreateRoomTypeByHotelPage() {
    const router = useRouter()
    const params = useParams()
    const hotelId = parseInt(params.id)

    // ✅ Get auth info untuk validasi
    const { hotelId: authHotelId, role, loading: authLoading } = useAuth()

    const [hotel, setHotel] = useState(null)
    const [hotelLoading, setHotelLoading] = useState(true)
    const [bedTypes, setBedTypes] = useState([])
    const [facilities, setFacilities] = useState([])
    const [accessDenied, setAccessDenied] = useState(false)

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
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
                console.error('🚫 Access denied: trying to create room type for different hotel')
                setAccessDenied(true)
            }
        }
    }, [authLoading, role, hotelId, authHotelId])

    // Load reference data & hotel info
    useEffect(() => {
        async function loadData() {
            try {
                setHotelLoading(true)

                const [hotelData, bedTypesData, facilitiesData] = await Promise.all([
                    getHotelById(hotelId),
                    getBedTypes(),
                    getRoomTypeFacilities()
                ])

                setHotel(hotelData)
                setBedTypes(bedTypesData)
                setFacilities(facilitiesData)
            } catch (error) {
                console.error("Failed to load data:", error)
                toast.error("Failed to load form data")
            } finally {
                setHotelLoading(false)
            }
        }

        if (hotelId) {
            loadData()
        }
    }, [hotelId])

    const onSubmit = async (values) => {
        try {
            const formData = new FormData()

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

            // ✅ Images
            if (values.images && values.images.length > 0) {
                Array.from(values.images).forEach((file, index) => {
                    formData.append(`images[${index}]`, file)
                })
            }

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

            // ✅ Debug: Log FormData
            console.log('📦 Submitting FormData for hotel:', hotelId)
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1])
            }

            // ✅ Call API dengan hotelId
            await createRoomTypeByHotel(hotelId, formData)

            toast.success("Room type created successfully", {
                description: `${values.name} has been added to ${hotel?.name}`
            })

            router.push(`/hotel/dashboard/${hotelId}/room-types`)
        } catch (err) {
            console.error("Failed to create room type:", err)
            toast.error("Failed to create room type", {
                description: err?.response?.data?.message || err?.message || "An unexpected error occurred."
            })
        }
    }

    // ✅ Loading state
    if (authLoading || hotelLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        )
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
            <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Room Types
                </Button>
            </Link>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold">Add Room Type</h1>
                        <p className="text-muted-foreground">
                            Create a new room type for <strong>{hotel?.name || 'Loading...'}</strong>
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
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Facilities *</h2>
                    <p className="text-sm text-muted-foreground">Select or add facilities available in this room type</p>
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
                    {errors.facilities && <p className="text-sm text-red-500">{errors.facilities.message}</p>}
                </div>

                {/* Images */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Images *</h2>
                    <p className="text-sm text-muted-foreground">Upload at least one image (JPG, PNG, max 2MB each)</p>
                    <Input
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png"
                        {...register("images")}
                    />
                    {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
                </div>

                {/* Beds */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Beds Configuration *</h2>
                    <p className="text-sm text-muted-foreground">Specify bed types and quantities</p>

                    {bedFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end border p-4 rounded-lg">
                            <div className="flex-1">
                                <Label>Bed Type</Label>
                                <Controller
                                    control={control}
                                    name={`beds.${index}.bed_type_id`}
                                    render={({ field }) => (
                                        <Select onValueChange={(val) => field.onChange(Number(val))}>
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
                                    <p className="text-sm text-red-500">{errors.beds[index].bed_type_id.message}</p>
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
                                    <p className="text-sm text-red-500">{errors.beds[index].quantity.message}</p>
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
                </div>

                {/* Prices */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Pricing *</h2>
                    <p className="text-sm text-muted-foreground">Set prices for different periods</p>

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
                                        <p className="text-sm text-red-500">{errors.prices[index].weekday_price.message}</p>
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
                                        <p className="text-sm text-red-500">{errors.prices[index].weekend_price.message}</p>
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
                                        <p className="text-sm text-red-500">{errors.prices[index].currency.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label>Start Date *</Label>
                                    <Input
                                        type="date"
                                        {...register(`prices.${index}.start_date`)}
                                    />
                                    {errors.prices?.[index]?.start_date && (
                                        <p className="text-sm text-red-500">{errors.prices[index].start_date.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label>End Date *</Label>
                                    <Input
                                        type="date"
                                        {...register(`prices.${index}.end_date`)}
                                    />
                                    {errors.prices?.[index]?.end_date && (
                                        <p className="text-sm text-red-500">{errors.prices[index].end_date.message}</p>
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
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Room Type"}
                    </Button>
                </div>
            </form>
        </div>
    )
}