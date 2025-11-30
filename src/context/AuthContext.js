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

  // Load user ketika halaman pertama kali dibuka (refresh)
  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();

        if (data && data.user) {
          console.log("LoadUser:", data);

          setUser(data.user);
          setRole(data.user.role);          // FIXED: role dari data.user.role
          setHotelId(data.user.hotel_id);   // FIXED: hotel ID langsung dari user
        }
      } catch (error) {
        console.error("❌ Error loading user:", error);
        setUser(null);
        setRole(null);
        setHotelId(null);
      } finally {
        setLoading(false);
        setInitialized(true);               // FIXED
      }
    }

    loadUser();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);

      const { user, role } = await loginService(email, password);

      setUser(user);
      setRole(role);
      setHotelId(user.hotel_id || null);

      return { user, role };
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await logoutService();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
      setRole(null);
      setHotelId(null);
      setLoading(false);
    }
  }, []);

  // Refresh User
  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        setHotelId(data.user.hotel_id);
      }
    } catch (error) {
      console.error("❌ Error refreshing user:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        hotelId,
        login,
        logout,
        refreshUser,
        loading,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
