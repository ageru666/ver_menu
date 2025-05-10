import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Сталася помилка');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.name);

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Вхід до облікового запису' : 'Реєстрація нового облікового запису'}
        </h3>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700">Ім'я</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Електронна пошта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? 'Не маєте акаунту? Зареєструватися'
              : 'Вже є акаунт? Увійти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
