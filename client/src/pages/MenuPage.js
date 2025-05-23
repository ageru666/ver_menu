import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CART_TTL = 30 * 60 * 1000; 

const MenuPage = ({ apiEndpoint, title }) => {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(() => readCart());

  function readCart() {
    const raw = localStorage.getItem('cart');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (parsed.items && parsed.expiry) {
        if (Date.now() <= parsed.expiry) {
          return parsed.items.map(i => ({ ...i, quantity: i.quantity || 1 }));
        } else {
          localStorage.removeItem('cart');
          return [];
        }
      }
      if (Array.isArray(parsed)) {
        return parsed.map(i => ({ ...i, quantity: i.quantity || 1 }));
      }
    } catch {
    }
    return [];
  }

  function saveCart(cartArray) {
    localStorage.setItem(
      'cart',
      JSON.stringify({
        items: cartArray,
        expiry: Date.now() + CART_TTL,
      })
    );
  }

  useEffect(() => {
    fetch(`${API}${apiEndpoint}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, [apiEndpoint]);

  const addToCart = item => {
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
      saveCart(next);
      return next;
    });
  };

  const changeQty = (itemId, delta) => {
    setCart(prev => {
      const next = prev
        .map(i =>
          i._id === itemId ? { ...i, quantity: (i.quantity || 1) + delta } : i
        )
        .filter(i => i.quantity > 0);
      saveCart(next);
      return next;
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold text-center mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => {
          const cartItem = cart.find(i => i._id === item._id);
          return (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-1">Ціна: {item.price}</p>
                <p className="text-gray-600 text-sm mb-1">Вага: {item.weight}</p>
                <p className="text-gray-600 text-sm mb-4">Опис: {item.ingredients}</p>

                {!cartItem ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Додати в кошик
                  </button>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => changeQty(item._id, -1)}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="px-4">{cartItem.quantity}</span>
                    <button
                      onClick={() => changeQty(item._id, +1)}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuPage;
