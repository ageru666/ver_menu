import React from 'react';
import { FaNewspaper } from 'react-icons/fa';

const articles = [
  {
    id: 1,
    title: 'Новий сезон в ресторані Song Wu',
    excerpt: 'Ми раді представити нове меню на осінній сезон. Дізнайтеся більше про наші новинки.',
    date: '2023-09-15',
  },
  {
    id: 2,
    title: 'Інтерв’ю з шеф-кухарем',
    excerpt: 'Поглиблене інтерв’ю з нашим шеф-кухарем, який розповідає про секрети кулінарії.',
    date: '2023-09-10',
  },
  {
    id: 3,
    title: 'Здорове харчування: поради від експертів',
    excerpt: 'Корисні поради та рецепти для здорового харчування від наших експертів.',
    date: '2023-09-05',
  },
];

const ArticlesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Статті</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div
            key={article.id}
            className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center h-48 bg-gray-100">
              <FaNewspaper className="text-6xl text-blue-500" />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {article.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
              <p className="text-gray-500 text-xs">Дата: {article.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
