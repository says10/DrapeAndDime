"use client";
import { useState } from "react";

interface UpdateOrderFormProps {
  orderId: string;
  currentStatus: string;
  trackingLink: string;
}

const UpdateOrderForm = ({ orderId, currentStatus, trackingLink }: UpdateOrderFormProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(trackingLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/orders/${orderId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, trackingLink: tracking }),
    });

    if (res.ok) {
      alert("Order updated successfully");
    } else {
      alert("Failed to update order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium">Order Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded"
        >
          <option value="NOT PAID">NOT PAID</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Tracking Link</label>
        <input
          type="url"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Enter tracking URL"
          className="mt-1 p-2 border border-gray-300 rounded w-full"
          
        />
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Update Order
      </button>
    </form>
  );
};

export default UpdateOrderForm;
