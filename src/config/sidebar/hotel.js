import { Command, FolderKanban, Building, BedSingle, BookOpen } from "lucide-react";

export default function hotelNav(hotelId) {
    return [
        {
            title: "Dashboard",
            icon: Command,
            url: `/hotel/dashboard/${hotelId}`,
        },
        {
            title: "Management",
            icon: FolderKanban,
            items: [
                {
                    icon: Building,
                    title: "Hotel Info",
                    items: [
                        { title: "Hotel Profile", url: `/hotel/dashboard/${hotelId}/profiles` },
                        { title: "Hotel Facilities", url: `/hotel/dashboard/${hotelId}/facilities` },
                    ],
                },
                {
                    icon: BedSingle,
                    title: "Rooms",
                    items: [
                        { title: "Room Type", url: `/hotel/dashboard/${hotelId}/room-types` },
                        { title: "Bed Type", url: `/hotel/dashboard/${hotelId}/bed-types` },
                        { title: "Room Facility", url: `/hotel/dashboard/${hotelId}/room-facilities` },
                    ],
                },
                { icon: BookOpen, title: "Reservations", url: `/hotel/dashboard/${hotelId}/reservations` },
            ],
        },
    ];
}
