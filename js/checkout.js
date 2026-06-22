let checkoutData = {
  shipping: {},
  payment: 'tarjeta',
  billing: {}
};

function renderCheckoutProgress() {
  renderShopProgress(2);
}

function setFieldError(input, errorEl, message) {
  if (!message) {
    input?.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
    return;
  }
  input?.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function validateShippingForm() {
  const form = document.getElementById('checkout-form');
  const fields = {
    nombre: form.querySelector('#ship-name').value.trim(),
    telefono: form.querySelector('#ship-phone').value.trim(),
    calle: form.querySelector('#ship-street').value.trim(),
    numExterior: form.querySelector('#ship-ext').value.trim(),
    numInterior: form.querySelector('#ship-int').value.trim(),
    colonia: form.querySelector('#ship-colonia').value.trim(),
    municipio: form.querySelector('#ship-city').value.trim(),
    estado: form.querySelector('#ship-state').value.trim(),
    cp: form.querySelector('#ship-zip').value.trim()
  };

  let valid = true;

  const required = [
    { value: fields.nombre, input: '#ship-name', error: '#error-nombre' },
    { value: fields.telefono, input: '#ship-phone', error: '#error-telefono' },
    { value: fields.calle, input: '#ship-street', error: '#error-calle' },
    { value: fields.numExterior, input: '#ship-ext', error: '#error-numExt' },
    { value: fields.colonia, input: '#ship-colonia', error: '#error-colonia' },
    { value: fields.municipio, input: '#ship-city', error: '#error-municipio' },
    { value: fields.estado, input: '#ship-state', error: '#error-estado' },
    { value: fields.cp, input: '#ship-zip', error: '#error-cp' }
  ];

  required.forEach(({ value, input, error }) => {
    const inputEl = form.querySelector(input);
    const errorEl = form.querySelector(error);
    if (!value) {
      valid = false;
      setFieldError(inputEl, errorEl, 'Este campo es obligatorio');
    } else {
      setFieldError(inputEl, errorEl, '');
    }
  });

  if (fields.telefono && !/^\d{10}$/.test(fields.telefono.replace(/\s/g, ''))) {
    valid = false;
    setFieldError(
      form.querySelector('#ship-phone'),
      form.querySelector('#error-telefono'),
      'El teléfono debe tener 10 dígitos'
    );
  }

  if (fields.cp && !/^\d{5}$/.test(fields.cp)) {
    valid = false;
    setFieldError(
      form.querySelector('#ship-zip'),
      form.querySelector('#error-cp'),
      'El código postal debe tener 5 dígitos'
    );
  }

  if (valid) checkoutData.shipping = fields;
  return valid;
}

function validateCardForm() {
  const form = document.getElementById('checkout-form');
  const payment = document.querySelector('input[name="payment"]:checked')?.value;

  if (payment !== 'tarjeta') {
    checkoutData.billing = { metodo: payment };
    return true;
  }

  const titular = form.querySelector('#card-holder').value.trim();
  const tarjeta = form.querySelector('#card-number').value.replace(/\s/g, '');
  const vencimiento = form.querySelector('#card-exp').value.trim();
  const cvv = form.querySelector('#card-cvv').value.trim();

  let valid = true;

  if (!titular) {
    valid = false;
    setFieldError(form.querySelector('#card-holder'), form.querySelector('#error-titular'), 'Este campo es obligatorio');
  } else {
    setFieldError(form.querySelector('#card-holder'), form.querySelector('#error-titular'), '');
  }

  if (!tarjeta || !/^\d{15,16}$/.test(tarjeta)) {
    valid = false;
    setFieldError(form.querySelector('#card-number'), form.querySelector('#error-tarjeta'), 'Ingresa un número de tarjeta válido');
  } else {
    setFieldError(form.querySelector('#card-number'), form.querySelector('#error-tarjeta'), '');
  }

  if (!vencimiento || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
    valid = false;
    setFieldError(form.querySelector('#card-exp'), form.querySelector('#error-vencimiento'), 'Usa el formato MM/AA');
  } else {
    setFieldError(form.querySelector('#card-exp'), form.querySelector('#error-vencimiento'), '');
  }

  if (!cvv || !/^\d{3,4}$/.test(cvv)) {
    valid = false;
    setFieldError(form.querySelector('#card-cvv'), form.querySelector('#error-cvv'), 'CVV inválido');
  } else {
    setFieldError(form.querySelector('#card-cvv'), form.querySelector('#error-cvv'), '');
  }

  if (valid) {
    checkoutData.billing = {
      metodo: 'tarjeta',
      titular,
      ultimosDigitos: tarjeta.slice(-4),
      vencimiento
    };
  }

  return valid;
}

function toggleCardSection() {
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const cardSection = document.getElementById('card-section');
  if (!cardSection) return;
  cardSection.style.display = payment === 'tarjeta' ? 'block' : 'none';
}

function formatCardNumberInput() {
  const input = document.getElementById('card-number');
  if (!input) return;
  input.addEventListener('input', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });
}

