"use client";
import React, { useState, useEffect } from "react";

interface Coupon {
  code: string;
  description: string;
  discount: number;
  type: string;
  allowedPayments?: string;
  _id?: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ code: "", description: "", discount: "", type: "percentage", allowedPayments: "both" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch coupons from API
  useEffect(() => {
    setLoading(true);
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        setCoupons(data);
        setLoading(false);
      })
      .catch(() => {
        setApiError("Failed to load coupons.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiError("");
    if (!form.code || !form.description || !form.discount) {
      setError("All fields are required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim().toUpperCase(),
          description: form.description,
          discount: Number(form.discount),
          type: form.type,
          allowedPayments: form.allowedPayments,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add coupon.");
      setCoupons([data, ...coupons]);
      setForm({ code: "", description: "", discount: "", type: "percentage", allowedPayments: "both" });
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (code: string) => {
    setDeleting(code);
    setApiError("");
    try {
      const res = await fetch("/api/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete coupon.");
      setCoupons(coupons.filter((c) => c.code !== code));
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Coupon Management</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Coupon</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAdd}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input name="code" value={form.code} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none" placeholder="e.g. WELCOME5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none" placeholder="Coupon description" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input name="discount" type="number" min="1" max="100" value={form.discount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none" placeholder="e.g. 5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Payment Methods</label>
            <select name="allowedPayments" value={form.allowedPayments} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none">
              <option value="both">Both</option>
              <option value="online">Online</option>
              <option value="cod">COD</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-4 mt-2">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-900 transition" disabled={adding}>{adding ? "Adding..." : "Add Coupon"}</button>
            {error && <span className="text-red-600 text-sm font-medium">{error}</span>}
            {apiError && <span className="text-red-600 text-sm font-medium">{apiError}</span>}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Coupons</h2>
        {loading ? (
          <div className="text-gray-500 py-8 text-center">Loading coupons...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 text-gray-700 font-medium">Code</th>
                <th className="py-2 px-2 text-gray-700 font-medium">Description</th>
                <th className="py-2 px-2 text-gray-700 font-medium">Discount</th>
                <th className="py-2 px-2 text-gray-700 font-medium">Type</th>
                <th className="py-2 px-2 text-gray-700 font-medium">Allowed Payments</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-mono font-bold text-black">{coupon.code}</td>
                  <td className="py-2 px-2 text-gray-700">{coupon.description}</td>
                  <td className="py-2 px-2 text-gray-700">{coupon.discount}{coupon.type === "percentage" ? "%" : "₹"}</td>
                  <td className="py-2 px-2 text-gray-700 capitalize">{coupon.type}</td>
                  <td className="py-2 px-2 text-gray-700 capitalize">{coupon.allowedPayments || "both"}</td>
                  <td className="py-2 px-2">
                    <button onClick={() => handleDelete(coupon.code)} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-medium hover:bg-red-100 transition" disabled={deleting === coupon.code}>{deleting === coupon.code ? "Deleting..." : "Delete"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {apiError && !loading && <div className="text-red-600 text-sm font-medium mt-4">{apiError}</div>}
      </div>
    </div>
  );
} 