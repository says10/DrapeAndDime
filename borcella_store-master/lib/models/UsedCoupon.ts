import mongoose from "mongoose";

const usedCouponSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  code: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
});

const UsedCoupon = mongoose.models.UsedCoupon || mongoose.model("UsedCoupon", usedCouponSchema);

export default UsedCoupon; 