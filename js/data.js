const STORAGE_KEYS = {
  SESSION: 'tienda_session',
  USERS: 'tienda_users',
  CART: 'tienda_cart',
  ORDERS: 'tienda_orders',
  PENDING_ORDER: 'tienda_pending_order'
};

const SHIPPING_COST = 99;
const FREE_SHIPPING_THRESHOLD = 500;

const CATEGORY_IMAGES = {
  frenos: 'assets/images/products/01-pastillas.jpg',
  motor: 'assets/images/products/04-filtro-aceite.jpg',
  suspension: 'assets/images/products/13-amortiguador.jpg',
  electrico: 'assets/images/products/11-bateria-24f.jpg',
  aceites: 'assets/images/products/08-aceite-5w30.jpg',
  llantas: 'assets/images/products/22-llanta-r15.jpg'
};

const CATEGORY_LABELS = {
  frenos: 'Frenos',
  motor: 'Motor',
  suspension: 'Suspensión',
  electrico: 'Eléctrico',
  aceites: 'Aceites',
  llantas: 'Llantas',
  todos: 'Todos'
};

let allProducts = [];
let demoUsers = [];

async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    allProducts = await response.json();
    return allProducts;
  } catch (error) {
    console.error('Error cargando productos:', error);
    allProducts = [];
    return [];
  }
}

async function loadDemoUsers() {
  try {
    const response = await fetch('data/users-demo.json');
    demoUsers = await response.json();
    return demoUsers;
  } catch (error) {
    console.error('Error cargando usuarios demo:', error);
    demoUsers = [
      { usuario: 'demo', password: 'demo123', nombre: 'Usuario Demo', email: 'demo@nubo.com' },
      { usuario: 'cliente', password: 'cliente123', nombre: 'Juan Pérez', email: 'cliente@nubo.com' }
    ];
    return demoUsers;
  }
}

function getProductImage(product) {
  if (product.imagen) return product.imagen;
  if (product.categoria && CATEGORY_IMAGES[product.categoria]) {
    return CATEGORY_IMAGES[product.categoria];
  }
  return 'assets/images/products/01-pastillas.jpg';
}

function renderProductImage(product, className = 'product-img') {
  const src = getProductImage(product);
  const alt = product.nombre || 'Producto NUBO';
  const fallback = CATEGORY_IMAGES[product.categoria] || 'assets/images/products/01-pastillas.jpg';
  return `<img src="${src}" alt="${alt}" class="${className}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback}'">`;
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

function getShippingCost(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

function formatShipping(subtotal) {
  const cost = getShippingCost(subtotal);
  return cost === 0 ? 'Gratis' : formatCurrency(cost);
}

function showToast(message, type = 'default') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function generateOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `PED-${date}-${random}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function renderShopProgress(currentStep) {
  const container = document.getElementById('shop-progress');
  if (!container) return;

  const steps = ['Carrito', 'Envío y pago', 'Confirmación'];

  container.innerHTML = steps.map((label, i) => {
    const stepNum = i + 1;
    const isActive = stepNum === currentStep;
    const isCompleted = stepNum < currentStep;
    const connector = i < steps.length - 1
      ? `<div class="step-connector ${isCompleted ? 'completed' : ''}"></div>`
      : '';

    return `
      <div class="step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
        <div class="step-circle">${isCompleted ? '✓' : stepNum}</div>
        <span class="step-label">${label}</span>
      </div>
      ${connector}
    `;
  }).join('');
}

function renderHeader(activePage = '') {
  const session = getSession();
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const authHtml = session
    ? `<span class="user-greeting visible">Hola, ${session.nombre}</span>
       <button class="btn btn-ghost btn-sm" id="btn-logout">Cerrar sesión</button>`
    : `<a href="login.html" class="btn btn-ghost btn-sm">Acceder</a>`;

  const cartLink = session
    ? `<a href="carrito.html" class="btn-icon" title="Carrito">
         <i class="fa-solid fa-cart-shopping"></i>
         <span class="cart-badge ${cartCount === 0 ? 'hidden' : ''}" id="cart-badge">${cartCount}</span>
       </a>`
    : `<a href="login.html?redirect=carrito.html" class="btn-icon" title="Carrito">
         <i class="fa-solid fa-cart-shopping"></i>
         <span class="cart-badge hidden" id="cart-badge">0</span>
       </a>`;

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="logo">
          <img src="assets/images/logo-nubo.svg" alt="NUBO" class="logo-img">
          <span>NUBO</span>
        </a>
        ${activePage === 'home' ? `
        <div class="search-bar">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" id="search-input" placeholder="Buscar refacciones, marcas...">
        </div>` : ''}
        <div class="header-actions">
          ${authHtml}
          ${cartLink}
        </div>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>NUBO</h4>
            <p>Tu tienda de confianza para refacciones automotrices. Calidad y precio en un solo lugar.</p>
          </div>
          <div>
            <h4>Categorías</h4>
            <ul>
              <li>Frenos</li>
              <li>Motor</li>
              <li>Suspensión</li>
              <li>Eléctrico</li>
              <li>Aceites</li>
              <li>Llantas</li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>📞 (55) 1234-5678</p>
            <p>✉️ contacto@nubo.com</p>
            <p>📍 Ciudad de México, México</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 NUBO. Todos los derechos reservados. Demo sin base de datos.</p>
        </div>
      </div>
    </footer>
  `;
}

function initHeader() {
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      showToast('Sesión cerrada correctamente');
      setTimeout(() => window.location.href = 'index.html', 500);
    });
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const session = getSession();
  if (!session) {
    badge.classList.add('hidden');
    return;
  }
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
}

function requireAuth(redirectUrl) {
  const session = getSession();
  if (!session) {
    const target = redirectUrl || window.location.pathname.split('/').pop();
    window.location.href = `login.html?redirect=${encodeURIComponent(target)}`;
    return null;
  }
  return session;
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}
