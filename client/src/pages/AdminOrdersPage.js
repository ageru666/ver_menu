import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const statusPriority = {
  pending: 1,
  confirmed: 2,
  cooking: 3,
  'on delivery': 4,
};

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
        const response = await fetch('http://localhost:3002/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, [token]);

  const activeOrders = orders
    .filter(order => order.status !== 'delivered' && order.status !== 'canceled')
    .sort((a, b) => {
      const prioA = statusPriority[a.status] || 99;
      const prioB = statusPriority[b.status] || 99;
      if (prioA !== prioB) return prioA - prioB;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const archivedOrders = orders
    .filter(order => order.status === 'delivered' || order.status === 'canceled')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Вы уверены, что хотите изменить статус на "${newStatus}"?`))
      return;
    try {
      const response = await fetch(`http://localhost:3002/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update order status');
      const updatedOrder = await response.json();
      setOrders(prev =>
        prev.map(order => order._id === updatedOrder._id ? updatedOrder : order)
      );
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
      <h1 className="text-3xl font-bold text-center mb-6">Адміністрування замовлень</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* SECTION: ACTIVE ORDERS */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Active Orders</h2>
          <button onClick={() => setShowActiveOrders(!showActiveOrders)} className="text-sm text-blue-500 underline">
            {showActiveOrders ? 'Hide' : 'Show'}
          </button>
        </div>
        {showActiveOrders && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Order #</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Total (грн)</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{order.orderNumber || order._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.contactInfo?.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="border border-gray-300 rounded p-1 text-sm"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cooking">cooking</option>
                        <option value="on delivery">on delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="canceled">canceled</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{order.total?.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center space-y-2">
                      <button
                        onClick={(e) => handleShowDetails(order, e)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                      >
                        Details
                      </button>
                      {(order.status === 'delivered' || order.status === 'canceled') && (
                        <button
                          onClick={() => updateOrderStatus(order._id, 'pending')}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                        >
                          Revert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {activeOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No active orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION: ARCHIVED ORDERS */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Archived Orders</h2>
          <button onClick={() => setShowArchivedOrders(!showArchivedOrders)} className="text-sm text-blue-500 underline">
            {showArchivedOrders ? 'Hide' : 'Show'}
          </button>
        </div>
        {showArchivedOrders && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Order #</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Total (грн)</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{order.orderNumber || order._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.contactInfo?.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={
                          order.status === 'delivered'
                            ? 'text-green-600 font-semibold'
                            : order.status === 'canceled'
                            ? 'text-red-600 font-semibold'
                            : ''
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{order.total?.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => updateOrderStatus(order._id, 'pending')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                      >
                        Revert
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No archived orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Order #:</span>{' '}
                {selectedOrder.orderNumber || selectedOrder._id}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedOrder.status}
              </p>
              <p>
                <span className="font-medium">Total:</span> {selectedOrder.total?.toFixed(2)} грн
              </p>
              {selectedOrder.contactInfo && (
                <>
                  <p>
                    <span className="font-medium">Name:</span> {selectedOrder.contactInfo.name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {selectedOrder.contactInfo.phone}
                  </p>
                  {selectedOrder.contactInfo.email && (
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.contactInfo.email}
                    </p>
                  )}
                </>
              )}
              {selectedOrder.orderType === 'Доставка' && selectedOrder.deliveryInfo && (
                <>
                  <p>
                    <span className="font-medium">Street:</span> {selectedOrder.deliveryInfo.street}
                  </p>
                  <p>
                    <span className="font-medium">Building:</span> {selectedOrder.deliveryInfo.building}
                  </p>
                  {selectedOrder.deliveryInfo.entrance && (
                    <p>
                      <span className="font-medium">Entrance:</span> {selectedOrder.deliveryInfo.entrance}
                    </p>
                  )}
                  {selectedOrder.deliveryInfo.comment && (
                    <p>
                      <span className="font-medium">Comment:</span> {selectedOrder.deliveryInfo.comment}
                    </p>
                  )}
                </>
              )}
              {selectedOrder.orderType === 'Самовивіз' && (
                <p>
                  <span className="font-medium">Pickup Info:</span> Restaurant address: Київ, вул. Центральна, 10
                </p>
              )}
              {selectedOrder.cart && selectedOrder.cart.length > 0 && (
                <div>
                  <h4 className="font-semibold">Cart Items:</h4>
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
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminOrdersPage;
