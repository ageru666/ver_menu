const express = require('express');
const router = express.Router();
const getModelForCategory = require('../utils/getModelForCategory'); 

router.get('/', async (req, res) => {
  try {
    const DishModel = getModelForCategory('noodles'); 
    const items = await DishModel.find();
    res.json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const DishModel = getModelForCategory('noodles'); 
    const newDish = new DishModel(req.body);
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
