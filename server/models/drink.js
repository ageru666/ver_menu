const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
  name: String,
  price: String,
  volume: String,
  ingredients: { type: String, required: false },
  image: String,
});

module.exports = drinkSchema; 
