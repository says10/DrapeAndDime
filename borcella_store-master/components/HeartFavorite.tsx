"use client"

import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HydrationSafe from "./HydrationSafe";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setIsLiked(data.wishlist.includes(product._id));
      setLoading(false);
    } catch (err) {
      console.log("[users_GET]", err);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/sign-in");
        return;
      } else {
        const res = await fetch("/api/users/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: product._id }),
        });
        const updatedUser = await res.json();
        setIsLiked(updatedUser.wishlist.includes(product._id));
        updateSignedInUser && updateSignedInUser(updatedUser);
      }
    } catch (err) {
      console.log("[wishlist_POST]", err);
    }
  };

  return (
    <HydrationSafe fallback={
      <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
    }>
      <button 
        onClick={handleLike}
        className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-200 ${
            isLiked 
              ? "fill-red-500 text-red-500" 
              : "fill-transparent text-gray-600 hover:text-red-500"
          }`}
        />
      </button>
    </HydrationSafe>
  );
};

export default HeartFavorite;
