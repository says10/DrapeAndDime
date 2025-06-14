import UpdateOrderForm from "@/components/orders/updateOrderForm";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`, {
    cache: "no-store", // Ensure fresh data on every request
  });

  if (!res.ok) {
    return <p>Error loading order details.</p>;
  }

  const { orderDetails } = await res.json();

  // Function to get status styles
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "shipped":
        return "bg-blue-500 text-white";
      case "delivered":
        return "bg-green-500 text-white";
      case "canceled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Order Details</h2>

      {/* Order Information */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
        <p className="text-lg"><strong>Order ID:</strong> {orderDetails._id}</p>
        <p className="text-lg"><strong>Customer:</strong> {orderDetails.customerName}</p>
        <p className="text-lg"><strong>Email:</strong> {orderDetails.customerEmail}</p>
        <p className="text-lg"><strong>Phone Number:</strong> {orderDetails.customerPhone}</p>
        <p className="text-lg"><strong>Total:</strong> ₹{orderDetails.totalAmount}</p>
        <p className="text-lg flex items-center"><strong>Status:</strong> 
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(orderDetails.status)}`}>
            {orderDetails.status}
          </span>
        </p>
        <p className="text-lg"><strong>Tracking Link:</strong>
          {orderDetails.trackingLink ? (
            <a href={orderDetails.trackingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {orderDetails.trackingLink}
            </a>
          ) : (
            "Not provided"
          )}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
        {orderDetails.shippingAddress ? (
          <>
            <p className="text-lg"><strong>Full Name:</strong> {orderDetails.shippingAddress.fullName}</p>
            <p className="text-lg"><strong>Street:</strong> {orderDetails.shippingAddress.street}</p>
            <p className="text-lg"><strong>City:</strong> {orderDetails.shippingAddress.city}</p>
            <p className="text-lg"><strong>State:</strong> {orderDetails.shippingAddress.state}</p>
            <p className="text-lg"><strong>Postal Code:</strong> {orderDetails.shippingAddress.postalCode}</p>
            <p className="text-lg"><strong>Country:</strong> {orderDetails.shippingAddress.country}</p>
          </>
        ) : (
          <p>No shipping address available</p>
        )}
      </div>

      {/* Payment Information */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        <p className="text-lg"><strong>Cashfree order ID:</strong> {orderDetails.cashfreeOrderId || "Not available"}</p>
        <p className="text-lg"><strong>Payment ID:</strong> {orderDetails.paymentId || "Not available"}</p>
      </div>

      {/* Product Details */}
      <h3 className="text-xl font-semibold mt-6">Product Details</h3>
      <div className="grid grid-cols-1 gap-6">
        {orderDetails.productDetails && orderDetails.productDetails.length > 0 ? (
          orderDetails.productDetails.map((item: any) => (
            <div key={item._id} className="bg-white p-6 border rounded-lg shadow-sm">
              <p className="text-lg"><strong>Product Name:</strong> {item.title}</p>
              {item.media && item.media.length > 0 ? (
                <img 
                  src={item.media[0]} 
                  alt="Product Image" 
                  className="w-32 h-32 object-cover mt-4"
                />
              ) : (
                <p>No image available</p>
              )}
              <p className="text-lg mt-4"><strong>Color:</strong> {item.colors}</p>
              <p className="text-lg"><strong>Size:</strong> {item.sizes}</p>
              <p className="text-lg"><strong>Quantity:</strong> {orderDetails.products.find((product: any) => product.product.toString() === item._id.toString())?.quantity}</p>
            </div>
          ))
        ) : (
          <p>No product details available</p>
        )}
      </div>

      {/* Client-Side Update Form */}
      <div className="mt-8">
        <UpdateOrderForm
          orderId={orderDetails._id}
          currentStatus={orderDetails.status}
          trackingLink={orderDetails.trackingLink || ""}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
