import React, { useEffect, useState } from 'react';

const DrinksPage = () => {
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
        const response = await fetch(`http://localhost:3002/api/drinks/${category}`);
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

    ['cocktails', 'beer', 'wine', 'spirits', 'coffee'].forEach(fetchDrinks);
  }, []);

  const renderCategory = (categoryName, categoryData) => (
    <div className="category-section" key={categoryName}>
      <h3 className="mt-4 mb-3 text-start">
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h3>
      <div className="row">
        {categoryData.map((drink) => (
          <div className="col-md-4 col-sm-12 mb-4" key={drink._id}>
            <div className="card shadow-sm" style={{ height: '100%' }}>
              <img
                src={drink.image}
                className="card-img-top"
                alt={drink.name}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'contain', 
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{drink.name}</h5>
                <p className="card-text mb-1"><strong>{drink.price}</strong></p>
                {drink.volume && <p className="card-text mb-1">{drink.volume}</p>}
                {drink.ingredients && (
                  <p className="card-text">{drink.ingredients}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="menu-title text-center mb-4">Барне меню</h2>
      {Object.entries(drinksData).map(([categoryName, categoryData]) =>
        renderCategory(categoryName, categoryData)
      )}
    </div>
  );
};

export default DrinksPage;
