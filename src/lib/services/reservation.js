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