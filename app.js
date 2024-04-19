const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 

// Подключение к MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB подключен'))
.catch(err => console.error('Ошибка подключения к MongoDB', err));

const noodleSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String
});

const saladSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String
});

const soupSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String
});

const appetizersSchema = new mongoose.Schema({
  name: String,
  price: String,
  weight: String,
  ingredients: String,
  image: String
});

const cocktailSchema = new mongoose.Schema({
  name: String, 
  price: String, 
  volume: String,
  ingredients: String, 
  image: String 
});

const beerSchema = new mongoose.Schema({
  name: String, 
  price: String, 
  volume: String, 
  image: String 
});

const wineSchema = new mongoose.Schema({
  name: String, 
  price: String, 
  volume: String, 
  image: String 
});

const spiritSchema = new mongoose.Schema({
  name: String, 
  price: String, 
  volume: String, 
  image: String 
});

const coffeeSchema = new mongoose.Schema({
  name: String, 
  price: String, 
  volume: String, 
  image: String 
});


const Cocktail = mongoose.model('Cocktail', cocktailSchema, 'cocktails');

const Beer = mongoose.model('Beer', beerSchema, 'beer');

const Wine = mongoose.model('Wine', wineSchema, 'wine');

const Spirits = mongoose.model('Spirits', spiritSchema, 'spirits');

const Coffee = mongoose.model('Coffee', coffeeSchema, 'coffee');

const Noodle = mongoose.model('Noodle', noodleSchema, 'noodles');

const Salad = mongoose.model('Salad', saladSchema, 'salads');

const Soup = mongoose.model('Soup', soupSchema, 'soups');

const Appetizer = mongoose.model('Appetizer', appetizersSchema, 'appetizers');

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
      return res.status(404).send({ message: 'No soups found' });
    }
    res.json(soups);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
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
  console.log(`Сервер запущен на порту ${PORT}`);
});
