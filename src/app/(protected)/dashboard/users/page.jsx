"use client"

import { columns } from "./columns"
import { getUsers } from "@/lib/services/user"
import { DataTable } from "@/components/common/data-table"
import { UserFilters } from "@/components/users/UserFilters"
import { useTableFilters } from "@/hooks/useTableFilters"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function UsersTable() {
  const initialFilters = {
    search: "",
    role: null,
    status: null,
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
  } = useTableFilters(getUsers, initialFilters, initialPagination)

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Error loading users: {error}</p>
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
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Kelola data pengguna sistem</p>
        </div>
        <Link href="/dashboard/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah User
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
            enabled: true, // Nonaktifkan search bar bawaan karena ada di UserFilters
            placeholder: "Cari user...",
            debounceMs: 500
          }}
          showColumnToggle={true}
          emptyStateMessage="Tidak ada user yang ditemukan dengan filter saat ini."
          className="min-h-[400px]"
          filterComponent={<UserFilters />}
          isLoading={loading}
        />
      </div>
    </div>
  )
}