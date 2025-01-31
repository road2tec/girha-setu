"use client";
import { SideNavItem } from "@/types/types";
import { SIDENAV_ITEMS } from "./constant";
import {
  AlignJustify,
  ChevronDown,
  ChevronRight,
  Home,
  Route,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ThemeToggler from "@/Components/Navbar/ThemeToggler";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    router.push("/login");
  };

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  if (!user) return null;
  console.log(user);
  return (
    <>
      <div className="drawer lg:drawer-open max-h-screen">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="navbar justify-between bg-base-300 w-full pl-10">
            <div className="lg:flex items-center justify-end space-x-2 hidden text-base-content">
              <span className="text-base font-semibold">Home</span>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-sm">
                    <ChevronRight />
                  </span>
                  <Link href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                    <span className="text-base capitalize hover:text-primary transition">
                      {segment.replace(/-/g, " ")}
                    </span>
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <AlignJustify className="h-6 w-6" />
              </label>
            </div>

            <div className="flex-1 justify-between lg:hidden px-2">
              <h1 className="text-xl font-bold text-base-content">
                FlatFinder
              </h1>
              <ThemeToggler />
            </div>

            <div className="hidden lg:block">
              <ul className="menu menu-horizontal">
                <ThemeToggler />
                <div className="flex items-center gap-4 bg-transparent">
                  <div className="dropdown dropdown-left cursor-pointer bg-transparent">
                    <div tabIndex={0} role="button" className="btn m-1 w-full">
                      <Image
                        src={user.profilePicture}
                        alt="Avatar"
                        className="h-12 w-12"
                        width={48}
                        height={48}
                      />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-72 p-2 shadow"
                    >
                      {/* User Initial */}
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary text-base-conten rounded-full text-xl font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {user.email}
                        </span>
                      </div>
                      <hr className="my-2 border-base-content" />
                      <div className="flex flex-col">
                        <button
                          onClick={() => router.push("/account")}
                          className="text-left px-4 py-2 text-base text-dark hover:bg-base-200 transition duration-200"
                        >
                          My Account
                        </button>
                        <button
                          onClick={() => router.push("/profile")}
                          className="text-left px-4 py-2 text-base text-dark hover:bg-base-200 transition duration-200"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="text-left px-4 py-2 text-base text-dark hover:bg-base-200 transition duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div>
            {" "}
            <div className="flex flex-1">
              <main className="flex-1 overflow-y-auto relative max-h-screen">
                <div className="relative">
                  <main className="overflow-x-auto">{children}</main>
                </div>
              </main>
            </div>
          </div>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            className="drawer-overlay"
            aria-label="close sidebar"
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <Link
              href={`/${user.role}/dashboard`}
              className="flex h-16 w-full flex-row items-center justify-center space-x-3 border-b border-base-content md:justify-start md:px-6"
            >
              <span className="h-7 w-7 rounded-lg bg-base-200">
                <Home size={28} />
              </span>
              <span className="text-xl font-bold text-base-content">
                FlatFinder
              </span>
            </Link>
            <div className="flex flex-col space-y-2 mt-10 md:px-6">
              {SIDENAV_ITEMS.map((item, idx) => (
                <MenuItem key={idx} item={item} />
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

  const baseClasses =
    "flex w-full flex-row items-center justify-between rounded-lg p-2 hover:bg-accent";
  const activeClasses = "bg-base-300 text-base-content";
  const inactiveClasses =
    "text-base-content hover:text-base-content hover:bg-base-100";

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`${baseClasses} ${
              pathname.includes(item.path) ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex flex-row items-center space-x-4 text-base-content">
              {item.icon}
              <span className="text-lg font-medium">{item.title}</span>
            </div>

            <div
              className={`transition-transform ${
                subMenuOpen ? "rotate-180" : ""
              } flex`}
            >
              <ChevronDown width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-4 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block rounded-lg p-2 text-base ${
                    subItem.path === pathname
                      ? "font-semibold text-base-content"
                      : "text-base-content/2"
                  } hover:bg-accent`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row items-center space-x-4 rounded-lg p-2 ${
            item.path === pathname ? activeClasses : inactiveClasses
          }`}
        >
          {item.icon}
          <span className="text-lg font-medium">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
