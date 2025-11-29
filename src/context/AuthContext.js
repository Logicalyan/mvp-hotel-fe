//context/AuthContext.js

"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, login as loginService, logout as logoutService } from "@/lib/services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Cek token & fetch user saat pertama kali mount
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (data) {
          console.log('✅ Setting user:', data.user);
          console.log('✅ Setting role:', data.role);
          console.log('✅ Setting hotelId:', data.user?.hotel_id || null);

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
        setInitialized(false);
      }
    }
    loadUser();
  }, []);

  // ✅ Login function - SET STATE IMMEDIATELY
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // Call login service
      const { user, role } = await loginService(email, password);
      
      // ✅ IMMEDIATELY update state (no need wait for useEffect)
      setUser(user);
      setRole(role);
      setHotelId(user?.hotel_id || null);
      
      return { user, role };  // Return untuk routing decision
      
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await logoutService();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setUser(null);
      setRole(null);
      setHotelId(null);
      setLoading(false);
    }
  }, []);

  // ✅ Refresh user data (untuk after update profile, dll)
  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      if (data) {
        setUser(data.user);
        setRole(data.role);
        setHotelId(data.user?.hotel_id || null);
      }
    } catch (error) {
      console.error('❌ Error refreshing user:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, hotelId, login, logout, refreshUser, loading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}
