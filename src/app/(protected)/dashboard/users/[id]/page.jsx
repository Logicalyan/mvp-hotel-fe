"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getUserById } from "@/lib/services/user"

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user detail
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserById(params.id)
        setUser(userData)
      } catch (err) {
        console.error("❌ Failed to fetch user:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) return <p>Loading...</p>
  if (!user) return <p>User not found</p>

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Pengguna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label className="font-semibold">Nama</Label>
              <p className="text-gray-200">{user.name}</p>
            </div>

            {/* Email */}
            <div>
              <Label className="font-semibold">Email</Label>
              <p className="text-gray-200">{user.email}</p>
            </div>

            {/* Role */}
            <div>
              <Label className="font-semibold">Role</Label>
              <p className="text-gray-200">
                {user.roles?.[0]?.name || "Tidak ada role"}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/users")}
            >
              Kembali
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/users/${params.id}/edit`)}
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}