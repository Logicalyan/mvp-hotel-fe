"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { detachFacilityFromHotel } from "@/lib/services/hotels/facility"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"

const FacilityActions = ({ facility, refreshData }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const { hotelId, role } = useAuth()

    const currentHotelId = role === "admin" ? facility.hotel_id : hotelId

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await detachFacilityFromHotel(currentHotelId, facility.id)
            toast.success("Fasilitas berhasil dihapus")
            refreshData()
        } catch (error) {
            toast.error("Gagal menghapus fasilitas")
            console.error("Delete facility error:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Fasilitas</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus fasilitas{" "}
                        <strong>{facility.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
            <DataTableColumnHeader column={column} title="Facility" />
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const createdAt = row.original.created_at
            if (!createdAt) return "-"

            const date = new Date(createdAt)
            return (
                <div className="text-sm">
                    {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const facility = row.original
            const refreshData = table.options.meta?.refreshData
            return <FacilityActions facility={facility} refreshData={refreshData} />
        },
    },
]
