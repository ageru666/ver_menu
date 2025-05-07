import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const MenuPage = ({ apiEndpoint, title }) => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}${apiEndpoint}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, [apiEndpoint]);

  const addToCart = (item) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === item._id);
      let next;
      if (idx > -1) {
        next = prev.map((i, j) =>
          j === idx ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        next = [...prev, { ...item, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition"
          >
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-1">Ціна: {item.price} грн</p>
              <p className="text-gray-600 text-sm mb-1">Вага: {item.weight}</p>
              <p className="text-gray-600 text-sm mb-4">Опис: {item.ingredients}</p>
              <button
                onClick={() => addToCart(item)}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Додати в кошик
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Нижний виджет удалён */}
    </div>
  );
};

export default MenuPage;
