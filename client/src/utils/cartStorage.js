export function saveCartToLS(items) {
    localStorage.setItem(
      'cart',
      JSON.stringify({
        items,
        timestamp: Date.now(),
      })
    );
  }
  
  export function loadCartFromLS(expirationMs = 30 * 60 * 1000) {
    let raw;
    try {
      raw = JSON.parse(localStorage.getItem('cart'));
    } catch {
      return [];
    }
    if (Array.isArray(raw)) return raw;
    if (
      raw &&
      Array.isArray(raw.items) &&
      typeof raw.timestamp === 'number' &&
      Date.now() - raw.timestamp < expirationMs
    ) {
      return raw.items;
    }
    localStorage.removeItem('cart');
    return [];
  }
  