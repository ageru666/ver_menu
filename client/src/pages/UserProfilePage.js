import React, { useEffect, useState } from 'react';

const UserProfilePage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchMyOrders = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Не вдалося завантажити ваші замовлення');
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyOrders();
  }, []);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Ваш акаунт</h1>
      <h2 className="text-xl font-semibold mb-2">Ваші замовлення</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">У вас ще немає замовлень.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Номер замовлення</th>
                <th className="border border-gray-300 px-4 py-2">Статус</th>
                <th className="border border-gray-300 px-4 py-2">Сума (грн)</th>
                <th className="border border-gray-300 px-4 py-2">Деталі</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {order.orderNumber || order._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.total?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                      onClick={() => handleShowDetails(order)}
                    >
                      Переглянути
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Деталі замовлення</h3>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Номер замовлення:</span>{' '}
                {selectedOrder.orderNumber || selectedOrder._id}
              </p>
              <p>
                <span className="font-medium">Статус:</span> {selectedOrder.status}
              </p>
              <p>
                <span className="font-medium">Сума:</span> {selectedOrder.total?.toFixed(2)} грн
              </p>
              {selectedOrder.contactInfo && (
                <>
                  <p>
                    <span className="font-medium">Ім'я:</span> {selectedOrder.contactInfo.name}
                  </p>
                  <p>
                    <span className="font-medium">Телефон:</span> {selectedOrder.contactInfo.phone}
                  </p>
                  {selectedOrder.contactInfo.email && (
                    <p>
                      <span className="font-medium">Пошта:</span> {selectedOrder.contactInfo.email}
                    </p>
                  )}
                </>
              )}
              {selectedOrder.orderType === 'Доставка' && selectedOrder.deliveryInfo && (
                <>
                  <p>
                    <span className="font-medium">Вулиця:</span> {selectedOrder.deliveryInfo.street}
                  </p>
                  <p>
                    <span className="font-medium">Будинок:</span> {selectedOrder.deliveryInfo.building}
                  </p>
                  {selectedOrder.deliveryInfo.entrance && (
                    <p>
                      <span className="font-medium">Під'їзд:</span> {selectedOrder.deliveryInfo.entrance}
                    </p>
                  )}
                  {selectedOrder.deliveryInfo.comment && (
                    <p>
                      <span className="font-medium">Коментар:</span> {selectedOrder.deliveryInfo.comment}
                    </p>
                  )}
                </>
              )}
              {selectedOrder.orderType === 'Самовивіз' && (
                <p>
                  <span className="font-medium">Інфо самовивозу:</span> Київ, вул. Центральна, 10
                </p>
              )}
              {selectedOrder.cart && selectedOrder.cart.length > 0 && (
                <div>
                  <h4 className="font-semibold">Замовлені позиції:</h4>
                  <ul className="list-disc list-inside">
                    {selectedOrder.cart.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity} = {(item.price * item.quantity).toFixed(2)} грн
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-5 text-right">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
