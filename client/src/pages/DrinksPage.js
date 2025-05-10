import React, { useEffect, useState } from 'react';

const categoryLabels = {
  cocktails: 'Коктейлі',
  beer: 'Пиво',
  wine: 'Вино',
  spirits: 'Міцні напої',
  coffee: 'Кава',
};

const DrinksPage = () => {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  const [drinksData, setDrinksData] = useState({
    cocktails: [],
    beer: [],
    wine: [],
    spirits: [],
    coffee: [],
  });

  useEffect(() => {
    const fetchDrinks = async (category) => {
      try {
        const response = await fetch(`${API}/api/drinks/${category}`);
        if (!response.ok) {
          throw new Error(`Error fetching ${category}`);
        }
        const data = await response.json();
        setDrinksData((prevData) => ({
          ...prevData,
          [category]: data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    Object.keys(categoryLabels).forEach(fetchDrinks);
  }, []);

  const renderCategory = (categoryName, categoryData) => {
    const label = categoryLabels[categoryName] || categoryName;
    return (
      <div className="mb-10" key={categoryName}>
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
            {label}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categoryData.map((drink) => (
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition transform hover:scale-105"
                key={drink._id}
              >
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full object-cover"
                  style={{ height: '300px', objectFit: 'contain' }}
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h4 className="text-lg font-bold mb-2">{drink.name}</h4>
                  <p className="text-gray-600 mb-1">
                    Ціна: {drink.price}
                  </p>
                  {drink.volume && (
                    <p className="text-gray-600 mb-1">Об'єм: {drink.volume}</p>
                  )}
                  {drink.ingredients && (
                    <p className="text-gray-600 text-sm">Опис: {drink.ingredients}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Барне меню</h2>
      {Object.entries(drinksData).map(([categoryName, categoryData]) =>
        renderCategory(categoryName, categoryData)
      )}
    </div>
  );
};

export default DrinksPage;
