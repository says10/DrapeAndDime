"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom ui/Loader";
import ImageUpload from '@/components/custom ui/ImageUpload';
import { toast } from 'sonner';
import { Edit, Save, X, Plus, Trash } from 'lucide-react';
import MultiSelect from '@/components/custom ui/MultiSelect';

const ProductDetails = ({ params }: { params: { productId: string }}) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    media: [] as string[],
    category: '',
    price: 0,
    originalPrice: 0,
    expense: 0,
    quantity: 0,
    colors: '',
    sizes: '',
    tags: [] as string[],
    isAvailable: true,
    collections: [] as string[]
  });
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getProductDetails = useCallback(async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      });
      const data = await res.json();
      setProductDetails(data);
      setEditForm({
        title: data.title,
        description: data.description,
        media: data.media,
        category: data.category,
        price: data.price,
        originalPrice: data.originalPrice || 0,
        expense: data.expense || 0,
        quantity: data.quantity,
        colors: data.colors || '',
        sizes: data.sizes || '',
        tags: data.tags || [],
        isAvailable: data.isAvailable,
        collections: data.collections || []
      });
      setLoading(false);
    } catch (err) {
      console.log("[productId_GET]", err);
      toast.error("Failed to load product details");
    }
  }, [params.productId]);

  const getCollections = async () => {
    try {
      const res = await fetch('/api/collections', { method: 'GET' });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.log('[collections_GET]', err);
      toast.error('Failed to load collections');
    }
  };

  useEffect(() => {
    getProductDetails();
    getCollections();
  }, [getProductDetails]);

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
            ...productDetails,
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
          setEditForm(prev => ({
            ...prev,
            quantity: updatedQuantity,
            isAvailable: updatedAvailability,
          }));
          setRestockQuantity(0);
          toast.success("Product restocked successfully!");
        } else {
          toast.error("Failed to update stock.");
        }
      } catch (err) {
        console.log("[restockProduct]", err);
        toast.error("Failed to restock product");
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProductDetails(updatedProduct);
        setIsEditing(false);
        toast.success("Product updated successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update product");
      }
    } catch (err) {
      console.log("[updateProduct]", err);
      toast.error("Failed to update product");
    }
  };

  const handleCancelEdit = () => {
    if (productDetails) {
      setEditForm({
        title: productDetails.title,
        description: productDetails.description,
        media: productDetails.media,
        category: productDetails.category,
        price: productDetails.price,
        originalPrice: productDetails.originalPrice || 0,
        expense: productDetails.expense || 0,
        quantity: productDetails.quantity,
        colors: productDetails.colors || '',
        sizes: productDetails.sizes || '',
        tags: productDetails.tags || [],
        isAvailable: productDetails.isAvailable,
        collections: productDetails.collections || []
      });
    }
    setIsEditing(false);
  };

  const handleAddTag = (tag: string) => {
    if (tag && !editForm.tags.includes(tag)) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Details</h1>
          <p className="text-muted-foreground">Manage product information and stock</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>
          ) : (
            <>
              <Button onClick={handleSaveEdit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleCancelEdit} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {productDetails && (
        <div className="space-y-6">
      {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Input
                        value={editForm.category}
                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  {/* Collections MultiSelect */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                    <MultiSelect
                      placeholder="Select collections"
                      collections={collections}
                      value={editForm.collections || []}
                      onChange={(_id) => setEditForm(prev => ({ ...prev, collections: [...(prev.collections || []), _id] }))}
                      onRemove={(idToRemove) => setEditForm(prev => ({ ...prev, collections: prev.collections.filter((id) => id !== idToRemove) }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <ImageUpload
                      value={editForm.media}
                      onChange={(url) => setEditForm(prev => ({ ...prev, media: [...prev.media, url] }))}
                      onRemove={(url) => setEditForm(prev => ({ ...prev, media: prev.media.filter(m => m !== url) }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <Input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹)</label>
                      <Input
                        type="number"
                        value={editForm.originalPrice}
                        onChange={(e) => setEditForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                        placeholder="MRP"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expense (₹)</label>
                      <Input
                        type="number"
                        value={editForm.expense}
                        onChange={(e) => setEditForm(prev => ({ ...prev, expense: Number(e.target.value) }))}
                        placeholder="Expense"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                      <Input
                        value={editForm.colors}
                        onChange={(e) => setEditForm(prev => ({ ...prev, colors: e.target.value }))}
                        placeholder="Colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                      <Input
                        value={editForm.sizes}
                        onChange={(e) => setEditForm(prev => ({ ...prev, sizes: e.target.value }))}
                        placeholder="Sizes"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editForm.tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleAddTag(input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement;
                          if (input && input.value) {
                            handleAddTag(input.value);
                            input.value = '';
                          }
                        }}
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Product Name</p>
                    <p className="text-lg">{productDetails.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-lg">{productDetails.category}</p>
                  </div>
                  {/* Collections display */}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Collections</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {productDetails.collections && productDetails.collections.length > 0 ? (
                        productDetails.collections.map((col) => (
                          <span key={col._id} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {col.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No collections</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="text-lg">₹{productDetails.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">MRP</p>
                    <p className="text-lg">₹{productDetails.originalPrice || productDetails.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Colors</p>
                    <p className="text-lg">{productDetails.colors || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sizes</p>
                    <p className="text-lg">{productDetails.sizes || 'Not specified'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Management */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-lg">Current Stock: <span className="font-semibold">{productDetails.quantity}</span></p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  productDetails.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {productDetails.isAvailable ? "Available" : "Out of Stock"}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <Input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        quantity: Number(e.target.value),
                        isAvailable: Number(e.target.value) > 0
                      }))}
                      min="0"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="flex items-center gap-2">
          <input
                      type="checkbox"
                      id="isAvailable"
                      checked={editForm.isAvailable}
                      onChange={(e) => setEditForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                      Product is available for purchase
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restock Quantity:
                    </label>
                    <Input
            type="number"
            value={restockQuantity}
            onChange={(e) => setRestockQuantity(Number(e.target.value))}
                      className="max-w-xs"
            min="1"
                      placeholder="Enter quantity"
          />
                  </div>
                  
                  <Button
            onClick={handleRestock}
                    className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={restockQuantity <= 0}
          >
            Restock Product
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;