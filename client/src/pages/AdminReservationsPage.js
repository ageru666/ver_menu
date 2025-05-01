import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const reservationStatusPriority = {
  active: 1,
  completed: 2,
  canceled: 3,
};

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [showActiveReservations, setShowActiveReservations] = useState(true);
  const [showArchivedReservations, setShowArchivedReservations] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch reservations');
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchReservations();
  }, [token]);

  const updateReservationStatus = async (reservationId, newStatus) => {
    if (!window.confirm(`Изменить статус бронирования на "${newStatus}"?`)) return;
    try {
      const response = await fetch(`http://localhost:3002/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update reservation status');
      const updatedReservation = await response.json();
      setReservations(prev =>
        prev.map(res => (res._id === updatedReservation._id ? updatedReservation : res))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowDetails = (reservation, e) => {
    e.stopPropagation();
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  const activeReservations = reservations
    .filter(r => !r.status || r.status === 'active')
    .sort((a, b) => {
      const prioA = reservationStatusPriority[a.status] || 1;
      const prioB = reservationStatusPriority[b.status] || 1;
      if (prioA !== prioB) return prioA - prioB;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const archivedReservations = reservations
    .filter(r => r.status === 'completed' || r.status === 'canceled')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">Адміністрування резервувань</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* SECTION: ACTIVE RESERVATIONS */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Active Reservations</h2>
          <button
            onClick={() => setShowActiveReservations(!showActiveReservations)}
            className="text-sm text-blue-500 underline"
          >
            {showActiveReservations ? 'Hide' : 'Show'}
          </button>
        </div>
        {showActiveReservations && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Reservation ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Time</th>
                  <th className="border border-gray-300 px-4 py-2">Guests</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeReservations.map(res => (
                  <tr key={res._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{res._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(res.date).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.guests}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <select
                        value={res.status || 'active'}
                        onChange={(e) => updateReservationStatus(res._id, e.target.value)}
                        className="border border-gray-300 rounded p-1 text-sm"
                      >
                        <option value="active">active</option>
                        <option value="completed">completed</option>
                        <option value="canceled">canceled</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={(e) => handleShowDetails(res, e)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {activeReservations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">No active reservations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION: ARCHIVED RESERVATIONS */}
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Archived Reservations</h2>
          <button
            onClick={() => setShowArchivedReservations(!showArchivedReservations)}
            className="text-sm text-blue-500 underline"
          >
            {showArchivedReservations ? 'Hide' : 'Show'}
          </button>
        </div>
        {showArchivedReservations && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Reservation ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Time</th>
                  <th className="border border-gray-300 px-4 py-2">Guests</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedReservations.map(res => (
                  <tr key={res._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{res._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(res.date).toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.time}</td>
                    <td className="border border-gray-300 px-4 py-2">{res.guests}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={
                          res.status === 'completed'
                            ? 'text-green-600 font-semibold'
                            : res.status === 'canceled'
                            ? 'text-red-600 font-semibold'
                            : ''
                        }
                      >
                        {res.status || 'active'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => updateReservationStatus(res._id, 'active')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                      >
                        Revert
                      </button>
                    </td>
                  </tr>
                ))}
                {archivedReservations.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-gray-500">No archived reservations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4">Reservation Details</h3>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="space-y-3">
              <p>
                <span className="font-medium">Reservation ID:</span> {selectedReservation._id}
              </p>
              <p>
                <span className="font-medium">Name:</span> {selectedReservation.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selectedReservation.phone}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(selectedReservation.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span> {selectedReservation.time}
              </p>
              <p>
                <span className="font-medium">Guests:</span> {selectedReservation.guests}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedReservation.status || 'active'}
              </p>
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

export default AdminReservationsPage;
