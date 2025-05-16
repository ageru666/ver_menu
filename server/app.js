const express       = require('express');
const mongoose      = require('mongoose');
const cors          = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

app.use(helmet());

app.use((req, res, next) => {
  
  res.setHeader('Content-Security-Policy', `default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data:; 
  font-src 'self'; 
  connect-src 'self'; 
  media-src 'self'; 
  object-src 'none'; 
  frame-ancestors 'none'; 
  form-action 'self'; 
  upgrade-insecure-requests;`);
  
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  res.setHeader('X-Frame-Options', 'DENY');
  
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Server</title>
    </head>
    <body>
      <h1>API Server</h1>
      <p>This is the API server for the application.</p>
    </body>
    </html>
  `);
});

app.use('/api/drinks', require('./routes/drinks'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/search', require('./routes/search'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/promos', require('./routes/promo'));
app.use('/api/users', require('./routes/users')); 

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
