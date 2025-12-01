// lib/services/hotels/facility.js
import api from "@/lib/api";

export async function getHotelFacilitiesByHotel(
    hotelId,
    page = 1,
    filters = {},     // <-- FILTER WAJIB DITERIMA
    pageSize = 10
) {
    const params = new URLSearchParams({
        page,
        per_page: pageSize,
    });

    // ⬅ Masukkan filters ke query string (jika ada)
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });

    const res = await api.get(`/hotel/${hotelId}/facilities?${params.toString()}`);

    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        facilitiesByHotel: res.data.data.data,
    };
}


export async function createFacilityByHotel(hotelId, payload) {
    const res = await api.post(`/hotel/${hotelId}/facilities`, payload)
    return res.data.data
}

// services/hotels/facility.js
export async function detachFacilityFromHotel(hotelId, facilityId) {
    const res = await api.delete(`/hotel/${hotelId}/facilities/${facilityId}`)
    return res.data
}


