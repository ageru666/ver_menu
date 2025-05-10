import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mt-10 space-y-8 pb-10">
      <h1 className="text-4xl font-bold text-center mb-8">Адміністрування</h1>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition"
        >
          Адміністрування користувачів
        </button>
        <button
          onClick={() => navigate('/admin/foods')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Адміністрування страв та напоїв
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition"
        >
          Адміністрування замовлень
        </button>
        <button
          onClick={() => navigate('/admin/reservations')}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
        >
          Адміністрування резервувань
        </button>
        <button
          onClick={() => navigate('/admin/promos')}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow hover:bg-yellow-600 transition"
        >
          Адміністрування промокодів
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
