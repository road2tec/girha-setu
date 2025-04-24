import { SideNavItem } from "@/types/types";
import {
  IconBell,
  IconBookmark,
  IconFlagQuestion,
  IconHeart,
  IconHome,
  IconList,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/buyer/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Browse Listings",
    path: "/buyer/listings",
    icon: <IconList width="24" height="24" />,
  },
  {
    title: "My Bookings",
    path: "/buyer/bookings",
    icon: <IconBookmark width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/buyer/messages",
    icon: <IconMessageCircle width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/buyer/notifications",
    icon: <IconBell width="24" height="24" />,
  },
  {
    title: "FAQ",
    path: "/buyer/faq",
    icon: <IconFlagQuestion width="24" height="24" />,
  },
];
