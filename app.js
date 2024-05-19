const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 

// Підключення до MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB підключено'))
.catch(err => console.error('Помилка підключення до MongoDB', err));

const dishSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String
});

const drinkSchema = new mongoose.Schema({
  name: String,
  price: String,
  volume: String,
  ingredients: { type: String, required: false },
  image: String
});

const Noodle = mongoose.model('Noodle', dishSchema, 'noodles');
const Salad = mongoose.model('Salad', dishSchema, 'salads');
const Soup = mongoose.model('Soup', dishSchema, 'soups');
const Appetizer = mongoose.model('Appetizer', dishSchema, 'appetizers');

const Cocktail = mongoose.model('Cocktail', drinkSchema, 'cocktails');
const Beer = mongoose.model('Beer', drinkSchema, 'beer');
const Wine = mongoose.model('Wine', drinkSchema, 'wine');
const Spirits = mongoose.model('Spirits', drinkSchema, 'spirits');
const Coffee = mongoose.model('Coffee', drinkSchema, 'coffee');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/header.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'header.js'));
});

app.get('/footer.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'footer.js'));
});

app.get('/drinks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'barMenu.html'));
});

app.get('/api/drinks/:category', async (req, res) => {
  const { category } = req.params;
  let model;

  switch (category) {
    case 'cocktails':
      model = Cocktail;
      break;
    case 'beer':
      model = Beer; 
      break;
    case 'wine':
      model = Wine; 
      break;
    case 'spirits':
      model = Spirits; 
      break;
    case 'coffee':
      model = Coffee; 
      break;
    default:
      return res.status(404).send('Категорія не знайдена');
  }

  try {
    const drinks = await model.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/noodles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'noodles.html'));
});

app.get('/api/noodles', async (req, res) => {
  try {
    const noodles = await Noodle.find();
    res.json(noodles);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/salads', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'salads.html'));
});

app.get('/api/salads', async (req, res) => {
  try {
    const salads = await Salad.find();
    res.json(salads);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/soups', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'soups.html'));
});

app.get('/api/soups', async (req, res) => {
  try {
    const soups = await Soup.find();
    if (!soups.length) {
      return res.status(404).send({ message: 'Супи не знайдено' });
    }
    res.json(soups);
  } catch (error) {
    res.status(500).send({ message: 'Помилка сервера', error });
  }
});

app.get('/appetizers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'appetizers.html'));
});

app.get('/api/appetizers', async (req, res) => {
  try {
    const appetizers = await Appetizer.find();
    res.json(appetizers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/noodles', async (req, res) => {
  const noodle = new Noodle(req.body);
  try {
    await noodle.save();
    res.status(201).send(noodle);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/salads', async (req, res) => {
  const salad = new Salad(req.body);
  try {
    await salad.save();
    res.status(201).send(salad);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/soups', async (req, res) => {
  const soup = new Soup(req.body);
  try {
    await soup.save();
    res.status(201).send(soup);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/appetizers', async (req, res) => {
  const appetizer = new Appetizer(req.body);
  try {
    await appetizer.save();
    res.status(201).send(appetizer);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
