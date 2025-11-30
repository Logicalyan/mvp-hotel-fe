// lib/services/facilities.js
import api from "../api";

// Get all facilities
export async function getAllFacilities() {
  try {
    console.log('🔍 Fetching facilities from /facilities endpoint');
    const res = await api.get("/facilities");
    console.log('✅ Facilities response:', res.data);
    
    const data = res.data?.data || res.data;
    console.log('📊 Facilities extracted:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error fetching facilities:", error.message);
    return [];
  }
}

// Create new facility
export async function createFacility(name) {
  try {
    const res = await api.post("/facilities", { name });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error creating facility:", error);
    throw error;
  }
}

// Delete facility
export async function deleteFacility(id) {
  try {
    await api.delete(`/facilities/${id}`);
  } catch (error) {
    console.error("Error deleting facility:", error);
    throw error;
  }
}

// Get all locations
export async function getAllLocations() {
  try {
    console.log('🔍 Fetching locations from /locations endpoint');
    const res = await api.get("/locations");
    console.log('✅ Locations response:', res.data);
    
    const data = res.data?.data || res.data;
    console.log('📊 Locations extracted:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error fetching locations from /locations:", error.message);
    
    // Fallback: Try to get cities instead
    try {
      console.log('🔄 Trying fallback /cities endpoint');
      const res = await api.get("/cities");
      console.log('✅ Cities response:', res.data);
      
      const data = res.data?.data || res.data;
      console.log('📊 Cities extracted:', data);
      
      return Array.isArray(data) ? data : [];
    } catch (fallbackError) {
      console.error("❌ Error fetching cities:", fallbackError.message);
      return [];
    }
  }
}

// Get all property types (bed types)
export async function getAllPropertyTypes() {
  try {
    console.log('🔍 Fetching property types from /bed-types endpoint');
    const res = await api.get("/bed-types");
    console.log('✅ Property types response:', res.data);
    
    const data = res.data?.data || res.data;
    console.log('📊 Property types extracted:', data);
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error fetching property types:", error.message);
    return [];
  }
}
