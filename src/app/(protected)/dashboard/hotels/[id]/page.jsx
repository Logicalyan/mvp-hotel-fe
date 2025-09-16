"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getHotelById } from "@/lib/services/hotel"

export default function HotelDetailPage() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id)
        setHotel(data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load hotel")
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      <p>{hotel.description}</p>
      <p className="text-gray-600">{hotel.address}</p>
      <p><strong>Phone:</strong> {hotel.phone_number}</p>
      <p><strong>Email:</strong> {hotel.email}</p>

      {/* Images */}
      {hotel.images?.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {hotel.images.map((img) => (
            <img
              key={img.id}
              src={`${process.env.NEXT_PUBLIC_URL}/storage/${img.image_url}`}
              alt={hotel.name}
              className="w-40 h-28 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      {/* Facilities */}
      {hotel.facilities?.length > 0 && (
        <div>
          <h2 className="font-semibold">Facilities:</h2>
          <ul className="list-disc ml-6">
            {hotel.facilities.map((f) => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
