// lib/services/reservation.js
import api from "@/lib/api";

export const reservationService = {
  // GET semua reservasi (dengan filter opsional)
  getAll: async (params = {}) => {
    const response = await api.get("/reservations", { params });
    return response.data.data; // Laravel pagination biasanya di data.data
  },

  // GET detail satu reservasi
  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data.data;
  },
};
export async function calculatePrice(roomId, checkIn, checkOut) {
  const res = await api.post("/room-reservations/calculate-price", {
    room_id: roomId,
    check_in_date: checkIn,
    check_out_date: checkOut,
  });
  return res.data.data;
}

export async function createReservation(payload) {
  const res = await api.post("/room-reservations", payload);
  return res.data.reservation || res.data.data;
}