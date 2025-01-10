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
    <div className="container mt-5">
      <h2 className="menu-title text-center">{title}</h2>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item._id || item.name}> {}
            <div className="card">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.price}</p>
                <p className="card-text">{item.weight}</p>
                <p className="card-text">{item.ingredients}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
