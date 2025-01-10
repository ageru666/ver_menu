const mongoose = require('mongoose');
const dishSchema = require('../models/dish'); 

const getModelForCategory = (category) => {
  if (mongoose.models[category]) {
    return mongoose.models[category]; 
  }
  return mongoose.model(category, dishSchema, category); 
};

module.exports = getModelForCategory;
