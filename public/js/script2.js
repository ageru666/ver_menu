fetch('/cocktails')
  .then(response => response.json())
  .then(cocktails => {
    const container = document.getElementById('cocktails-container');
    cocktails.forEach(cocktail => {
      const card = `
        <div class="card" style="width: 18rem;">
          <img src="${cocktail.image}" class="card-img-top" alt="${cocktail.name}">
          <div class="card-body">
            <h5 class="card-title">${cocktail.name}</h5>
            <p class="card-text">Ціна: ${cocktail.price}</p>
            <p class="card-text">Об'єм: ${cocktail.volume}</p>
            <p class="card-text">Інгредієнти: ${cocktail.ingredients}</p>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  })
  .catch(error => console.error('Помилка:', error));
