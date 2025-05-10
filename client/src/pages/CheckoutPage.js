import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('Доставка');
  const [timeOption, setTimeOption] = useState('По готовності');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const API = process.env.REACT_APP_API_URL || 'http://localhost:3002';

  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    street: '',
    building: '',
    entrance: '',
    block: '',
    apartment: '',
    floor: '',
    comment: '',
  });

  useEffect(() => {
    const EXPIRATION_MS = 30 * 60 * 1000;
  
    let raw;
    try {
      raw = JSON.parse(localStorage.getItem('cart'));
    } catch {
      raw = null;
    }
  
    let storedItems = [];
  
  if (Array.isArray(raw)) {
      storedItems = raw;
    }
    else if (raw && Array.isArray(raw.items)) {
      if (
        typeof raw.timestamp !== 'number' ||
        Date.now() - raw.timestamp < EXPIRATION_MS
      ) {
        storedItems = raw.items;
      } else {
        localStorage.removeItem('cart');
        storedItems = [];
      }
    }
  
    const formatted = storedItems.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity, 10) || 1,
    }));
    setCart(formatted);
  
    const initialTotal = formatted.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );
    setTotalBeforeDiscount(initialTotal);
  }, []);
  
  
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalBeforeDiscount(newTotal);
    setFinalTotal(newTotal - discountAmount);
  }, [cart]);

  useEffect(() => {
    setFinalTotal(totalBeforeDiscount - discountAmount);
  }, [discountAmount, totalBeforeDiscount]);

  const handleContactInputChange = e => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryInputChange = e => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderTypeChange = type => {
    setOrderType(type);
    setPaymentMethod('');
  };

  const goBackToCart = () => {
    window.location.href = '/cart';
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !paymentMethod) {
      alert('Будь ласка, оберіть спосіб оплати.');
      return;
    }
    if (currentStep === 2) {
      if (!contactInfo.name.trim()) {
        alert("Будь ласка, введіть ім'я.");
        return;
      }
      const phoneRegex = /^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(contactInfo.phone)) {
        alert('Будь ласка, введіть номер телефону у форматі +38(0XX)XXX-XX-XX.');
        return;
      }
      if (contactInfo.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactInfo.email)) {
          alert('Будь ласка, введіть правильну адресу електронної пошти.');
          return;
        }
      }
    }
    if (currentStep === 3 && orderType === 'Доставка') {
      if (!deliveryInfo.street.trim() || !deliveryInfo.building.trim()) {
        alert('Будь ласка, заповніть вулицю та будинок.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const orderData = {
      cart,
      totalBeforeDiscount,
      promoCode,
      discount: discountAmount,  
      total:      finalTotal,       
      timeOption,
      selectedTime,
      orderType,
      paymentMethod,
      contactInfo,
      deliveryInfo: orderType === 'Доставка' ? deliveryInfo : null,
    };
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API}/api/orders/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      const data = await res.json();
      alert(`Замовлення успішно оформлено! Номер: ${data.orderNumber}`);
     setCart([]);
     localStorage.removeItem('cart');
     // window.location.href = '/';
     navigate('/');
    } catch (err) {
      alert('Помилка: ' + err.message);
    }
  };

  const generateTimeIntervals = () => {
    const intervals = [];
    for (let h = 10; h <= 21; h++) {
      intervals.push(`${h}:00`, `${h}:30`);
    }
    return intervals;
  };

  const getPaymentOptions = () => {
    if (orderType === 'Доставка') {
      return [
        { label: "Готівкою кур'єру", value: "Готівкою кур'єру" },
        { label: "Карткою кур'єру",   value: "Карткою кур'єру"   },
      ];
    }
    return [
      { label: "Готівкою в ресторані", value: "Готівкою в ресторані" },
      { label: "Карткою в ресторані",  value: "Карткою в ресторані"  },
    ];
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      alert('Введіть промокод');
      return;
    }
    try {
      const res = await fetch(
        `${API}/api/promos/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalRaw: totalBeforeDiscount,
            codeRaw: promoCode,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDiscountAmount(data.discount);
      alert(`Знижка застосована: ${data.discount} грн`);
    } catch (err) {
      setDiscountAmount(0);
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Оформлення замовлення
      </h1>

      {currentStep === 1 && (
        <form onSubmit={e => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
          {/* Крок 1: Тип, час, оплата */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium mb-3 text-gray-700">Тип замовлення</h2>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => handleOrderTypeChange('Доставка')}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  orderType === 'Доставка'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Доставка
              </button>
              <button
                type="button"
                onClick={() => handleOrderTypeChange('Самовивіз')}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  orderType === 'Самовивіз'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Самовивіз
              </button>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium mb-3 text-gray-700">Виберіть час</h2>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setTimeOption('По готовності')}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeOption === 'По готовності'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                По готовності
              </button>
              <button
                type="button"
                onClick={() => setTimeOption('На час')}
                className={`w-1/2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeOption === 'На час'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                На час
              </button>
            </div>

            {timeOption === 'На час' && (
              <div className="mt-4">
                <label htmlFor="time-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Оберіть час
                </label>
                <select
                  id="time-select"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">-- Оберіть час --</option>
                  {generateTimeIntervals().map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium mb-3 text-gray-700">Спосіб оплати</h2>
            <div className="flex flex-col space-y-4 items-start">
              {getPaymentOptions().map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center w-full text-sm font-medium p-3 rounded-md cursor-pointer border transition-colors ${
                    paymentMethod === opt.value
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 mr-3"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={goBackToCart}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!paymentMethod}
              className={`py-2 px-3 text-sm rounded-md transition-colors ${
                paymentMethod
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={e => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
          {/* Крок 2: Контактні дані */}
          <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Контактні дані</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ім'я<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={handleContactInputChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон<span className="text-red-500">*</span>
            </label>
            <InputMask
              mask="+38(099)999-99-99"
              value={contactInfo.phone}
              onChange={e => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
            >
              {inputProps => (
                <input
                  {...inputProps}
                  id="phone"
                  name="phone"
                  placeholder="+38(0__)___-__-__"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              )}
            </InputMask>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (необов'язково)
            </label>
            <input
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={handleContactInputChange}
              placeholder="example@domain.com"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-600"
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 3 && (
        <form onSubmit={e => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
          {/* Крок 3: Адреса */}
          {orderType === 'Доставка' ? (
            <>
              <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Адреса доставки</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">Вулиця<span className="text-red-500">*</span></label>
                  <input
                    id="street"
                    name="street"
                    value={deliveryInfo.street}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-2">Будинок<span className="text-red-500">*</span></label>
                  <input
                    id="building"
                    name="building"
                    value={deliveryInfo.building}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="entrance" className="block text-sm font-medium text-gray-700 mb-2">Під'їзд</label>
                  <input
                    id="entrance"
                    name="entrance"
                    value={deliveryInfo.entrance}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">Корпус</label>
                  <input
                    id="block"
                    name="block"
                    value={deliveryInfo.block}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">Квартира</label>
                  <input
                    id="apartment"
                    name="apartment"
                    value={deliveryInfo.apartment}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">Поверх</label>
                  <input
                    id="floor"
                    name="floor"
                    value={deliveryInfo.floor}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Коментар</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={deliveryInfo.comment}
                  onChange={handleDeliveryInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Самовивіз</h2>
              <p className="text-sm text-gray-600 mb-6">Наш ресторан: Київ, вул. Центральна, 10</p>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Коментар</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={deliveryInfo.comment}
                  onChange={handleDeliveryInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-600"
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
          {/* Крок 4: Підтвердження */}
          <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Підтвердження замовлення</h2>

          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="font-semibold mb-2 text-gray-700">Ваше замовлення:</h3>
            {cart.length === 0 ? (
              <p className="text-red-500 text-sm">Кошик порожній.</p>
            ) : (
              <ul className="space-y-2">
                {cart.map((item, i) => (
                  <li key={i} className="flex justify-between border-b pb-2 text-sm text-gray-700">
                    <span>
                      {item.name} <span className="text-xs text-gray-500">×{item.quantity}</span>
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} грн</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-right mt-4 text-gray-800">
              Сума до знижки: <span className="font-bold">{totalBeforeDiscount.toFixed(2)} грн</span>
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
              Промокод (необов'язково)
            </label>
            <div className="flex space-x-2">
              <input
                id="promoCode"
                name="promoCode"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введіть промокод"
              />
              <button
                type="button"
                onClick={applyPromoCode}
                className="bg-green-500 text-white px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Застосувати
              </button>
            </div>
            {discountAmount > 0 && (
              <p className="mt-2 text-green-600">Знижка: {discountAmount.toFixed(2)} грн</p>
            )}
          </div>

          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="font-semibold mb-2 text-gray-700">До сплати:</h3>
            <p className="text-xl font-bold text-gray-800">{finalTotal.toFixed(2)} грн</p>
          </div>

          {/* Підсумкові дані contact & delivery */}
          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="font-semibold mb-2 text-gray-700">Контактна інформація:</h3>
            <p className="text-sm"><strong>Ім'я:</strong> {contactInfo.name}</p>
            <p className="text-sm"><strong>Телефон:</strong> {contactInfo.phone}</p>
            {contactInfo.email && <p className="text-sm"><strong>Email:</strong> {contactInfo.email}</p>}
          </div>

          {orderType === 'Доставка' && (
            <div className="mb-6 border p-4 rounded-md bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-700">Адреса доставки:</h3>
              <p className="text-sm"><strong>Вулиця:</strong> {deliveryInfo.street}</p>
              <p className="text-sm"><strong>Будинок:</strong> {deliveryInfo.building}</p>
              {deliveryInfo.entrance && <p className="text-sm"><strong>Під'їзд:</strong> {deliveryInfo.entrance}</p>}
              {deliveryInfo.block &&    <p className="text-sm"><strong>Корпус:</strong> {deliveryInfo.block}</p>}
              {deliveryInfo.apartment &&<p className="text-sm"><strong>Квартира:</strong> {deliveryInfo.apartment}</p>}
              {deliveryInfo.floor &&    <p className="text-sm"><strong>Поверх:</strong> {deliveryInfo.floor}</p>}
              {deliveryInfo.comment &&  <p className="text-sm"><strong>Коментар:</strong> {deliveryInfo.comment}</p>}
            </div>
          )}

          {orderType === 'Самовивіз' && (
            <div className="mb-6 border p-4 rounded-md bg-gray-50">
              <h3 className="font-semibold mb-2 text-gray-700">Самовивіз:</h3>
              <p className="text-sm">Ресторан: Київ, вул. Центральна, 10</p>
              {deliveryInfo.comment && <p className="text-sm"><strong>Коментар:</strong> {deliveryInfo.comment}</p>}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="bg-gray-300 text-gray-700 py-2 px-4 text-sm rounded-md hover:bg-gray-400"
            >
              Попередній крок
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 text-sm rounded-md hover:bg-blue-700"
            >
              Підтвердити замовлення
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;
