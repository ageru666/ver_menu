const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');

router.get('/', async (req, res) => {
  try {
    const salads = await Dish.find({ category: 'salads' });
    res.json(salads);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const salad = new Dish({ ...req.body, category: 'salads' });
  try {
    await salad.save();
    res.status(201).send(salad);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
