// hooks/useHotelId.js
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"

export function useHotelId() {
    const { user, role, hotelId, loading } = useAuth();
    const router = useRouter()

    useEffect(() => {
        if (loading) return;

        if (role === 'hotel' && !hotelId) {
            console.error('❌ Hotel staff without hotel_id');
            router.push('/unauthorized');
        }

    }, [loading, role, hotelId, router]);

    return { hotelId, loading, user, role };
}