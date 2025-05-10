const PromoCode = require('../models/PromoCode');

class PromoError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PromoError';
  }
}

async function applyPromo(totalRaw, codeRaw) {
  if (!codeRaw) return { discount: 0, finalTotal: totalRaw };

  const code = codeRaw.trim().toUpperCase();
  const promo = await PromoCode.findOne({ code });
  if (!promo) throw new PromoError('Промокод не знайдено');
  if (promo.expiresAt && promo.expiresAt < new Date())
    throw new PromoError('Промокод закінчився');
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit)
    throw new PromoError('Ліміт використання промокоду вичерпано');

  let discount = promo.discountType === 'percent'
    ? totalRaw * (promo.amount / 100)
    : promo.amount;
  discount = Math.min(discount, totalRaw);
  const finalTotal = +(totalRaw - discount).toFixed(2);

  promo.usedCount++;
  await promo.save();

  return { discount: +discount.toFixed(2), finalTotal };
}

module.exports = { applyPromo, PromoError };
