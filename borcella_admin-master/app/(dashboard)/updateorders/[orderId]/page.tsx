"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const UpdateOrderPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const [status, setStatus] = useState('');
  const [trackingLink, setTrackingLink] = useState('');

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        setStatus(data.status || 'received');
        setTrackingLink(data.trackingLink || '');
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { status, trackingLink };

    const res = await fetch(`/api/orders/update/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      alert('Order updated successfully!');
      router.push(`/order-details/${orderId}`); // Redirect back to the order details page
    } else {
      alert('Failed to update order.');
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold mb-3">Update Order {orderId}</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="font-bold mb-1">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 border rounded-md bg-gray-50"
          >
            <option value="received">Not Paid</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="font-bold mb-1">Tracking Link:</label>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-50"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            placeholder="Enter tracking link"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Update Order
        </button>
      </form>
    </div>
  );
};

export default UpdateOrderPage;
