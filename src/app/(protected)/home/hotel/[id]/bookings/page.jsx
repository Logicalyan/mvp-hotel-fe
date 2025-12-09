// "use client";

// import React, { useState, useEffect } from "react";
// import { getRoomTypeDetail } from "@/lib/services/room-type";
// import RoomTypeGallery from "@/components/room-types/RoomTypeGallery";
// import RoomTypeInfo from "@/components/room-types/RoomTypeInfo";
// import RoomTypeTabs from "@/components/room-types/RoomTypeTabs";
// import BookingCard from "@/components/room-types/BookingCard";
// import BookingModal from "@/components/room-types/BookingModal";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function RoomTypeDetail({ params }) {
//   const { id } = React.use(params);
//   const [roomType, setRoomType] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isBookingOpen, setIsBookingOpen] = useState(false);

//   useEffect(() => {
//     const fetchRoomType = async () => {
//       try {
//         const data = await getRoomTypeDetail(id);
//         setRoomType(data);
//       } catch (err) {
//         console.error("Failed to fetch room type:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRoomType();
//   }, [id]);

//   const openBooking = () => {
//     setIsBookingOpen(true);
//   };

//   if (loading) {
//     return <RoomTypeDetailSkeleton />;
//   }

//   if (!roomType) {
//     return (
//       <div className="min-h-[60vh] flex flex-col items-center justify-center">
//         <h2 className="text-2xl font-bold text-gray-700 mb-2">Tipe Kamar Tidak Ditemukan</h2>
//         <p className="text-gray-500">Tipe kamar yang Anda cari tidak tersedia.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Room Type Gallery */}
//             <RoomTypeGallery 
//               images={roomType.images} 
//               roomTypeName={roomType.name} 
//             />

//             {/* Room Type Information */}
//             <RoomTypeInfo roomType={roomType} />

//             {/* Room Type Details Tabs */}
//             <RoomTypeTabs roomType={roomType} />
//           </div>

//           {/* Sidebar - Booking Card */}
//           <div className="lg:col-span-1">
//             <BookingCard 
//               roomType={roomType}
//               hotel={roomType.hotel}
//               onBook={openBooking}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       <BookingModal
//         isOpen={isBookingOpen}
//         onClose={() => setIsBookingOpen(false)}
//         roomType={roomType}
//         hotel={roomType.hotel}
//       />
//     </>
//   );
// }

// // Skeleton Loader Component
// function RoomTypeDetailSkeleton() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <Skeleton className="h-96 w-full rounded-2xl mb-8" />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-8">
//           <div className="space-y-4">
//             <Skeleton className="h-10 w-3/4" />
//             <Skeleton className="h-6 w-64" />
//             <Skeleton className="h-32 w-full" />
//           </div>
//           <Skeleton className="h-64 w-full" />
//         </div>
//         <div className="lg:col-span-1">
//           <Skeleton className="h-96 rounded-2xl" />
//         </div>
//       </div>
//     </div>
//   );
// }