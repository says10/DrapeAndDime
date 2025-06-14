"use client";

import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [stockValidation, setStockValidation] = useState<{ [key: string]: boolean }>({});

  // Calculate total
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  // Validate stock when cart items change
  useEffect(() => {
    const checkStock = async () => {
      try {
        const formattedCartItems = cart.cartItems.map((cartItem) => ({
          itemId: cartItem.item._id,
          quantity: cartItem.quantity,
          color: cartItem.color,
          size: cartItem.size,
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validatestock`, {
          method: "POST",
          body: JSON.stringify({ cartItems: formattedCartItems }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setStockValidation(data);
      } catch (err) {
        console.error("[validateStock] Error:", err);
      }
    };

    if (cart.cartItems.length > 0) {
      checkStock();
    }
  }, [cart.cartItems]);

  const handleCheckout = async () => {
    try {
      // Ensure that there are no out-of-stock items before redirecting
      if (Object.values(stockValidation).includes(false)) {
        // Show some error or alert for out-of-stock items
        alert("Some items are out of stock and cannot be purchased.");
        return;
      }
      
      // Proceed to checkout if all items are in stock
      if (!user) {
        router.push("sign-in");
      } else {
        // This now redirects directly to the checkout page
        const checkoutUrl =  `https://drapeanddime.shop/payment`;
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  // Handle quantity increase and decrease
  const handleIncreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity < cartItem.item.quantity) {
      cart.increaseQuantity(cartItem.item._id);
    }
  };

  const handleDecreaseQuantity = (cartItem: any) => {
    if (cartItem.quantity > 1) {
      cart.decreaseQuantity(cartItem.item._id);
    }
  };

  return (
    <div className="flex gap-16 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No items in the cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => {
              const isOutOfStock = stockValidation[cartItem.item._id] === false;

              return (
                <div
                  key={cartItem.item._id}
                  className={`w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-4 items-center max-sm:items-start justify-between ${
                    isOutOfStock ? "bg-red-50 border-2 border-red-500" : "border-b"
                  }`}
                >
                  <div className="flex items-center">
                    <Image
                      src={cartItem.item.media[0]}
                      width={100}
                      height={100}
                      className="rounded-lg w-32 h-32 object-cover"
                      alt="product"
                    />
                    <div className="flex flex-col gap-3 ml-4">
                      <p className="text-body-bold">{cartItem.item.title}</p>
                      {cartItem.color && (
                        <p className="text-small-medium">{cartItem.color}</p>
                      )}
                      {cartItem.size && (
                        <p className="text-small-medium">{cartItem.size}</p>
                      )}
                      <p className="text-small-medium">₹{cartItem.item.price}</p>

                      {/* Display "Out of Stock" near the price if the item is out of stock */}
                      {isOutOfStock && (
                        <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <MinusCircle
                      className="hover:text-red-1 cursor-pointer"
                      onClick={() => handleDecreaseQuantity(cartItem)}
                    />
                    <p className="text-body-bold">{cartItem.quantity}</p>
                    <PlusCircle
                      className="hover:text-red-1 cursor-pointer"
                      onClick={() => handleIncreaseQuantity(cartItem)}
                    />
                  </div>

                  <Trash
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.removeItem(cartItem.item._id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "items" : "item"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>₹ {totalRounded}</span>
        </div>
        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
          onClick={handleCheckout}
          disabled={Object.values(stockValidation).includes(false)}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
