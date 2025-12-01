import { Command, FolderKanban, Hotel, UserRoundCog } from "lucide-react";

export default [
  {
    title: "Dashboard",
    icon: Command,
    url: "/dashboard",
  },
  {
    title: "Management",
    icon: FolderKanban,
    items: [
      {
        title: "Users",
        icon: UserRoundCog,
        url: "/dashboard/users",
      },
      {
        icon: Hotel,
        title: "Hotels",
        url: "/dashboard/hotels",
      }
    ],
  },
];
