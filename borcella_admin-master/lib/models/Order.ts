import mongoose from "mongoose";

// Define the schema for the product details
const productSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  color: String,
  size: String,
  quantity: Number,
  media: [String],
  title: String,
});

// Define the schema for shipping address
const shippingAddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

// Define the main order schema
const orderSchema = new mongoose.Schema(
  {
    customerClerkId: String,
    customerEmail: String,
    customerName: String,
    products: [productSchema],
    shippingAddress: shippingAddressSchema,
    shippingRate: String,
    totalAmount: Number,
    cashfreeOrderId: String,
    customerPhone: String,
    status: { type: String, enum: ["NOT PAID", "Paid", "Shipped", "Delivered"], default: "NOT PAID" },
    trackingLink:String,
    paymentId: String,
    expiresAt: { type: Date, required: true }, // Custom expiration date field
  },
  { timestamps: true }
);
// Create and export the Order model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
