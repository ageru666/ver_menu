import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const roleLabels = {
  admin: 'Адміністратор',
  visitor: 'Користувач',
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
    const sortedUsers = [...users].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    return a.name.localeCompare(b.name);
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });        
        if (!response.ok) {
          throw new Error('Не вдалося завантажити користувачів');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, [token]);

  const deleteUser = async (userId) => {
    if (!window.confirm('Ви впевнені, що хочете видалити користувача?')) return;
    try {
      const response = await fetch(`${API}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Не вдалося видалити користувача');
      }
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.message);
    }
  };

  
  const updateRole = async (userId, newRole) => {
   try {
     const res = await fetch(`${API}/api/users/${userId}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       },
       body: JSON.stringify({ role: newRole }),
     });
     if (!res.ok) throw new Error('Не вдалося оновити роль');
     const updated = await res.json();
     setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
   } catch (err) {
     alert(err.message);
   }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Адміністрування користувачів
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="bg-white p-4 rounded shadow-md">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Ім'я</th>
              <th className="border border-gray-300 px-4 py-2">Пошта</th>
              <th className="border border-gray-300 px-4 py-2">Роль</th>
              <th className="border border-gray-300 px-4 py-2">Дії</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                 <select
                   value={user.role}
                   onChange={e => updateRole(user._id, e.target.value)}
                   className="border rounded p-1 text-sm"
                 >
                   <option value="visitor">Користувач</option>
                   <option value="admin">Адміністратор</option>
                 </select>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  Користувачів не знайдено.
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

export default AdminUsersPage;
