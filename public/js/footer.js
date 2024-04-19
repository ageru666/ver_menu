document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
        <footer class="text-white bg-dark " style="bottom: 0;">
            <div class="container py-1">
                <div class="row">
                    <div class="col-md-4">
                        <ul class="list-unstyled">
                            <li>Email: qwert@gmail.com</li>
                            <li>Телефон: +380 12 345 6789</li>
                            <li>Адреса: Вул. Незалежності, 5, Київ, Україна</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});


