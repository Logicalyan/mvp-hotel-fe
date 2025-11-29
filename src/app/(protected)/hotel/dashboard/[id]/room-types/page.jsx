// app/dashboard/hotels/[id]/room-types/page.jsx
"use client"
import { columns } from "./columns"
import { getRoomTypesByHotel } from "@/lib/services/hotels/roomType"
import { DataTable } from "@/components/common/data-table"
import { RoomTypeByHotelFilters } from "@/components/room-types/RoomTypeByHotelFilters"
import { useTableFilters } from "@/hooks/useTableFilters"
import { useHotelId } from "@/hooks/useHotelId"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { getHotelById } from "@/lib/services/hotel"

export default function HotelRoomTypesTable() {
    const params = useParams()
    const urlHotelId = params.id
    const { hotelId: authHotelId, loading: authLoading } = useHotelId()

    const [hotel, setHotel] = useState(null)
    const [hotelLoading, setHotelLoading] = useState(true)
    const [accessDenied, setAccessDenied] = useState(false)

    // ✅ VALIDASI: URL hotel_id harus sama dengan auth hotel_id
    useEffect(() => {
        if (!authLoading && authHotelId) {
            if (parseInt(urlHotelId) !== authHotelId) {
                console.error('🚫 Access denied: URL hotel_id !== auth hotel_id')
                setAccessDenied(true)
            }
        }
    }, [urlHotelId, authHotelId, authLoading])

    const initialFilters = {
        search: "",
        facilities: [],
        sort: null
    }
    const initialPagination = {
        pageIndex: 0,
        pageSize: 10,
    }

    // ✅ USE authHotelId (bukan urlHotelId) untuk security
    const getRoomTypesForHotel = useCallback((page, filters, pageSize) => {
        if (!authHotelId) return Promise.resolve({ roomTypes: [], meta: {} })
        return getRoomTypesByHotel(authHotelId, page, filters, pageSize)
    }, [authHotelId])

    const {
        data,
        loading,
        error,
        pagination,
        pageMeta,
        filters,
        handleFiltersChange,
        handleFiltersReplace,
        handlePaginationChange,
        refreshData,
        resetFilters,
    } = useTableFilters(getRoomTypesForHotel, initialFilters, initialPagination)

    useEffect(() => {
        async function loadHotel() {

            if (!authHotelId) return

            try {
                setHotelLoading(true)
                const hotelData = await getHotelById(authHotelId)
                setHotel(hotelData)
            } catch (error) {
                console.error("Failed to load hotel:", error)
            } finally {
                setHotelLoading(false)
            }
        }
        loadHotel()
    }, [authHotelId])

    if (authLoading || hotelLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        )
    }

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this hotel.</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error loading room types: {error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Back Button */}
            <Link href="/hotel/dashboard">
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Button>
            </Link>

            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Room Types - {hotelLoading ? "Loading..." : hotel?.name}
                    </h2>
                    <p className="text-muted-foreground">
                        Kelola tipe kamar untuk hotel ini
                    </p>
                </div>
                <Link href={`hotel/dashboard/hotels/${authHotelId}/room-types/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Tipe Kamar
                    </Button>
                </Link>
            </div>

            {/* Table Section */}
            <div className="relative">
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageMeta.last_page}
                    state={{
                        pagination,
                        filters
                    }}
                    onPaginationChange={handlePaginationChange}
                    onFiltersChange={handleFiltersReplace}
                    meta={{ refreshData }}
                    searchConfig={{
                        enabled: true,
                        placeholder: "Cari tipe kamar...",
                        debounceMs: 500
                    }}
                    showColumnToggle={true}
                    emptyStateMessage="Tidak ada tipe kamar yang ditemukan dengan filter saat ini."
                    className="min-h-[400px]"
                    filterComponent={<RoomTypeByHotelFilters />}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}