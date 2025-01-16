import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <img
            src="https://st4.depositphotos.com/12006592/29212/v/1600/depositphotos_292124886-stock-illustration-korean-food-menu-restaurant-korean.jpg"
            alt="Restaurant Song Wu"
            className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[400px]"
          />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center md:text-left">
            Song Wu
          </h2>
          <p className="text-gray-600 text-lg mb-4 text-center md:text-left">
            Ресторан Song Wu - це справжній острівець корейської кухні у серці Києва, де кожен гість може відчути смак та атмосферу справжньої Кореї.
          </p>
          <p className="text-gray-600 text-lg text-center md:text-left">
            Ми пишаємося нашою здатністю поєднувати традиційні рецепти з сучасними кулінарними тенденціями, створюючи неперевершені страви, які задовольнять навіть найвимогливіші смаки.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
