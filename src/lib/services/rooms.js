// lib/services/rooms.js
import api from "../api";

// Get all rooms with optional filters
export async function getAllRooms(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    // Add filters to query params
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.location && filters.location !== 'All') params.append('location', filters.location);
    if (filters.propertyType && filters.propertyType !== 'All') params.append('property_type', filters.propertyType);
    if (filters.priceMin) params.append('price_min', filters.priceMin);
    if (filters.priceMax) params.append('price_max', filters.priceMax);
    if (filters.facilities && filters.facilities.length > 0) {
      filters.facilities.forEach(facility => params.append('facilities[]', facility));
    }
    
    const queryString = params.toString();
    const url = queryString ? `/rooms?${queryString}` : '/rooms';
    
    const res = await api.get(url);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

// Get room detail by ID
export async function getRoomById(id) {
  try {
    const res = await api.get(`/rooms/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error(`Error fetching room ${id}:`, error);
    throw error;
  }
}
