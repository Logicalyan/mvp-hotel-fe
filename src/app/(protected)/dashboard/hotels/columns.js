"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { deleteHotel } from "@/lib/services/hotel"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"

// Hotel Actions component
const HotelActions = ({ hotel, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteHotel(hotel.id)
      toast.success("Hotel berhasil dihapus")
      refreshData()
    } catch (error) {
      toast.error("Gagal menghapus hotel")
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Link href={`/dashboard/hotels/${hotel.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
          </Link>
          
          <Link href={`/dashboard/hotels/${hotel.id}/edit`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>
          
          <DropdownMenuSeparator />
          
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Hotel</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus hotel <strong>{hotel.name}</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
      <DataTableColumnHeader column={column} title="Hotel" />
    ),
    cell: ({ row }) => {
      const hotel = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium">{hotel.name}</span>
            <span className="text-sm text-muted-foreground">{hotel.email || '-'}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),
  },
  {
    accessorKey: "sub_district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kelurahan" />
    ),
    cell: ({ row }) => row.original.sub_district?.name || "-",
  },
  {
    accessorKey: "district.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kecamatan" />
    ),
    cell: ({ row }) => row.original.district?.name || "-",
  },
  {
    accessorKey: "city.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kota" />
    ),
    cell: ({ row }) => row.original.city?.name || "-",
  },
  {
    accessorKey: "province.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provinsi" />
    ),
    cell: ({ row }) => row.original.province?.name || "-",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at")
      if (!createdAt) return <span className="text-sm text-muted-foreground">-</span>
      
      try {
        const date = new Date(createdAt)
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {format(date, "dd MMM yyyy", { locale: id })}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "HH:mm", { locale: id })}
            </span>
          </div>
        )
      } catch (error) {
        return <span className="text-sm text-muted-foreground">-</span>
      }
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const hotel = row.original
      const refreshData = table.options.meta?.refreshData
      
      return <HotelActions hotel={hotel} refreshData={refreshData}/>
    },
  },
]