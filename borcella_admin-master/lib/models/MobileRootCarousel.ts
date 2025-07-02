import mongoose, { Schema, models } from "mongoose";

const MobileRootCarouselItemSchema = new Schema({
  media: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  link: { type: String, required: true },
});

const MobileRootCarouselSchema = new Schema({
  items: [MobileRootCarouselItemSchema],
}, { timestamps: true });

export default models.MobileRootCarousel || mongoose.model("MobileRootCarousel", MobileRootCarouselSchema); 