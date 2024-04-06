document.addEventListener('DOMContentLoaded', function() {
    const headerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">Song Wu</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                      <a class="nav-link" href="/html/index.html">Головна</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/noodles.html">Основні страви</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/soups.html">Супи</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/salads.html">Салати</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/appetizers.html">Закуски</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/html/barMenu.html">Барне меню</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
});



