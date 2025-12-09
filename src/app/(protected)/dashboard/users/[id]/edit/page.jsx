"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { getUserById, updateUser } from "@/lib/services/user"
import { getRoles } from "@/lib/services/reference"
import { toast } from "sonner"

const schema = z.object({
    name: z.string().min(1, "Name is required").max(50),
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50)
        .optional()
        .or(z.literal("")),
    role: z.string().min(1, "Role is required"),
})

export default function UpdateUserPage() {
    const router = useRouter()
    const params = useParams()
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "",
        }
    })

    // Fetch reference data
    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

    // Fetch user detail
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserById(params.id)
                reset({
                    name: user.name,
                    email: user.email,
                    password: "", // Kosongkan password untuk keamanan
                    role: user.roles?.[0]?.slug || "", // Ambil slug role pertama
                })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.id, reset])

    const onSubmit = async (values) => {
        try {
            const data = {
                ...values,
                _method: 'PUT', // Untuk mendukung PUT request di backend Laravel
            }

            await updateUser(params.id, data)
            router.push("/dashboard/users")
            toast.success("Updated Users Successfully")
        } catch (err) {
            console.error("❌ Failed to update user:", err)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">Edit Pengguna</h1>

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
                        <Label>Password (Kosongkan jika tidak ingin mengubah)</Label>
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
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.slug} value={r.slug}>
                                                {r.name}
                                            </SelectItem>
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
                        {isSubmitting ? "Memperbarui..." : "Perbarui"}
                    </Button>
                </div>
            </form>
        </div>
    )
}