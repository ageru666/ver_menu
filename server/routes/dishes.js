const express = require('express');
const getModelForCategory = require('../utils/getModelForCategory');

const router = express.Router();

const categories = ['salads', 'soups', 'appetizers', 'noodles'];

router.get('/', async (req, res) => {
  try {
    const allDishes = [];
    for (const category of categories) {
      const DishModel = getModelForCategory(category);
      const dishes = await DishModel.find();
      allDishes.push(...dishes.map(dish => ({ ...dish._doc, category })));
    }
    res.json(allDishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
});

router.get('/:category', async (req, res) => {
  const { category } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DishModel = getModelForCategory(category);
    const dishes = await DishModel.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
});

router.post('/:category', async (req, res) => {
  const { category } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DishModel = getModelForCategory(category);
    const newDish = new DishModel(req.body);
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ message: 'Error adding dish', error: error.message });
  }
});

router.patch('/:category/:id', async (req, res) => {
  const { category, id } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DishModel = getModelForCategory(category);
    const updatedDish = await DishModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: 'Error updating dish', error: error.message });
  }
});

router.delete('/:category/:id', async (req, res) => {
  const { category, id } = req.params;
  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  try {
    const DishModel = getModelForCategory(category);
    const deletedDish = await DishModel.findByIdAndDelete(id);
    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.json({ message: 'Dish deleted', deletedDish });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting dish', error: error.message });
  }
});

module.exports = router;
