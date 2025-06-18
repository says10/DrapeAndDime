import { create } from "zustand";
import { toast } from "sonner";
import { persist, createJSONStorage } from "zustand/middleware";
import { trackCartSession } from "@/lib/actions/cartTracking";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; // ? means optional
  size?: string; // ? means optional
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
      addItem: async (data: CartItem) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems;
        const isExisting = currentItems.find(
          (cartItem) => cartItem.item._id === item._id
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
        set({ cartItems: [...currentItems, { item, quantity, color, size }] });
        toast.success("Item added to cart", { 
          description: `${item.title} has been added to your cart.`
        });
        // Track cart session
        await trackCartSession({
          action: currentItems.length === 0 ? 'create_session' : 'update_activity',
          cartItems: [...currentItems, { item, quantity, color, size }],
        });
      },
      removeItem: async (idToRemove: string) => {
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
        // Track cart session
        await trackCartSession({
          action: newCartItems.length === 0 ? 'mark_abandoned' : 'update_activity',
          cartItems: newCartItems,
        });
      },
      increaseQuantity: (idToIncrease: string) => {
        const currentItems = get().cartItems;
        const itemToIncrease = currentItems.find(item => item.item._id === idToIncrease);
        
        if (!itemToIncrease) return;
        
        // Check if we can increase quantity
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
      clearCart: async () => {
        set({ cartItems: [] });
        toast.success("Cart cleared", {
          description: "All items have been removed from your cart."
        });
        // Track cart session
        await trackCartSession({
          action: 'mark_abandoned',
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

export default useCart;

