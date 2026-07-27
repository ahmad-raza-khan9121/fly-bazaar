/* ================================================================
   FLY BAZAAR — cart.js
   Full e-commerce functionality:
   - Cart (add, remove, quantity, checkout)
   - Wishlist (add, remove, move to cart)
   - Toast notifications
   - Login/Register modal
   - Live search with product database
   - Back to top button
================================================================ */

/* ────────────────────────────────────────────
   PRODUCT DATABASE
   Full catalogue (392 products) loaded from
   js/products-data.js as PRODUCTS_DB, which is
   included on every page BEFORE this file.
   Each entry's `page` and `img` are ROOT-RELATIVE
   paths; SITE_ROOT (also set on every page, before
   this script) tells us how far the current page
   is from the project root so links always resolve
   correctly no matter how deep the page is nested.
──────────────────────────────────────────── */
const PRODUCTS = (typeof PRODUCTS_DB !== 'undefined') ? PRODUCTS_DB : [];
const ROOT = (typeof window.SITE_ROOT === 'string') ? window.SITE_ROOT : '';

function resolveAsset(rootRelativePath) {
  return ROOT + rootRelativePath;
}

/* Escapes text for safe insertion into HTML (both as text content and
   inside "..." attributes). Used whenever product names — which can
   contain apostrophes like "Men's Jacket" — are rendered into markup,
   so a name never breaks out of an attribute or corrupts the page. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ────────────────────────────────────────────
   CART SYSTEM
──────────────────────────────────────────── */
function getCart() { try { return JSON.parse(localStorage.getItem('fb_cart') || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem('fb_cart', JSON.stringify(cart)); updateCartBadge(); }

function addToCart(name, price, img, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.name === name);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({ name, price, img, qty });
  }
  saveCart(cart);
  showToast(`<i class="fa fa-cart-shopping"></i> "${name}" added to cart!`);
  updateCartBadge();
}

function removeFromCart(name) {
  let cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
  renderCartPage();
}

function updateQty(name, delta) {
  let cart = getCart();
  const idx = cart.findIndex(i => i.name === name);
  if (idx > -1) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  }
  saveCart(cart);
  renderCartPage();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartBadge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function renderCartPage() {
  const box = document.getElementById('cartItemsBox');
  const empty = document.getElementById('emptyCart');
  const summary = document.getElementById('cartSummary');
  if (!box) return;

  const cart = getCart();
  if (cart.length === 0) {
    box.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (summary) summary.style.display = 'none';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (summary) summary.style.display = 'block';

  let subtotal = 0;
  box.innerHTML = cart.map(item => {
    subtotal += item.price * item.qty;
    const safeName = escapeHtml(item.name);
    return `
      <div class="cart-item">
        <img src="${escapeHtml(item.img || 'assets/fly-bazaar-logo.png')}" alt="${safeName}" onerror="this.src='assets/fly-bazaar-logo.png'">
        <div class="cart-item-info">
          <div class="cart-item-name">${safeName}</div>
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" data-name="${safeName}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-name="${safeName}">+</button>
          </div>
        </div>
        <button class="remove-btn" data-action="remove" data-name="${safeName}" title="Remove">
          <i class="fa fa-trash"></i>
        </button>
      </div>`;
  }).join('');

  // Event delegation — reliable regardless of special characters
  // (apostrophes, quotes, etc.) in the product name, unlike inline
  // onclick="...('${item.name}')" which used to break for any name
  // containing a quote (e.g. "Men's Jacket") and silently fail to
  // remove/update that item.
  box.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const action = btn.dataset.action;
      if (action === 'remove') removeFromCart(name);
      else if (action === 'inc') updateQty(name, 1);
      else if (action === 'dec') updateQty(name, -1);
    });
  });

  const discount = Math.round(subtotal * 0.10);
  const total = subtotal - discount;
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  const s = id => document.getElementById(id);
  if (s('summarySubtotal')) s('summarySubtotal').textContent = fmt(subtotal);
  if (s('summaryDiscount')) s('summaryDiscount').textContent = '-' + fmt(discount);
  if (s('summaryTotal')) s('summaryTotal').textContent = fmt(total);
}

