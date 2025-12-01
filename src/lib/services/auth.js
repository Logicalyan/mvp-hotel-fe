// lib/services/auth.js
import api from "../api"
import { clearAuth, getToken, setAuth } from "../storage/authStorage";
// Login
export async function login(email, password) {
  const res = await api.post("/login", { email, password });

  console.log('🔍 Full API Response:', res.data);
  const { user, token, hotel_id } = res.data.data;

  console.log('👤 User:', user);
  console.log('🎭 Role:', user.role);
  console.log('🎭 Role Type:', typeof user.role);
  console.log('🏨 Hotel ID:', hotel_id);

  setAuth(token, user.role, hotel_id);
  return {
    user: {
      ...user,
      role: user.role,
      hotel_id: hotel_id
    },
    role: user.role
  };
}

// Register
export async function register(name, email, password) {
  const res = await api.post("/register", { name, email, password });
  return res.data.data;
}

// Logout
export async function logout() {
  try {
    await api.post("/logout");
  } catch (e) {
    console.warn("Logout request failed:", e.message)
  } finally {
    clearAuth()
  }
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const res = await api.get("/user");
  console.log('🔍 /user Response:', res.data);

  const user = res.data.data;

  const role = user.role;
  const hotelId = user.hotel_id;

  return {
    user: {
      ...user,
      role,
      hotel_id: hotelId,
    },
    role,
  };
}
