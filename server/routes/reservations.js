const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { protect, adminOnly } = require('../utils/authMiddleware');

router.post('/', async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'Всі поля є обов’язковими.' });
    }

    const reservation = new Reservation({ name, phone, date, time, guests });
    await reservation.save();

    res.status(201).json({ message: 'Заявку прийнято', reservationId: reservation._id });
  } catch (error) {
    console.error('Помилка при створенні заявки:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Помилка отримання заявок:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Невірний статус' });
    }
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(updatedReservation);
  } catch (error) {
    console.error('Помилка оновлення статусу:', error);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Бронювання не знайдено' });
    return res.json({ message: 'Бронювання видалено' });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    return res.status(500).json({ message: 'Помилка сервера' });
  }
});

module.exports = router;