/* ────────────────────────────────────────────
   WISHLIST SYSTEM
──────────────────────────────────────────── */
function getWishlist() { try { return JSON.parse(localStorage.getItem('fb_wishlist') || '[]'); } catch { return []; } }
function saveWishlist(w) { localStorage.setItem('fb_wishlist', JSON.stringify(w)); updateWishBadge(); }

function toggleWishlistItem(name, price, img, iconEl) {
  let w = getWishlist();
  const idx = w.findIndex(i => i.name === name);
  if (idx > -1) {
    w.splice(idx, 1);
    showToast(`<i class="fa-regular fa-heart"></i> Removed from wishlist`);
    if (iconEl) { iconEl.classList.add('fa-regular'); iconEl.classList.remove('fa-solid'); }
  } else {
    w.push({ name, price, img });
    showToast(`<i class="fa-solid fa-heart" style="color:#e11d48"></i> Added to wishlist!`);
    if (iconEl) { iconEl.classList.remove('fa-regular'); iconEl.classList.add('fa-solid'); }
  }
  saveWishlist(w);
}

function updateWishBadge() {
  const count = getWishlist().length;
  document.querySelectorAll('#wishBadge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('emptyWishlist');
  if (!grid) return;

  const w = getWishlist();
  if (w.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = w.map(item => {
    const safeName = escapeHtml(item.name);
    return `
    <div class="product-card">
      <div class="wishlist active" data-action="toggle-wish" data-name="${safeName}" data-price="${item.price}" data-img="${escapeHtml(item.img)}">
        <i class="fa-solid fa-heart" style="color:#e11d48"></i>
      </div>
      <img src="${escapeHtml(item.img || 'assets/fly-bazaar-logo.png')}" alt="${safeName}" onerror="this.src='assets/fly-bazaar-logo.png'">
      <h3>${safeName}</h3>
      <p class="price">₹${item.price.toLocaleString('en-IN')}</p>
      <div class="product-btns">
        <button class="btn small" data-action="wish-add-cart" data-name="${safeName}" data-price="${item.price}" data-img="${escapeHtml(item.img)}">Add to Cart</button>
        <button class="btn small outline" data-action="wish-remove" data-name="${safeName}" data-price="${item.price}" data-img="${escapeHtml(item.img)}">Remove</button>
      </div>
    </div>`;
  }).join('');

  // Event delegation — same fix as the cart page: avoids breaking on
  // product names that contain apostrophes (e.g. "Women's Fancy Bag").
  grid.querySelectorAll('[data-action]').forEach(el => {
    const { name, price, img } = el.dataset;
    const numPrice = Number(price);
    el.addEventListener('click', () => {
      if (el.dataset.action === 'toggle-wish') {
        toggleWishlistItem(name, numPrice, img, el.querySelector('i'));
        renderWishlistPage();
      } else if (el.dataset.action === 'wish-add-cart') {
        addToCart(name, numPrice, img);
      } else if (el.dataset.action === 'wish-remove') {
        toggleWishlistItem(name, numPrice, img);
        renderWishlistPage();
      }
    });
  });
}

/* ────────────────────────────────────────────
   PRODUCT DETAIL MODAL
   Clicking any product card (image/name/price — not the Add to
   Cart or wishlist buttons) opens a full detail view: bigger image,
   rating, description and a quantity selector before adding to
   cart. Mirrors the item-detail experience already used on the
   Fly Restaurant project.
──────────────────────────────────────────── */
function createProductModal() {
  if (document.getElementById('productModalOverlay')) return;
  const el = document.createElement('div');
  el.id = 'productModalOverlay';
  el.className = 'modal-overlay product-modal-overlay';
  el.style.display = 'none';
  el.innerHTML = `<div class="modal-box product-modal-box" id="productModalBody"></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', (e) => { if (e.target === el) closeProductModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProductModal(); });
}

function openProductModal(slug, fallback) {
  const dbItem = PRODUCTS.find(p => p.slug === slug);
  const item = dbItem || { name: fallback.name, price: fallback.price, img: fallback.img, categoryLabel: '', rating: null, reviews: null, description: '' };
  // DB-sourced images are root-relative and need resolveAsset(); the
  // fallback path (used only if a slug isn't found in PRODUCTS_DB) is
  // already a fully-resolved URL taken straight from the card's <img>.
  // Either way, run it through `new URL()` so we end up with a real
  // absolute URL — safe to store in the cart and re-display later
  // from any page (e.g. cart.html), regardless of folder depth.
  const rawSrc = dbItem ? resolveAsset(item.img || 'assets/fly-bazaar-logo.png') : (item.img || resolveAsset('assets/fly-bazaar-logo.png'));
  const imgSrc = new URL(rawSrc, document.baseURI).href;

  createProductModal();
  const body = document.getElementById('productModalBody');
  const ratingHtml = item.rating
    ? `<div class="modal-rating"><i class="fa fa-star"></i> ${item.rating} <span>(${item.reviews} reviews)</span>${item.categoryLabel ? ' • ' + escapeHtml(item.categoryLabel) : ''}</div>`
    : '';
  const descHtml = item.description ? `<p class="modal-desc">${escapeHtml(item.description)}</p>` : '';

  body.innerHTML = `
    <button class="modal-close" id="productModalClose">✕</button>
    <img class="product-modal-img" src="${imgSrc}" alt="${escapeHtml(item.name)}" onerror="this.src='${resolveAsset('assets/fly-bazaar-logo.png')}'">
    <div class="product-modal-info">
      ${ratingHtml}
      <h2 class="product-modal-name">${escapeHtml(item.name)}</h2>
      ${descHtml}
      <div class="product-modal-footer">
        <span class="product-modal-price">₹${item.price.toLocaleString('en-IN')}</span>
        <div class="qty-controls" id="modalQtyBox">
          <button class="qty-btn" data-qty="-1">−</button>
          <span class="qty-value" id="modalQtyVal">1</span>
          <button class="qty-btn" data-qty="1">+</button>
        </div>
      </div>
      <button class="modal-submit" id="modalAddCartBtn"><i class="fa fa-cart-shopping"></i> Add to Cart</button>
    </div>`;

  let qty = 1;
  body.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      qty = Math.max(1, qty + Number(btn.dataset.qty));
      body.querySelector('#modalQtyVal').textContent = qty;
    });
  });
  body.querySelector('#productModalClose').addEventListener('click', closeProductModal);
  body.querySelector('#modalAddCartBtn').addEventListener('click', () => {
    addToCart(item.name, item.price, imgSrc, qty);
    closeProductModal();
  });

  document.getElementById('productModalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const overlay = document.getElementById('productModalOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeProductModal = closeProductModal;

/* ────────────────────────────────────────────
   ATTACH ADD-TO-CART & WISHLIST TO PAGE CARDS
──────────────────────────────────────────── */
function attachCardHandlers() {
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.querySelector('h3')?.textContent?.trim() || '';
    const priceText = card.querySelector('.price')?.textContent?.replace(/[^\d]/g, '') || '0';
    const price = parseInt(priceText, 10);
    const img = card.querySelector('img')?.src || '';

    // Add to Cart
    card.querySelectorAll('.btn.small:not(.outline)').forEach(btn => {
      if (btn.dataset.cartBound) return;
      btn.dataset.cartBound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(name, price, img);
        btn.textContent = 'Added ✓';
        btn.style.background = '#16a34a';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.style.background = '';
          btn.style.color = '';
        }, 1800);
      });
    });

    // Wishlist icon
    const wishIcon = card.querySelector('.wishlist');
    if (wishIcon && !wishIcon.dataset.wishBound) {
      wishIcon.dataset.wishBound = '1';
      // Restore saved state
      const w = getWishlist();
      if (w.find(i => i.name === name)) {
        const i = wishIcon.querySelector('i');
        if (i) { i.classList.remove('fa-regular'); i.classList.add('fa-solid'); }
        wishIcon.style.background = '#fee2e2';
      }
      wishIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const iconEl = wishIcon.querySelector('i');
        toggleWishlistItem(name, price, img, iconEl);
        wishIcon.style.background = getWishlist().find(i => i.name === name) ? '#fee2e2' : '#fff';
      });
    }

    // Click anywhere else on the card (image, name, price) opens the
    // full product detail view — Add to Cart / wishlist clicks above
    // already call stopPropagation(), so they never trigger this.
    if (!card.dataset.detailBound) {
      card.dataset.detailBound = '1';
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const slug = (card.id || '').replace('product-', '');
        openProductModal(slug, { name, price, img });
      });
    }
  });
}

/* ────────────────────────────────────────────
   CHECKOUT
──────────────────────────────────────────── */
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return;
    const user = localStorage.getItem('fb_user');
    if (!user) {
      showToast('<i class="fa fa-lock"></i> Please login to checkout');
      setTimeout(() => openLoginModal(), 500);
      return;
    }
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.style.display = 'flex';
  });
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.style.display = 'none';
  localStorage.removeItem('fb_cart');
  updateCartBadge();
  window.location.href = 'index.html';
}
window.closeCheckoutModal = closeCheckoutModal;

/* ────────────────────────────────────────────
   LOGIN / REGISTER MODAL
──────────────────────────────────────────── */
function createLoginModal() {
  if (document.getElementById('loginModal')) return;
  const m = document.createElement('div');
  m.className = 'modal-overlay';
  m.id = 'loginModal';
  m.style.display = 'none';
  m.innerHTML = `
    <div class="modal-box" id="loginBox">
      <button class="modal-close" onclick="closeLoginModal()">✕</button>
      <div id="loginForm">
        <h2>Welcome Back 👋</h2>
        <p>Login to your Fly Bazaar account</p>
        <input class="modal-input" id="loginEmail" type="email" placeholder="Email address">
        <input class="modal-input" id="loginPass" type="password" placeholder="Password">
        <button class="modal-submit" onclick="doLogin()">Login</button>
        <p class="modal-divider">Don't have an account? <span class="modal-switch" onclick="showRegister()">Register here</span></p>
      </div>
      <div id="registerForm" style="display:none">
        <h2>Create Account 🛒</h2>
        <p>Join Fly Bazaar today!</p>
        <input class="modal-input" id="regName" type="text" placeholder="Full Name">
        <input class="modal-input" id="regEmail" type="email" placeholder="Email address">
        <input class="modal-input" id="regPass" type="password" placeholder="Password (min 6 chars)">
        <button class="modal-submit" onclick="doRegister()">Create Account</button>
        <p class="modal-divider">Already have an account? <span class="modal-switch" onclick="showLogin()">Login here</span></p>
      </div>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) closeLoginModal(); });
}

