const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');

router.get('/', async (req, res) => {
  try {
    const soups = await Dish.find({ category: 'soups' });
    res.json(soups);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const soup = new Dish({ ...req.body, category: 'soups' });
  try {
    await soup.save();
    res.status(201).send(soup);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
