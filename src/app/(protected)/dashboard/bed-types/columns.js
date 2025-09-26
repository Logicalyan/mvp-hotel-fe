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
import { deleteBedType } from "@/lib/services/bed-types"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"

// Bed Type Actions component
const BedTypeActions = ({ bedType, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteBedType(bedType.id)
      toast.success("Bed type berhasil dihapus")
      refreshData()
    } catch (error) {
      toast.error("Gagal menghapus bed type")
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={`Open actions for ${bedType.name}`}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <Link href={`/dashboard/bed-types/${bedType.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
          </Link>
          
          <Link href={`/dashboard/bed-types/${bedType.id}/edit`}>
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
          <AlertDialogTitle>Hapus Bed Type</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus bed type <strong>{bedType.name}</strong>? 
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
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      const bedType = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[200px]">{bedType.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deskripsi" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description")
      return (
        <span className="text-sm text-muted-foreground truncate block max-w-[300px]">
          {description || '-'}
        </span>
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
        if (isNaN(date.getTime())) throw new Error("Invalid date")
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
  // {
  //   accessorKey: "updated_at",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Diperbarui" />
  //   ),
  //   cell: ({ row }) => {
  //     const updatedAt = row.getValue("updated_at")
  //     if (!updatedAt) return <span className="text-sm text-muted-foreground">-</span>
      
  //     try {
  //       const date = new Date(updatedAt)
  //       if (isNaN(date.getTime())) throw new Error("Invalid date")
  //       return (
  //         <div className="flex flex-col">
  //           <span className="text-sm">
  //             {format(date, "dd MMM yyyy", { locale: id })}
  //           </span>
  //           <span className="text-xs text-muted-foreground">
  //             {format(date, "HH:mm", { locale: id })}
  //           </span>
  //         </div>
  //       )
  //     } catch (error) {
  //       return <span className="text-sm text-muted-foreground">-</span>
  //     }
  //   },
  // },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const bedType = row.original
      const refreshData = table.options.meta?.refreshData
      
      return <BedTypeActions bedType={bedType} refreshData={refreshData} />
    },
  },
]