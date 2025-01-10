const mongoose = require('mongoose');
const drinkSchema = require('../models/drink'); 

const getDrinkModelForCategory = (category) => {
  if (mongoose.models[category]) {
    return mongoose.models[category]; 
  }
  return mongoose.model(category, drinkSchema, category); 
};

module.exports = getDrinkModelForCategory;
