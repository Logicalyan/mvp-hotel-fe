// hooks/useHotelId.js
import { getHotelId } from "@/lib/storage/authStorage"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useHotelId() {
    const router = useRouter()
    const [hotelId, setHotelId] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = getHotelId()

        if (!id) {
            console.error('❌ No hotel_id found in storage')
            router.push('/unauthorized')
            return
        }

        setHotelId(id)
        setLoading(false)
    }, [router])

    return { hotelId, loading }
}