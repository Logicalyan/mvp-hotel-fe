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
                        { title: "Hotel Profile", url: `/hotel/${hotelId}/profile` },
                        { title: "Hotel Facilities", url: `/hotel/${hotelId}/facilities` },
                    ],
                },
                {
                    icon: BedSingle,
                    title: "Rooms",
                    items: [
                        { title: "Room Type", url: `/hotel/${hotelId}/rooms/types` },
                        { title: "Room Price", url: `/hotel/${hotelId}/rooms/prices` },
                        { title: "Room Facility", url: `/hotel/${hotelId}/rooms/facilities` },
                    ],
                },
                { icon: BookOpen, title: "Reservations", url: `/hotel/${hotelId}/reservations` },
            ],
        },
    ];
}
