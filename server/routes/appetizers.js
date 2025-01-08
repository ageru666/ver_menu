const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');

router.get('/', async (req, res) => {
  try {
    const appetizers = await Dish.find({ category: 'appetizers' });
    res.json(appetizers);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const appetizer = new Dish({ ...req.body, category: 'appetizers' });
  try {
    await appetizer.save();
    res.status(201).send(appetizer);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
