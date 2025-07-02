"use client"; // Ensure this is client-side code

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import SearchDropdown from "./SearchDropdown";
import HydrationSafe from "./HydrationSafe";

interface Product {
  _id: string;
  title: string;
  description: string;
  media: string[];
  price: number;
  originalPrice: number;
  category: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Add scroll effect for all pages
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isLoaded && user && typeof window !== "undefined") {
      const key = `customer_created_${user.id}`;
      if (!localStorage.getItem(key)) {
        const email = user.emailAddresses?.[0]?.emailAddress || "";
        fetch("/api/users", {
          method: "GET",
          headers: {
            "x-user-email": email,
            "x-user-id": user.id, // Pass user ID in header
          },
        })
          .then((res) => {
            if (res.ok) {
              localStorage.setItem(key, "true");
              console.log("[Navbar] User creation/check succeeded.");
            } else {
              console.error("[Navbar] /api/users call failed:", res.status);
            }
          })
          .catch((err) => {
            console.error("[Navbar] API call failed:", err);
          });
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (dropdownMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dropdownMenu]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSearchDropdown(value.length >= 2);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
      setShowSearchDropdown(false);
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSelectProduct = (product: Product) => {
    setQuery("");
    setShowSearchDropdown(false);
  };

  const closeSearchDropdown = () => {
    setShowSearchDropdown(false);
  };

  return (
    <HydrationSafe
      fallback={
        <nav className="fixed top-0 left-0 w-full z-1000 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex-1 max-w-md mx-4">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </nav>
      }
    >
      <nav
        className={`${styles["sticky-navbar"]} ${
          isScrolled ? styles["scrolled"] : ""
        } transition-all duration-300 ease-in-out`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col xs:flex-row xs:items-center w-full xs:w-auto gap-2 xs:gap-0 items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Logo and Hamburger */}
          <div className="flex items-center justify-between w-full xs:w-auto">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={40}
                className={`transition-all duration-300 ${pathname === "/" && !isHovered ? "brightness-0 invert" : ""}`}
              />
            </Link>
            <Menu
              className={`cursor-pointer lg:hidden transition-colors block xs:hidden ${pathname === "/" && !isHovered ? "text-white" : "text-gray-700"}`}
              onClick={() => setDropdownMenu(!dropdownMenu)}
            />
          </div>
          {/* Navigation Links - Desktop */}
          {pathname !== "/" && (
            <div className="flex gap-6 text-base-bold max-lg:hidden">
              <Link
                href="/home"
                className={`hover:text-red-1 transition-colors ${
                  pathname === "/home" && "text-red-1"
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`hover:text-red-1 transition-colors ${
                  pathname === "/products" && "text-red-1"
                }`}
              >
                BestSellers
              </Link>
              <Link
                href={user ? "/wishlist" : "/sign-in"}
                className={`hover:text-red-1 transition-colors ${
                  pathname === "/wishlist" && "text-red-1"
                }`}
              >
                Wishlist
              </Link>
              <Link
                href={user ? "/orders" : "/sign-in"}
                className={`hover:text-red-1 transition-colors ${
                  pathname === "/orders" && "text-red-1"
                }`}
              >
                Orders
              </Link>
            </div>
          )}
          {/* Search Bar */}
          <div className="relative w-full xs:w-auto mt-2 xs:mt-0 flex-1 max-w-md mx-0 xs:mx-4">
            <div
              className={`flex gap-3 border px-3 py-2 items-center rounded-lg transition-all duration-300 ${
                pathname === "/" && !isHovered
                  ? "border-white/30 bg-white/10 backdrop-blur-sm"
                  : "border-gray-300 bg-white"
              }`}
            >
              <input
                className={`outline-none flex-1 bg-transparent transition-colors ${
                  pathname === "/" && !isHovered
                    ? "text-white placeholder-white/70"
                    : "text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Search products..."
                value={query}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                onFocus={() => query.length >= 2 && setShowSearchDropdown(true)}
              />
              <button
                disabled={query === ""}
                onClick={handleSearchSubmit}
                className="transition-colors"
              >
                <Search
                  className={`cursor-pointer h-4 w-4 ${
                    pathname === "/" && !isHovered
                      ? "text-white"
                      : "text-gray-600 hover:text-red-1"
                  }`}
                />
              </button>
            </div>
            <SearchDropdown
              query={query}
              isVisible={showSearchDropdown}
              onClose={closeSearchDropdown}
              onSelectProduct={handleSelectProduct}
            />
          </div>
          {/* Cart & User Menu */}
          <div className="relative flex gap-3 items-center">
            {pathname !== "/" && (
              <Link
                href="/cart"
                className="flex items-center gap-3 border rounded-lg px-3 py-2 hover:bg-black hover:text-white transition-all duration-300 max-md:hidden"
              >
                <ShoppingCart />
                <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
              </Link>
            )}
            {/* Mobile Menu */}
            {dropdownMenu && (
              <div className="fixed inset-0 z-50 flex items-start justify-end lg:hidden">
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn"
                  onClick={() => setDropdownMenu(false)}
                />
                {/* Menu */}
                <div className="relative w-4/5 max-w-xs h-full bg-white/95 backdrop-blur-md shadow-lg flex flex-col gap-4 p-6 animate-slideInRight">
                  <button
                    className="absolute top-4 right-4 p-2 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => setDropdownMenu(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <Link href="/" className="hover:text-red-1 transition-colors" onClick={() => setDropdownMenu(false)}>
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className={`hover:text-red-1 transition-colors ${pathname === "/products" && "text-red-1"}`}
                    onClick={() => setDropdownMenu(false)}
                  >
                    BestSellers
                  </Link>
                  <Link
                    href={user ? "/wishlist" : "/sign-in"}
                    className="hover:text-red-1 transition-colors"
                    onClick={() => setDropdownMenu(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    href={user ? "/orders" : "/sign-in"}
                    className="hover:text-red-1 transition-colors"
                    onClick={() => setDropdownMenu(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 border rounded-lg px-3 py-2 hover:bg-black hover:text-white transition-all duration-300"
                    onClick={() => setDropdownMenu(false)}
                  >
                    <ShoppingCart />
                    <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
                  </Link>
                </div>
              </div>
            )}
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : pathname !== "/" ? (
              <Link href="/sign-in">
                <CircleUserRound className="w-6 h-6 hover:text-red-1 transition-colors" />
              </Link>
            ) : (
              <Link href="/sign-in">
                <CircleUserRound
                  className={`w-6 h-6 transition-colors ${
                    isHovered
                      ? "text-gray-700 hover:text-red-1"
                      : "text-white hover:text-white/80"
                  }`}
                />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </HydrationSafe>
  );
};

export default Navbar;