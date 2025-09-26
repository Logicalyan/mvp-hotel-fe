"use client"

import { columns } from "./columns"
import { getBedType } from "@/lib/services/bed-types"
import { DataTable } from "@/components/common/data-table"
import { BedTypeFilters } from "@/components/bed-types/BedTypeFilters"
import { useTableFilters } from "@/hooks/useTableFilters"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function BedTypesTable() {
    const initialFilters = {
        search: "",
        sort: null
    }

    const initialPagination = {
        pageIndex: 0,
        pageSize: 10,
    }

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
    } = useTableFilters(getBedType, initialFilters, initialPagination)

    // Debug logs
    console.log("DataTable data:", data)
    console.log("PageMeta:", pageMeta)
    console.log("Filters:", filters)
    console.log("Loading:", loading)
    console.log("Error:", error)

    if (error) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Error loading bed types: {error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bed Types</h2>
                    <p className="text-muted-foreground">Kelola data tipe tempat tidur</p>
                </div>
                <Link href="/dashboard/bed-types/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Bed Type
                    </Button>
                </Link>
            </div>

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
                        placeholder: "Cari bed type...",
                        debounceMs: 500
                    }}
                    showColumnToggle={true}
                    emptyStateMessage="Tidak ada bed type yang ditemukan dengan filter saat ini."
                    className="min-h-[400px]"
                    filterComponent={<BedTypeFilters />}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}