"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Import auth hook from Clerk
import Image from "next/image";

// Import the custom useCart hook
import useCart from "@/lib/hooks/useCart"; // Adjust the path to where your store is located
import { load } from '@cashfreepayments/cashfree-js'; // Import Cashfree SDK

const Payment = () => {
  const router = useRouter();
  const { cartItems } = useCart(); // Use cartItems from your Zustand store

  const { user } = useUser(); // Get clerkId from Clerk
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    clerkId: user?.id || "", // Initialize with clerkId from Clerk
  });

  const [shippingRate, setShippingRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages

  const amount = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  // Initialize Cashfree SDK when the component mounts
  useEffect(() => {
    const initializeCashfreeSDK = async () => {
      try {
        await load({
          mode: "production", // Use "production" for live mode
        });
        setCashfreeLoaded(true);
      } catch (error) {
        console.error("Error loading Cashfree SDK:", error);
        setErrorMessage("Failed to load Cashfree payment gateway.");
      }
    };
    
    initializeCashfreeSDK();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function
  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      setErrorMessage("All fields are required.");
      return false;
    }

    // Phone number validation (simple validation for now)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    // Postal code validation (simple 6-digit validation)
    const postalCodeRegex = /^[0-9]{6}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      setErrorMessage("Please enter a valid 6-digit postal code.");
      return false;
    }

    setErrorMessage(""); // Clear error message if validation passes
    return true;
  };

  const handlePayment = async () => {
    if (!cashfreeLoaded || !amount) return;

    // Validate form data
    if (!validateForm()) return;

    const orderData = {
      cartItems,
      customer: {
        email: formData.email,
        clerkId: user?.id, // Ensure this is populated
      },
      shippingDetails: formData,
      shippingRate,
      enteredName: formData.name,
    };

    console.log("Sending orderData to API:", JSON.stringify(orderData, null, 2)); // Log before sending request

    try {
      const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        console.error("Checkout API error response:", errorData); // Log error details
        setErrorMessage(errorData.message || "Some of the items may be out of stock");
        return;
      }

      const checkoutData = await checkoutResponse.json();
      console.log("Received checkout response:", checkoutData); // Log response data

      if (!checkoutData.paymentSessionId) {
        setErrorMessage("Payment session ID missing. Please try again.");
        return;
      }
      let checkoutOptions = {
          paymentSessionId: checkoutData.paymentSessionId,
          redirectTarget: "_modal",
      };

      // Proceed with payment
      const cashfree = await load({ mode: "production" });
      cashfree
        .checkout(checkoutOptions)
        .then(async (response: { paymentId: string }) => {
          console.log("Cashfree Payment Success:", response);
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verifypayment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: checkoutData.orderId,
              paymentId: checkoutData.paymentId,
              shippingDetails: formData,
            }),
          });

          const verifyResData = await verifyRes.json();
          console.log("Payment Verification Response:", verifyResData);

          if (verifyResData.success) {
            window.location.href = "/payment_success";
          } else {
            setErrorMessage("Payment verification failed.");
            window.location.href = "/payment_fail";
          }
        })
        .catch((error: any) => {
          console.error("Cashfree payment error:", error);
          setErrorMessage("Payment failed. Please try again.");
        });
    } catch (error) {
      console.error("Error during checkout process:", error);
      setErrorMessage("An error occurred during checkout. Please try again later.");
    }
  };

  return (
    <div className="related-products-container min-h-screen bg-cover bg-center bg-fixed">
      <div className="related-products-container max-w-6xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-12">
        <h1 className="text-800xl font-bold mb-8 text-center text-gray-800">Please Fill In Your Details</h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500 text-white rounded-lg text-center">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">Shipping Details</h3>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                className="border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
            <div className="space-y-6">
              {cartItems.map((cartItem) => (
                <div key={cartItem.item._id} className="flex flex-col items-center border-b py-6">
                  <Image
                    src={cartItem.item.media[0]}
                    width={400} // Increased the width for a larger image
                    height={400} // Increased the height for a larger image
                    className="rounded-lg mb-4"
                    alt="product"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-gray-800">{cartItem.item.title}</p>
                    <p className="text-sm text-gray-600 mb-2">{cartItem.item.description}</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{cartItem.item.price * cartItem.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between font-bold text-lg text-gray-800">
              <span>Total:</span>
              <span>₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="mt-8">
          <button
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
