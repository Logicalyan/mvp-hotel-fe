// app/dashboard/hotels/[id]/rooms/columns.jsx
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
import { MoreHorizontal, Eye, Edit, Trash2, Power } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteRoom, toggleRoomStatus } from "@/lib/services/hotels/room"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const statusColors = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-orange-500",
    cleaning: "bg-yellow-500",
}

// Room Actions component
const RoomActions = ({ room, refreshData }) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isToggling, setIsToggling] = useState(false)
    const params = useParams()
    const hotelId = params.id
    const roomTypeId = params.room_type_id;


    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteRoom(room.id)
            toast.success("Kamar berhasil dihapus")
            refreshData?.()
        } catch (error) {
            toast.error(error.message || "Gagal menghapus kamar")
            console.error("Delete error:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleToggleStatus = async () => {
        try {
            setIsToggling(true)
            await toggleRoomStatus(room.id)
            toast.success(`Kamar ${room.is_active ? 'dinonaktifkan' : 'diaktifkan'} berhasil`)
            refreshData?.()
        } catch (error) {
            toast.error(error.message || "Gagal mengubah status kamar")
            console.error("Toggle error:", error)
        } finally {
            setIsToggling(false)
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
                    <Link href={`/hotel/dashboard/${hotelId}/rooms/${room.id}`}>
                        <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}/${room.id}/edit`}>
                        <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                        className="cursor-pointer"
                    >
                        <Power className="mr-2 h-4 w-4" />
                        {room.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    </DropdownMenuItem>
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
                    <AlertDialogTitle>Hapus Kamar</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kamar <strong>{room.room_number}</strong>? 
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
        accessorKey: "room_number",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Kamar" />
        ),
        cell: ({ row }) => {
            const roomNumber = row.getValue("room_number")
            return <div className="font-medium">{roomNumber}</div>
        },
    },
    {
        accessorKey: "roomType",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe Kamar" />
        ),
        cell: ({ row }) => {
            const roomType = row.original.room_type
            return <div>{roomType?.name || "-"}</div>
        },
    },
    {
        accessorKey: "floor",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lantai" />
        ),
        cell: ({ row }) => {
            const floor = row.getValue("floor")
            return <div>Lantai {floor}</div>
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status")
            const statusLabels = {
                available: "Tersedia",
                occupied: "Terisi",
                maintenance: "Maintenance",
                cleaning: "Cleaning"
            }
            return (
                <Badge 
                    variant="outline" 
                    className={`${statusColors[status]} text-white border-0`}
                >
                    {statusLabels[status] || status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status Aktif" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("is_active")
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Aktif" : "Nonaktif"}
                </Badge>
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
            const room = row.original
            const refreshData = table.options.meta?.refreshData
            return <RoomActions room={room} refreshData={refreshData} />
        },
    },
]