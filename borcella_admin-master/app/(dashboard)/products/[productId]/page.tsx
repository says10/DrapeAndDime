"use client";

import Loader from '@/components/custom ui/Loader';
import React, { useEffect, useState } from 'react';

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);

  const getProductDetails = async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      });
      const data = await res.json();
      setProductDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[productId_GET]", err);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const handleRestock = async () => {
    if (productDetails && restockQuantity > 0) {
      try {
        const updatedQuantity = productDetails.quantity + restockQuantity;
        const updatedAvailability = updatedQuantity > 0;

        const res = await fetch(`/api/products/${params.productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedQuantity,
            isAvailable: updatedAvailability,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setProductDetails(prevState => ({
            ...prevState!,
            quantity: updatedQuantity,
            isAvailable: updatedAvailability,
          }));
        } else {
          console.log("Failed to update stock.");
        }
      } catch (err) {
        console.log("[restockProduct]", err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
        <p className="text-muted-foreground">Manage product stock and availability</p>
      </div>

      {productDetails && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Product Name</p>
                <p className="text-lg">{productDetails.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-lg">{productDetails.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-lg">₹{productDetails.price}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Stock</p>
                <p className="text-lg">{productDetails.quantity}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <p className="text-lg">Current Stock: <span className="font-semibold">{productDetails.quantity}</span></p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                productDetails.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {productDetails.isAvailable ? "Available" : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restock Quantity:
                </label>
                <input
                  type="number"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              
              <button
                onClick={handleRestock}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={restockQuantity <= 0}
              >
                Restock Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
