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
        {/* MOBILE & DESKTOP NAVBAR ROW */}
        <div className="flex items-center w-full justify-between px-4 py-3 max-w-7xl mx-auto gap-2">
          {/* Logo and Hamburger */}
          <div className="flex items-center gap-2 min-w-0">
            <Menu
              className={`cursor-pointer lg:hidden transition-colors block sm:hidden ${pathname === "/" ? "text-white" : "text-gray-700"}`}
              onClick={() => setDropdownMenu(!dropdownMenu)}
            />
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={90}
                height={36}
                className="transition-all duration-300 min-w-[70px]"
              />
            </Link>
          </div>
          {/* Search Bar - always in row, compact on mobile */}
          <div className="flex-1 mx-2 max-w-xs min-w-0">
            <div
              className={`flex gap-2 border px-2 py-1 items-center rounded-lg transition-all duration-300 ${
                pathname === "/"
                  ? "border-white/30 bg-white/10 backdrop-blur-sm"
                  : "border-gray-300 bg-white"
              }`}
            >
              <input
                className={`outline-none flex-1 bg-transparent text-sm transition-colors min-w-0 ${
                  pathname === "/"
                    ? "text-white placeholder-white/70"
                    : "text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Search..."
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
                    pathname === "/"
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
          {/* Cart & User Menu - always in row */}
          <div className="flex items-center gap-2 min-w-0">
            {pathname !== "/" && (
              <Link
                href="/cart"
                className="flex items-center gap-2 border rounded-lg px-2 py-1 hover:bg-black hover:text-white transition-all duration-300 max-md:hidden text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cart.cartItems.length})</span>
              </Link>
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
        {/* Desktop Navigation Links (hidden on mobile) */}
        <div className={`flex gap-6 text-base-bold max-lg:hidden ${pathname === "/" ? "text-white drop-shadow" : ""} px-4 max-w-7xl mx-auto w-full mt-2`}>
          <Link
            href="/home"
            className={`hover:text-red-1 transition-colors ${
              pathname === "/home" ? "text-red-1" : pathname === "/" ? "hover:text-red-1 text-white" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`hover:text-red-1 transition-colors ${
              pathname === "/products" ? "text-red-1" : pathname === "/" ? "hover:text-red-1 text-white" : ""
            }`}
          >
            BestSellers
          </Link>
          <Link
            href={user ? "/wishlist" : "/sign-in"}
            className={`hover:text-red-1 transition-colors ${
              pathname === "/wishlist" ? "text-red-1" : pathname === "/" ? "hover:text-red-1 text-white" : ""
            }`}
          >
            Wishlist
          </Link>
          <Link
            href={user ? "/orders" : "/sign-in"}
            className={`hover:text-red-1 transition-colors ${
              pathname === "/orders" ? "text-red-1" : pathname === "/" ? "hover:text-red-1 text-white" : ""
            }`}
          >
            Orders
          </Link>
        </div>
        {/* Mobile Dropdown Menu (unchanged) */}
        {dropdownMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn"
              onClick={() => setDropdownMenu(false)}
            />
            {/* Menu */}
            <div className="relative w-11/12 max-w-sm h-[90vh] bg-white rounded-xl border border-gray-200 shadow-2xl flex flex-col py-8 px-6 space-y-4 animate-slideInRight overflow-y-auto">
              <button
                className="absolute top-4 right-4 p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow"
                onClick={() => setDropdownMenu(false)}
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
              <Link href="/" className="block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition" onClick={() => setDropdownMenu(false)}>
                Home
              </Link>
              <Link
                href="/products"
                className={`block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition ${pathname === "/products" ? "text-red-500" : ""}`}
                onClick={() => setDropdownMenu(false)}
              >
                BestSellers
              </Link>
              <Link
                href={user ? "/wishlist" : "/sign-in"}
                className="block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setDropdownMenu(false)}
              >
                Wishlist
              </Link>
              <Link
                href={user ? "/orders" : "/sign-in"}
                className="block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setDropdownMenu(false)}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-3 bg-gray-900 text-white text-lg font-semibold py-3 px-4 rounded-lg mt-4 hover:bg-gray-800 transition"
                onClick={() => setDropdownMenu(false)}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>Cart ({cart.cartItems.length})</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </HydrationSafe>
  );
};

export default Navbar;