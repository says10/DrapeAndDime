import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: [String],
  category: { type: String, required: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: [String],
  sizes: { type: String, default: "" },
  colors: { type: String, default: "" },
  price: { type: Number, required: true, min: 0.1 },
  originalPrice: { type: Number, min: 0.1, required: false }, // optional MRP (original price)
  expense: { type: Number, required: true, min: 0.1 },
  quantity: { type: Number, required: true, min: 0 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;