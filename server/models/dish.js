const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String,
  category: String, 
});

module.exports = dishSchema;
