import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import InputMask from 'react-input-mask';

const ContactsPage = () => {
  const [reservationInfo, setReservationInfo] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reservationInfo.phone.includes('_')) {
      alert("Будь ласка, введіть повністю номер телефону у форматі (0XX)XXX-XX-XX.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationInfo),
      });
      if (response.ok) {
        alert("Ваша заявка на бронювання відправлена! Наш менеджер зв'яжеться з вами.");
        setReservationInfo({
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: 1,
        });
      } else {
        const errorData = await response.json();
        alert("Помилка при відправці заявки: " + errorData.message);
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Виникла помилка. Будь ласка, спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Контакти</h1>
      <div className="flex flex-col items-center space-y-4 mb-12">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-green-500 text-2xl mr-2" />
          <span className="text-gray-600 text-sm">
            вул. Прикладна, 123, Київ, Україна
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6 items-center">
          <div className="flex items-center">
            <FaPhone className="text-green-500 text-2xl mr-2" />
            <span className="text-gray-600 text-sm">Ресторан: (044) 123-45-67</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-green-500 text-2xl mr-2" />
            <span className="text-gray-600 text-sm">Доставка: (044) 765-43-21</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
        <p className="text-lg text-gray-800 text-center mb-4">
          Бажаєте забронювати столик в одному з наших ресторанів?
          <br />
          Залиште заявку, і наш менеджер зв'яжеться з вами для уточнення деталей бронювання.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ім'я
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={reservationInfo.name}
              onChange={handleChange}
              placeholder="Ваше ім'я"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Вкажіть телефон (+38)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +38
              </span>
              <InputMask
                mask="(099)999-99-99"
                value={reservationInfo.phone}
                onChange={handleChange}
                maskChar="_"
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="(0XX)XXX-XX-XX"
                    className="flex-grow border border-gray-300 p-2 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
              </InputMask>
            </div>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Дата
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={reservationInfo.date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Час (інтервал 30 хв)
            </label>
            <input
              id="time"
              type="time"
              name="time"
              value={reservationInfo.time}
              onChange={handleChange}
              step="1800"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Кількість гостей
            </label>
            <input
              id="guests"
              type="number"
              name="guests"
              min="1"
              value={reservationInfo.guests}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Відправка..." : "Залишити заявку"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactsPage;
