"use client"; // Ensure this is client-side code

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import SearchDropdown from "./SearchDropdown";

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
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Check if we're on the exact home page (not /home)
  const isHomePage = pathname === "/";

  // Add scroll effect for non-home pages
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) {
        setIsScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

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
    if (e.key === 'Enter') {
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
    <nav 
      className={`${styles["sticky-navbar"]} ${
        isHomePage 
          ? styles["home-page"]
          : isScrolled
            ? styles["scrolled"]
            : ""
      } transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="logo" 
            width={130} 
            height={100}
            className={`transition-all duration-300 ${
              isHomePage && !isHovered ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        {/* Navigation Links - Desktop */}
        {!isHomePage && (
          <div className="flex gap-6 text-base-bold max-lg:hidden">
            <Link href="/home" className={`hover:text-red-1 transition-colors ${pathname === "/home" && "text-red-1"}`}>
              Home
            </Link>
            <Link href={user ? "/wishlist" : "/sign-in"} className={`hover:text-red-1 transition-colors ${pathname === "/wishlist" && "text-red-1"}`}>
              Wishlist
            </Link>
            <Link href={user ? "/orders" : "/sign-in"} className={`hover:text-red-1 transition-colors ${pathname === "/orders" && "text-red-1"}`}>
              Orders
            </Link>
            <Link href="/about-us" className={`hover:text-red-1 transition-colors ${pathname === "/about-us" && "text-red-1"}`}>
              About Us
            </Link>
          </div>
        )}

        {/* Search Bar with Dropdown */}
        <div className="relative flex-1 max-w-md mx-4">
          <div className={`flex gap-3 border px-3 py-2 items-center rounded-lg transition-all duration-300 ${
            isHomePage && !isHovered 
              ? "border-white/30 bg-white/10 backdrop-blur-sm" 
              : "border-gray-300 bg-white"
          }`}>
            <input
              className={`outline-none flex-1 bg-transparent transition-colors ${
                isHomePage && !isHovered 
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
              <Search className={`cursor-pointer h-4 w-4 ${
                isHomePage && !isHovered 
                  ? "text-white" 
                  : "text-gray-600 hover:text-red-1"
              }`} />
            </button>
          </div>

          {/* Search Dropdown */}
          <SearchDropdown
            query={query}
            isVisible={showSearchDropdown}
            onClose={closeSearchDropdown}
            onSelectProduct={handleSelectProduct}
          />
        </div>

        {/* Cart & User Menu */}
        <div className="relative flex gap-3 items-center">
          {!isHomePage && (
            <Link 
              href="/cart" 
              className="flex items-center gap-3 border rounded-lg px-3 py-2 hover:bg-black hover:text-white transition-all duration-300 max-md:hidden"
            >
              <ShoppingCart />
              <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
            </Link>
          )}

          {/* Mobile Menu */}
          <Menu 
            className={`cursor-pointer lg:hidden transition-colors ${
              isHomePage && !isHovered ? "text-white" : "text-gray-700"
            }`} 
            onClick={() => setDropdownMenu(!dropdownMenu)} 
          />

          {dropdownMenu && (
            <div className="absolute top-12 right-5 flex flex-col gap-4 p-4 rounded-lg border bg-white/95 backdrop-blur-md shadow-lg text-base-bold lg:hidden z-50">
              <Link href="/" className="hover:text-red-1 transition-colors">Home</Link>
              <Link href={user ? "/wishlist" : "/sign-in"} className="hover:text-red-1 transition-colors">Wishlist</Link>
              <Link href={user ? "/orders" : "/sign-in"} className="hover:text-red-1 transition-colors">Orders</Link>
              <Link href="/about-us" className="hover:text-red-1 transition-colors">About Us</Link>
              <Link href="/cart" className="flex items-center gap-3 border rounded-lg px-3 py-2 hover:bg-black hover:text-white transition-all duration-300">
                <ShoppingCart />
                <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
              </Link>
            </div>
          )}

          {user ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : !isHomePage ? (
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
  );
};

export default Navbar;
