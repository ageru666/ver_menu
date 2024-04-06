
const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

const noodles = [
    { id: 1, name: 'Локшина Удон з куркою', price: '150 грн', weight: '250г', ingredients: 'Удон, курка, овочі, соєвий соус', image: 'https://novosti24.kyiv.ua/wp-content/uploads/2023/07/recipe_f0caba4f-243a-4fe8-bed5-e04452bff4a0_w450.jpg' },
    { id: 2, name: 'Локшина Соба з яловичиною', price: '170 грн', weight: '300г', ingredients: 'Соба, яловичина, овочі, соус теріякі', image: 'https://contrabanda.kiev.ua/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/f/i/file_5_3_1.jpg' },
    { id: 3, name: 'Рамен з морепродуктами', price: '180 грн', weight: '350г', ingredients: 'Рамен, морепродукти, бульйон, яйце', image: 'https://yasensvit.ua/uploads/recipes/prev/5e5cfff6a6f50.jpg' },
    { id: 4, name: 'Локшина з тофу та грибами', price: '130 грн', weight: '250г', ingredients: 'Локшина, тофу, гриби шіітаке, овочевий бульйон', image: 'https://picantecooking.com/pictures/2015-01/egg-noodles-stir-fry13-6404ce32b0376884159061.jpg' },
    { id: 5, name: 'Локшина Хейзен з креветками', price: '190 грн', weight: '300г', ingredients: 'Локшина Хейзен, креветки, овочі, гострий соус', image: 'https://radiotrek.rv.ua/uploads/media/54/7a/547aaa3ff9d5535bde4132ec14a1bbff_orig.jpg' },
    { id: 6, name: 'Локшина Карі з качкою', price: '200 грн', weight: '300г', ingredients: 'Локшина, качка, овочі, карі', image: 'https://shuba.life/static/content/thumbs/1200x630/f/37/s7arrm---c2000x1050x0sx182s-up--bc920b28d007fec239950a421b1ba37f.jpg' },
    { id: 7, name: 'Вегетаріанська локшина', price: '120 грн', weight: '250г', ingredients: 'Локшина, асорті овочів, соєвий соус', image: 'https://shuba.life/static/content/thumbs/1905x884/5/ab/5q2wmo---c1905x884x50px50p-up--e9316cafc3058d5d4e0b82e3a201bab5.jpg' },
    { id: 8, name: 'Локшина з волованом та грибами', price: '175 грн', weight: '300г', ingredients: 'Локшина, волован, гриби, кремовий соус', image: 'https://picantecooking.com/pictures/2020-03/soba-noodles-with-sesame8-6404dbb44c96f185413985.jpg' },
    { id: 9, name: 'Локшина з морським гребінцем', price: '250 грн', weight: '350г', ingredients: 'Локшина, морські гребінці, овочі, соус устриць', image: 'https://tykami.com.ua/image/cache/catalog/news/paste-shrimp-and-scallops-4-896x588.jpg' }
];


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/noodles', (req, res) => {
    res.json(noodles);
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});