function openLoginModal() {
  createLoginModal();
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}
function closeLoginModal() {
  const m = document.getElementById('loginModal');
  if (m) m.style.display = 'none';
}
function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}
function showLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  if (!email || !pass) return showToast('<i class="fa fa-warning"></i> Please fill all fields');
  const users = JSON.parse(localStorage.getItem('fb_users') || '{}');
  if (!users[email] || users[email].pass !== pass) return showToast('<i class="fa fa-warning"></i> Invalid email or password');
  localStorage.setItem('fb_user', JSON.stringify({ name: users[email].name, email }));
  closeLoginModal();
  updateUserIcon();
  showToast(`<i class="fa fa-check"></i> Welcome back, ${users[email].name}!`);
}
function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value.trim();
  if (!name || !email || !pass) return showToast('<i class="fa fa-warning"></i> Please fill all fields');
  if (pass.length < 6) return showToast('<i class="fa fa-warning"></i> Password too short (min 6)');
  const users = JSON.parse(localStorage.getItem('fb_users') || '{}');
  if (users[email]) return showToast('<i class="fa fa-warning"></i> Email already registered');
  users[email] = { name, pass };
  localStorage.setItem('fb_users', JSON.stringify(users));
  localStorage.setItem('fb_user', JSON.stringify({ name, email }));
  closeLoginModal();
  updateUserIcon();
  showToast(`<i class="fa fa-check"></i> Account created! Welcome, ${name}!`);
}
function updateUserIcon() {
  const user = JSON.parse(localStorage.getItem('fb_user') || 'null');
  const btn = document.getElementById('userIconBtn');
  if (btn && user) {
    btn.innerHTML = `<i class="fa-solid fa-user" style="color:#f97316"></i>${user.name.split(' ')[0]}`;
    btn.title = 'Click to logout';
    btn.onclick = () => {
      if (confirm(`Logout, ${user.name}?`)) {
        localStorage.removeItem('fb_user');
        showToast('<i class="fa fa-sign-out"></i> Logged out');
        updateUserIcon();
      }
    };
  } else if (btn) {
    btn.innerHTML = `<i class="fa-regular fa-user"></i>user`;
    btn.onclick = openLoginModal;
  }
}
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.showRegister = showRegister;
window.showLogin = showLogin;
window.doLogin = doLogin;
window.doRegister = doRegister;

