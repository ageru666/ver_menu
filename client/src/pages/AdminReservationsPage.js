import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const reservationStatusPriority = {
  active: 1,
  completed: 2,
  canceled: 3,
};

const statuses = [
  { value: 'active',    label: 'Активне'    },
  { value: 'completed', label: 'Завершене'  },
  { value: 'canceled',  label: 'Скасоване'  },
];

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [showArchived, setShowArchived] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('${process.env.REACT_APP_API_URL}/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Не вдалося завантажити бронювання');
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReservations();
  }, [token]);

  const updateStatus = async (id, status) => {
    const label = statuses.find(s => s.value === status)?.label;
    if (!window.confirm(`Змінити статус на „${label}“?`)) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Не вдалося оновити статус');
      const updated = await res.json();
      setReservations(prev =>
        prev.map(r => r._id === updated._id ? updated : r)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const activeReservations = reservations
    .filter(r => !r.status || r.status === 'active')
    .sort((a, b) => {
      const pa = reservationStatusPriority[a.status] || 1;
      const pb = reservationStatusPriority[b.status] || 1;
      if (pa !== pb) return pa - pb;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const archivedReservations = reservations
    .filter(r => r.status === 'completed' || r.status === 'canceled')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const openModal = (r, e) => {
    e.stopPropagation();
    setSelected(r);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Адміністрування бронювань</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Активні бронювання */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Активні бронювання</h2>
          <button
            onClick={() => setShowActive(!showActive)}
            className="text-sm text-blue-500 underline"
          >
            {showActive ? 'Приховати' : 'Показати'}
          </button>
        </div>
        {showActive && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Ім’я</th>
                  <th className="border px-4 py-2">Телефон</th>
                  <th className="border px-4 py-2">Дата</th>
                  <th className="border px-4 py-2">Час</th>
                  <th className="border px-4 py-2">Гості</th>
                  <th className="border px-4 py-2">Статус</th>
                  <th className="border px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {activeReservations.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{r._id}</td>
                    <td className="border px-4 py-2">{r.name}</td>
                    <td className="border px-4 py-2">{r.phone}</td>
                    <td className="border px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{r.time}</td>
                    <td className="border px-4 py-2">{r.guests}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={r.status || 'active'}
                        onChange={e => updateStatus(r._id, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        {statuses.map(s => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={e => openModal(r, e)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Деталі
                      </button>
                    </td>
                  </tr>
                ))}
                {activeReservations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">
                      Активних бронювань не знайдено.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Архівні бронювання */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Архівні бронювання</h2>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm text-blue-500 underline"
          >
            {showArchived ? 'Приховати' : 'Показати'}
          </button>
        </div>
        {showArchived && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Ім’я</th>
                  <th className="border px-4 py-2">Телефон</th>
                  <th className="border px-4 py-2">Дата</th>
                  <th className="border px-4 py-2">Час</th>
                  <th className="border px-4 py-2">Гості</th>
                  <th className="border px-4 py-2">Статус</th>
                  <th className="border px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {archivedReservations.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{r._id}</td>
                    <td className="border px-4 py-2">{r.name}</td>
                    <td className="border px-4 py-2">{r.phone}</td>
                    <td className="border px-4 py-2">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{r.time}</td>
                    <td className="border px-4 py-2">{r.guests}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={
                          r.status === 'completed'
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {statuses.find(s => s.value === r.status)?.label}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => updateStatus(r._id, 'active')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Повернути
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedReservations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">
                      Архівних бронювань не знайдено.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модалка */}
      {showModal && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Деталі бронювання</h3>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
              ✕
            </button>
            <div className="space-y-3">
              <p><strong>ID:</strong> {selected._id}</p>
              <p><strong>Ім’я:</strong> {selected.name}</p>
              <p><strong>Телефон:</strong> {selected.phone}</p>
              <p><strong>Дата:</strong> {new Date(selected.date).toLocaleDateString()}</p>
              <p><strong>Час:</strong> {selected.time}</p>
              <p><strong>Гості:</strong> {selected.guests}</p>
              <p><strong>Статус:</strong> {statuses.find(s => s.value === selected.status)?.label}</p>
            </div>
            <div className="mt-5 text-right">
              <button onClick={closeModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Повернутися */}
      <div className="text-center mt-6">
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

export default AdminReservationsPage;
