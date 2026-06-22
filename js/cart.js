function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

function addToCart(productId, qty = 1, productData = null) {
  const product = productData || allProducts.find(p => p.id === productId);
  if (!product) return false;

  let cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.cantidad + qty > product.stock) {
      showToast('No hay más stock disponible', 'error');
      return false;
    }
    existing.cantidad += qty;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      marca: product.marca,
      precio: product.precio,
      categoria: product.categoria,
      imagen: getProductImage(product),
      cantidad: qty,
      stock: product.stock
    });
  }

  saveCart(cart);
  updateCartBadge();
  return true;
}

function updateQty(productId, newQty) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  if (newQty <= 0) {
    removeItem(productId);
    return;
  }

  if (newQty > item.stock) {
    item.cantidad = item.stock;
    showToast('Cantidad máxima de stock alcanzada', 'error');
  } else {
    item.cantidad = newQty;
  }

  saveCart(cart);
  renderCart();
  updateCartBadge();
}

function updateCartItemQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  updateQty(productId, item.cantidad + delta);
}

function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartBadge();
  showToast('Producto eliminado del carrito');
}

function removeCartItem(productId) {
  removeItem(productId);
}

function getTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  return { subtotal, shipping, total, itemCount: cart.reduce((s, i) => s + i.cantidad, 0) };
}

function getCartTotals() {
  return getTotal();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const summaryContainer = document.getElementById('cart-summary');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Explora nuestro catálogo y encuentra las refacciones que necesitas.</p>
        <a href="index.html" class="btn btn-primary">Ver productos</a>
      </div>
    `;
    if (summaryContainer) summaryContainer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">${renderProductImage(item, 'cart-item-img')}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nombre}</div>
        <div class="cart-item-brand">${item.marca}</div>
        <div class="cart-item-price">${formatCurrency(item.precio)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn btn-qty-minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.cantidad}</span>
          <button class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="btn-remove" data-id="${item.id}">Eliminar</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id), -1));
  });

  container.querySelectorAll('.btn-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => updateCartItemQuantity(parseInt(btn.dataset.id), 1));
  });

  container.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => removeCartItem(parseInt(btn.dataset.id)));
  });

  const { subtotal, shipping, total } = getCartTotals();
  const shippingLabel = shipping === 0 ? 'Gratis' : formatCurrency(shipping);
  const shippingNote = subtotal < FREE_SHIPPING_THRESHOLD
    ? `<p class="shipping-note">Envío gratis en compras mayores a ${formatCurrency(FREE_SHIPPING_THRESHOLD)}</p>`
    : '';

  if (summaryContainer) {
    summaryContainer.style.display = 'block';
    summaryContainer.innerHTML = `
      <h3>Resumen</h3>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span class="label-muted">Envío</span>
        <span>${shippingLabel}</span>
      </div>
      ${shippingNote}
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatCurrency(total)}</span>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="btn-checkout" style="margin-top: 1.25rem">
        Continuar compra
      </button>
    `;

    document.getElementById('btn-checkout')?.addEventListener('click', () => {
      if (requireAuth('carrito.html')) {
        window.location.href = 'checkout.html';
      }
    });
  }
}

function initCartPage() {
  requireAuth('carrito.html');
  renderShopProgress(1);
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items')) {
    initCartPage();
  }
});
