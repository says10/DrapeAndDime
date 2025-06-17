import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  // Main 16:9 banner
  mainBanner: {
    type: String,
    required: true,
    default: ""
  },
  mainBannerType: {
    type: String,
    enum: ['image', 'video'],
    default: 'video'
  },
  mainBannerTitle: {
    type: String,
    required: true,
    default: "New Arrivals"
  },
  mainBannerSubtitle: {
    type: String,
    required: true,
    default: "Discover the latest trends in women's fashion"
  },
  mainBannerCta: {
    type: String,
    required: true,
    default: "Shop Now"
  },
  mainBannerCtaLink: {
    type: String,
    required: true,
    default: "/products"
  },

  // First 9:16 banner
  firstVerticalBanner: {
    type: String,
    required: true,
    default: ""
  },
  firstVerticalType: {
    type: String,
    enum: ['image', 'video'],
    default: 'video'
  },
  firstVerticalTitle: {
    type: String,
    required: true,
    default: "Elegant Collection"
  },
  firstVerticalSubtitle: {
    type: String,
    required: true,
    default: "Timeless pieces for the modern woman"
  },
  firstVerticalCta: {
    type: String,
    required: true,
    default: "Explore"
  },
  firstVerticalCtaLink: {
    type: String,
    required: true,
    default: "/collections"
  },

  // Second 9:16 banner
  secondVerticalBanner: {
    type: String,
    required: true,
    default: ""
  },
  secondVerticalType: {
    type: String,
    enum: ['image', 'video'],
    default: 'video'
  },
  secondVerticalTitle: {
    type: String,
    required: true,
    default: "Trendy Styles"
  },
  secondVerticalSubtitle: {
    type: String,
    required: true,
    default: "Stay ahead with our curated fashion selection"
  },
  secondVerticalCta: {
    type: String,
    required: true,
    default: "View Collection"
  },
  secondVerticalCtaLink: {
    type: String,
    required: true,
    default: "/products"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { toJSON: { getters: true } });

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner; 