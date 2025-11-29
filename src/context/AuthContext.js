//context/AuthContext.js

"use client";

import { createContext, useState, useEffect } from "react";
import { getCurrentUser, login as loginService, logout as logoutService } from "@/lib/services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek token & fetch user saat pertama kali mount
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (data) {
          console.log('✅ Setting user:', data.user);
          console.log('✅ Setting role:', data.role);
          console.log('✅ Setting hotelId:', data.user?.hotel_id);

          // console.log('🔄 loadUser data:', data);
          setUser(data.user);
          setRole(data.role);
          setHotelId(data.user?.hotel_id || null);
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        setUser(null);
        setRole(null);
        setHotelId(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Fungsi login
  async function login(email, password) {
    console.log('🔐 Login attempt:', { email });

    const { user, role } = await loginService(email, password);

    console.log('✅ Login success!');
    console.log('👤 User:', user);
    console.log('🎭 Role:', role);
    console.log('🏨 Hotel ID:', user?.hotel_id);

    setUser(user);
    setRole(role);
    setHotelId(user?.hotel_id || null);
  }

  // Fungsi logout
  async function logout() {
    await logoutService();
    setUser(null);
    setRole(null);
    setHotelId(null);
  }

  useEffect(() => {
    console.log('📊 Auth State Updated:', { 
      userName: user?.name,
      userRole: user?.role,
      role, 
      hotelId, 
      loading 
    });
  }, [user, role, hotelId, loading]);

  return (
    <AuthContext.Provider value={{ user, role, hotelId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
