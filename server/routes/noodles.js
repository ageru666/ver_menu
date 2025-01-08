const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');

router.get('/', async (req, res) => {
  try {
    const noodles = await Dish.find({ category: 'noodles' });
    res.json(noodles);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const noodle = new Dish({ ...req.body, category: 'noodles' });
  try {
    await noodle.save();
    res.status(201).send(noodle);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
