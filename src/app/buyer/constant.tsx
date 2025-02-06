import {
  HomeIcon,
  ListIcon,
  HeartIcon,
  BellIcon,
  MessageSquareIcon,
  SettingsIcon,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/buyer/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Browse Listings",
    path: "/buyer/listings",
    icon: <ListIcon width="24" height="24" />,
  },
  {
    title: "Saved Listings",
    path: "/buyer/wishlist",
    icon: <HeartIcon width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/buyer/messages",
    icon: <MessageSquareIcon width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/buyer/notifications",
    icon: <BellIcon width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/buyer/settings",
    icon: <SettingsIcon width="24" height="24" />,
  },
];
