const express = require('express');
const router = express.Router();
const getDrinkModelForCategory = require('../utils/getDrinkModelForCategory');
const { protect, adminOnly } = require('../utils/authMiddleware');

const categories = ['cocktails', 'beer', 'wine', 'spirits', 'coffee'];

router.get('/:category?', async (req, res) => {
  const { category } = req.params;
  try {
    if (category) {
      if (!categories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      const DrinkModel = getDrinkModelForCategory(category);
      const drinks = await DrinkModel.find();
      return res.json(drinks);
    } else {
      const allDrinks = [];
      for (const cat of categories) {
        const DrinkModel = getDrinkModelForCategory(cat);
        const drinks = await DrinkModel.find();
        allDrinks.push(...drinks);
      }
      return res.json(allDrinks);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drinks', error: error.message });
  }
});

router.post('/:category', protect, adminOnly, async (req, res) => {
  const { category } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DrinkModel = getDrinkModelForCategory(category);
    const newDrink = new DrinkModel(req.body);
    await newDrink.save();
    res.status(201).json(newDrink);
  } catch (error) {
    res.status(500).json({ message: 'Error adding drink', error: error.message });
  }
});

router.patch('/:category/:id', protect, adminOnly, async (req, res) => {
  const { category, id } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DrinkModel = getDrinkModelForCategory(category);
    const updatedDrink = await DrinkModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDrink) {
      return res.status(404).json({ message: 'Drink not found' });
    }
    res.json(updatedDrink);
  } catch (error) {
    res.status(500).json({ message: 'Error updating drink', error: error.message });
  }
});

router.delete('/:category/:id', protect, adminOnly, async (req, res) => {
  const { category, id } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DrinkModel = getDrinkModelForCategory(category);
    const deletedDrink = await DrinkModel.findByIdAndDelete(id);
    if (!deletedDrink) {
      return res.status(404).json({ message: 'Drink not found' });
    }
    res.json({ message: 'Drink deleted', deletedDrink });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting drink', error: error.message });
  }
});

module.exports = router;
