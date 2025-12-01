// app/hotel/dashboard/[id]/facilities/page.jsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { columns } from "./columns"
import { getHotelFacilitiesByHotel } from "@/lib/services/hotels/facility"
import { DataTable } from "@/components/common/data-table"
import { useTableFilters } from "@/hooks/useTableFilters"
import { useHotelId } from "@/hooks/useHotelId"
import { HotelFacilityFilters } from "@/components/facilities/HotelFacilityFilter"
import { getHotelById } from "@/lib/services/hotel"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"

export default function HotelFacilitiesTable() {
    const params = useParams()
    const urlHotelId = parseInt(params.id)

    const { hotelId: authHotelId, loading: authLoading, role } = useHotelId()

    const [hotel, setHotel] = useState(null)
    const [hotelLoading, setHotelLoading] = useState(true)

    // ⛔ Cek role → hotel staff tidak boleh akses hotel lain
    useEffect(() => {
        if (!authLoading && role === 'hotel' && authHotelId && urlHotelId !== authHotelId) {
            console.error('🚫 Access denied: cannot access another hotel')
            window.location.href = '/unauthorized'
        }
    }, [authLoading, role, urlHotelId, authHotelId])

    // 🎯 Wrapper get data
    const getFacilitiesForHotel = useCallback((page, filters, pageSize) => {
        const hotelIdToUse = role === 'admin' ? urlHotelId : authHotelId
        if (!hotelIdToUse) return Promise.resolve({ facilitiesByHotel: [], meta: {} })

        return getHotelFacilitiesByHotel(hotelIdToUse, page, filters, pageSize)
    }, [urlHotelId, authHotelId, role])

    const {
        data,
        loading,
        error,
        pagination,
        pageMeta,
        filters,
        handlePaginationChange,
        handleFiltersReplace,
        refreshData,
    } = useTableFilters(getFacilitiesForHotel, {}, { pageIndex: 0, pageSize: 10 })

    // 🚀 Load Hotel Name (sama seperti RoomTypes)
    useEffect(() => {
        async function loadHotel() {
            const hotelIdToUse = role === 'admin' ? urlHotelId : authHotelId
            if (!hotelIdToUse) return

            try {
                setHotelLoading(true)
                const hotelData = await getHotelById(hotelIdToUse)
                setHotel(hotelData)
            } catch (error) {
                console.error("Failed to load hotel:", error)
            } finally {
                setHotelLoading(false)
            }
        }
        loadHotel()
    }, [urlHotelId, authHotelId, role])

    // 🌀 Global Loading (hotel & auth)
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

    // ❌ Error Handling
    if (error) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error loading facilities: {error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        )
    }

    const currentHotelId = role === 'admin' ? urlHotelId : authHotelId

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* 🔙 Back Button */}
            <Link href={role === 'hotel' ? `/hotel/dashboard/${currentHotelId}` : '/dashboard'}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {role === 'hotel' ? 'Kembali ke Hotels' : 'Kembali ke Dashboard'}
                </Button>
            </Link>

            {/* 🏨 Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Facilities - {hotel?.name || 'Loading...'}
                    </h2>
                    <p className="text-muted-foreground">Kelola fasilitas untuk hotel ini</p>
                </div>
                <Link href={`/hotel/dashboard/${currentHotelId}/facilities/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Fasilitas
                    </Button>
                </Link>
            </div>

            {/* 📦 Table Section */}
            <div className="relative">
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageMeta.last_page}
                    state={{ pagination, filters }}
                    onPaginationChange={handlePaginationChange}
                    onFiltersChange={handleFiltersReplace}
                    meta={{ refreshData }}
                    searchConfig={{
                        enabled: true,
                        placeholder: "Cari fasilitas...",
                        debounceMs: 500,
                    }}
                    showColumnToggle={true}
                    emptyStateMessage="Tidak ada fasilitas ditemukan."
                    className="min-h-[400px]"
                    filterComponent={<HotelFacilityFilters />}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}
