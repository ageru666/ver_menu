fetch('/noodles')
  .then(response => response.json())
  .then(noodles => {
    const noodlesContainer = document.getElementById('noodles');
    noodles.forEach(noodle => {
      const noodleElement = document.createElement('div');
      noodleElement.innerHTML = `
        <h3>${noodle.name}</h3>
        <p>Ціна: ${noodle.price}</p>
        <p>Вага: ${noodle.weight}</p>
        <img src="${noodle.image}" alt="${noodle.name}" style="width:100px; height:auto;">
      `;
      noodlesContainer.appendChild(noodleElement);
    });
  })
  .catch(error => console.error('Помилка:', error));
