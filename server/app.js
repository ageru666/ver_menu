const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const drinkRoutes = require('./routes/drinks');
const userRoutes = require('./routes/users'); 
const dishRoutes = require('./routes/dishes'); 


app.use('/api/drinks', drinkRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/dishes', dishRoutes); 

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
