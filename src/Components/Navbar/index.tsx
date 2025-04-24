"use client";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";
import ThemeToggler from "./ThemeToggler";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/services", label: "Services" },
  ];

  return (
    <nav className=" z-50 bg-base-300/80 backdrop-blur-lg border-b border-base-content/10">
      <div className="container mx-auto">
        <div className="navbar px-4 sm:px-6">
          {/* Logo Section */}
          <div className="navbar-start">
            <Link
              href="/"
              className="flex items-center gap-4 px-2 py-1 rounded-lg hover:bg-base-200 transition-colors duration-300"
            >
              <div className="w-12 h-12 relative">
                <Image
                  src="/img/icon-deal.png"
                  fill
                  alt="Flat Finder Logo"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-baseline gap-[2px]">
                  <span className="text-primary font-extrabold text-xl">Flat</span>
                  <span className="text-accent font-semibold text-xl">Finder</span>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-primary to-accent"></div>
                <span className="text-xs text-base-content/70 italic">
                  जहाँ सपना, वहाँ अपना!
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-lg text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden btn btn-ghost btn-circle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <IconX className="w-6 h-6" />
            ) : (
              <IconMenu2 className="w-6 h-6" />
            )}
          </button>

          {/* Auth Buttons & Theme Toggle */}
          <div className="navbar-end gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                href="/login" 
                className="btn btn-accent btn-sm"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="btn btn-accent btn-outline btn-sm"
              >
                Sign Up
              </Link>
            </div>
            <ThemeToggler />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-base-content/10">
            <ul className="py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-6 py-3 text-base-content/70 hover:text-base-content hover:bg-base-200 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="sm:hidden flex flex-col gap-2 p-4">
                <Link 
                  href="/login" 
                  className="btn btn-accent btn-sm w-full"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="btn btn-accent btn-outline btn-sm w-full"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
