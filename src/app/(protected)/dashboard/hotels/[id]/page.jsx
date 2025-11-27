"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getHotelById } from "@/lib/services/hotel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";

export default function HotelDetailPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setSelectedImage(null);
    }, 300); // Sesuai dengan duration animasi
  };

  if (loading) return <HotelDetailSkeleton />;
  if (error) return (
    <Alert variant="destructive" className="max-w-4xl mx-auto">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  const displayedImages = showAllImages 
    ? hotel.images 
    : hotel.images?.slice(0, 6);
  const remainingImages = hotel.images?.length - 6;

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{hotel.name}</h1>
          <p className="text-muted-foreground mt-2">{hotel.address}</p>
        </div>
        {hotel.rating && (
          <Badge variant="secondary" className="text-sm">
            Rating: {hotel.rating}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Gallery */}
          {hotel.images?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>
                  {hotel.images.length} photos available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {displayedImages.map((img) => (
                    <div 
                      key={img.id}
                      className="relative group cursor-pointer"
                      onClick={() => handleImageClick(img)}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_URL}/storage/${img.image_url}`}
                        alt={hotel.name}
                        className="w-full h-32 object-cover rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                      />
                      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg" />
                    </div>
                  ))}
                </div>
                
                {hotel.images.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAllImages(!showAllImages)}
                    >
                      {showAllImages ? 'Show Less' : `Show ${remainingImages} More Photos`}
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
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm">Phone Number</p>
                <p className="text-muted-foreground">{hotel.phone_number}</p>
              </div>
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-muted-foreground">{hotel.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          {hotel.facilities?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Facilities</CardTitle>
                <CardDescription>
                  {hotel.facilities.length} facilities available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {hotel.facilities.map((f) => (
                    <Badge key={f.id} variant="outline">
                      {f.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
          <div className="relative flex items-center justify-center">
            {selectedImage && (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/storage/${selectedImage.image_url}`}
                  alt={hotel.name}
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

// Skeleton Loading Component (tetap sama)
function HotelDetailSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-16" />
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
                  <Skeleton key={i} className="h-32 w-full" />
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}