import api from "../api";

// Get provinces
export async function getProvinces() {
  const res = await api.get('/provinces');
  return res.data.data;
}

// Get cities by province
export async function getCities(provinceId = null) {
  const params = provinceId ? `?province_id=${provinceId}` : '';
  const res = await api.get(`/cities${params}`);
  return res.data.data;
}

// Get districts by city
export async function getDistricts(cityId = null) {
  const params = cityId ? `?city_id=${cityId}` : '';
  const res = await api.get(`/districts${params}`);
  return res.data.data;
}

// Get sub districts by district
export async function getSubDistricts(districtId = null) {
  const params = districtId ? `?district_id=${districtId}` : '';
  const res = await api.get(`/sub-districts${params}`);
  return res.data.data;
}

// Get facilities
export async function getFacilities() {
  const res = await api.get('/facilities');
  return res.data.data;
}

export async function getRoles() {
  const res = await api.get('/roles');
  return res.data.data;
} 