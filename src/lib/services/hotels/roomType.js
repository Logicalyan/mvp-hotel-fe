import api from "@/lib/api";

export async function getRoomTypesByHotel(hotelId, page = 1, filters = {}, pageSize = 10) {
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

    const res = await api.get(`/hotel/${hotelId}/room-types?${params.toString()}`);
    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        roomTypesByHotel: res.data.data.data,
    };
}

export async function getRoomTypeById(hotelId, roomTypeId) {
    const res = await api.get(`/hotel/${hotelId}/room-types/${roomTypeId}`);
    return res.data.data;
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