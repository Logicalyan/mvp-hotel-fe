// apphotel/dashboard/[id]/room-types/columns.js
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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { deleteRoomTypeByHotel } from "@/lib/services/hotels/roomType"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { useParams } from "next/navigation"

// RoomType Actions component
const RoomTypeActions = ({ roomType, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const params = useParams()
  const hotelId = params.id

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteRoomTypeByHotel(hotelId, roomType.id)
      toast.success("Tipe kamar berhasil dihapus")
      refreshData()
    } catch (error) {
      toast.error("Gagal menghapus tipe kamar")
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
          <Link href={`hotel/dashboard/${hotelId}/room-types/${roomType.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
          </Link>
          <Link href={`hotel/dashboard/${hotelId}/room-types/${roomType.id}/edit`}>
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
          <AlertDialogTitle>Hapus Tipe Kamar</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus tipe kamar <strong>{roomType.name}</strong>? 
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacity" />
    ),
  },
  {
    accessorKey: "facilities",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Facilities" />
    ),
    cell: ({ row }) => row.original.facilities?.map(f => f.name).join(", ") || "-",
  },
  {
    accessorKey: "prices",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Range" />
    ),
    cell: ({ row }) => {
      const prices = row.original.prices
      if (!prices || prices.length === 0) return "-"
      
      const minPrice = Math.min(...prices.map(p => p.weekday_price))
      const maxPrice = Math.max(...prices.map(p => p.weekend_price))
      const currency = prices[0]?.currency || "IDR"
      
      return (
        <div className="text-sm">
          <span className="font-medium">{currency} {minPrice.toLocaleString()}</span>
          {minPrice !== maxPrice && (
            <span className="text-muted-foreground"> - {maxPrice.toLocaleString()}</span>
          )}
        </div>
      )
    },
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
      const roomType = row.original
      const refreshData = table.options.meta?.refreshData
      return <RoomTypeActions roomType={roomType} refreshData={refreshData}/>
    },
  },
]