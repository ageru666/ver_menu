const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const drinkRoutes = require('./routes/drinks');
const userRoutes = require('./routes/users'); 
const dishRoutes = require('./routes/dishes'); 
const orderRoutes = require('./routes/orders');
const searchRouter = require('./routes/search');
const reservationsRouter = require('./routes/reservations');

app.use('/api/drinks', drinkRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/dishes', dishRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/promos', require('./routes/promo'));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