/* ────────────────────────────────────────────
   LIVE SEARCH
──────────────────────────────────────────── */
function createSearchOverlay() {
  if (document.getElementById('searchOverlay')) return;
  const o = document.createElement('div');
  o.className = 'search-overlay';
  o.id = 'searchOverlay';
  o.innerHTML = `
    <div class="search-panel">
      <div class="search-bar-inner">
        <i class="fa fa-search"></i>
        <input class="search-input-main" id="searchMain" placeholder="Search products, categories..." autocomplete="off">
        <button class="search-close-btn" onclick="closeSearch()">✕</button>
      </div>
      <div class="search-results" id="searchResults">
        <div class="search-empty">Start typing to search products...</div>
      </div>
    </div>`;
  document.body.appendChild(o);
  o.addEventListener('click', e => { if (e.target === o) closeSearch(); });

  document.getElementById('searchMain').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    const res = document.getElementById('searchResults');
    if (!q) { res.innerHTML = '<div class="search-empty">Start typing to search products...</div>'; window.__searchMatches = []; return; }
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) { res.innerHTML = '<div class="search-empty">No products found for "' + q + '"</div>'; window.__searchMatches = []; return; }
    res.innerHTML = matches.map((p, i) => `
      <div class="search-result-item" data-search-idx="${i}">
        <img src="${resolveAsset(p.img)}" alt="${p.name}" onerror="this.src='${resolveAsset('assets/fly-bazaar-logo.png')}'">
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
        </div>
        <i class="fa fa-chevron-right" style="color:#d1d5db;font-size:12px;margin-left:auto"></i>
      </div>`).join('');

    // Attach click handlers that navigate to the REAL product's real page,
    // and deep-link straight to that exact product card via #product-<slug>
    res.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const p = matches[Number(el.dataset.searchIdx)];
        goToProduct(p);
      });
    });
    window.__searchMatches = matches;
  });

  document.getElementById('searchMain').addEventListener('keydown', e => {
    if (e.key === 'Enter' && window.__searchMatches && window.__searchMatches.length) {
      goToProduct(window.__searchMatches[0]);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });
}

