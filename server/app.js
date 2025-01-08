const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Маршруты
const noodleRoutes = require('./routes/noodles');
const saladRoutes = require('./routes/salads');
const soupRoutes = require('./routes/soups');
const appetizerRoutes = require('./routes/appetizers');
const drinkRoutes = require('./routes/drinks');

app.use('/api/noodles', noodleRoutes);
app.use('/api/salads', saladRoutes);
app.use('/api/soups', soupRoutes);
app.use('/api/appetizers', appetizerRoutes);
app.use('/api/drinks', drinkRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
