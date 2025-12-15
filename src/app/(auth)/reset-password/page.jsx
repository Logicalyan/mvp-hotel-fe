"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useSearchParams();

    const email = params.get("email");
    const token = params.get("token");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 state untuk toggle password

    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
                email,
                token,
                new_password: password,
            });

            toast.success("Password berhasil direset!");

            router.push("/login");

        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal reset password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-lg border p-8">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Buat Password Baru</h1>
                    <p className="text-gray-500">Masukkan password baru untuk akun Anda</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2 relative">
                        <label className="text-sm font-medium">Password Baru</label>
                        <Input
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <Button className="w-full" disabled={loading}>
                        {loading ? "Menyimpan..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
