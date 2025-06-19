import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  title: String,
  image: String,
  size: String,
  color: String
});

const cartSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: String,
  cartItems: [cartItemSchema],
  totalValue: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'recovered', 'purchased'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  abandonedAt: Date,
  recoveredAt: Date,
  purchasedAt: Date,
  
  // Email tracking
  emailsSent: [{
    type: {
      type: String,
      enum: ['abandonment_1h', 'abandonment_24h', 'abandonment_72h', 'recovery']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    opened: {
      type: Boolean,
      default: false
    },
    clicked: {
      type: Boolean,
      default: false
    }
  }],
  
  // User preferences
  emailPreferences: {
    marketing: {
      type: Boolean,
      default: true
    },
    transactional: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  }
});

// Indexes for efficient queries
cartSessionSchema.index({ status: 1, lastActivity: 1 });
cartSessionSchema.index({ userId: 1, status: 1 });
cartSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days TTL

const CartSession = mongoose.models.CartSession || mongoose.model("CartSession", cartSessionSchema);

export default CartSession; 