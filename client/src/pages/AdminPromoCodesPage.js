import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPromoCodesPage = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({
    code: '',
    discountType: 'fixed',
    amount: '',
    expiresAt: '',
    usageLimit: ''
  });
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';

  useEffect(() => {
  const fetchCodes = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API}/api/promos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Не вдалося завантажити промокоди');
      const data = await res.json();
      setCodes(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };
  fetchCodes();
}, [API]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleCreate = async e => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        amount: parseFloat(form.amount),
        expiresAt: form.expiresAt || null,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : null
      };
      const res = await fetch(`${API}/api/promos`, {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setForm({
        code: '',
        discountType: 'fixed',
        amount: '',
        expiresAt: '',
        usageLimit: ''
      });
      const updated = await res.json();
      setCodes(prev => [...prev, updated]);
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Видалити цей промокод?')) return;
    try {
      const res = await fetch(`${API}/api/promos/${id}`, { 
          method: 'DELETE',
          headers: {
          'Authorization': `Bearer ${token}`
         }
         });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setCodes(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Адміністрування промокодів</h1>

      <form onSubmit={handleCreate} className="max-w-2xl mx-auto bg-white p-6 rounded shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Код</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Тип знижки</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="fixed">Фіксована</option>
              <option value="percent">Відсоток</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Сума / %</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Закінчення (опц.)</label>
            <input
              name="expiresAt"
              type="date"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ліміт використань (опц.)</label>
            <input
              name="usageLimit"
              type="number"
              value={form.usageLimit}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Додати промокод
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Код</th>
              <th className="px-4 py-2">Тип</th>
              <th className="px-4 py-2">Сума</th>
              <th className="px-4 py-2">Використано</th>
              <th className="px-4 py-2">Ліміт</th>
              <th className="px-4 py-2">Закінчення</th>
              <th className="px-4 py-2">Дії</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{c.code}</td>
                <td className="border px-4 py-2">{c.discountType}</td>
                <td className="border px-4 py-2">{c.amount}</td>
                <td className="border px-4 py-2">{c.usedCount}</td>
                <td className="border px-4 py-2">{c.usageLimit ?? '∞'}</td>
                <td className="border px-4 py-2">
                  {c.expiresAt
                    ? new Date(c.expiresAt).toLocaleDateString()
                    : '—'}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Промокодів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-center">
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

export default AdminPromoCodesPage;
