"use client";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import SignIn from "../Dialogs/SignIn";
import Image from "next/image";
import SignUp from "../Dialogs/SignUp";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <>
      <div className="navbar bg-base-100 px-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <Menu size={24} />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {[
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Services", path: "/services" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-base-content text-base hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/"
            className="text-2xl font-bold flex items-center px-4 py-2 rounded-lg hover:bg-base-200 transition-colors duration-300"
          >
            <Image
              src="/img/icon-deal.png"
              width={56}
              height={56}
              alt="logo"
              className="mx-4"
            />{" "}
            <div className="flex flex-col items-start gap-1 w-48">
              <div className="flex items-baseline gap-[2px]">
                <span className="text-primary font-extrabold text-xl">
                  Flat
                </span>
                <span className="text-accent font-semibold text-xl">
                  Finder
                </span>
              </div>
              <hr className="w-full border border-base-content" />
              <span className="text-sm text-base-content/70 italic">
                जहाँ सपना, वहाँ अपना!
              </span>
            </div>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {[
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Services", path: "/services" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="text-base-content text-base hover:text-primary hidden lg:block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end space-x-3">
          {[
            { name: "Sign In", link: "/signin", color: "btn-secondary" },
            { name: "Sign Up", link: "/signup", color: "btn-accent" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className={`btn ${item.color} hidden lg:flex items-center justify-center`}
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggler />
        </div>
      </div>
    </>
  );
};

export default Header;
