import {
  HomeIcon,
  ListIcon,
  BellIcon,
  MessageSquareIcon,
  PlusSquareIcon,
  SettingsIcon,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/owner/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "My Listings",
    path: "/owner/listings",
    icon: <ListIcon width="24" height="24" />,
  },
  {
    title: "Add New Listing",
    path: "/owner/add-listing",
    icon: <PlusSquareIcon width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/owner/messages",
    icon: <MessageSquareIcon width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/owner/notifications",
    icon: <BellIcon width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/owner/settings",
    icon: <SettingsIcon width="24" height="24" />,
  },
];
