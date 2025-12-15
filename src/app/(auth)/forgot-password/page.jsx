"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ResetPasswordRequestPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password-request`, {
        email,
      });

      toast.success("Kode OTP telah dikirim ke email Anda");

      router.push(`/verify-otp?email=${email}`);

    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim kode");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-gray-500">Masukkan email Anda untuk menerima kode OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}
