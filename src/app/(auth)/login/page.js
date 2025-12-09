"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 Tambahkan icon Lucide

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 state untuk toggle password

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const { user, role } = await login(formData.email, formData.password);
      toast.success("Login berhasil!");

      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "hotel") {
        router.push(`/hotel/dashboard/${user.hotel_id}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Login gagal");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          {/* Password + Eye Icon */}
          <div className="space-y-2 relative">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <Input
              id="password"
              type={showPassword ? "text" : "password"} // 👈 Toggle type
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              disabled={loading}
            />

            {/* Icon Mata */}
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* 👉 Link ke Reset Password Request */}
        <div className="text-center">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-blue-600 hover:underline"
          >
            Lupa password?
          </button>
        </div>
      </div>
    </div>
  );
}
