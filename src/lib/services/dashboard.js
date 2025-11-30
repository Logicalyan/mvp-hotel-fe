// lib/services/dashboard.js
import api from "@/lib/api";

export async function getHotelDashboard(hotelId, params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  
  const res = await api.get(`/hotel/${hotelId}/dashboard?${queryParams.toString()}`);
  return res.data.data;
}