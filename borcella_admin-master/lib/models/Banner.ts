import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  // Main 16:9 banner
  mainBanner: {
    type: String,
    required: true,
  },
  mainBannerType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  mainBannerTitle: {
    type: String,
    required: true,
  },
  mainBannerSubtitle: {
    type: String,
    required: true,
  },
  mainBannerCta: {
    type: String,
    required: true,
  },
  mainBannerCtaLink: {
    type: String,
    required: true,
  },

  // First 9:16 banner
  firstVerticalBanner: {
    type: String,
    required: true,
  },
  firstVerticalType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  firstVerticalTitle: {
    type: String,
    required: true,
  },
  firstVerticalSubtitle: {
    type: String,
    required: true,
  },
  firstVerticalCta: {
    type: String,
    required: true,
  },
  firstVerticalCtaLink: {
    type: String,
    required: true,
  },

  // Second 9:16 banner
  secondVerticalBanner: {
    type: String,
    required: true,
  },
  secondVerticalType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  secondVerticalTitle: {
    type: String,
    required: true,
  },
  secondVerticalSubtitle: {
    type: String,
    required: true,
  },
  secondVerticalCta: {
    type: String,
    required: true,
  },
  secondVerticalCtaLink: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner; 