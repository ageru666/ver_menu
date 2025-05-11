const express         = require('express');
const router          = express.Router();
const Order           = require('../models/Order');
const optionalProtect = require('../utils/optionalProtect');
const { protect, adminOnly } = require('../utils/authMiddleware');
const { applyPromo, PromoError } = require('../utils/promo');

function generateOrderNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return Date.now().toString() + random;
}

router.post('/create', optionalProtect, async (req, res) => {
  try {
    const {
      cart,
      promoCode,
      timeOption,
      selectedTime,
      orderType,
      paymentMethod,
      contactInfo,
      deliveryInfo
    } = req.body;

    const totalBeforeDiscount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let discount = 0;
    let finalTotal = totalBeforeDiscount;
    try {
      ({ discount, finalTotal } = await applyPromo(
        totalBeforeDiscount,
        promoCode
      ));
    } catch (err) {
      if (err.name === 'PromoError') {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }

    const newOrder = new Order({
      orderNumber:        generateOrderNumber(),
      user:               req.user?._id || null,
      cart,
      totalBeforeDiscount,
      promoCode:          promoCode || null,
      discount,
      total:              finalTotal,
      timeOption,
      selectedTime,
      orderType,
      paymentMethod,
      contactInfo,
      deliveryInfo:       orderType === 'Самовивіз' ? {} : deliveryInfo,
    });

    await newOrder.save();

    return res.status(201).json({
      message:     'Замовлення успішно створено!',
      orderNumber: newOrder.orderNumber,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      message: 'Помилка при створенні замовлення',
      error:   error.message,
    });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    res.json(updatedOrder);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Помилка', error: err.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user._id });
    res.json(myOrders);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ message: 'Помилка', error: error.message });
  }
});

module.exports = router;
