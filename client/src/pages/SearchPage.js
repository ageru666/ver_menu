import React, { useState, useEffect } from 'react';

const SearchPage = () => {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (item) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, item];
      localStorage.setItem(
        'cart',
        JSON.stringify({
          items: updatedCart,
          timestamp: Date.now(),
        })
      );      
      return updatedCart;
    });
  };

  const handleSearch = async () => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    console.log('Виконуємо пошук за запитом:', query);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}/api/search?query=${encodeURIComponent(query)}`);
      console.log('Статус відповіді:', response.status);
      if (!response.ok) {
        throw new Error(`Помилка запиту: ${response.status}`);
      }
      const data = await response.json();
      console.log('Отримані дані:', data);
      setResults(data);
    } catch (err) {
      console.error('Помилка пошуку:', err);
      setError('Не вдалося виконати пошук. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Пошук страв та напоїв</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Введіть ключові слова..."
          className="border border-gray-400 p-2 rounded-l flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-3 rounded-r ml-2"
          disabled={loading}
        >
          {loading ? 'Пошук...' : 'Пошук'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {(!loading && results.length === 0 && query.trim() !== '') && (
        <p className="text-center">Нічого не знайдено</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map(item => {
          if (item.type === 'dish') {
            return (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Ціна: {item.price}</p>
                  <p className="text-gray-600 text-sm">Вага: {item.weight}</p>
                  <p className="text-gray-600 text-sm mb-4">{item.ingredients}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                  >
                    Додати до кошика
                  </button>
                </div>
              </div>
            );
          } else if (item.type === 'drink') {
            return (
              <div
                key={item._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition transform hover:scale-105"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full object-cover"
                  style={{ height: '300px', objectFit: 'contain' }}
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <h4 className="text-lg font-bold mb-2">{item.name}</h4>
                  <p className="text-gray-600 mb-1"><strong>{item.price}</strong></p>
                  {item.volume && <p className="text-gray-600 mb-1">{item.volume}</p>}
                  {item.ingredients && (
                    <p className="text-gray-600 text-sm">{item.ingredients}</p>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div key={item._id} className="bg-white shadow-md rounded-lg p-4">
                <p>Невідомий тип</p>
              </div>
            );
          }
        })}
      </div>
      <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-full shadow-lg flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-9v9" />
        </svg>
        <span>{cart.length} товар(ів)</span>
      </div>
    </div>
  );
};

export default SearchPage;
