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
  const res = await api.post("/reservations", {
    room_id: roomId,
    check_in_date: checkIn,
    check_out_date: checkOut,
  });
  return res.data.data;
}

export async function createReservation(payload) {
  const res = await api.post("/reservations/user", payload);
  return res.data.data;
}

export async function getReservation(id) {
  const res = await api.get(`/room-reservations/${id}`);
  return res.data.data;
}

export async function cancelReservation(id) {
  const res = await api.post(`/room-reservations/${id}/cancel`);
  return res.data.data;
}