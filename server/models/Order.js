const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },

  cart: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  promoCode: { type: String },
  timeOption: { type: String, required: true },
  selectedTime: { type: String },
  orderType: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  deliveryInfo: {
    street: { type: String },
    building: { type: String },
    entrance: { type: String },
    block: { type: String },
    apartment: { type: String },
    floor: { type: String },
    comment: { type: String },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'cooking', 'on delivery', 'delivered'],
    default: 'pending',
    validate: {
      validator: function (value) {
        if (this.orderType === 'Самовивіз') {
          return !['on delivery', 'delivered'].includes(value);
        }
        return true;
      },
      message: 'Неможливо встановити статус "{VALUE}" для самовивозу',
    },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
