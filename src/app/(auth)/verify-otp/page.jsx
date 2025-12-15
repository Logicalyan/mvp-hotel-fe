"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-otp`, {
        email,
        code,
      });

      const token = response.data.data.token;

      toast.success("OTP berhasil diverifikasi");

      router.push(`/reset-password?email=${email}&token=${token}`);

    } catch (error) {
      toast.error(error.response?.data?.message || "OTP tidak valid");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verifikasi OTP</h1>
          <p className="text-gray-500">Masukkan kode OTP yang dikirim ke {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-medium">Kode OTP</label>
            <Input
              type="number"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
}