function formatCardExpInput() {
  const input = document.getElementById('card-exp');
  if (!input) return;
  input.addEventListener('input', () => {
    let value = input.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    input.value = value;
  });
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  const cart = getCart();
  const { subtotal, shipping, total } = getCartTotals();
  const shippingLabel = shipping === 0 ? 'Gratis' : formatCurrency(shipping);

  container.innerHTML = `
    <h3>Tu compra</h3>
    ${cart.map(item => `
      <div class="summary-row">
        <span class="label-muted">${item.nombre} x${item.cantidad}</span>
        <span>${formatCurrency(item.precio * item.cantidad)}</span>
      </div>
    `).join('')}
    <div class="summary-row" style="margin-top: 1rem">
      <span>Subtotal</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    <div class="summary-row">
      <span class="label-muted">Envío</span>
      <span>${shippingLabel}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>${formatCurrency(total)}</span>
    </div>
  `;
}

function confirmOrder() {
  if (!validateShippingForm() || !validateCardForm()) return;

  const selected = document.querySelector('input[name="payment"]:checked');
  if (selected) checkoutData.payment = selected.value;

  const session = getSession();
  const cart = getCart();
  const { subtotal, shipping, total } = getCartTotals();
  const orderNumber = generateOrderNumber();

  const order = {
    numero: orderNumber,
    fecha: new Date().toISOString(),
    usuario: session.email || session.usuario,
    nombre: session.nombre,
    items: [...cart],
    envio: { ...checkoutData.shipping },
    facturacion: { ...checkoutData.billing },
    pago: checkoutData.payment,
    subtotal,
    envioCosto: shipping,
    total
  };

  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  orders.push(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  localStorage.setItem(STORAGE_KEYS.PENDING_ORDER, JSON.stringify(order));
  localStorage.removeItem(STORAGE_KEYS.CART);

  updateCartBadge();
  window.location.href = `confirmacion.html?order=${orderNumber}`;
}

function initPaymentOptions() {
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      option.querySelector('input').checked = true;
      toggleCardSection();
    });
  });

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', toggleCardSection);
  });
}

function prefillCheckoutFromSession() {
  const session = getSession();
  if (!session) return;
  const nameInput = document.getElementById('ship-name');
  if (nameInput && !nameInput.value) nameInput.value = session.nombre || '';
}

function initCheckoutPage() {
  const session = requireAuth('checkout.html');
  if (!session) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'carrito.html';
    return;
  }

  renderCheckoutProgress();
  renderCheckoutSummary();
  initPaymentOptions();
  toggleCardSection();
  formatCardNumberInput();
  formatCardExpInput();
  prefillCheckoutFromSession();

  document.getElementById('btn-confirm-order')?.addEventListener('click', confirmOrder);
}

function initOrderConfirmation() {
  renderShopProgress(4);
  const orderNumber = getQueryParam('order');
  const container = document.getElementById('order-confirmation');
  if (!container) return;

  let order = null;
  const pending = localStorage.getItem(STORAGE_KEYS.PENDING_ORDER);
  if (pending) {
    order = JSON.parse(pending);
    if (orderNumber && order.numero !== orderNumber) {
      const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      order = orders.find(o => o.numero === orderNumber) || order;
    }
  }

  if (!order) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3>Pedido no encontrado</h3>
        <p>No se encontró información del pedido.</p>
        <a href="index.html" class="btn btn-primary">Ir al inicio</a>
      </div>
    `;
    return;
  }

  const paymentLabels = {
    tarjeta: 'Tarjeta de crédito/débito',
    transferencia: 'Transferencia bancaria',
    efectivo: 'Efectivo contra entrega'
  };

  const shippingLabel = order.envioCosto === 0 ? 'Gratis' : formatCurrency(order.envioCosto);
  const envio = order.envio || {};
  const facturacion = order.facturacion || {};
  const direccion = [
    envio.calle,
    envio.numExterior ? `No. ${envio.numExterior}` : '',
    envio.numInterior ? `Int. ${envio.numInterior}` : ''
  ].filter(Boolean).join(' ');

  const pagoDetalle = order.pago === 'tarjeta' && facturacion.ultimosDigitos
    ? `${paymentLabels[order.pago]} terminación ${facturacion.ultimosDigitos}`
    : paymentLabels[order.pago];

  const itemsHtml = order.items.map(item => `
    <div class="order-review-item">
      <span>${item.nombre} x${item.cantidad}</span>
      <span>${formatCurrency(item.precio * item.cantidad)}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="confirmation-icon">✓</div>
    <h1>¡Pedido confirmado!</h1>
    <p>Gracias por tu compra, ${order.nombre}. Tu pedido ha sido registrado exitosamente.</p>
    <div class="order-number">${order.numero}</div>
    <div class="confirmation-details">
      <h4 style="margin-bottom: 1rem">Detalle del pedido</h4>
      ${itemsHtml}
      <div class="summary-row" style="margin-top: 1rem">
        <span>Subtotal</span>
        <span>${formatCurrency(order.subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Envío</span>
        <span>${shippingLabel}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
      <div style="margin-top: 1.25rem; font-size: 0.9rem; color: var(--color-text-muted)">
        <p><strong>Envío a:</strong> ${direccion}</p>
        <p>${envio.colonia}, ${envio.municipio}, ${envio.estado} CP ${envio.cp}</p>
        <p><strong>Tel:</strong> ${envio.telefono}</p>
        <p><strong>Pago:</strong> ${pagoDetalle}</p>
      </div>
    </div>
    <a href="index.html" class="btn btn-primary btn-lg">Seguir comprando</a>
  `;

  localStorage.removeItem(STORAGE_KEYS.PENDING_ORDER);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('checkout-form')) {
    initCheckoutPage();
  }

  if (document.getElementById('order-confirmation')) {
    initOrderConfirmation();
  }
});
