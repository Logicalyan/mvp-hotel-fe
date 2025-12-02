"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Service untuk reference data
import { getRoles } from "@/lib/services/reference"
import { createUser } from "@/lib/services/user"
import { toast } from "sonner"

// --- Validasi Zod ---
const schema = z.object({
    name: z.string().min(1, "Name is required").max(50),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(50),
    role: z.string().min(1, "Role is required"),
})

export default function CreateUserPage() {
    const router = useRouter()
    const [roles, setRoles] = useState([])

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "",
        }
    })

    // Load reference data
    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

    const onSubmit = async (values) => {
        try {
            await createUser(values)
            router.push("/dashboard/users")
            toast.success("User Created Successfully")
        } catch (err) {
            console.error("❌ Failed to create user:", err)
            toast.error("Failed Create User:", err)
        }
    }

    return (
        <>
            <div className="container mx-auto p-6 max-w-4xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold">Tambah Pengguna</h1>

                        {/* Name */}
                        <div>
                            <Label>Nama</Label>
                            <Input
                                placeholder="Nama Pengguna"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <Input
                                placeholder="Email"
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <Label>Password</Label>
                            <Input
                                placeholder="Password"
                                type="password"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <Label>Role</Label>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((r) => (
                                                <SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}