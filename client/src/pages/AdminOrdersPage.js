import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const statusPriority = {
  pending: 1,
  confirmed: 2,
  cooking: 3,
  'on delivery': 4,
};

const statuses = [
  { value: 'pending',     label: 'Очікується'   },
  { value: 'confirmed',   label: 'Підтверджено' },
  { value: 'cooking',     label: 'Готується'    },
  { value: 'on delivery', label: 'У дорозі'   },
  { value: 'delivered',   label: 'Доставлено'   },
  { value: 'canceled',    label: 'Скасовано'    },
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [showActiveOrders, setShowActiveOrders] = useState(true);
  const [showArchivedOrders, setShowArchivedOrders] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Не вдалося завантажити замовлення');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, [token]);

  const activeOrders = orders
    .filter(o => o.status !== 'delivered' && o.status !== 'canceled')
    .sort((a, b) => {
      const pa = statusPriority[a.status] || 99;
      const pb = statusPriority[b.status] || 99;
      if (pa !== pb) return pa - pb;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const archivedOrders = orders
    .filter(o => o.status === 'delivered' || o.status === 'canceled')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const updateOrderStatus = async (orderId, newStatus) => {
    const label = statuses.find(s => s.value === newStatus)?.label;
    if (!window.confirm(`Ви впевнені, що хочете змінити статус на "${label}"?`)) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Не вдалося оновити статус');
      const updated = await res.json();
      setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowDetails = (order, e) => {
    e.stopPropagation();
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Адміністрування замовлень</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Активні замовлення */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Активні замовлення</h2>
          <button
            onClick={() => setShowActiveOrders(!showActiveOrders)}
            className="text-sm text-blue-500 underline"
          >
            {showActiveOrders ? 'Приховати' : 'Показати'}
          </button>
        </div>
        {showActiveOrders && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">№ замовлення</th>
                  <th className="border px-4 py-2">Ім’я</th>
                  <th className="border px-4 py-2">Статус</th>
                  <th className="border px-4 py-2">Сума (грн)</th>
                  <th className="border px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{order.orderNumber || order._id}</td>
                    <td className="border px-4 py-2">{order.contactInfo?.name}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order._id, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        {statuses.map(s => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border px-4 py-2 text-right">{order.total?.toFixed(2)}</td>
                    <td className="border px-4 py-2 text-center space-y-2">
                      <button
                        onClick={e => handleShowDetails(order, e)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Деталі
                      </button>
                      {(order.status === 'delivered' || order.status === 'canceled') && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'pending')}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        >
                          Повернути
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {activeOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      Активних замовлень не знайдено.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Архівні замовлення */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Архівні замовлення</h2>
          <button
            onClick={() => setShowArchivedOrders(!showArchivedOrders)}
            className="text-sm text-blue-500 underline"
          >
            {showArchivedOrders ? 'Приховати' : 'Показати'}
          </button>
        </div>
        {showArchivedOrders && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">№ замовлення</th>
                  <th className="border px-4 py-2">Ім’я</th>
                  <th className="border px-4 py-2">Статус</th>
                  <th className="border px-4 py-2">Сума (грн)</th>
                  <th className="border px-4 py-2">Дії</th>
                </tr>
              </thead>
              <tbody>
                {archivedOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{order.orderNumber || order._id}</td>
                    <td className="border px-4 py-2">{order.contactInfo?.name}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={
                          order.status === 'delivered'
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                        }
                      >
                        {statuses.find(s => s.value === order.status)?.label}
                      </span>
                    </td>
                    <td className="border px-4 py-2 text-right">{order.total?.toFixed(2)}</td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => updateOrderStatus(order._id, 'pending')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Повернути
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      Архівних замовлень не знайдено.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модалка з деталями */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Деталі замовлення</h3>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="space-y-3">
              <p><span className="font-medium">№:</span> {selectedOrder.orderNumber || selectedOrder._id}</p>
              <p><span className="font-medium">Статус:</span> {statuses.find(s => s.value === selectedOrder.status)?.label}</p>
              <p><span className="font-medium">Сума:</span> {selectedOrder.total?.toFixed(2)} грн</p>

              {selectedOrder.contactInfo && (
                <>
                  <p><span className="font-medium">Ім’я:</span> {selectedOrder.contactInfo.name}</p>
                  <p><span className="font-medium">Телефон:</span> {selectedOrder.contactInfo.phone}</p>
                  {selectedOrder.contactInfo.email && (
                    <p><span className="font-medium">Email:</span> {selectedOrder.contactInfo.email}</p>
                  )}
                </>
              )}

              {selectedOrder.orderType === 'Доставка' && selectedOrder.deliveryInfo && (
                <>
                  <p><span className="font-medium">Вулиця:</span> {selectedOrder.deliveryInfo.street}</p>
                  <p><span className="font-medium">Будинок:</span> {selectedOrder.deliveryInfo.building}</p>
                  {selectedOrder.deliveryInfo.entrance && (
                    <p><span className="font-medium">Під’їзд:</span> {selectedOrder.deliveryInfo.entrance}</p>
                  )}
                  {selectedOrder.deliveryInfo.comment && (
                    <p><span className="font-medium">Коментар:</span> {selectedOrder.deliveryInfo.comment}</p>
                  )}
                </>
              )}

              {selectedOrder.orderType === 'Самовивіз' && (
                <p><span className="font-medium">Самовивіз:</span> за адресою вул. Центральна, 10, Київ</p>
              )}

              {selectedOrder.cart && selectedOrder.cart.length > 0 && (
                <div>
                  <h4 className="font-semibold">Склад кошика:</h4>
                  <ul className="list-disc list-inside">
                    {selectedOrder.cart.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} грн
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminOrdersPage;
