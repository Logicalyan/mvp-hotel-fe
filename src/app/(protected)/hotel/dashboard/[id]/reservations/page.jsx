"use client"
import { columns } from "./columns"
import { getReservationsByHotel } from "@/lib/services/hotels/reservation"
import { DataTable } from "@/components/common/data-table"
import { ReservationByHotelFilters } from "@/components/reservations/ReservationByHotelFilters"
import { useTableFilters } from "@/hooks/useTableFilters"
import { useHotelId } from "@/hooks/useHotelId"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { getHotelById } from "@/lib/services/hotel"

export default function HotelReservationsTable() {
    const params = useParams()
    const urlHotelId = parseInt(params.id)

    const { hotelId: authHotelId, loading: authLoading, role } = useHotelId()

    const [hotel, setHotel] = useState(null)
    const [hotelLoading, setHotelLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            if (authHotelId && urlHotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to access different hotel')
                window.location.href = '/unauthorized'
            }
        }
    }, [authLoading, role, urlHotelId, authHotelId])

    const initialFilters = {
        search: "",
        reservation_status: null,
        payment_status: null,
        from_date: null,
        to_date: null,
        sort: null
    }
    const initialPagination = {
        pageIndex: 0,
        pageSize: 10,
    }

    const getReservationsForHotel = useCallback((page, filters, pageSize) => {
        const hotelIdToUse = role === 'admin' ? urlHotelId : authHotelId

        if (!hotelIdToUse) {
            return Promise.resolve({ reservations: [], meta: {} })
        }

        return getReservationsByHotel(hotelIdToUse, page, filters, pageSize)
    }, [urlHotelId, authHotelId, role])

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
    } = useTableFilters(getReservationsForHotel, initialFilters, initialPagination)

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

    if (error) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error loading reservations: {error}</p>
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
            <Link href={role === 'hotel' ? `/hotel/dashboard/${currentHotelId}` : '/dashboard'}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {role === 'hotel' ? 'Kembali ke Hotels' : 'Kembali ke Dashboard'}
                </Button>
            </Link>

            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Reservations - {hotel?.name || 'Loading...'}
                    </h2>
                    <p className="text-muted-foreground">
                        Kelola reservasi untuk hotel ini
                    </p>
                </div>
                <Link href={`/hotel/dashboard/${currentHotelId}/reservations/create`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Reservasi
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
                        placeholder: "Cari nama tamu, phone, email, kode reservasi...",
                        debounceMs: 500
                    }}
                    showColumnToggle={true}
                    emptyStateMessage="Tidak ada reservasi yang ditemukan dengan filter saat ini."
                    className="min-h-[400px]"
                    filterComponent={<ReservationByHotelFilters />}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}