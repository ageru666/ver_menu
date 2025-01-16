import React, { useEffect, useState } from 'react';

const MenuPage = ({ apiEndpoint, title }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3002${apiEndpoint}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, [apiEndpoint]);

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
            key={item._id || item.name}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm">Price: {item.price}</p>
              <p className="text-gray-600 text-sm">Weight: {item.weight}</p>
              <p className="text-gray-600 text-sm mb-4">{item.ingredients}</p>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