function openSearch() {
  createSearchOverlay();
  const o = document.getElementById('searchOverlay');
  o.classList.add('open');
  setTimeout(() => document.getElementById('searchMain')?.focus(), 50);
}
function closeSearch() {
  const o = document.getElementById('searchOverlay');
  if (o) o.classList.remove('open');
}
window.closeSearch = closeSearch;

/* Navigate to a product's actual page and land exactly on its card */
function goToProduct(p) {
  const targetUrl = resolveAsset(p.page) + '#product-' + p.slug;
  const onSamePage = window.location.pathname.split('/').pop() === p.page.split('/').pop();
  if (onSamePage) {
    // Already on the right page — just close search and scroll/highlight
    closeSearch();
    scrollToProduct(p.slug);
  } else {
    window.location.href = targetUrl;
  }
}
window.goToProduct = goToProduct;

/* Smoothly scroll to a product card and give it a temporary highlight glow */
function scrollToProduct(slug) {
  const card = document.getElementById('product-' + slug);
  if (!card) return;
  const headerH = document.querySelector('.header')?.offsetHeight || 0;
  const top = card.getBoundingClientRect().top + window.scrollY - headerH - 24;
  window.scrollTo({ top, behavior: 'smooth' });
  card.classList.add('product-highlight');
  setTimeout(() => card.classList.remove('product-highlight'), 2200);
}

