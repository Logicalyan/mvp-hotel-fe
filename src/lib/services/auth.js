// lib/services/auth.js
import api from "../api"
import { clearAuth, setAuth } from "../storage/authStorage";
// Login
export async function login(email, password) {
  const res = await api.post("/login", { email, password });
  const { token, user, role } = res.data.data;

  setAuth(token, role);
  return { user, role };
}

// Register
export async function register(name, email, password) {
  const res = await api.post("/register", { name, email, password });
  return res.data.data;
}

// Logout
export async function logout() {
  try{
    await api.post("/logout");
  } catch (e) {
    console.warn("Logout request failed:", e.message)
  } finally {
    clearAuth()
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const res = await api.get("/user");
    
    return res.data.data
  } catch (error) {
    return null
  }
}

