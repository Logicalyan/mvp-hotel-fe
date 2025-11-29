"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Hotel, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'hotel') {
        router.push(`/hotel/dashboard/${user.hotel_id}`);
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      toast.error(error.message || "Login gagal");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Hotel className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">HotelLoop</h1>
          </div>
          
          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Kelola Hotel Anda dengan Mudah
            </h2>
            <p className="text-blue-100 text-lg">
              Platform manajemen hotel modern untuk meningkatkan efisiensi operasional dan kepuasan tamu.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 text-white">
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-blue-200 text-sm">Hotel Terdaftar</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-blue-200 text-sm">Reservasi</div>
          </div>
          <div>
            <div className="text-3xl font-bold">98%</div>
            <div className="text-blue-200 text-sm">Kepuasan</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">HotelLoop</h1>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-black">Selamat Datang</h2>
            <p className="text-black">Masuk untuk melanjutkan ke dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-black">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-black">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg shadow-blue-600/30 transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-black">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline"
            >
              Daftar sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
