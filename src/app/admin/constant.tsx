import {
  HomeIcon,
  ListIcon,
  UsersIcon,
  BellIcon,
  SettingsIcon,
  MessageSquareIcon,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: <UsersIcon width="24" height="24" />,
  },
  {
    title: "Manage Listings",
    path: "/admin/listings",
    icon: <ListIcon width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/admin/notifications",
    icon: <BellIcon width="24" height="24" />,
  },
];
