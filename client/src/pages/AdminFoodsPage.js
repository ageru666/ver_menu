import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const dishCategories = [
  { label: 'Салати', value: 'salads' },
  { label: 'Супи', value: 'soups' },
  { label: 'Закуски', value: 'appetizers' },
  { label: 'Локшина', value: 'noodles' },
];

const drinkCategories = [
  { label: 'Коктейлі', value: 'cocktails' },
  { label: 'Пиво', value: 'beer' },
  { label: 'Вино', value: 'wine' },
  { label: 'Міцні', value: 'spirits' },
  { label: 'Кава', value: 'coffee' },
];

const AdminFoodsPage = () => {
  const [activeTab, setActiveTab] = useState('dishes'); // 'dishes' или 'drinks'
  const [selectedCategory, setSelectedCategory] = useState(dishCategories[0].value);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    weight: '',
    ingredients: '',
    image: '',
  });
  const [editingItem, setEditingItem] = useState(null);

  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (!editingItem) {
      setFormData({
        name: '',
        price: '',
        weight: '',
        ingredients: '',
        image: '',
      });
    }
  }, [activeTab, selectedCategory, editingItem]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const endpoint =
          activeTab === 'dishes'
            ? `http://localhost:3002/api/dishes/${selectedCategory}`
            : `http://localhost:3002/api/drinks/${selectedCategory}`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchItems();
  }, [activeTab, selectedCategory, token]);

  const isDishTab = activeTab === 'dishes';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === 'dishes'
          ? `http://localhost:3002/api/dishes/${selectedCategory}`
          : `http://localhost:3002/api/drinks/${selectedCategory}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
      setFormData({ name: '', price: '', weight: '', ingredients: '', image: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей елемент?')) return;
    try {
      const endpoint =
        activeTab === 'dishes'
          ? `http://localhost:3002/api/dishes/${selectedCategory}/${id}`
          : `http://localhost:3002/api/drinks/${selectedCategory}/${id}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete item');
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name ?? '',
      price: item.price ?? '',
      weight: item.weight ?? '',
      ingredients: item.ingredients ?? '',
      image: item.image ?? '',
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === 'dishes'
          ? `${process.env.REACT_APP_API_URL}/api/dishes/${selectedCategory}/${editingItem._id}`
          : `${process.env.REACT_APP_API_URL}/api/drinks/${selectedCategory}/${editingItem._id}`;
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update item');
      const updatedItem = await response.json();
      setItems((prev) =>
        prev.map((itm) => (itm._id === updatedItem._id ? updatedItem : itm))
      );
      setEditingItem(null);
      setFormData({ name: '', price: '', weight: '', ingredients: '', image: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', weight: '', ingredients: '', image: '' });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Адміністрування страв та напоїв
      </h1>

      <div className="flex justify-center mb-6 space-x-6">
        <button
          onClick={() => {
            setActiveTab('dishes');
            setSelectedCategory(dishCategories[0].value);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === 'dishes'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Страви
        </button>
        <button
          onClick={() => {
            setActiveTab('drinks');
            setSelectedCategory(drinkCategories[0].value);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === 'drinks'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Напої
        </button>
      </div>

      <div className="mb-6 text-center">
        <label className="block text-lg font-semibold mb-2">Оберіть категорію:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          {activeTab === 'dishes'
            ? dishCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))
            : drinkCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
        </select>
      </div>

      <div className="bg-white p-4 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          {activeTab === 'dishes' ? 'Список страв' : 'Список напоїв'}
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {items.length === 0 ? (
          <p className="text-gray-600">Немає елементів у цій категорії.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Назва</th>
                  <th className="border border-gray-300 px-4 py-2">Ціна</th>
                  <th className="border border-gray-300 px-4 py-2">Вага</th>
                  <th className="border border-gray-300 px-4 py-2">Інгредієнти</th>
                  <th className="border border-gray-300 px-4 py-2">Фото</th>
                  <th className="border border-gray-300 px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.weight}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.ingredients}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-y-2 space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                        onClick={() => handleEditItem(item)}
                      >
                        Змінити
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingItem ? 'Редагувати елемент' : 'Додати новий елемент'}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Назва:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required={!editingItem} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ціна:</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required={!editingItem} 
            />
          </div>
          
          {isDishTab && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Вага:</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={!editingItem} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Інгредієнти:</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={!editingItem} 
                ></textarea>
              </div>
            </>
          )}

          {!isDishTab && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Вага (необов'язково):</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={false}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Інгредієнти (необов'язково):</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={false}
                ></textarea>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">URL зображення:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required={!editingItem} 
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {editingItem ? 'Оновити елемент' : 'Додати елемент'}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
              Скасувати редагування
            </button>
          )}
        </form>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/admin')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Повернутися до адмін панелі
        </button>
      </div>
    </div>
  );
};

export default AdminFoodsPage;
