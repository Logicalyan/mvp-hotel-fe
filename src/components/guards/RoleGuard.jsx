"use client"
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login"); // kalau belum login
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        router.replace("/404"); // kalau role tidak sesuai
      }
    }
  }, [user, role, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