/* On page load, if the URL carries a #product-<slug> hash (arrived here
   via search), scroll to and highlight that exact product card. */
function handleProductDeepLink() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#product-')) {
    const slug = hash.replace('#product-', '');
    // slight delay so images/layout have settled before measuring position
    setTimeout(() => scrollToProduct(slug), 300);
  }
}

/* ────────────────────────────────────────────
   BACK TO TOP
──────────────────────────────────────────── */
function initBackToTop() {
  let btn = document.getElementById('backToTop');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.title = 'Back to top';
    btn.innerHTML = '<i class="fa fa-arrow-up"></i>';
    document.body.appendChild(btn);
  }
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ────────────────────────────────────────────
   TOAST NOTIFICATION
──────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  let t = document.getElementById('fbToast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.id = 'fbToast';
    document.body.appendChild(t);
  }
  t.innerHTML = msg;
  clearTimeout(toastTimer);
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}
window.showToast = showToast;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.removeFromCart = removeFromCart;
window.toggleWishlistItem = toggleWishlistItem;
window.renderWishlistPage = renderWishlistPage;

/* ────────────────────────────────────────────
   INIT — runs on every page
──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Badges
  updateCartBadge();
  updateWishBadge();
  updateUserIcon();

  // Attach handlers to product cards on this page
  attachCardHandlers();

  // Also re-attach after slider changes (for dynamically shown slides)
  setTimeout(attachCardHandlers, 500);

  // Search box click
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.addEventListener('click', openSearch);
    const inp = searchBox.querySelector('#searchInput');
    if (inp) {
      inp.addEventListener('focus', openSearch);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') openSearch(); });
    }
  }

  // Back to top
  initBackToTop();

  // If we arrived here from a search result, jump to & highlight the product
  handleProductDeepLink();

  // User icon — login modal
  const userBtn = document.getElementById('userIconBtn');
  if (userBtn) {
    userBtn.addEventListener('click', () => {
      const user = localStorage.getItem('fb_user');
      if (!user) openLoginModal();
    });
  }

  // Cart/wishlist icons already navigate correctly via their inline
  // onclick="window.location='...'" attributes in the HTML (with the
  // right ../../ prefix on nested category pages). A duplicate JS
  // click handler used to be attached here with a hardcoded plain
  // 'cart.html' / 'wishlist.html' path — on nested pages this fired
  // AFTER the correct inline handler and overwrote it, sending users
  // to a broken URL like pages/men/wishlist.html ("Cannot GET").
  // Removed — the inline handlers alone are correct on every page.

  // Cart page render
  renderCartPage();

  // Wishlist page render
  renderWishlistPage();
});
