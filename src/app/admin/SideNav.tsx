"use client";
import { SideNavItem } from "@/types/types";
import { SIDENAV_ITEMS } from "./constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/context/AuthProvider";
import ThemeToggler from "@/Components/Navbar/ThemeToggler";
import toast from "react-hot-toast";
import {
  IconChevronDown,
  IconChevronRight,
  IconHome,
  IconMenu,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const handleLogout = async () => {
    const res = axios.get("/api/auth/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: () => {
        router.push("/");
        return "Logged out successfully";
      },
      error: "Error logging out",
    });
  };
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return null;
  return (
    <>
      <div className="drawer lg:drawer-open max-h-screen">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Top Navigation */}
          <div className="navbar bg-base-100 border-b border-base-200/80 px-6 py-3">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <IconMenu className="h-6 w-6" />
              </label>
            </div>

            <div className="flex-1">
              <div className="hidden lg:flex items-center space-x-2 text-base-content/70">
                <Link href="/admin/dashboard" className="hover:text-primary transition-colors">
                  Home
                </Link>
                {pathSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <IconChevronRight className="w-4 h-4" />
                    <Link 
                      href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                      className="capitalize hover:text-primary transition-colors"
                    >
                      {segment.replace(/-/g, " ")}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
              
              <div className="lg:hidden flex items-center">
                <IconHome className="w-6 h-6 text-primary mr-2" />
                <span className="text-xl font-bold">
                  <span className="text-primary">Flat</span>
                  <span className="text-secondary">Finder</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggler />
              
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-lg cursor-pointer transition-colors"
                >
                  <Image
                    src={user.profilePicture}
                    alt="Avatar"
                    className="rounded-full"
                    width={32}
                    height={32}
                  />
                  <span className="hidden lg:block font-medium">{user.name}</span>
                  <IconChevronDown className="w-4 h-4" />
                </div>
                
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 w-56 p-2 shadow-lg rounded-box mt-2">
                  <li className="menu-title">
                    <span className="text-xs font-semibold uppercase text-base-content/50">Account</span>
                  </li>
                  <li>
                    <Link href="/admin/profile" className="gap-2">
                      <IconUser className="w-4 h-4" />
                      My Profile
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogout} className="text-error gap-2">
                      <IconLogout className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="overflow-y-auto h-[calc(100vh-4rem)] bg-base-100">
            <div className="max-w-[1600px] mx-auto lg:pl-10">
              <div className="w-full h-full">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Side Navigation */}
        <div className="drawer-side z-40">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <div className="menu bg-base-100 w-64 min-h-full border-r-[2px] border-base-200/80">
            {/* Logo */}
            <div className="p-4 border-b border-base-200/80">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconHome className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-bold">
                  <span className="text-primary">Flat</span>
                  <span className="text-secondary">Finder</span>
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col py-4">
              {SIDENAV_ITEMS.map((item, idx) => (
                <React.Fragment key={idx}>
                  <MenuItem item={item} />
                  {idx < SIDENAV_ITEMS.length - 1 && (
                    <div className="px-4">
                      <div className="h-px bg-base-200/80 my-2"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

  return (
    <div className="px-3">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-primary text-primary-content' 
                : 'hover:bg-base-200 text-base-content'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5">{item.icon}</div>
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            <IconChevronDown 
              className={`w-4 h-4 transition-transform ${subMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {subMenuOpen && (
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-base-200 pl-2">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block px-4 py-2 rounded-lg text-xs transition-colors ${
                    subItem.path === pathname
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-base-content/70 hover:bg-base-200'
                  }`}
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
            isActive 
              ? 'bg-primary text-primary-content' 
              : 'hover:bg-base-200 text-base-content'
          }`}
        >
          <div className="w-5 h-5">{item.icon}</div>
          <span className="font-medium text-sm">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
