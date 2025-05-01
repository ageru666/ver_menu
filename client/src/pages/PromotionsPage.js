import React from 'react';
import { FaTag, FaGift, FaTruck } from 'react-icons/fa';

const promotions = [
  {
    id: 1,
    title: 'Знижка 20% на всі страви',
    description: 'Скористайтесь знижкою 20% на всі страви протягом цього тижня!',
    icon: <FaTag className="text-6xl text-blue-500" />,
  },
  {
    id: 2,
    title: 'Акція "2 за 1"',
    description: 'Придбайте дві страви за ціною однієї. Не пропустіть!',
    icon: <FaGift className="text-6xl text-green-500" />,
  },
  {
    id: 3,
    title: 'Безкоштовна доставка',
    description: 'Замовляйте страви на суму від 500 грн та отримуйте безкоштовну доставку!',
    icon: <FaTruck className="text-6xl text-red-500" />,
  },
];

const PromotionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Акції</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promo => (
          <div
            key={promo.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center h-48 bg-gray-100">
              {promo.icon}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {promo.title}
              </h2>
              <p className="text-gray-600 text-sm">{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionsPage;
