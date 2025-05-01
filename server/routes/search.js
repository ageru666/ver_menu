const express = require('express');
const getModelForCategory = require('../utils/getModelForCategory');
const getDrinkModelForCategory = require('../utils/getDrinkModelForCategory');

const router = express.Router();

const dishCategories = ['salads', 'soups', 'appetizers', 'noodles'];
const drinkCategories = ['cocktails', 'beer', 'wine', 'spirits', 'coffee'];

router.get('/', async (req, res) => {
  try {
    const query = req.query.query || '';
    const regex = new RegExp(query, 'i'); 
    let results = [];

    for (const category of dishCategories) {
      const DishModel = getModelForCategory(category);
      const dishes = await DishModel.find({ name: regex });
      results.push(
        ...dishes.map(dish => ({ ...dish._doc, category, type: 'dish' }))
      );
    }

    for (const category of drinkCategories) {
      const DrinkModel = getDrinkModelForCategory(category);
      const drinks = await DrinkModel.find({ name: regex });
      results.push(
        ...drinks.map(drink => ({ ...drink._doc, category, type: 'drink' }))
      );
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при пошуку', error: error.message });
  }
});

module.exports = router;
