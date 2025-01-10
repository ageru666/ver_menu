import React from 'react';

const HomePage = () => {
  return (
    <div className="container mt-4">
      <div className="row align-items-center">
        <div className="col-md-6">
          <img
            src="https://st4.depositphotos.com/12006592/29212/v/1600/depositphotos_292124886-stock-illustration-korean-food-menu-restaurant-korean.jpg"
            alt="Restaurant Song Wu"
            className="img-fluid" 
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
          />
        </div>
        <div className="col-md-6">
          <h2>Song Wu</h2>
          <p>
            Ресторан Song Wu - це справжній острівець корейської кухні у серці Києва, 
            де кожен гість може відчути смак та атмосферу справжньої Кореї.
          </p>
          <p>
            Ми пишаємося нашою здатністю поєднувати традиційні рецепти з сучасними 
            кулінарними тенденціями, створюючи неперевершені страви, які задовольнять 
            навіть найвимогливіші смаки.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
