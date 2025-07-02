import React from "react";

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center">Shipping Policy</h1>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-4">Last updated: 21/03/2025</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Order Processing</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">Orders are processed within <strong>0-7 days</strong> from the order confirmation and payment, or as per the delivery date agreed upon at the time of order confirmation.</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Delivery Time</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-2">For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.</p>
        <p className="text-sm sm:text-base text-gray-700 mb-2">For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only. Delivery is subject to Courier Company or post office norms.</p>
        <p className="text-sm sm:text-base text-gray-700 mb-4">Delivery may take up to <strong>7 days</strong>, but unforeseen circumstances may cause delays.</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Shipping Charges</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">Shipping charges vary based on the delivery location and will be displayed at checkout.</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Tracking</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">Once shipped, you will receive a tracking link via email to track your order.</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Undeliverable Orders</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">If a package is returned due to incorrect details provided by the buyer, the customer will be responsible for re-shipping charges.</p>
        <p className="text-sm sm:text-base text-gray-700 mb-4">For shipping inquiries or any assistance, feel free to contact us at <a href="mailto:drapeanddime@gmail.com" className="text-blue-600 hover:underline font-semibold"> drapeanddime@gmail.com</a>.</p>
        <h2 className="text-lg sm:text-2xl font-bold mt-6 mb-2">Disclaimer</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">We are not liable for any delay in delivery by the courier company or postal authorities and only guarantee to hand over the consignment to the courier company or postal authorities within the stipulated time.</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageContainer: { padding: "40px", maxWidth: "800px", margin: "auto", fontFamily: "Poppins, sans-serif" },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
  subTitle: { fontSize: "22px", fontWeight: "bold", marginTop: "20px" },
  list: { padding: "0 20px", fontSize: "16px", lineHeight: "1.6" },
  link: { color: "#0077cc", textDecoration: "none", fontWeight: "bold" },
};

export default Shipping;
