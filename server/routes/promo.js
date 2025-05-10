const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const { applyPromo, PromoError } = require('../utils/promo');

router.get('/', async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (err) {
    console.error('Error fetching promo codes:', err);
    res.status(500).json({ message: 'Помилка при завантаженні промокодів' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { code, discountType, amount, expiresAt, usageLimit } = req.body;
    const promo = new PromoCode({
      code,
      discountType,
      amount,
      expiresAt: expiresAt || null,
      usageLimit: usageLimit != null ? usageLimit : null,
    });
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    console.error('Error creating promo code:', err);
    const msg = err.code === 11000
      ? 'Такий промокод вже існує'
      : err.message;
    res.status(400).json({ message: msg });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PromoCode.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Промокод не знайдено' });
    res.json({ message: 'Промокод видалено' });
  } catch (err) {
    console.error('Error deleting promo code:', err);
    res.status(500).json({ message: 'Помилка при видаленні промокоду' });
  }
});

router.post('/apply', async (req, res) => {
  try {
    const { totalRaw, codeRaw } = req.body;
    const { discount, finalTotal } = await applyPromo(totalRaw, codeRaw);
    return res.json({ discount, finalTotal });
  } catch (err) {
    if (err.name === 'PromoError') {
      return res.status(400).json({ message: err.message });
    }
    console.error('Error in /api/promos/apply:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
