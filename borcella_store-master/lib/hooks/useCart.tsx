import { create } from "zustand";
import { toast } from "sonner";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string) => void;
  increaseQuantity: (idToIncrease: string) => void;
  decreaseQuantity: (idToDecrease: string) => void;
  clearCart: () => void;
  validateStock: (itemId: string, quantity: number) => Promise<boolean>;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems;
        const isExisting = currentItems.find(
          (cartItem) => cartItem.item._id === item._id && cartItem.size === size && cartItem.color === color
        );
        if (isExisting) {
          toast.error("Item already in cart", {
            description: `${item.title} is already in your cart.`
          });
          return;
        }
        if (!item.isAvailable || item.quantity === 0) {
          toast.error("Item not available", {
            description: `${item.title} is currently out of stock.`
          });
          return;
        }
        if (quantity > item.quantity) {
          toast.error("Quantity not available", {
            description: `Only ${item.quantity} items available in stock.`
          });
          return;
        }
        const newCart = [...currentItems, { item, quantity, color, size }];
        set({ cartItems: newCart });
        toast.success("Item added to cart", { 
          description: `${item.title} has been added to your cart.`
        });
      },
      removeItem: (idToRemove: string) => {
        const currentItems = get().cartItems;
        const itemToRemove = currentItems.find(item => item.item._id === idToRemove);
        const newCartItems = currentItems.filter(
          (cartItem) => cartItem.item._id !== idToRemove
        );
        set({ cartItems: newCartItems });
        if (itemToRemove) {
          toast.success("Item removed from cart", {
            description: `${itemToRemove.item.title} has been removed from your cart.`
          });
        }
      },
      increaseQuantity: (idToIncrease: string) => {
        const currentItems = get().cartItems;
        const itemToIncrease = currentItems.find(item => item.item._id === idToIncrease);
        if (!itemToIncrease) return;
        if (itemToIncrease.quantity >= itemToIncrease.item.quantity) {
          toast.error("Maximum quantity reached", {
            description: `Only ${itemToIncrease.item.quantity} items available in stock.`
          });
          return;
        }
        const newCartItems = currentItems.map((cartItem) =>
          cartItem.item._id === idToIncrease
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
      },
      decreaseQuantity: (idToDecrease: string) => {
        const currentItems = get().cartItems;
        const newCartItems = currentItems.map((cartItem) =>
          cartItem.item._id === idToDecrease
            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
            : cartItem
        );
        set({ cartItems: newCartItems });
      },
      clearCart: () => {
        set({ cartItems: [] });
        toast.success("Cart cleared", {
          description: "All items have been removed from your cart."
        });
      },
      validateStock: async (itemId: string, quantity: number) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validationstock`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              itemId,
              quantity
            }),
          });
          if (!response.ok) {
            return false;
          }
          const data = await response.json();
          return data.isAvailable;
        } catch (error) {
          console.error("Stock validation error:", error);
          return false;
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Custom hook for user/session logic and cart syncing
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { trackCartSession } from "@/lib/actions/cartTracking";

export function useCartWithUser() {
  const cart = useCart();
  const { user, isLoaded: isUserLoaded } = useUser();

  // Helper to get user info
  const getUserInfo = () => {
    if (!user) return { userId: '', userEmail: '', userName: '' };
    return {
      userId: user.id,
      userEmail: user.emailAddresses?.[0]?.emailAddress || '',
      userName: (user.firstName || '') + (user.lastName ? ' ' + user.lastName : '')
    };
  };

  // Merge two cart arrays (avoid duplicates by productId, sum quantities)
  const mergeCarts = (cartA: CartItem[], cartB: CartItem[]): CartItem[] => {
    const merged = [...cartA];
    cartB.forEach((itemB: CartItem) => {
      const idx = merged.findIndex(itemA => itemA.item._id === itemB.item._id && itemA.size === itemB.size && itemA.color === itemB.color);
      if (idx > -1) {
        merged[idx].quantity += itemB.quantity;
      } else {
        merged.push(itemB);
      }
    });
    return merged;
  };

  useEffect(() => {
    if (isUserLoaded && user) {
      fetch(`/api/cart-tracking`, { method: 'GET' })
        .then(res => res.json())
        .then(async data => {
          const backendCart = (data.sessions && data.sessions.length > 0) ? data.sessions[0].cartItems || [] : [];
          const localCart = cart.cartItems || [];
          console.log("[useCartWithUser] Local cart before merge:", localCart);
          console.log("[useCartWithUser] Backend cart:", backendCart);
          let mergedCart = backendCart;
          if (localCart.length > 0) {
            mergedCart = mergeCarts(backendCart, localCart);
            const { userId, userEmail, userName } = getUserInfo();
            console.log("[useCartWithUser] Merging carts for user:", userId, userEmail, userName);
            await trackCartSession({
              action: 'create_session',
              cartItems: mergedCart,
              userEmail,
              userName
            });
          }
          console.log("[useCartWithUser] Cart after merge:", mergedCart);
          cart.cartItems = mergedCart;
        });
    }
  }, [isUserLoaded, user]);

  // Optionally, you can wrap addItem/removeItem/etc. to sync with backend here
  return cart;
}

export default useCart;

