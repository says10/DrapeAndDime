import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true }, // Indexed for faster lookup
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order", default: [] }],
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
