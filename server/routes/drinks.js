const express = require('express');
const router = express.Router();
const Drink = require('../models/drink');

router.get('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const drinks = await Drink.find({ category });
    res.json(drinks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:category', async (req, res) => {
  const { category } = req.params;
  const drink = new Drink({ ...req.body, category });
  try {
    await drink.save();
    res.status(201).send(drink);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
