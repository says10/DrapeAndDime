"use client";

import Loader from '@/components/custom ui/Loader';
import ProductForm from '@/components/products/ProductForm';
import React, { useEffect, useState } from 'react';
 // Assuming ProductType is defined somewhere

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0); // Track the restock quantity

  // Fetch product details
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

  // Function to handle restocking the product
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
          // Update the product details state with the new values
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

  // Loading state
  if (loading) return <Loader />;

  return (
    <div className="product-details-page">
      {/* Product Information */}
      <ProductForm initialData={productDetails} />

      {/* Display stock and availability info */}
      <div className="stock-management">
        <h2 className="text-heading3-bold">Stock Management</h2>

        <p className="text-body-bold">Current Stock: {productDetails?.quantity}</p>
        <p className={`text-body-bold ${productDetails?.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
          {productDetails?.isAvailable ? "Available" : "Out of Stock"}
        </p>

        {/* Restock inputs */}
        <div className="restock-input">
          <label className="text-small-medium" htmlFor="restock-quantity">Restock Quantity:</label>
          <input
            id="restock-quantity"
            type="number"
            value={restockQuantity}
            onChange={(e) => setRestockQuantity(Number(e.target.value))}
            className="border p-2 rounded"
            min="1"
          />
          <button
            onClick={handleRestock}
            className="bg-blue-500 text-white p-2 rounded mt-4"
            disabled={restockQuantity <= 0}
          >
            Restock Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
