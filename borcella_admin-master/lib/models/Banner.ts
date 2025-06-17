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
    default: 'image',
  },

  // First 9:16 banner
  verticalBanner1: {
    type: String,
    required: true,
  },
  verticalBanner1Type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  verticalBanner1Title: {
    type: String,
    default: "",
  },
  verticalBanner1Subtitle: {
    type: String,
    default: "",
  },
  verticalBanner1Cta: {
    type: String,
    default: "",
  },
  verticalBanner1CtaLink: {
    type: String,
    default: "",
  },

  // Second 9:16 banner
  verticalBanner2: {
    type: String,
    required: true,
  },
  verticalBanner2Type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  verticalBanner2Title: {
    type: String,
    default: "",
  },
  verticalBanner2Subtitle: {
    type: String,
    default: "",
  },
  verticalBanner2Cta: {
    type: String,
    default: "",
  },
  verticalBanner2CtaLink: {
    type: String,
    default: "",
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