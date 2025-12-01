import { Command, FolderKanban, UserRoundCog } from "lucide-react";

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
        title: "Hotels",
        url: "/dashboard/hotels",
      }
    ],
  },
];
