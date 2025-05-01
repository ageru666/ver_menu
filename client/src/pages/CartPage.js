import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1, 
    }));
    setCart(updatedCart);
  }, []);

  const updateQuantity = (index, increment) => {
    const updatedCart = [...cart];
    const currentItem = updatedCart[index];

    if (currentItem.quantity + increment > 0) {
      currentItem.quantity += increment;
      setCart(updatedCart); 
      localStorage.setItem('cart', JSON.stringify(updatedCart)); 
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); 
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">{item.price} грн</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-4 text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold text-gray-800">Total: {calculateTotal()} грн</p>
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
            >
              Оформити замовленяя
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage