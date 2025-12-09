"use client";

import { useState } from "react";
import { Maximize2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RoomTypeGallery({ images = [], roomTypeName = "Tipe" }) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pastikan images selalu array
  const imageList = Array.isArray(images) ? images : [];
  const hasImages = imageList.length > 0;   

  // Format URL gambar
  const getImageUrl = (imageUrl) => {
    return imageUrl
      ? `${process.env.NEXT_PUBLIC_URL || ""}/storage/${imageUrl}`
      : "/placeholder-hotel.jpg";
  };

  // Generate slides untuk lightbox
  const slides = imageList.map((img) => ({
    src: getImageUrl(img.image_url),
    alt: `${roomTypeName} - Image ${img.id}`,
  }));

  // Navigasi gambar
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Jika tidak ada gambar, tampilkan placeholder
  if (!hasImages || imageList.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-1">Belum Ada Foto Room Type</p>
            <p className="text-gray-400 text-sm">Foto akan tersedia segera</p>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = slides[0];
  const thumbnailImages = slides.slice(1, 5);
  const hasMoreImages = slides.length > 5;

  return (
    <>
      {/* Gallery Container */}
      <div className="space-y-4 mb-8">
        {/* Main Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Image */}
          <div
            className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setCurrentIndex(0);
              setOpen(true);
            }}
          >
            <img
              src={mainImage.src}
              alt={mainImage.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6">
                <p className="text-white text-lg font-semibold">Lihat Semua Foto</p>
                <p className="text-white/80 text-sm">{slides.length} foto tersedia</p>
              </div>
              
              {/* View All Button */}
              <div className="absolute top-6 right-6">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white backdrop-blur-sm"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Lihat Semua
                </Button>
              </div>
            </div>
          </div>

          {/* Thumbnails Grid */}
          <div className="grid grid-cols-2 gap-4">
            {thumbnailImages.map((slide, index) => (
              <div
                key={index}
                className="relative h-[190px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentIndex(index + 1);
                  setOpen(true);
                }}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Overlay for last thumbnail if there are more images */}
                {index === 3 && hasMoreImages && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold mb-1">
                        +{slides.length - 5}
                      </p>
                      <p className="text-white/80 text-sm">Foto Lainnya</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image Counter & Navigation Dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setOpen(true);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === 0 
                      ? "bg-blue-600 w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {slides.length} foto
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            Lihat semua foto
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Custom Lightbox Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 z-10 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 p-3 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10 p-3 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-6">
            <img
              src={slides[currentIndex].src}
              alt={slides[currentIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
            <span className="font-medium">
              {currentIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Thumbnails Strip */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 px-6">
              <div className="flex justify-center gap-2 overflow-x-auto py-2">
                {slides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                      currentIndex === idx
                        ? "border-white scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    )}
                  >
                    <img
                      src={slide.src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}