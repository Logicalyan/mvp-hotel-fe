// lib/services/hotels/room.js
import api from "@/lib/api";

/**
 * Get rooms by hotel ID dengan pagination dan filters
 */
export async function getRoomsByHotel(hotelId, page = 1, filters = {}, pageSize = 10) {
    const params = new URLSearchParams({
        page,
        per_page: pageSize,
    });

    // Build query params dari filters
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

    const res = await api.get(`/hotel/${hotelId}/rooms?${params.toString()}`);
    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        rooms: res.data.data.data,
    };
}

/**
 * Get rooms by room type ID (nested dalam hotel)
 */
export async function getRoomsByRoomType(hotelId, roomTypeId, page = 1, filters = {}, pageSize = 10) {
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

    // ✅ Nested route dengan hotel_id
    const res = await api.get(`/hotel/${hotelId}/room-type/${roomTypeId}/rooms?${params.toString()}`);
    return {
        meta: {
            current_page: res.data.data.current_page,
            last_page: res.data.data.last_page,
            total: res.data.data.total,
            per_page: res.data.data.per_page,
        },
        rooms: res.data.data.data,
    };
}

/**
 * Get single room by ID
 */
export async function getRoomById(roomId) {
    const res = await api.get(`/rooms/${roomId}`);
    return res.data.data;
}

/**
 * Create new room
 */
export async function createRoom(hotelId, roomData) {
    const res = await api.post(`/hotel/${hotelId}/rooms`, roomData);
    return res.data.data;
}

/**
 * Update existing room
 */
export async function updateRoom(roomId, roomData) {
    const res = await api.put(`/rooms/${roomId}`, roomData);
    return res.data.data;
}

/**
 * Delete room
 */
export async function deleteRoom(roomId) {
    const res = await api.delete(`/rooms/${roomId}`);
    return res.data;
}

/**
 * Toggle room active status
 */
export async function toggleRoomStatus(roomId) {
    const res = await api.patch(`/rooms/${roomId}/toggle-status`);
    return res.data.data;
}

/**
 * Bulk update rooms status
 */
export async function bulkUpdateRoomsStatus(roomIds, status) {
    const res = await api.post(`/rooms/bulk-update-status`, {
        room_ids: roomIds,
        status: status
    });
    return res.data.data;
}