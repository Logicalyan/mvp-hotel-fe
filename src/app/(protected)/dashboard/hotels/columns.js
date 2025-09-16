"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { useState } from "react"
import { deleteHotel } from "@/lib/services/hotel"

// Komponen terpisah untuk Actions Cell
function ActionsCell({ hotel, table }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteHotel(hotel.id)
      
      // Show success message
      // toast({
      //   title: "Success",
      //   description: `Hotel "${hotel.name}" has been deleted.`,
      //   variant: "default"
      // })

      // Trigger refresh data - call parent refresh function
      if (table.options.meta?.refreshData) {
        table.options.meta.refreshData()
      }

    } catch (error) {
      console.error('Delete error:', error)
      // toast({
      //   title: "Error",
      //   description: error.response?.data?.message || "Failed to delete hotel. Please try again.",
      //   variant: "destructive"
      // })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(hotel.id)}
        >
          Copy Hotel ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Edit hotel</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete hotel"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hotel Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "sub_district.name",
    header: "Sub District",
    cell: ({ row }) => row.original.sub_district?.name || "-",
  },
  {
    accessorKey: "district.name",
    header: "District",
    cell: ({ row }) => row.original.district?.name || "-",
  },
  {
    accessorKey: "city.name",
    header: "City",
    cell: ({ row }) => row.original.city?.name || "-",
  },
  {
    accessorKey: "province.name",
    header: "Province",
    cell: ({ row }) => row.original.province?.name || "-",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      return <ActionsCell hotel={row.original} table={table} />
    },
  },
]