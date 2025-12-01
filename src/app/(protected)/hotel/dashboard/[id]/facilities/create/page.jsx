"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Service API
import { createFacilityByHotel } from "@/lib/services/hotels/facility"

const schema = z.object({
    name: z.string().min(1, "Facility name is required"),
})

export default function CreateFacilityPage() {
    const router = useRouter()
    const params = useParams()
    const hotelId = parseInt(params.id)

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "" }
    })

    const onSubmit = async (values) => {
        try {
            await createFacilityByHotel(hotelId, values)
            toast.success("Facility created & attached to hotel")
            router.push(`/hotel/dashboard/${hotelId}/facilities`)
        } catch (err) {
            console.error(err)
            toast.error("Failed to create facility", {
                description: err?.response?.data?.message || err?.message
            })
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-md">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${hotelId}/facilities`}>
                <Button variant="ghost" size="sm" className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Facilities
                </Button>
            </Link>

            <h1 className="text-2xl font-bold mb-6">Add Facility</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <Label>Facility Name *</Label>
                    <Input
                        placeholder="e.g., Swimming Pool"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating..." : "Create Facility"}
                </Button>
            </form>
        </div>
    )
}
