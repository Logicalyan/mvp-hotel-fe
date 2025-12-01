"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  ChevronRight,
  PlayCircle,
  BedSingle,
  School,
  FolderKanban,
  CircuitBoard,
  UserRoundCog,
  Building,
  BedIcon
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { getSidebar } from "@/config/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Hotel Loop",
      logo: GalleryVerticalEnd,
      plan: "Reservation Hotel",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      icon: Command
    },
    {
      title: "Management",
      url: "#",
      icon: FolderKanban,
      isActive: true,
      items: [
        {
          icon: Building,
          title: "Hotels",
          url: "#",
          items: [
            {
              title: "Hotel Manage",
              url: "/dashboard/hotels",
            },
            {
              title: "Hotel Facilities",
              url: "/dashboard/hotel-facilities",
            },
          ]
        },
        {
          icon: BedIcon,
          title: "Beds",
          url: "#",
          items: [
            {
              title: "Bed Type",
              url: "/dashboard/bed-types",
            },
          ]
        },
        {
          icon: BedSingle,
          title: "Rooms",
          url: "#",
          items: [
            {
              title: "Room Type",
              url: "/rooms",
            },
            {
              title: "Room Price",
              url: "/room-prices",
            },
            {
              title: "Room Facility",
              url: "/room-facilities",
            },
            {
              title: "Bookings",
              url: "/bookings"
            }
          ]
        },
        {
          icon: UserRoundCog,
          title: "Users",
          url: "/dashboard/users",
        },
      ],
    },
    {
      title: "Reports",
      icon: Command
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

// NavMain component dengan tree functionality
function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Feature</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <NavMenuItem key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// Recursive NavMenuItem component - mirip dengan Tree component
function NavMenuItem({ item }) {
  const hasItems = item.items && item.items.length > 0

  if (!hasItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={item.isActive}>
          <a href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90"
        defaultOpen={item.isActive || item.title === "Hotels Management"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="transition-transform" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <NavMenuItem key={subItem.title} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function AppSidebar(props) {
  const {role, hotelId} = useAuth();

  const menu = getSidebar(role, hotelId);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>

        <NavMain items={menu} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}