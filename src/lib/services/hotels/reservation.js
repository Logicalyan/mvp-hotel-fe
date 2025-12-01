// lib/services/hotel/reservation.js
import api from "@/lib/api";

/**
 * Get reservations by hotel ID dengan pagination dan filters
 */
export async function getReservationsByHotel(hotelId, page = 1, filters = {}, pageSize = 10) {
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

  const res = await api.get(`/hotel/${hotelId}/reservations?${params.toString()}`);
  return {
    meta: {
      current_page: res.data.data.current_page,
      last_page: res.data.data.last_page,
      total: res.data.data.total,
      per_page: res.data.data.per_page,
    },
    reservations: res.data.data.data,
  };
}

/**
 * GET detail satu reservasi berdasarkan hotel_id + reservation_id
 */
// lib/services/hotel/reservation.js
export async function getReservationDetail(hotelId, reservationId) {
  const res = await api.get(`/hotel/${hotelId}/reservations/${reservationId}`);
  return res.data.data;
}

export async function createReservationByHotel(hotelId, data) {
  const res = await api.post(`/hotel/${hotelId}/reservations`, data);
  return res.data.data;
}

export async function checkInReservation(reservationId) {
  const res = await api.post(`reservations/${reservationId}/check-in`);
  return res.data.data
}

/**
 * (Opsional) Export semua biar rapih
 */
export const reservationHotelService = {
  getReservationsByHotel,
  getReservationDetail,
};