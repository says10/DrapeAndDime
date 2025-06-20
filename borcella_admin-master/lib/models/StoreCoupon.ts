import { getStoreConnection } from "../mongoDBStore";
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
  allowedPayments: { type: String, enum: ["online", "cod", "both"], default: "both" },
  createdAt: { type: Date, default: Date.now },
  minOrderValue: { type: Number },
  maxDiscount: { type: Number },
  minOrderCount: { type: Number },
  maxOrderCount: { type: Number },
});

export const getStoreCouponModel = async () => {
  const conn = await getStoreConnection();
  return conn.models.Coupon || conn.model("Coupon", couponSchema);
}; 