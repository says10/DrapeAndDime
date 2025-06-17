import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  // Main 16:9 banner
  mainBanner: {
    type: String,
    required: true,
  },

  // First 9:16 banner
  verticalBanner1: {
    type: String,
    required: true,
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

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner; 