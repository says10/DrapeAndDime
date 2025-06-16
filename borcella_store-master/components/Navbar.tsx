"use client"; // Ensure this is client-side code

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");

  const isHomePage = pathname === "/";

  return (
    <div className={`${styles["sticky-navbar"]} flex items-center justify-between px-4 py-2 bg-white shadow-sm`}>
      <div className={styles["sticky-navbar-trigger"]} />

      {/* Logo */}
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={130} height={100} />
      </Link>

      {!isHomePage && (
        <div className="flex gap-4 text-base-bold max-lg:hidden">
          <Link href="/home" className={`hover:text-red-1 ${pathname === "/home" && "text-red-1"}`}>Home</Link>
          <Link href={user ? "/wishlist" : "/sign-in"} className={`hover:text-red-1 ${pathname === "/wishlist" && "text-red-1"}`}>Wishlist</Link>
          <Link href={user ? "/orders" : "/sign-in"} className={`hover:text-red-1 ${pathname === "/orders" && "text-red-1"}`}>Orders</Link>
          <Link href="/about-us" className={`hover:text-red-1 ${pathname === "/about-us" && "text-red-1"}`}>About Us</Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
        <input
          className="outline-none max-sm:max-w-[120px]"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button disabled={query === ""} onClick={() => router.push(`/search/${query}`)}>
          <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
        </button>
      </div>

      {/* Cart & User Menu */}
      <div className="relative flex gap-3 items-center">
        {!isHomePage && (
          <Link href="/cart" className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white max-md:hidden">
            <ShoppingCart />
            <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
          </Link>
        )}

        {/* Mobile Menu */}
        <Menu className="cursor-pointer lg:hidden" onClick={() => setDropdownMenu(!dropdownMenu)} />

        {dropdownMenu && (
          <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden">
            <Link href="/" className="hover:text-red-1">Home</Link>
            <Link href={user ? "/wishlist" : "/sign-in"} className="hover:text-red-1">Wishlist</Link>
            <Link href={user ? "/orders" : "/sign-in"} className="hover:text-red-1">Orders</Link>
            <Link href="/about-us" className="hover:text-red-1">About Us</Link>
            <Link href="/cart" className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white">
              <ShoppingCart />
              <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
            </Link>
          </div>
        )}

        {user ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : !isHomePage ? (
          <Link href="/sign-in">
            <CircleUserRound className="w-6 h-6 hover:text-red-1" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
