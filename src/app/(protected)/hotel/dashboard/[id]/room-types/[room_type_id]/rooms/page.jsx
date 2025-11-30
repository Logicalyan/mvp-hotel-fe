"use client"
import { columns } from "./columns"
import { getRoomsByRoomType } from "@/lib/services/hotels/room"
import { DataTable } from "@/components/common/data-table"
import { RoomByRoomTypeFilters } from "@/components/rooms/RoomByRoomTypeFilters"
import { useTableFilters } from "@/hooks/useTableFilters"
import { useHotelId } from "@/hooks/useHotelId"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { getHotelById } from "@/lib/services/hotel"
import { getRoomTypeById } from "@/lib/services/hotels/roomType"

export default function RoomTypeRoomsTable() {
    const params = useParams()
    const urlHotelId = parseInt(params.id)
    const urlRoomTypeId = parseInt(params.room_type_id)

    const { hotelId: authHotelId, loading: authLoading, role } = useHotelId()

    const [hotel, setHotel] = useState(null)
    const [roomType, setRoomType] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            // Hotel staff cuma bisa akses hotel mereka sendiri
            if (authHotelId && urlHotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to access different hotel')
                window.location.href = '/unauthorized'
            }
        }
    }, [authLoading, role, urlHotelId, authHotelId])

    const initialFilters = {
        search: "",
        status: null,
        floor: null,
        is_active: null,
        sort: null
    }
    const initialPagination = {
        pageIndex: 0,
        pageSize: 10,
    }

    // ✅ Wrapper function dengan hotel_id dan room_type_id yang sudah tervalidasi
    const getRoomsForRoomType = useCallback((page, filters, pageSize) => {
        const hotelIdToUse = role === 'admin' ? urlHotelId : authHotelId

        if (!hotelIdToUse || !urlRoomTypeId) {
            return Promise.resolve({ rooms: [], meta: {} })
        }

        return getRoomsByRoomType(hotelIdToUse, urlRoomTypeId, page, filters, pageSize)
    }, [urlHotelId, authHotelId, urlRoomTypeId, role])

    const {
        data,
        loading: tableLoading,
        error,
        pagination,
        pageMeta,
        filters,
        handleFiltersChange,
        handleFiltersReplace,
        handlePaginationChange,
        refreshData,
        resetFilters,
    } = useTableFilters(getRoomsForRoomType, initialFilters, initialPagination)

    // Load hotel dan room type data
    useEffect(() => {
        async function loadData() {
            const hotelIdToUse = role === 'admin' ? urlHotelId : authHotelId
            if (!hotelIdToUse || !urlRoomTypeId) return

            try {
                setLoading(true)
                const [hotelData, roomTypeData] = await Promise.all([
                    getHotelById(hotelIdToUse),
                    getRoomTypeById(hotelIdToUse, urlRoomTypeId) // ✅ Pass hotelId
                ])
                setHotel(hotelData)
                setRoomType(roomTypeData)
            } catch (error) {
                console.error("Failed to load data:", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [urlHotelId, authHotelId, urlRoomTypeId, role])

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error loading rooms: {error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    const currentHotelId = role === 'admin' ? urlHotelId : authHotelId

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Back Button */}
            <Link href={`hotel/dashboard/${currentHotelId}/room-types`}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Room Types
                </Button>
            </Link>

            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Rooms - {roomType?.name || 'Loading...'}
                    </h2>
                    <p className="text-muted-foreground">
                        {hotel?.name} • Kelola kamar untuk tipe kamar ini
                    </p>
                </div>
                <Link href={`/dashboard/hotels/${currentHotelId}/room-types/${urlRoomTypeId}/rooms/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kamar
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
                        placeholder: "Cari nomor kamar...",
                        debounceMs: 500
                    }}
                    showColumnToggle={true}
                    emptyStateMessage="Tidak ada kamar yang ditemukan dengan filter saat ini."
                    className="min-h-[400px]"
                    filterComponent={<RoomByRoomTypeFilters />}
                    isLoading={tableLoading}
                />
            </div>
        </div>
    )
}