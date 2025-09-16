"use client"

import { useCallback, useEffect, useState } from "react"
import { columns } from "./columns"
import { getHotels } from "@/lib/services/hotel"
import { DataTable } from "@/components/common/data-table"
import { HotelFilters } from "@/components/hotels/HotelFilters"

export default function HotelsTable() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [pagination, setPagination] = useState({
    pageIndex: 0, // zero-based
    pageSize: 10,
  })

  const [pageMeta, setPageMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  })

  // Unified filters state
  const [filters, setFilters] = useState({
    search: "",
    province_id: null,
    city_id: null,
    district_id: null,
    sub_district_id: null,
    facilities: [],
    sort: null
  })

  const fetchHotels = useCallback(async () => {
    setLoading(true)
    try {
      const apiPage = pagination.pageIndex + 1

      // DEBUG: Log filters SEBELUM clean
      console.log('🔍 Raw filters before cleaning:', filters)

      // Filter out empty/null values sebelum kirim ke API
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
          if (key === 'search') return value !== "" && value !== null
          if (key === 'facilities') return Array.isArray(value) && value.length > 0
          return value !== null && value !== undefined
        })
      )

      // DEBUG: Log untuk cek request
      console.log('🔍 Fetching hotels with:', {
        page: apiPage,
        pageSize: pagination.pageSize,
        rawFilters: filters,
        cleanFilters: cleanFilters
      })

      const res = await getHotels(apiPage, cleanFilters, pagination.pageSize)

      // DEBUG: Log response
      console.log('📊 API Response:', {
        totalHotels: res.hotels.length,
        totalFound: res.meta.total,
        currentPage: res.meta.current_page,
        meta: res.meta,
        firstHotel: res.hotels[0],
        hotelProvinceIds: res.hotels.map(h => `${h.name} (province: ${h.province_id})`), // Cek province_id semua hotel
        allHotelIds: res.hotels.map(h => h.id) // Cek ID hotel yang dikembalikan
      })

      // IMPORTANT: Set data dan meta dengan benar
      setData(res.hotels || []) // Pastikan fallback ke empty array
      setPageMeta(res.meta)

      // DEBUG: Log state update
      console.log('🔄 State updated:', {
        dataLength: (res.hotels || []).length,
        pageMeta: res.meta
      })

    } catch (err) {
      console.error("❌ Error fetching hotels:", err)
      // Set empty data on error
      setData([])
      setPageMeta({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: pagination.pageSize,
      })
    } finally {
      setLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, filters])

  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  // Handle search change from DataTable search input
  const handleSearchChange = useCallback((term) => {
    setFilters(prev => ({ ...prev, search: term }))
    // Reset ke halaman pertama saat search berubah
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [])

  // Handle filters change from HotelFilters component
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setData([])
  }, [])



  // Handler untuk menangkap perubahan dari TanStack Table
  const handlePaginationChange = useCallback((updater) => {
    setPagination(prev => {
      const newPagination = typeof updater === 'function' ? updater(prev) : updater

      // Jika pageSize berubah, reset ke halaman pertama
      if (newPagination.pageSize !== prev.pageSize) {
        return { ...newPagination, pageIndex: 0 }
      }

      return newPagination
    })
  }, [])

  // Function untuk refresh data setelah delete
  const refreshData = useCallback(() => {
    fetchHotels()
  }, [fetchHotels])

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <HotelFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Table Section */}
      <div className="space-y-4 relative">
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageMeta.last_page}
          state={{
            pagination,
            filters // Pass filters ke DataTable untuk sync search
          }}
          onPaginationChange={handlePaginationChange}
          onSearchChange={handleSearchChange}
          meta={{ refreshData }}
        />
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="bg-white px-4 py-2 rounded-md shadow-lg">
              <p className="text-sm">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}