import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const HomePage = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [featuredDishes, setFeaturedDishes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/api/dishes')
      .then(res => {
        if (!res.ok) throw new Error('Помилка завантаження страв');
        return res.json();
      })
      .then(data => {
        const featured = data.filter(d => d.featured);
        setFeaturedDishes(featured.length ? featured : data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  const addToCart = (dish) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === dish._id);
      let next;
      if (idx > -1) {
        next = prev.map((i, j) =>
          j === idx ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        next = [...prev, { ...dish, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const totalQty = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);

  return (
    <div>
      <section
        className="relative w-full bg-cover bg-center h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://blog-cdn.aviata.kz/posts/thumbnails/0_1257cf714c5cff33188b4da6a365c8d61995a809.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Song Wu</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
            Справжній смак корейської кухні у серці Києва
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto border rounded-lg p-8 shadow-md text-center">
          <h2 className="text-3xl font-bold mb-4">Про нас</h2>
          <p className="text-gray-600 mb-4">
            Ресторан Song Wu – це місце, де традиції корейської кухні поєднуються з сучасними кулінарними інноваціями.
          </p>
          <p className="text-gray-600 mb-4">
            Ми використовуємо лише найсвіжіші та натуральні інгредієнти, а наші страви готуються за автентичними рецептами, переданими з покоління в покоління.
          </p>
          <p className="text-gray-600">
            Наш заклад створено для тих, хто шукає нові гастрономічні враження та прагне насолодитися справжнім смаком Кореї.
          </p>
        </div>
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Наші фірмові страви</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredDishes.map(dish => (
              <div
                key={dish._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transform transition"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">Ціна: {dish.price} грн</p>
                  <p className="text-gray-600 text-sm mb-1">Вага: {dish.weight}</p>
                  <p className="text-gray-600 text-sm mb-4">{dish.ingredients}</p>
                  <button
                    onClick={() => addToCart(dish)}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Додати до кошика
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Відгуки наших гостей</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="bg-white p-6 rounded-lg shadow-md italic">
              "Найкращий ресторан, який я коли-небудь відвідував! Атмосфера, смак страв та сервіс – все на найвищому рівні."
              <footer className="mt-4 text-right font-semibold">— Марія, Київ</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow-md italic">
              "Відчуваєш себе справді особливим! Рекомендую всім, хто цінує якісну корейську кухню."
              <footer className="mt-4 text-right font-semibold">— Олексій, Київ</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-blue-500 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Забронюйте столик вже сьогодні!</h2>
          <p className="text-white mb-6">
            Резервуйте столик у нашому ресторані і насолоджуйтесь неперевершеними стравами та атмосферою Song Wu.
          </p>
          <a
            href="/contacts"
            className="bg-white text-blue-500 py-3 px-6 rounded-full hover:bg-gray-200 transition"
          >
            Перейти до бронювання
          </a>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-full shadow-lg flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span>{totalQty} товарів</span>
      </div>
    </div>
  );
};

export default HomePage;
