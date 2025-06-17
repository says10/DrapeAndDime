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

  // First 9:16 banner
  verticalBanner1: {
    type: String,
    required: true,
  },
  verticalBanner1Type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },

  // Second 9:16 banner
  verticalBanner2: {
    type: String,
    required: true,
  },
  verticalBanner2Type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
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