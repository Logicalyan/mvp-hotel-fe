import api from "@/lib/api";

export async function getRoomTypesByHotel(hotelId, page = 1, filters = {}, pageSize = 10) {
    try {
        const params = new URLSearchParams({
            page,
            per_page: pageSize,
        });

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") return;
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    params.append(key, value.join(","));
                }
            } else {
                params.append(key, value.toString());
            }
        });

        const url = `/hotel/${hotelId}/room-types?${params.toString()}`;
        console.log('🏨 Fetching room types from:', url);
        
        const res = await api.get(url);
        console.log('✅ Room types response:', res.data);

        // Extract data with fallback strategies
        const roomTypesData = res.data?.data?.data || res.data?.data || [];
        const meta = res.data?.data || { 
            current_page: page, 
            last_page: 1, 
            total: roomTypesData.length, 
            per_page: pageSize 
        };

        console.log('📊 Extracted room types:', roomTypesData.length);

        return {
            meta: {
                current_page: meta.current_page || page,
                last_page: meta.last_page || 1,
                total: meta.total || roomTypesData.length,
                per_page: meta.per_page || pageSize,
            },
            roomTypesByHotel: Array.isArray(roomTypesData) ? roomTypesData : [],
        };
    } catch (error) {
        console.error('❌ Error fetching room types:', error.message);
        console.error('Error response:', error.response?.data);
        return {
            meta: { current_page: 1, last_page: 1, total: 0, per_page: pageSize },
            roomTypesByHotel: [],
        };
    }
}

export async function getRoomTypeByHotel(hotelId, roomTypeId) {
    const res = await api.get(`/hotel/${hotelId}/room-types/${roomTypeId}`);
    return res.data.data;
}

export async function createRoomTypeByHotel(hotelId, payload) {
    const res = await api.post(`/hotel/${hotelId}/room-types`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
}

export async function updateRoomTypeByHotel(hotelId, roomTypeId, payload) {
    // Laravel membutuhkan _method untuk multipart/form-data
    payload.append('_method', 'PUT');

    const res = await api.post(`/hotel/${hotelId}/room-types/${roomTypeId}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data.data;
}

export async function deleteRoomTypeByHotel(hotelId, roomTypeId) {
    const res = await api.delete(`/hotel/${hotelId}/room-types/${roomTypeId}`);
    return res.data.data;
}