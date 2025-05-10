const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  expiresAt: Date,          
  usageLimit: Number,       
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PromoCode', promoSchema);
