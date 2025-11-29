// app/hotel/dashboard/[id]/room-types/[room_type_id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getRoomTypeByHotel } from "@/lib/services/hotels/roomType";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { deleteRoomTypeByHotel } from "@/lib/services/hotels/roomType";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";

export default function RoomTypeDetailByHotelPage() {
    const params = useParams();
    const router = useRouter();
    const hotelId = parseInt(params.id);
    const roomTypeId = parseInt(params.room_type_id);

    // ✅ Get auth info untuk validasi
    const { hotelId: authHotelId, role, loading: authLoading } = useAuth();

    const [roomType, setRoomType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ✅ SECURITY: Validasi akses
    useEffect(() => {
        if (!authLoading && role === 'hotel') {
            if (authHotelId && hotelId !== authHotelId) {
                console.error('🚫 Access denied: trying to view room type of different hotel');
                setAccessDenied(true);
            }
        }
    }, [authLoading, role, hotelId, authHotelId]);

    useEffect(() => {
        if (!hotelId || !roomTypeId || accessDenied) return;

        const fetchRoomType = async () => {
            try {
                setLoading(true);
                const data = await getRoomTypeByHotel(hotelId, roomTypeId);
                setRoomType(data);
            } catch (err) {
                console.error("Failed to load room type:", err);
                setError(err.response?.data?.message || "Failed to load room type");
            } finally {
                setLoading(false);
            }
        };

        fetchRoomType();
    }, [hotelId, roomTypeId, accessDenied]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            setSelectedImage(null);
        }, 300);
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteRoomTypeByHotel(hotelId, roomTypeId);
            toast.success("Room type deleted successfully");
            router.push(`/hotel/dashboard/${hotelId}/room-types`);
        } catch (error) {
            console.error("Failed to delete room type:", error);
            toast.error("Failed to delete room type", {
                description: error?.response?.data?.message || error?.message
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // ✅ Loading state
    if (authLoading || loading) {
        return <RoomTypeDetailSkeleton />;
    }

    // ✅ Access denied
    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this hotel.</p>
                <Link href="/dashboard">
                    <Button className="mt-4">Go to Dashboard</Button>
                </Link>
            </div>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <div className="container max-w-4xl mx-auto p-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Room Types
                    </Button>
                </Link>
            </div>
        );
    }

    if (!roomType) return null;

    const displayedImages = showAllImages
        ? roomType.images
        : roomType.images?.slice(0, 6);
    const remainingImages = roomType.images?.length - 6;

    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-6">
            {/* Back Button */}
            <Link href={`/hotel/dashboard/${hotelId}/room-types`}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Room Types
                </Button>
            </Link>

            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{roomType.name}</h1>
                    <p className="text-muted-foreground mt-2">
                        Max Guests: {roomType.capacity} • Hotel: {roomType.hotel?.name}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/hotel/dashboard/${hotelId}/room-types/${roomTypeId}/edit`}>
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Room Type</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{roomType.name}</strong>?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images Gallery */}
                    {roomType.images?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Gallery</CardTitle>
                                <CardDescription>
                                    {roomType.images.length} photo{roomType.images.length !== 1 && 's'} available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {displayedImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                                            onClick={() => handleImageClick(img)}
                                        >
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_URL}/storage/${img.image_url}`}
                                                alt={roomType.name}
                                                className="w-full h-32 object-cover transition-all duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                                        </div>
                                    ))}
                                </div>

                                {roomType.images.length > 6 && (
                                    <div className="mt-4 text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAllImages(!showAllImages)}
                                        >
                                            {showAllImages
                                                ? 'Show Less'
                                                : `Show ${remainingImages} More Photo${remainingImages !== 1 ? 's' : ''}`
                                            }
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {roomType.description || "No description available."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Beds */}
                    {roomType.beds?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Bed Configuration</CardTitle>
                                <CardDescription>
                                    {roomType.beds.length} bed type{roomType.beds.length !== 1 && 's'} available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {roomType.beds.map((bed) => (
                                        <div
                                            key={bed.id}
                                            className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{bed.bed_type?.name || bed.bedType?.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {bed.bed_type?.size || bed.bedType?.size}
                                                </p>
                                            </div>
                                            <Badge variant="secondary">
                                                × {bed.quantity}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Prices */}
                    {roomType.prices?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                                <CardDescription>
                                    {roomType.prices.length} price period{roomType.prices.length !== 1 && 's'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Period</TableHead>
                                                <TableHead>Weekday</TableHead>
                                                <TableHead>Weekend</TableHead>
                                                <TableHead>Currency</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {roomType.prices.map((price) => (
                                                <TableRow key={price.id}>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            <div>{new Date(price.start_date).toLocaleDateString('id-ID')}</div>
                                                            <div className="text-muted-foreground">
                                                                to {new Date(price.end_date).toLocaleDateString('id-ID')}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {Number(price.weekday_price).toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {Number(price.weekend_price).toLocaleString('id-ID')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{price.currency}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Facilities */}
                    {roomType.facilities?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Facilities</CardTitle>
                                <CardDescription>
                                    {roomType.facilities.length} facilit{roomType.facilities.length !== 1 ? 'ies' : 'y'} available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {roomType.facilities.map((f) => (
                                        <Badge key={f.id} variant="secondary">
                                            {f.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Beds</span>
                                <span className="font-medium">
                                    {roomType.beds?.reduce((sum, bed) => sum + bed.quantity, 0) || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Max Capacity</span>
                                <span className="font-medium">{roomType.capacity} guests</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Photos</span>
                                <span className="font-medium">{roomType.images?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Facilities</span>
                                <span className="font-medium">{roomType.facilities?.length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTitle className="sr-only">Room Image</DialogTitle>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
                    <div className="relative flex items-center justify-center">
                        {selectedImage && (
                            <div className="relative">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_URL}/storage/${selectedImage.image_url}`}
                                    alt={roomType.name}
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                                    onClick={handleCloseDialog}
                                >
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Skeleton Loading Component
function RoomTypeDetailSkeleton() {
    return (
        <div className="container max-w-6xl mx-auto p-6 space-y-6">
            <Skeleton className="h-9 w-40" />

            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                                ))}
                            </div>
                            <Skeleton className="h-9 w-40 mx-auto mt-4" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[...Array(2)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-36" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-20" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-6 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}