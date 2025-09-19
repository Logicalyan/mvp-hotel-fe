"use client"

import { Badge } from "@/components/ui/badge"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { deleteUser } from "@/lib/services/user"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"

// Status badge component - berdasarkan email verification
const StatusBadge = ({ user }) => {
  const isVerified = user.email_verified_at !== null
  
  if (isVerified) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Terverifikasi
      </Badge>
    )
  } else {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Belum Verifikasi
      </Badge>
    )
  }
}

// Role badge component
const RoleBadge = ({ roles }) => {
  if (!roles || roles.length === 0) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        No Role
      </Badge>
    )
  }

  // Ambil role pertama jika ada multiple roles
  const primaryRole = roles[0]
  const roleConfig = {
    admin: { label: "Administrator", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
    receptionist: { label: "Receptionist", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    customer: { label: "Customer", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  }
  
  const config = roleConfig[primaryRole.slug] || { 
    label: primaryRole.name, 
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100" 
  }
  
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
      {roles.length > 1 && (
        <span className="text-xs text-muted-foreground">
          +{roles.length - 1} more
        </span>
      )}
    </div>
  )
}

// Actions component
const UserActions = ({ user, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUser(user.id)
      toast.success("User berhasil dihapus")
      refreshData()
    } catch (error) {
      toast.error("Gagal menghapus user")
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
          
          <Link href={`/dashboard/users/${user.id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
          </Link>
          
          <Link href={`/dashboard/users/${user.id}/edit`}>
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
          <AlertDialogTitle>Hapus User</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>? 
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
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => {
      const roles = row.getValue("roles")
      return <RoleBadge roles={roles} />
    },
  },
  // {
  //   accessorKey: "email_verified_at",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const user = row.original
  //     return <StatusBadge user={user} />
  //   },
  // },
  // {
  //   accessorKey: "email_verified_at",
  //   header: "Verifikasi Email",
  //   cell: ({ row }) => {
  //     const emailVerifiedAt = row.getValue("email_verified_at")
  //     if (!emailVerifiedAt) {
  //       return <span className="text-sm text-muted-foreground">Belum verifikasi</span>
  //     }
      
  //     try {
  //       const date = new Date(emailVerifiedAt)
  //       return (
  //         <div className="flex flex-col">
  //           <span className="text-sm text-green-600 font-medium">Terverifikasi</span>
  //           <span className="text-xs text-muted-foreground">
  //             {format(date, "dd MMM yyyy", { locale: id })}
  //           </span>
  //         </div>
  //       )
  //     } catch (error) {
  //       return <span className="text-sm text-muted-foreground">-</span>
  //     }
  //   },
  // },
  {
    accessorKey: "created_at",
    header: "Dibuat",
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
      const user = row.original
      const refreshData = table.options.meta?.refreshData
      
      return <UserActions user={user} refreshData={refreshData} />
    },
  },
]