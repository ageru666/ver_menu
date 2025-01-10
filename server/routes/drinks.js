const express = require('express');
const router = express.Router();
const getDrinkModelForCategory = require('../utils/getDrinkModelForCategory'); 

router.get('/:category?', async (req, res) => {
  const { category } = req.params;
  try {
    if (category) {
      const DrinkModel = getDrinkModelForCategory(category);
      const drinks = await DrinkModel.find();
      res.json(drinks);
    } else {
      const categories = ['cocktails', 'beer', 'wine', 'spirits', 'coffee']; 
      const allDrinks = [];
      for (const cat of categories) {
        const DrinkModel = getDrinkModelForCategory(cat);
        const drinks = await DrinkModel.find();
        allDrinks.push(...drinks);
      }
      res.json(allDrinks);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const DrinkModel = getDrinkModelForCategory(category);
    const newDrink = new DrinkModel(req.body);
    await newDrink.save();
    res.status(201).json(newDrink);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
