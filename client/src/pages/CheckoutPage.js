import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState('Доставка');
  const [timeOption, setTimeOption] = useState('По готовності');
  const [selectedTime, setSelectedTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [cart, setCart] = useState([]);    
  const [promoCode, setPromoCode] = useState(''); 
  const [total, setTotal] = useState(0);   

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
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const formattedCart = storedCart.map((item) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity, 10) || 1,
    }));
    setCart(formattedCart);

    const initialTotal = formattedCart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotal(initialTotal);
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cart]);

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    setPaymentMethod(''); 
  };

  const goBackToCart = () => {
    window.location.href = '/cart';
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!paymentMethod) {
        alert('Будь ласка, оберіть спосіб оплати.');
        return;
      }
    }

    // Step 2 validation (contact info)
    if (currentStep === 2) {
      if (!contactInfo.name.trim()) {
        alert("Будь ласка, введіть ім'я.");
        return;
      }
      const phoneRegex = /^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(contactInfo.phone)) {
        alert('Будь ласка, введіть правильний номер телефону у форматі +38(0XX)XXX-XX-XX.');
        return;
      }
      if (contactInfo.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactInfo.email)) {
          alert('Будь ласка, введіть правильну адресу електронної пошти.');
          return;
        }
      }
    }

    // Step 3 validation (address if Delivery)
    if (currentStep === 3) {
      if (orderType === 'Доставка') {
        if (!deliveryInfo.street.trim() || !deliveryInfo.building.trim()) {
          alert('Будь ласка, заповніть обов’язкові поля (вулиця та будинок).');
          return;
        }
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  // Final submit (step 4)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      cart,
      total,
      promoCode,
      timeOption,
      selectedTime,
      orderType,
      paymentMethod,
      contactInfo,
      deliveryInfo: orderType === 'Доставка' ? deliveryInfo : null,
    };

    try {
      const token = localStorage.getItem('authToken');

      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('${process.env.REACT_APP_API_URL}/api/orders/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Замовлення успішно оформлено! Номер: ${data.orderNumber}. Очікуйте дзвінка.`
        );
        setCart([]);
        localStorage.removeItem('cart');
        setCurrentStep(1);
      } else {
        const errorData = await response.json();
        alert('Помилка при оформленні замовлення: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Виникла помилка. Перевірте з’єднання і спробуйте ще раз.');
    }
  };

  const generateTimeIntervals = () => {
    const intervals = [];
    for (let hour = 10; hour <= 21; hour++) {
      intervals.push(`${hour}:00`);
      intervals.push(`${hour}:30`);
    }
    return intervals;
  };

  const getPaymentOptions = () => {
    if (orderType === 'Доставка') {
      return [
        { label: "Готівкою кур'єру", value: "Готівкою кур'єру" },
        { label: "Карткою кур'єру", value: "Карткою кур'єру" },
      ];
    } else {
      return [
        { label: "Готівкою в ресторані", value: "Готівкою в ресторані" },
        { label: "Карткою в ресторані", value: "Карткою в ресторані" },
      ];
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
        Оформлення замовлення
      </h1>

      {currentStep === 1 && (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
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
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">-- Оберіть час --</option>
                  {generateTimeIntervals().map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium mb-3 text-gray-700">Виберіть спосіб оплати</h2>
            <div className="flex flex-col space-y-4 items-start">
              {getPaymentOptions().map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center w-full text-sm font-medium p-3 rounded-md cursor-pointer border transition-colors ${
                    paymentMethod === option.value
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 mr-3"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={goBackToCart}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400 transition-colors"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className={`py-2 px-3 text-sm rounded-md transition-colors ${
                paymentMethod
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!paymentMethod}
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
          <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Контактні дані</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ім'я<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={handleContactInputChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              onChange={(e) =>
                setContactInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="+38(0__)___-__-__"
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              type="email"
              id="email"
              name="email"
              value={contactInfo.email}
              onChange={handleContactInputChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="example@domain.com"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400 transition-colors"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-600 transition-colors"
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 3 && (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
          {orderType === 'Доставка' ? (
            <>
              <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Адреса доставки</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Вулиця<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={deliveryInfo.street}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-2">
                    Будинок<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="building"
                    name="building"
                    value={deliveryInfo.building}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="entrance" className="block text-sm font-medium text-gray-700 mb-2">
                    Під'їзд
                  </label>
                  <input
                    type="text"
                    id="entrance"
                    name="entrance"
                    value={deliveryInfo.entrance}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">
                    Корпус
                  </label>
                  <input
                    type="text"
                    id="block"
                    name="block"
                    value={deliveryInfo.block}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
                    Квартира
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={deliveryInfo.apartment}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
                    Поверх
                  </label>
                  <input
                    type="text"
                    id="floor"
                    name="floor"
                    value={deliveryInfo.floor}
                    onChange={handleDeliveryInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Коментар до замовлення
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={deliveryInfo.comment}
                  onChange={handleDeliveryInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                ></textarea>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Адреса ресторану</h2>
              <p className="text-sm text-gray-600 mb-6">
                Наш ресторан знаходиться за адресою: Київ, вул. Центральна, 10
              </p>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Коментар до замовлення
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={deliveryInfo.comment}
                  onChange={handleDeliveryInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                ></textarea>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400 transition-colors"
            >
              Попередній крок
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="bg-blue-500 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-600 transition-colors"
            >
              Наступний крок
            </button>
          </div>
        </form>
      )}

      {currentStep === 4 && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
          <h2 className="text-lg font-medium mb-4 text-center text-gray-700">Підтвердження замовлення</h2>

          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="text-md font-semibold mb-2 text-gray-700">Ваше замовлення:</h3>
            {cart.length === 0 ? (
              <p className="text-red-500 text-sm">У кошику поки немає товарів.</p>
            ) : (
              <ul className="space-y-2">
                {cart.map((item, index) => {
                  const itemTotal = item.price * item.quantity;
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-2 text-sm text-gray-700"
                    >
                      <span>
                        {item.name}{' '}
                        <span className="ml-1 text-xs text-gray-500">x{item.quantity}</span>
                      </span>
                      <span>{itemTotal.toFixed(2)} грн</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="text-right mt-4 text-lg font-bold text-gray-800">
              Разом: {total.toFixed(2)} грн
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="promoCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Промокод (необов'язково)
            </label>
            <input
              type="text"
              id="promoCode"
              name="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Введіть промокод"
            />
          </div>

          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="text-md font-semibold mb-2 text-gray-700">Час замовлення:</h3>
            {timeOption === 'По готовності' ? (
              <p className="text-sm text-gray-700">По готовності (як тільки буде готово)</p>
            ) : selectedTime ? (
              <p className="text-sm text-gray-700">На час: {selectedTime}</p>
            ) : (
              <p className="text-sm text-gray-500">Час не вибраний</p>
            )}
          </div>

          <div className="mb-6 border p-4 rounded-md bg-gray-50">
            <h3 className="text-md font-semibold mb-2 text-gray-700">Контактна інформація:</h3>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Ім'я:</span> {contactInfo.name}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Телефон:</span> {contactInfo.phone}
            </p>
            {contactInfo.email && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> {contactInfo.email}
              </p>
            )}
          </div>

          {orderType === 'Доставка' && (
            <div className="mb-6 border p-4 rounded-md bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-gray-700">Адреса доставки:</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Вулиця:</span> {deliveryInfo.street}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Будинок:</span> {deliveryInfo.building}
              </p>
              {deliveryInfo.entrance && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Під'їзд:</span> {deliveryInfo.entrance}
                </p>
              )}
              {deliveryInfo.block && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Корпус:</span> {deliveryInfo.block}
                </p>
              )}
              {deliveryInfo.apartment && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Квартира:</span> {deliveryInfo.apartment}
                </p>
              )}
              {deliveryInfo.floor && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Поверх:</span> {deliveryInfo.floor}
                </p>
              )}
              {deliveryInfo.comment && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Коментар:</span> {deliveryInfo.comment}
                </p>
              )}
            </div>
          )}

          {orderType === 'Самовивіз' && (
            <div className="mb-6 border p-4 rounded-md bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-gray-700">Самовивіз:</h3>
              <p className="text-sm text-gray-700">
                Ресторан знаходиться за адресою: Київ, вул. Центральна, 10
              </p>
              {deliveryInfo.comment && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Коментар до замовлення:</span> {deliveryInfo.comment}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="bg-gray-300 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-400 transition-colors"
            >
              Попередній крок
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 text-sm rounded-md hover:bg-green-600 transition-colors"
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
