import { create } from "zustand";
import { toast } from "sonner";
import { persist, createJSONStorage } from "zustand/middleware";
import { useState } from "react";

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
          // Stock validation error
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
import { useEffect, useRef } from "react";
import { trackCartSession } from "@/lib/actions/cartTracking";

export function useCartWithUser() {
  const cart = useCart();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [cartClearing, setCartClearing] = useState(false);

  // Helper to get user info
  const getUserInfo = () => {
    if (!user) return { userId: '', userEmail: '', userName: '' };
    return {
      userId: user.id,
      userEmail: Array.isArray(user.emailAddresses) && user.emailAddresses.length > 0 ? user.emailAddresses[0].emailAddress : '',
      userName: (user.firstName || '') + (user.lastName ? ' ' + user.lastName : '')
    };
  };

  // Backend sync logic for all cart actions
  const syncBackend = async (action: string, cartItems?: CartItem[]) => {
    if (!user || cartClearing) {
      // [Cart Sync] No user or cart is clearing, skipping backend sync
      return;
    }
    const { userEmail, userName } = getUserInfo();
    try {
      if (action === 'clear_session') {
        // [Cart Sync] Clearing session
        await trackCartSession({ action });
        // [Cart Sync] Session cleared
      } else {
        // [Cart Sync] Updating session with cartItems
        await trackCartSession({ action: 'update_session', cartItems: cartItems || cart.cartItems, userEmail, userName });
        // [Cart Sync] Session updated
      }
    } catch (err) {
      // [Cart Sync] Backend sync failed
    }
  };

  // Robust: clear backend session when cart becomes empty
  const prevCartLength = useRef(cart.cartItems.length);
  useEffect(() => {
    if (prevCartLength.current > 0 && cart.cartItems.length === 0) {
      syncBackend('clear_session');
    }
    prevCartLength.current = cart.cartItems.length;
  }, [cart.cartItems.length]);

  // Wrapped cart actions
  const addItem = async (data: CartItem) => {
    if (cartClearing) return;
    cart.addItem(data);
    setTimeout(() => trackCartSession({ action: 'update_session', cartItems: cart.cartItems }), 0);
    await syncBackend('update_session');
  };
  const removeItem = async (id: string) => {
    if (cartClearing) return;
    cart.removeItem(id);
    setTimeout(async () => {
      if (cart.cartItems.length === 0) {
        await syncBackend('clear_session');
      } else {
        await syncBackend('update_session');
      }
    }, 0);
  };
  const increaseQuantity = async (id: string) => {
    if (cartClearing) return;
    cart.increaseQuantity(id);
    setTimeout(() => trackCartSession({ action: 'update_session', cartItems: cart.cartItems }), 0);
    await syncBackend('update_session');
  };
  const decreaseQuantity = async (id: string) => {
    if (cartClearing) return;
    cart.decreaseQuantity(id);
    setTimeout(async () => {
      if (cart.cartItems.length === 0) {
        await syncBackend('clear_session');
      } else {
        await syncBackend('update_session');
      }
    }, 0);
  };
  const clearCart = async () => {
    setCartClearing(true);
    cart.clearCart();
    const res = await trackCartSession({ action: 'clear_session' });
    if (res && res.success) {
      setCartClearing(false);
      // UI will update automatically
    } else {
      setCartClearing(false);
      // Optionally show error or retry
    }
  };

  useEffect(() => {
    if (isUserLoaded && user && !cartClearing) {
      // 1. Push local cart to backend if not empty
      (async () => {
        if (cart.cartItems.length > 0) {
          await syncBackend('update_session', cart.cartItems);
        }
        // 2. Fetch backend cart and merge (only on login/session load)
        fetch(`/api/cart-tracking`, { method: 'GET' })
          .then(res => res.json())
          .then(async data => {
            if (cartClearing) return;
            const backendCartRaw = (data.sessions && data.sessions.length > 0) ? data.sessions[0].cartItems || [] : [];
            // Normalize backend cart to local cart structure
            const backendCart = backendCartRaw.map((item: any) => ({
              item: {
                _id: item.productId || item._id,
                title: item.title,
                price: item.price,
                media: item.image ? [item.image] : [],
                isAvailable: true,
                quantity: item.quantity,
              },
              quantity: item.quantity,
              color: item.color,
              size: item.size,
            }));
            // Safeguard: if both backend and local cart are empty, do nothing
            if (backendCart.length === 0 && cart.cartItems.length === 0) return;
            // Merge: prefer local cart items for same product/variant (only on login/session load)
            const mergedCart = [...backendCart];
            cart.cartItems.forEach(localItem => {
              const exists = mergedCart.find(
                b => b.item._id === localItem.item._id && b.color === localItem.color && b.size === localItem.size
              );
              if (!exists) mergedCart.push(localItem);
            });
            cart.cartItems = mergedCart;
          });
      })();
    }
  }, [isUserLoaded, user, cartClearing]);

  return {
    ...cart,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };
}

export default useCart;

