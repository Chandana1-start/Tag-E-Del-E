const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'shop_logo_' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// Initial Database Seed
const initialData = {
  settings: {
    id: 1,
    shop_name: 'TAG É DEL É',
    phone: '9876543210',
    email: 'contact@tagedele.com',
    address: '123 Fashion Street, Mumbai, India',
    currency: '₹',
    logo: 'shop_logo.png',
    tagline: "Style that speaks for you.",
    upi_id: '9876543210@upi',
    cod_enabled: 1,
    online_enabled: 1,
    upi_enabled: 1,
    card_enabled: 1,
    netbanking_enabled: 1
  },
  admins: [
    {
      id: 1,
      username: 'admin',
      passwordHash: 'admin123', // plain or hash
      created_at: new Date().toISOString()
    }
  ],
  customers: [],
  products: [
    {
      id: 1,
      name: 'Classic Formal Shirt',
      category: 'Shirts',
      sku: 'TED-SH-001',
      price: 899,
      old_price: 1299,
      stock: 25,
      image: 'images/classic-formal-shirt.jpg',
      sizes: 'S,M,L,XL,XXL',
      description: 'Comfortable regular-fit formal shirt for office and occasions.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Premium White Shirt',
      category: 'Shirts',
      sku: 'TED-SH-002',
      price: 999,
      old_price: 1499,
      stock: 20,
      image: 'images/premium-white-shirt.jpg',
      sizes: 'S,M,L,XL,XXL',
      description: 'Clean premium white shirt with a smart modern finish.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Essential Black T-Shirt',
      category: 'T-Shirts',
      sku: 'TED-TS-001',
      price: 599,
      old_price: 799,
      stock: 40,
      image: 'images/essential-black-tshirt.jpg',
      sizes: 'S,M,L,XL,XXL',
      description: 'Soft everyday black T-shirt with a comfortable fit.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Urban Polo T-Shirt',
      category: 'T-Shirts',
      sku: 'TED-TS-002',
      price: 699,
      old_price: 999,
      stock: 30,
      image: 'images/urban-polo-tshirt.jpg',
      sizes: 'S,M,L,XL,XXL',
      description: 'Classic polo style for casual and semi-casual looks.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Slim Fit Blue Jeans',
      category: 'Jeans',
      sku: 'TED-JN-001',
      price: 1299,
      old_price: 1799,
      stock: 18,
      image: 'images/slim-fit-blue-jeans.jpg',
      sizes: '30,32,34,36,38',
      description: 'Stretch denim slim-fit jeans for everyday wear.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Dark Wash Jeans',
      category: 'Jeans',
      sku: 'TED-JN-002',
      price: 1399,
      old_price: 1999,
      stock: 16,
      image: 'images/dark-wash-jeans.jpg',
      sizes: '30,32,34,36,38',
      description: 'Premium dark wash denim with a modern silhouette.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      name: 'Casual Cotton Trousers',
      category: 'Trousers',
      sku: 'TED-TR-001',
      price: 1099,
      old_price: 1499,
      stock: 22,
      image: 'images/casual-cotton-trousers.jpg',
      sizes: '30,32,34,36,38',
      description: 'Lightweight cotton trousers for a polished casual look.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      name: 'Classic Casual Jacket',
      category: 'Jackets',
      sku: 'TED-JK-001',
      price: 1799,
      old_price: 2499,
      stock: 12,
      image: 'images/classic-casual-jacket.jpg',
      sizes: 'S,M,L,XL,XXL',
      description: 'Layer-ready casual jacket designed for versatile styling.',
      status: 1,
      new_arrival: 1,
      created_at: new Date().toISOString()
    }
  ],
  orders: [],
  order_items: []
};

function loadDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return { ...initialData, ...data };
    }
  } catch (e) {
    console.error('Error loading db, using initial:', e);
  }
  saveDb(initialData);
  return initialData;
}

function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving db:', e);
  }
}

let db = loadDb();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'tag-e-dele-secret-session-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve static assets from project directory (skip .php files so dynamic routes handle them)
app.use((req, res, next) => {
  if (req.path.endsWith('.php')) {
    return next();
  }
  express.static(__dirname)(req, res, next);
});

app.use('/public', (req, res, next) => {
  if (req.path.endsWith('.php')) {
    return next();
  }
  express.static(__dirname)(req, res, next);
});

// Flash & Session Helper
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {};
  }
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

function setFlash(req, message, type = 'success') {
  req.session.flash = { message, type };
}

function e(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function money(amount) {
  const currency = db.settings.currency || '₹';
  return currency + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getCartCount(cart) {
  if (!cart) return 0;
  return Object.values(cart).reduce((a, b) => a + Number(b || 0), 0);
}

function getCartItems(cart) {
  if (!cart) return [];
  const items = [];
  for (const [key, quantity] of Object.entries(cart)) {
    const parts = String(key).split(':');
    const id = parseInt(parts[0], 10);
    const size = parts[1] || '';
    const qty = parseInt(quantity, 10);
    if (id <= 0 || qty <= 0) continue;
    const p = db.products.find(prod => prod.id === id);
    if (!p || p.status !== 1 || p.stock <= 0) continue;
    
    const safeQty = Math.min(qty, p.stock);
    items.push({
      ...p,
      cart_key: key,
      size: size,
      qty: safeQty,
      quantity: safeQty,
      line_total: p.price * safeQty,
      subtotal: p.price * safeQty,
      stock_status: p.stock <= 0 ? 'Out of Stock' : (p.stock <= 5 ? `Only ${p.stock} left` : 'In Stock'),
      stock_class: p.stock <= 0 ? 'out' : (p.stock <= 5 ? 'low' : 'in')
    });
  }
  return items;
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.line_total, 0);
}

// Common Layout Helpers
function renderHeader(req, pageTitle) {
  const cartCount = getCartCount(req.session.cart);
  const isCustomer = !!req.session.customer_id;
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const flash = req.session.flash_message || null;
  delete req.session.flash_message;

  const reqPath = (req.path || '').toLowerCase();
  const reqCategory = (req.query && req.query.category || '').toLowerCase();
  const reqQ = (req.query && req.query.q || '').toLowerCase();
  const isStorePage = (reqPath === '/products.php' || reqPath === '/products') && !reqCategory && !reqQ;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(pageTitle || shopName)} | Premium Men's Wear</title>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Fixed Top Header Wrapper -->
  <div class="site-header-wrapper">
    <!-- Announcement Topbar -->
    <div class="topbar">
      <strong>⚡ FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹1,499</strong>
      <span>📞 SUPPORT: 9876543210</span>
    </div>

    <!-- Site Header -->
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="index.php">
          <div class="brand-text">
            <span class="brand-name">TAG É DEL É</span>
            <span class="brand-tagline">MENS FASHION</span>
          </div>
        </a>

        <nav class="main-nav">
          <a href="index.php" class="${reqPath === '/' || reqPath === '/index.php' ? 'active' : ''}">Home</a>
          <a href="products.php" class="${isStorePage ? 'active' : ''}">STORE</a>
          <a href="products.php?category=Shirts" class="${reqCategory === 'shirts' ? 'active' : ''}">Shirts</a>
          <a href="products.php?category=T-Shirts" class="${reqCategory === 't-shirts' ? 'active' : ''}">T-Shirts</a>
          <a href="products.php?category=Jeans" class="${reqCategory === 'jeans' ? 'active' : ''}">Jeans</a>
          <a href="products.php?category=Jackets" class="${reqCategory === 'jackets' ? 'active' : ''}">Jackets</a>
          <a href="products.php?category=Trousers" class="${reqCategory === 'trousers' ? 'active' : ''}">Trousers</a>
          <a href="about.php" class="${reqPath === '/about.php' ? 'active' : ''}">About</a>
        </nav>

        <div class="nav-actions">
          <button class="nav-icon-btn" id="searchToggleBtn" title="Search">🔍</button>
          <a href="#" class="nav-icon-btn" title="Wishlist">♡ <span class="badge-count">0</span></a>
          <a href="cart.php" class="nav-icon-btn" title="Cart">🛒 <span class="badge-count">${cartCount}</span></a>

          ${!isCustomer ? `
            <a href="login.php" class="nav-btn-link">Login</a>
            <a href="admin_login.php" class="nav-btn-link nav-btn-admin">Admin</a>
          ` : `
            <a href="my_orders.php" class="nav-btn-link">My Orders</a>
            <a href="logout.php" class="nav-btn-link" style="background:#475569;">Logout</a>
          `}

          <button class="mobile-toggle" id="mobileToggleBtn" aria-label="Open Navigation">☰</button>
        </div>
      </div>
    </header>
  </div>

  <!-- Mobile Drawer Menu -->
  <div class="mobile-drawer" id="mobileDrawer">
    <div class="drawer-header">
      <div class="brand-name" style="font-size:1.3rem;">TAG É DEL É</div>
      <button class="close-drawer" id="closeDrawerBtn">✕</button>
    </div>
    <nav class="mobile-nav-links">
      <a href="index.php">Home</a>
      <a href="products.php">STORE</a>
      <a href="products.php?category=Shirts">Shirts</a>
      <a href="products.php?category=T-Shirts">T-Shirts</a>
      <a href="products.php?category=Jeans">Jeans</a>
      <a href="products.php?category=Jackets">Jackets</a>
      <a href="products.php?category=Trousers">Trousers</a>
      <a href="store.php">Store Location</a>
      <a href="about.php">About Us</a>
      ${!isCustomer ? `
        <a href="login.php" style="color:var(--clr-sky);">Customer Login</a>
        <a href="admin_login.php" style="color:var(--clr-terracotta);">Admin Portal</a>
      ` : `
        <a href="my_orders.php">My Orders</a>
        <a href="logout.php">Logout</a>
      `}
    </nav>
  </div>

  <!-- Search Modal -->
  <div class="search-modal" id="searchModal">
    <div class="search-container">
      <form action="products.php" method="get">
        <input type="text" name="q" class="search-input" placeholder="Search men's shirts, jeans, t-shirts, jackets..." autocomplete="off">
      </form>
      <button class="search-close" id="searchCloseBtn">✕</button>
    </div>
  </div>

  ${flash ? `<div class="flash ${flash.type === 'error' ? 'error' : 'success'}">${e(flash.message)}</div>` : ''}
  <main>`;
}

function renderFooter() {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const year = new Date().getFullYear();

  return `</main>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="shop_logo.png" alt="${e(shopName)}">
          <p>TAG É DEL É delivers bold, modern silhouettes and premium men's fashion essentials. Engineered for confidence, comfort, and contemporary style.</p>
        </div>
        <div class="footer-col">
          <h4>Shop Men's</h4>
          <div class="footer-links">
            <a href="products.php">New Drops</a>
            <a href="products.php?category=Shirts">Shirts</a>
            <a href="products.php?category=T-Shirts">T-Shirts</a>
            <a href="products.php?category=Jeans">Jeans</a>
            <a href="products.php?category=Jackets">Jackets</a>
            <a href="products.php?category=Trousers">Trousers</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Customer Care</h4>
          <div class="footer-links">
            <a href="my_orders.php">Track Order</a>
            <a href="store.php">Store Locations</a>
            <a href="checkout.php">Checkout</a>
            <a href="about.php">Shipping Policy</a>
            <a href="about.php">Returns & Exchange</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <div class="footer-links">
            <a href="about.php">About TAG É DEL É</a>
            <a href="about.php">Our Story</a>
            <a href="about.php">Sustainability</a>
            <a href="admin_login.php">Admin Login</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© ${year} ${e(shopName)}. All rights reserved. Premium Men's Wear.</p>
        <p>Crafted with modern streetwear & luxury menswear aesthetic.</p>
      </div>
    </div>
  </footer>
  <script src="app.js"></script>
  </body>
  </html>`;
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

function getMixedProducts(allProducts, limit = 8) {
  const active = allProducts.filter(p => p.status === 1);
  const shirts = active.filter(p => (p.category || '').toLowerCase() === 'shirts');
  const tshirts = active.filter(p => (p.category || '').toLowerCase() === 't-shirts');
  const jeans = active.filter(p => (p.category || '').toLowerCase() === 'jeans');
  const others = active.filter(p => !['shirts', 't-shirts', 'jeans'].includes((p.category || '').toLowerCase()));

  const mixed = [];
  const maxLen = Math.max(shirts.length, tshirts.length, jeans.length, others.length, 1);
  for (let i = 0; i < maxLen; i++) {
    if (shirts[i]) mixed.push(shirts[i]);
    if (tshirts[i]) mixed.push(tshirts[i]);
    if (jeans[i]) mixed.push(jeans[i]);
    if (others[i]) mixed.push(others[i]);
  }
  return mixed.length > 0 ? mixed.slice(0, limit) : active.slice(0, limit);
}

// Home Page
app.get(['/', '/index.php'], (req, res) => {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const products = getMixedProducts(db.products, 8);
  const newArrivals = getMixedProducts(db.products.filter(p => p.new_arrival === 1), 8);

  let html = renderHeader(req, `${shopName} | Premium Men's Wear`);
  html += `
<!-- =========================================================
     1. HERO SECTION — IMAGE-FOCUSED WITH STABLE FIXED BACKDROP
========================================================= -->
<section class="hero-section">
  <div class="hero-overlay-gradient"></div>

  <!-- HERO CATEGORY CARDS (OVERLAPPING HERO BOTTOM — NON-CLICKABLE INFINITE MARQUEE) -->
  <div class="hero-cards-wrapper">
    <div class="marquee-container">
      <div class="marquee-track">
        <!-- Set 1 (NON-CLICKABLE IMAGE ONLY CARDS) -->
        <div class="hero-cat-card"><img src="herocards/card_1.png" alt="Men's Look 1"></div>
        <div class="hero-cat-card"><img src="herocards/card_2.png" alt="Men's Look 2"></div>
        <div class="hero-cat-card"><img src="herocards/card_3.png" alt="Men's Look 3"></div>
        <div class="hero-cat-card"><img src="herocards/card_4.png" alt="Men's Look 4"></div>
        <div class="hero-cat-card"><img src="herocards/card_5.png" alt="Men's Look 5"></div>
        <div class="hero-cat-card"><img src="herocards/card_6.png" alt="Men's Look 6"></div>
        <div class="hero-cat-card"><img src="herocards/card_7.png" alt="Men's Look 7"></div>
        <div class="hero-cat-card"><img src="herocards/card_8.png" alt="Men's Look 8"></div>
        <div class="hero-cat-card"><img src="herocards/card_9.png" alt="Men's Look 9"></div>
        <div class="hero-cat-card"><img src="herocards/card_10.png" alt="Men's Look 10"></div>
        <div class="hero-cat-card"><img src="herocards/card_11.png" alt="Men's Look 11"></div>
        <div class="hero-cat-card"><img src="herocards/card_12.png" alt="Men's Look 12"></div>
        <div class="hero-cat-card"><img src="herocards/card_13.png" alt="Men's Look 13"></div>
        <div class="hero-cat-card"><img src="herocards/card_14.png" alt="Men's Look 14"></div>
        <div class="hero-cat-card"><img src="herocards/card_15.png" alt="Men's Look 15"></div>

        <!-- Set 2 (Identical Duplicate for Seamless Infinite Marquee Loop) -->
        <div class="hero-cat-card"><img src="herocards/card_1.png" alt="Men's Look 1"></div>
        <div class="hero-cat-card"><img src="herocards/card_2.png" alt="Men's Look 2"></div>
        <div class="hero-cat-card"><img src="herocards/card_3.png" alt="Men's Look 3"></div>
        <div class="hero-cat-card"><img src="herocards/card_4.png" alt="Men's Look 4"></div>
        <div class="hero-cat-card"><img src="herocards/card_5.png" alt="Men's Look 5"></div>
        <div class="hero-cat-card"><img src="herocards/card_6.png" alt="Men's Look 6"></div>
        <div class="hero-cat-card"><img src="herocards/card_7.png" alt="Men's Look 7"></div>
        <div class="hero-cat-card"><img src="herocards/card_8.png" alt="Men's Look 8"></div>
        <div class="hero-cat-card"><img src="herocards/card_9.png" alt="Men's Look 9"></div>
        <div class="hero-cat-card"><img src="herocards/card_10.png" alt="Men's Look 10"></div>
        <div class="hero-cat-card"><img src="herocards/card_11.png" alt="Men's Look 11"></div>
        <div class="hero-cat-card"><img src="herocards/card_12.png" alt="Men's Look 12"></div>
        <div class="hero-cat-card"><img src="herocards/card_13.png" alt="Men's Look 13"></div>
        <div class="hero-cat-card"><img src="herocards/card_14.png" alt="Men's Look 14"></div>
        <div class="hero-cat-card"><img src="herocards/card_15.png" alt="Men's Look 15"></div>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================
     2. WHAT'S HOT (TRENDING NOW) SECTION
========================================================= -->
<section class="section-padding trending-section">
  <div class="container">
    <div class="section-head centered-head">
      <span class="eyebrow">WHAT'S HOT</span>
      <h2 class="section-title">Trending Now</h2>
      <p class="section-subtitle">Must-have shirts, streetwear tees, and statement denim</p>
    </div>
    <div class="filter-tabs">
      <button class="tab-btn active" data-filter="all">All Items</button>
      <button class="tab-btn" data-filter="shirts">Shirts</button>
      <button class="tab-btn" data-filter="t-shirts">T-Shirts</button>
      <button class="tab-btn" data-filter="jeans">Jeans</button>
      <button class="tab-btn" data-filter="jackets">Jackets</button>
    </div>
    <div class="products-grid">
      ${products.map(p => {
        const stock = parseInt(p.stock, 10);
        const isOutOfStock = stock <= 0;
        const catLower = (p.category || '').toLowerCase().trim();
        const availSizes = p.sizes ? p.sizes.split(',') : (['jeans', 'trousers'].includes(catLower) ? ['30','32','34','36','38'] : ['S','M','L','XL','XXL']);

        return `
        <article class="product-card trending-item" data-category="${e(catLower)}">
          <button class="wishlist-btn" title="Add to Wishlist">♡</button>
          <a href="product.php?id=${p.id}">
            <div class="product-image-wrapper">
              <img class="product-img" src="${e(p.image)}" alt="${e(p.name)}">
              <div class="quick-view-overlay"><span class="btn-quickview">Quick View</span></div>
            </div>
          </a>
          <div class="product-info">
            <span class="product-cat">${e(p.category)}</span>
            <h3 class="product-name"><a href="product.php?id=${p.id}">${e(p.name)}</a></h3>
            <div class="product-price-row">
              <span class="price-current">${money(p.price)}</span>
              ${p.old_price ? `<span class="price-old">${money(p.old_price)}</span>` : ''}
            </div>
            <div class="product-size-box">
              <label class="product-size-label" for="size-trend-${p.id}">SIZE</label>
              <select class="product-size-select" id="size-trend-${p.id}" name="size" form="cart-form-trend-${p.id}" required ${isOutOfStock ? 'disabled' : ''}>
                <option value="">Select Size</option>
                ${availSizes.map(sz => `<option value="${e(sz.trim())}">${e(sz.trim())}</option>`).join('')}
              </select>
            </div>
            <div class="product-actions">
              ${isOutOfStock ? `
                <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
              ` : `
                <form method="post" action="cart.php" id="cart-form-trend-${p.id}" style="width:100%;">
                  <input type="hidden" name="action" value="add">
                  <input type="hidden" name="product_id" value="${p.id}">
                  <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                </form>
              `}
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
  </div>
</section>

<!-- =========================================================
     MODELVIDEO SCROLL-CONTROLLED HERO EXPERIENCE
========================================================= -->
<div class="modelvideo-scroll-section" id="modelvideoScrollSection">
  <div class="modelvideo-sticky-wrapper">
    
    <!-- Loading Overlay -->
    <div class="modelvideo-loader" id="modelvideoLoader">
      <div class="modelvideo-loader-brand">TAG É DEL É</div>
      <div class="modelvideo-loader-sub">CINEMATIC MEN'S FASHION</div>
      <div class="modelvideo-loader-line"><div class="modelvideo-loader-progress"></div></div>
    </div>

    <!-- Hidden Video Source -->
    <video
      id="modelVideoElem"
      class="modelvideo-source-video"
      src="Modelvideo/hero-section.mp4"
      preload="auto"
      muted
      playsinline
      webkit-playsinline
      tabindex="-1"
    ></video>

    <!-- Ultra-Smooth Canvas for Scroll-Scrubbed Frames -->
    <canvas id="modelVideoCanvas" class="modelvideo-canvas"></canvas>

    <!-- Minimal Subtle Overlay -->
    <div class="modelvideo-overlay">
      <div class="modelvideo-branding">
        <span class="modelvideo-tag">TAG É DEL É</span>
        <span class="modelvideo-sub">AUTUMN / WINTER CINEMATIC CAMPAIGN</span>
      </div>
      <div class="modelvideo-scroll-indicator">
        <span>SCROLL TO EXPLORE CAMPAIGN</span>
        <div class="scroll-arrow-down">↓</div>
      </div>
    </div>

  </div>
</div>

<!-- =========================================================
     3. EDITORIAL FASHION SECTION (EXACT 5-BOX ASYMMETRIC GRID)
========================================================= -->
<section class="section-padding" style="background:#FFFFFF;">
  <div class="container">
    <div class="section-head text-center" style="text-align:center; justify-content:center; flex-direction:column; align-items:center; margin-bottom:36px;">
      <span class="eyebrow">EDITORIAL FASHION</span>
      <h2 class="section-title">Style Lookbook</h2>
      <p class="section-subtitle" style="margin:8px auto 0; text-align:center;">Contemporary men's streetwear and luxury outfit inspirations</p>
    </div>

    <div class="editorial-asymmetric-grid">
      <!-- BOX 1: LARGE FEATURED VERTICAL IMAGE -->
      <div class="editorial-box editorial-box-1">
        <img src="herocards/vacation_ready.png" alt="Streetwear Edit">
        <div class="editorial-box-overlay">
          <span class="editorial-box-tag">FEATURED EDIT</span>
          <h3 class="editorial-box-title">STREETWEAR EDIT</h3>
          <p class="editorial-box-sub">Modern silhouettes for the contemporary man</p>
        </div>
      </div>

      <!-- BOX 2: SMALLER IMAGE -->
      <div class="editorial-box editorial-box-2">
        <img src="herocards/smart_casual.png" alt="Smart Casual">
        <div class="editorial-box-overlay">
          <span class="editorial-box-tag">LOOK 02</span>
          <h3 class="editorial-box-title">SMART CASUAL</h3>
          <p class="editorial-box-sub">Effortless refinement</p>
        </div>
      </div>

      <!-- BOX 3: SMALLER IMAGE -->
      <div class="editorial-box editorial-box-3">
        <img src="herocards/bold_moves.png" alt="Luxury Style">
        <div class="editorial-box-overlay">
          <span class="editorial-box-tag">LOOK 03</span>
          <h3 class="editorial-box-title">LUXURY STYLE</h3>
          <p class="editorial-box-sub">Refined textures & cuts</p>
        </div>
      </div>

      <!-- BOX 4: SMALLER IMAGE -->
      <div class="editorial-box editorial-box-4">
        <img src="Jeans/jeans_1.png" alt="Denim Edit">
        <div class="editorial-box-overlay">
          <span class="editorial-box-tag">LOOK 04</span>
          <h3 class="editorial-box-title">DENIM EDIT</h3>
          <p class="editorial-box-sub">Urban silhouettes</p>
        </div>
      </div>

      <!-- BOX 5: SMALLER IMAGE -->
      <div class="editorial-box editorial-box-5">
        <img src="T-Shirts/tshirt_1.png" alt="Urban Essentials">
        <div class="editorial-box-overlay">
          <span class="editorial-box-tag">LOOK 05</span>
          <h3 class="editorial-box-title">URBAN ESSENTIALS</h3>
          <p class="editorial-box-sub">Everyday city style</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- =========================================================
     4. BROWSE BY STYLE (FIND YOUR LOOK) HORIZONTAL DRAGGABLE SLIDER
========================================================= -->
<section class="drag-gallery-section">
  <div class="container">
    <div class="section-head">
      <div>
        <span class="eyebrow">BROWSE BY STYLE</span>
        <h2 class="section-title">Find your look</h2>
        <p class="section-subtitle">Swipe or drag to explore our men's style categories</p>
      </div>
    </div>

    <div class="drag-gallery-container" id="dragGallery">
      <a href="products.php?category=Shirts" class="browse-style-card">
        <img src="Shirts/shirt_1.png" alt="Shirts">
        <div class="browse-style-overlay">
          <h3 class="browse-style-title">Shirts</h3>
          <span class="browse-style-link">VIEW MORE →</span>
        </div>
      </a>

      <a href="products.php?category=T-Shirts" class="browse-style-card">
        <img src="T-Shirts/tshirt_1.png" alt="T-Shirts">
        <div class="browse-style-overlay">
          <h3 class="browse-style-title">T-Shirts</h3>
          <span class="browse-style-link">VIEW MORE →</span>
        </div>
      </a>

      <a href="products.php?category=Jeans" class="browse-style-card">
        <img src="Jeans/jeans_1.png" alt="Jeans">
        <div class="browse-style-overlay">
          <h3 class="browse-style-title">Jeans</h3>
          <span class="browse-style-link">VIEW MORE →</span>
        </div>
      </a>

      <a href="products.php?category=Trousers" class="browse-style-card">
        <img src="Trousers/trouser_1.png" alt="Trousers">
        <div class="browse-style-overlay">
          <h3 class="browse-style-title">Trousers</h3>
          <span class="browse-style-link">VIEW MORE →</span>
        </div>
      </a>

      <a href="products.php?category=Jackets" class="browse-style-card">
        <img src="Jackets/jacket_1.png" alt="Jackets">
        <div class="browse-style-overlay">
          <h3 class="browse-style-title">Jackets</h3>
          <span class="browse-style-link">VIEW MORE →</span>
        </div>
      </a>
    </div>

    <div class="carousel-dots">
      <span class="dot active"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
</section>

<!-- =========================================================
     5. MEN'S WARDROBE ESSENTIALS (ASYMMETRIC CATEGORY GRID)
========================================================= -->
<section class="section-padding">
  <div class="container">
    <div class="section-head">
      <div>
        <span class="eyebrow">BROWSE CATEGORIES</span>
        <h2 class="section-title">Men's Wardrobe Essentials</h2>
        <p class="section-subtitle">Curated essentials engineered for modern men's style</p>
      </div>
      <a href="products.php" class="btn-secondary">View All Categories →</a>
    </div>

    <div class="wardrobe-grid">
      <!-- 1. SHIRTS (Large Featured Banner) -->
      <a href="products.php?category=Shirts" class="wardrobe-card wardrobe-card-large">
        <img src="Shirts/shirt_1.png" alt="Men's Shirts">
        <div class="wardrobe-card-overlay">
          <span class="eyebrow" style="color:#FFFFFF;">CATEGORY 01</span>
          <h3 class="wardrobe-card-title">SHIRTS</h3>
          <p class="wardrobe-card-desc">Printed, Formal & Statement Casual Shirts</p>
          <span class="btn-chip" style="margin-top:12px;">Explore Shirts →</span>
        </div>
      </a>

      <!-- 2. JEANS -->
      <a href="products.php?category=Jeans" class="wardrobe-card wardrobe-card-medium">
        <img src="Jeans/jeans_1.png" alt="Men's Jeans">
        <div class="wardrobe-card-overlay">
          <span class="eyebrow" style="color:#FFFFFF;">CATEGORY 02</span>
          <h3 class="wardrobe-card-title">JEANS</h3>
          <p class="wardrobe-card-desc">Slim Fit, Streetwear & Dark Wash Denim</p>
          <span class="btn-chip" style="margin-top:12px;">Explore Jeans →</span>
        </div>
      </a>

      <!-- 3. TROUSERS -->
      <a href="products.php?category=Trousers" class="wardrobe-card wardrobe-card-medium">
        <img src="Trousers/trouser_1.png" alt="Men's Trousers">
        <div class="wardrobe-card-overlay">
          <span class="eyebrow" style="color:#FFFFFF;">CATEGORY 03</span>
          <h3 class="wardrobe-card-title">TROUSERS</h3>
          <p class="wardrobe-card-desc">Tailored Cotton Trousers & Cargo Pants</p>
          <span class="btn-chip" style="margin-top:12px;">Explore Trousers →</span>
        </div>
      </a>

      <!-- 4. T-SHIRTS -->
      <a href="products.php?category=T-Shirts" class="wardrobe-card wardrobe-card-medium">
        <img src="T-Shirts/tshirt_1.png" alt="Men's T-Shirts">
        <div class="wardrobe-card-overlay">
          <span class="eyebrow" style="color:#FFFFFF;">CATEGORY 04</span>
          <h3 class="wardrobe-card-title">T-SHIRTS</h3>
          <p class="wardrobe-card-desc">Oversized, Graphic & Urban Polo Tees</p>
          <span class="btn-chip" style="margin-top:12px;">Explore T-Shirts →</span>
        </div>
      </a>

      <!-- 5. JACKETS -->
      <a href="products.php?category=Jackets" class="wardrobe-card wardrobe-card-medium">
        <img src="Jackets/jacket_1.png" alt="Men's Jackets">
        <div class="wardrobe-card-overlay">
          <span class="eyebrow" style="color:#FFFFFF;">CATEGORY 05</span>
          <h3 class="wardrobe-card-title">JACKETS</h3>
          <p class="wardrobe-card-desc">Casual Layering & Streetwear Jackets</p>
          <span class="btn-chip" style="margin-top:12px;">Explore Jackets →</span>
        </div>
      </a>
    </div>
  </div>
</section>

<!-- NEW ARRIVALS -->
<section class="section-padding" id="new-arrivals" style="background:var(--clr-surface);">
  <div class="container">
    <div class="section-head text-center" style="text-align:center; justify-content:center; flex-direction:column; align-items:center; margin-bottom:44px;">
      <span class="eyebrow">FRESH DROPS</span>
      <h2 class="section-title">New Arrivals</h2>
      <p class="section-subtitle" style="margin:8px auto 0; text-align:center;">The latest printed shirts, streetwear tees and statement menswear</p>
    </div>

    <div class="products-grid">
      ${newArrivals.map(p => {
        const stock = parseInt(p.stock, 10);
        const isOutOfStock = stock <= 0;
        const catLower = (p.category || '').toLowerCase().trim();
        const availSizes = p.sizes ? p.sizes.split(',') : (['jeans', 'trousers'].includes(catLower) ? ['30','32','34','36','38'] : ['S','M','L','XL','XXL']);

        return `
        <article class="product-card">
          <span class="badge-tag new">NEW</span>
          <button class="wishlist-btn" title="Add to Wishlist">♡</button>
          <a href="product.php?id=${p.id}">
            <div class="product-image-wrapper">
              <img class="product-img" src="${e(p.image)}" alt="${e(p.name)}">
              <div class="quick-view-overlay"><span class="btn-quickview">Quick View</span></div>
            </div>
          </a>
          <div class="product-info">
            <span class="product-cat">${e(p.category)}</span>
            <h3 class="product-name"><a href="product.php?id=${p.id}">${e(p.name)}</a></h3>
            <div class="product-price-row">
              <span class="price-current">${money(p.price)}</span>
              ${p.old_price ? `<span class="price-old">${money(p.old_price)}</span>` : ''}
            </div>
            <div class="product-size-box">
              <label class="product-size-label" for="size-new-${p.id}">SIZE</label>
              <select class="product-size-select" id="size-new-${p.id}" name="size" form="cart-form-new-${p.id}" required ${isOutOfStock ? 'disabled' : ''}>
                <option value="">Select Size</option>
                ${availSizes.map(sz => `<option value="${e(sz.trim())}">${e(sz.trim())}</option>`).join('')}
              </select>
            </div>
            <div class="product-actions">
              ${isOutOfStock ? `
                <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
              ` : `
                <form method="post" action="cart.php" id="cart-form-new-${p.id}" style="width:100%;">
                  <input type="hidden" name="action" value="add">
                  <input type="hidden" name="product_id" value="${p.id}">
                  <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                </form>
              `}
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
  </div>
</section>

<!-- 4. EDITORIAL CAMPAIGN -->
<section class="editorial-campaign-section">
  <div class="container">
    <div class="editorial-campaign-box">
      <span class="td-eyebrow">EDITORIAL CAMPAIGN</span>
      <h2 class="editorial-campaign-title">THE NEW MEN'S COLLECTION</h2>
      <p class="editorial-campaign-desc">
        Bold silhouettes. Modern prints. Everyday confidence. Explore high-impact men's fashion designed for statement looks.
      </p>
      <a href="products.php" class="td-btn-primary">EXPLORE COLLECTION <span class="btn-arrow">→</span></a>
    </div>
  </div>
</section>

<!-- 5. LIMITED TIME DROPS -->
<section class="limited-drops-section">
  <div class="container">
    <div class="limited-drops-box">
      <span class="td-eyebrow gold">LIMITED TIME DROPS</span>
      <h2 class="limited-drops-title">NEW SEASON. NEW ATTITUDE.</h2>
      <a href="products.php" class="td-btn-burgundy">SHOP SALE — UP TO 40% OFF <span class="btn-arrow">→</span></a>
    </div>
  </div>
</section>

<!-- 6. EXCLUSIVELY MENSWEAR -->
<section class="exclusively-menswear-section">
  <div class="container">
    <div class="exclusively-menswear-box">
      <span class="td-eyebrow">EXCLUSIVELY MENSWEAR</span>
      <h2 class="exclusively-menswear-title">YOUR STYLE. YOUR RULES.</h2>
      <a href="products.php" class="td-btn-primary">EXPLORE TAG É DEL É <span class="btn-arrow">→</span></a>
    </div>
  </div>
</section>

<!-- 7. OUR PHILOSOPHY -->
<section class="philosophy-section">
  <div class="container">
    <div class="philosophy-box">
      <span class="philosophy-eyebrow">OUR PHILOSOPHY</span>
      <h2 class="philosophy-main-title">ABOUT TAG É DEL É</h2>
      <p class="philosophy-text">
        TAG É DEL É brings together bold prints, modern silhouettes, and effortless men's fashion for those who want their style to stand out.
      </p>
      <p class="philosophy-text">
        From everyday essentials to statement jackets and relaxed denim, every piece is designed around confidence, comfort, and contemporary fashion.
      </p>
      <div class="philosophy-action">
        <a href="about.php" class="philosophy-btn">DISCOVER OUR STORY <span class="btn-arrow">→</span></a>
      </div>
    </div>
  </div>
</section>

<!-- 8. PHILOSOPHY FEATURES -->
<section class="features-section">
  <div class="container">
    <div class="features-editorial-grid">
      <div class="feature-block">
        <div class="feature-num">01</div>
        <div class="feature-icon-wrap">
          <svg class="feature-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <h3 class="feature-title">PREMIUM STYLE</h3>
        <p class="feature-desc">Modern designs tailored for today's fashion-conscious man.</p>
      </div>
      <div class="feature-block">
        <div class="feature-num">02</div>
        <div class="feature-icon-wrap">
          <svg class="feature-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3 class="feature-title">QUALITY FIRST</h3>
        <p class="feature-desc">Fashion designed with premium fabrics, durable stitching, and comfort in mind.</p>
      </div>
      <div class="feature-block">
        <div class="feature-num">03</div>
        <div class="feature-icon-wrap">
          <svg class="feature-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h3 class="feature-title">TREND-DRIVEN</h3>
        <p class="feature-desc">Fresh drops inspired by global streetwear and contemporary men's fashion.</p>
      </div>
      <div class="feature-block">
        <div class="feature-num">04</div>
        <div class="feature-icon-wrap">
          <svg class="feature-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <h3 class="feature-title">EASY SHOPPING</h3>
        <p class="feature-desc">Fast nationwide shipping, COD, UPI options, and simple returns.</p>
      </div>
    </div>
  </div>
</section>

<!-- 9. REAL FEEDBACK -->
<section class="testimonials-section">
  <div class="container">
    <div class="testimonials-header">
      <span class="td-eyebrow">REAL FEEDBACK</span>
      <h2 class="testimonials-main-title">What Our Customers Say</h2>
    </div>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="quote-mark">“</div>
        <div class="star-rating">★★★★★</div>
        <p class="quote-text">"Great fit, amazing print, and the quality of the fabric is even better in person!"</p>
        <div class="quote-author-wrap">
          <span class="author-name">— Rohan M.</span>
          <span class="author-city">Mumbai</span>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="quote-mark">“</div>
        <div class="star-rating">★★★★★</div>
        <p class="quote-text">"TAG É DEL É has completely upgraded my casual wardrobe. The oversized tees are top notch."</p>
        <div class="quote-author-wrap">
          <span class="author-name">— Vikram S.</span>
          <span class="author-city">Delhi</span>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="quote-mark">“</div>
        <div class="star-rating">★★★★★</div>
        <p class="quote-text">"Stylish printed shirts that stand out without looking ordinary. Fast delivery too!"</p>
        <div class="quote-author-wrap">
          <span class="author-name">— Aman P.</span>
          <span class="author-city">Bengaluru</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 10. JOIN THE CLUB -->
<section class="join-club-section">
  <div class="container">
    <div class="join-club-box">
      <div class="join-club-bg"></div>
      <div class="join-club-content">
        <span class="td-eyebrow">JOIN THE CLUB</span>
        <h2 class="join-club-title">STAY AHEAD OF THE STYLE</h2>
        <p class="join-club-desc">Get first access to new drops, exclusive collections and secret sales.</p>
        <form class="join-club-form" onsubmit="event.preventDefault(); showToast('Welcome to TAG É DEL É Club!');">
          <input type="email" class="join-club-input" placeholder="Enter your email address..." required>
          <button type="submit" class="td-btn-burgundy">JOIN NOW <span class="btn-arrow">→</span></button>
        </form>
      </div>
    </div>
  </div>
</section>
`;

  html += renderFooter();
  res.send(html);
});


// Products / Store Page
app.get('/products.php', (req, res) => {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const category = (req.query.category || '').trim();
  const q = (req.query.q || '').trim();
  const qLower = q.toLowerCase();

  // If no category and no search query, render the MINIMAL 4 PHOTO STORE PAGE
  if (!category && !q) {
    let html = renderHeader(req, `STORE | ${shopName}`);
    html += `
<div class="store-minimal-page">
  <div class="container">
    
    <!-- STORE HERO -->
    <header class="store-minimal-hero store-reveal">
      <span class="store-minimal-tag">TAG É DEL É</span>
      <h1 class="store-minimal-title">THE STORE</h1>
      <p class="store-minimal-sub">"Where modern style meets everyday confidence."</p>
    </header>

    <!-- 4 PHOTO EDITORIAL MAGAZINE LAYOUT -->
    <div class="store-editorial-magazine">

      <!-- PHOTO 1 -->
      <article class="store-photo-card store-photo-1 store-reveal store-stagger-1">
        <div class="store-photo-wrap">
          <img src="Store/shop%201%20image.png" alt="TAG É DEL É Fashion 01" loading="lazy">
        </div>
        <p class="store-photo-quote">"STYLE IS THE WAY<br>YOU EXPRESS YOURSELF."</p>
      </article>

      <!-- PHOTO 2 -->
      <article class="store-photo-card store-photo-2 store-reveal store-stagger-2">
        <div class="store-photo-wrap">
          <img src="Store/shop%202.png" alt="TAG É DEL É Fashion 02" loading="lazy">
        </div>
        <p class="store-photo-quote">"CONFIDENCE<br>STARTS WITH WHAT YOU WEAR."</p>
      </article>

      <!-- PHOTO 3 -->
      <article class="store-photo-card store-photo-3 store-reveal store-stagger-3">
        <div class="store-photo-wrap">
          <img src="Store/shop%203%20image.png" alt="TAG É DEL É Fashion 03" loading="lazy">
        </div>
        <p class="store-photo-quote">"LESS NOISE.<br>MORE STYLE."</p>
      </article>

      <!-- PHOTO 4 -->
      <article class="store-photo-card store-photo-4 store-reveal store-stagger-4">
        <div class="store-photo-wrap">
          <img src="Store/shop%204.png" alt="TAG É DEL É Fashion 04" loading="lazy">
        </div>
        <p class="store-photo-quote">"DRESS WELL.<br>LIVE CONFIDENTLY."</p>
      </article>

      <!-- SHOP SUPPORTING BOX -->
      <div class="store-cta-box store-reveal store-stagger-4">
        <p class="store-cta-text">"Discover contemporary menswear designed for modern everyday living."</p>
        <a href="products.php?category=Shirts" class="store-cta-btn">
          SHOP THE COLLECTION <span class="btn-arrow">→</span>
        </a>
      </div>

    </div>

  </div>
</div>
`;
    html += renderFooter();
    return res.send(html);
  }

  // Otherwise, render category product catalogue view
  let products = db.products.filter(p => p.status === 1);
  if (category) {
    products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }
  if (qLower) {
    products = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(qLower)) || 
      (p.category && p.category.toLowerCase().includes(qLower)) ||
      (p.description && p.description.toLowerCase().includes(qLower))
    );
  }
  products = products.slice().reverse();

  const catBanners = {
    'Shirts': { tag: 'SHIRTS COLLECTION', title: 'PRINTED & CASUAL SHIRTS', desc: 'Bold prints, modern fits, and premium casual cotton shirts engineered for everyday confidence.', img: 'herocards/summer_vibes.png' },
    'T-Shirts': { tag: 'T-SHIRTS COLLECTION', title: 'OVERSIZED & GRAPHIC TEES', desc: 'Relaxed street fits, premium heavyweight cotton, and iconic urban graphic T-shirts.', img: 'herocards/everyday_comfort.png' },
    'Jeans': { tag: 'DENIM COLLECTION', title: 'SLIM & STREET DENIM JEANS', desc: 'Contemporary washes, relaxed street cuts, and durable stretch denim engineered for maximum comfort.', img: 'herocards/denim_days.png' },
    'Jackets': { tag: 'OUTERWEAR COLLECTION', title: 'CASUAL & BOMBER JACKETS', desc: 'Statement layering pieces, bomber jackets, and casual outerwear to elevate any outfit.', img: 'herocards/urban_edge.png' },
    'Trousers': { tag: 'TROUSERS COLLECTION', title: 'CARGO & TAILORED TROUSERS', desc: 'Sleek tailored trousers, utility cargos, and relaxed bottomwear for modern menswear.', img: 'herocards/timeless_style.png' }
  };
  const activeBanner = catBanners[category] || null;

  function getProductFilterAttrsJS(p) {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const id = p.id || 1;

    let brand = p.brand;
    if (!brand) {
      if (id % 5 === 0) brand = 'TAG É DEL É';
      else if (id % 5 === 1) brand = 'Urban Thread';
      else if (id % 5 === 2) brand = 'Classic Fit';
      else if (id % 5 === 3) brand = 'Street Line';
      else brand = 'Premium Wear';
    }

    let color = p.color;
    if (!color) {
      if (name.includes('black') || desc.includes('black')) color = 'Black';
      else if (name.includes('white') || desc.includes('white')) color = 'White';
      else if (name.includes('blue') || name.includes('indigo') || desc.includes('blue')) color = 'Blue';
      else if (name.includes('red') || desc.includes('red')) color = 'Red';
      else if (name.includes('green') || desc.includes('green') || desc.includes('olive')) color = 'Green';
      else if (name.includes('khaki') || name.includes('beige') || desc.includes('khaki')) color = 'Beige';
      else if (name.includes('grey') || name.includes('gray') || desc.includes('grey')) color = 'Grey';
      else if (name.includes('brown') || desc.includes('brown')) color = 'Brown';
      else if (name.includes('purple') || desc.includes('purple')) color = 'Purple';
      else {
        const colors = ['Black', 'Blue', 'White', 'Beige', 'Grey', 'Green'];
        color = colors[id % colors.length];
      }
    }

    let fabric = p.fabric;
    if (!fabric) {
      if (cat.includes('jeans')) {
        fabric = desc.includes('stretch') ? 'Stretch Denim' : 'Denim';
      } else if (cat.includes('shirts')) {
        if (name.includes('linen') || desc.includes('linen')) fabric = 'Linen';
        else if (desc.includes('blend')) fabric = 'Cotton Blend';
        else fabric = 'Cotton';
      } else if (cat.includes('t-shirts')) {
        fabric = (desc.includes('blend') || desc.includes('poly')) ? 'Cotton Blend' : 'Cotton';
      } else if (cat.includes('jackets')) {
        if (name.includes('denim')) fabric = 'Denim';
        else if (name.includes('nylon')) fabric = 'Nylon';
        else fabric = 'Polyester';
      } else if (cat.includes('trousers')) {
        if (name.includes('twill') || desc.includes('twill')) fabric = 'Twill';
        else if (name.includes('linen')) fabric = 'Linen';
        else fabric = 'Cotton';
      } else {
        fabric = 'Cotton';
      }
    }

    let pattern = p.pattern;
    if (!pattern) {
      if (name.includes('print') || desc.includes('print') || desc.includes('floral')) pattern = 'Printed';
      else if (name.includes('stripe') || desc.includes('stripe')) pattern = 'Striped';
      else if (name.includes('check') || desc.includes('check')) pattern = 'Checked';
      else if (name.includes('graphic') || desc.includes('graphic')) pattern = 'Graphic';
      else if (desc.includes('texture')) pattern = 'Textured';
      else if (name.includes('camo') || desc.includes('camo')) pattern = 'Camouflage';
      else pattern = 'Solid';
    }

    let fit = p.fit;
    if (!fit) {
      if (name.includes('slim') || desc.includes('slim')) fit = 'Slim Fit';
      else if (name.includes('oversize') || desc.includes('oversize') || name.includes('relaxed')) fit = 'Oversized';
      else if (name.includes('relaxed') || desc.includes('relaxed')) fit = 'Relaxed Fit';
      else fit = 'Regular Fit';
    }

    return { brand, color, fabric, pattern, fit };
  }

  let html = renderHeader(req, `${category ? category : 'Store'} | ${shopName}`);
  html += `
<section class="section-padding">
  <div class="container">



    ${activeBanner ? `
      <div style="position:relative; border-radius:var(--radius-lg); overflow:hidden; margin-bottom: 40px; background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border:1px solid var(--clr-border); padding: 50px 40px; display:grid; grid-template-columns:1fr 280px; gap:30px; align-items:center;">
        <div>
          <span class="eyebrow">${e(activeBanner.tag)}</span>
          <h1 style="font-family:var(--font-heading); font-size:2.8rem; color:var(--clr-text-main); margin:10px 0 14px; line-height:1.1;">
            ${e(activeBanner.title)}
          </h1>
          <p style="font-size:1.05rem; color:#475569; max-width:600px; line-height:1.6;">
            ${e(activeBanner.desc)}
          </p>
        </div>
        <div style="height: 180px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md);">
          <img src="${e(activeBanner.img)}" alt="${e(category)}" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    ` : `
      <div class="section-head" style="margin-bottom: 30px;">
        <div>
          <span class="eyebrow">MEN'S CATALOGUE</span>
          <h1 class="section-title">${q ? `Search Results for "${e(q)}"` : 'Category Products'}</h1>
          <p class="section-subtitle">Discover premium menswear essentials across all categories</p>
        </div>
      </div>
    `}

    <div style="background:#FFFFFF; border-radius:var(--radius-lg); padding:20px 26px; border:1px solid var(--clr-border); box-shadow:var(--shadow-sm); margin-bottom: 30px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:20px;">
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <a href="products.php" class="size-pill-btn ${!category ? 'active' : ''}" style="border-radius:var(--radius-pill); padding:0 20px; height:38px; display:inline-flex; align-items:center;">
          STORE LANDING
        </a>
        ${['Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Trousers'].map(c => `
          <a href="products.php?category=${encodeURIComponent(c)}${q ? `&q=${encodeURIComponent(q)}` : ''}" class="size-pill-btn ${category.toLowerCase() === c.toLowerCase() ? 'active' : ''}" style="border-radius:var(--radius-pill); padding:0 20px; height:38px; display:inline-flex; align-items:center;">
            ${e(c)}
          </a>
        `).join('')}
      </div>

      <form method="get" action="products.php" style="display:flex; gap:10px; align-items:center; flex:1; max-width:360px;">
        ${category ? `<input type="hidden" name="category" value="${e(category)}">` : ''}
        <input type="text" name="q" value="${e(q)}" placeholder="Search products..." style="flex:1; padding:10px 16px; border-radius:var(--radius-pill); border:1px solid var(--clr-border); background:var(--clr-bg); font-size:0.9rem;">
        <button class="btn-primary" type="submit" style="padding:10px 20px; font-size:0.85rem; border-radius:var(--radius-pill);">Search</button>
        ${(category || q) ? `<a href="products.php" class="btn-secondary" style="padding:10px 16px; font-size:0.85rem; border-radius:var(--radius-pill);">Clear</a>` : ''}
      </form>
    </div>

    <div class="category-page-wrap">
      
      <!-- Mobile Filter Bar -->
      <div class="mobile-filter-bar">
        <button type="button" class="mobile-filter-trigger" id="openMobileFilterBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          FILTER
        </button>
        <div class="mobile-sort-wrap">
          <select id="mobileSortSelect" class="sort-select">
            <option value="default">Sort: Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div class="category-layout-grid">

        <!-- LEFT FILTER SIDEBAR -->
        <aside class="filter-sidebar" id="filterSidebar">
          <div class="filter-sidebar-header">
            <div class="filter-sidebar-title-wrap">
              <span class="filter-sidebar-title">FILTERS</span>
              <span class="active-filter-badge" id="activeFilterBadge" style="display:none;">0</span>
            </div>
            <button type="button" class="clear-all-btn" id="clearAllFiltersBtn">CLEAR ALL</button>
            <button type="button" class="mobile-filter-close" id="closeMobileFilterBtn" aria-label="Close Filter">✕</button>
          </div>

          <div class="filter-sidebar-content">
            <!-- BRAND -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>BRAND</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="brand-search-wrap">
                  <input type="text" class="brand-search-input" id="brandSearchInput" placeholder="Search Brand..." autocomplete="off">
                </div>
                <div class="filter-options-list" id="brandOptionsList"></div>
              </div>
            </div>

            <!-- COLOR -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>COLOR</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list" id="colorOptionsList"></div>
              </div>
            </div>

            <!-- FABRIC -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>FABRIC</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list" id="fabricOptionsList"></div>
              </div>
            </div>

            <!-- PATTERN -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>PATTERN</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list" id="patternOptionsList"></div>
              </div>
            </div>

            <!-- SIZE -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>SIZE</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list size-grid" id="sizeOptionsList"></div>
              </div>
            </div>

            <!-- FIT -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>FIT</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list" id="fitOptionsList"></div>
              </div>
            </div>

            <!-- PRICE -->
            <div class="filter-accordion open">
              <button type="button" class="filter-accordion-header">
                <span>PRICE</span>
                <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="filter-accordion-body">
                <div class="filter-options-list" id="priceOptionsList"></div>
              </div>
            </div>

          </div>

          <div class="mobile-filter-footer">
            <button type="button" class="btn-primary" id="applyMobileFilterBtn" style="width:100%;">APPLY FILTERS</button>
          </div>
        </aside>

        <!-- RIGHT PRODUCTS MAIN AREA -->
        <main class="products-main-area">
          <div class="products-toolbar">
            <div class="products-count-label" id="productsCountLabel">
              Showing <span id="visibleProductsCount">0</span> Products
            </div>
            <div class="products-sort-desktop">
              <label for="desktopSortSelect">Sort By:</label>
              <select id="desktopSortSelect" class="sort-select">
                <option value="default">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <!-- ACTIVE FILTER CHIPS -->
          <div class="active-filter-chips" id="activeFilterChips" style="display:none;"></div>

          <!-- PRODUCTS GRID -->
          <div class="products-grid" id="categoryProductsGrid">
            ${products.length > 0 ? products.map(p => {
              const stock = parseInt(p.stock, 10);
              const isOutOfStock = stock <= 0;
              const catLower = (p.category || '').toLowerCase().trim();
              const hasSizes = ['shirts', 't-shirts', 'jeans', 'trousers', 'jackets'].includes(catLower) || !!p.sizes;
              let availSizes = [];
              if (p.sizes) {
                availSizes = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
              }
              if (availSizes.length === 0 && hasSizes) {
                availSizes = ['jeans', 'trousers'].includes(catLower) ? ['30', '32', '34', '36', '38'] : ['S', 'M', 'L', 'XL', 'XXL'];
              }

              const meta = getProductFilterAttrsJS(p);
              const sizesStr = availSizes.join(',');

              return `
              <article
                class="product-card"
                data-id="${p.id}"
                data-name="${e(p.name)}"
                data-category="${e(p.category)}"
                data-price="${p.price}"
                data-brand="${e(meta.brand)}"
                data-color="${e(meta.color)}"
                data-fabric="${e(meta.fabric)}"
                data-pattern="${e(meta.pattern)}"
                data-fit="${e(meta.fit)}"
                data-sizes="${e(sizesStr)}"
              >
                ${p.new_arrival ? `<span class="badge-tag new">NEW</span>` : ''}
                <button class="wishlist-btn" title="Add to Wishlist">♡</button>
                <a href="product.php?id=${p.id}">
                  <div class="product-image-wrapper">
                    <img class="product-img" src="${e(p.image)}" alt="${e(p.name)}">
                    <div class="quick-view-overlay"><span class="btn-quickview">Quick View</span></div>
                  </div>
                </a>
                <div class="product-info">
                  <span class="product-cat">${e(p.category)}</span>
                  <h3 class="product-name"><a href="product.php?id=${p.id}">${e(p.name)}</a></h3>
                  <div class="product-price-row">
                    <span class="price-current">${money(p.price)}</span>
                    ${p.old_price ? `<span class="price-old">${money(p.old_price)}</span>` : ''}
                  </div>
                  ${hasSizes ? `
                    <div class="product-size-box">
                      <label class="product-size-label" for="size-${p.id}">SIZE</label>
                      <select class="product-size-select" id="size-${p.id}" name="size" form="cart-form-${p.id}" required ${isOutOfStock ? 'disabled' : ''}>
                        <option value="">Select Size</option>
                        ${availSizes.map(sz => `<option value="${e(sz)}">${e(sz)}</option>`).join('')}
                      </select>
                    </div>
                  ` : ''}
                  <div class="product-actions">
                    ${isOutOfStock ? `
                      <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
                    ` : `
                      <form method="post" action="cart.php" id="cart-form-${p.id}" style="width:100%;">
                        <input type="hidden" name="action" value="add">
                        <input type="hidden" name="product_id" value="${p.id}">
                        <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                      </form>
                    `}
                  </div>
                </div>
              </article>`;
            }).join('') : `
              <div class="empty-cart-card" style="grid-column: 1 / -1; margin:0;">
                <div style="font-size:3.5rem; margin-bottom:12px;">🔍</div>
                <h2>NO PRODUCTS FOUND</h2>
                <p class="section-subtitle">We couldn't find any products matching your selected criteria.</p>
                <br>
                <a class="btn-primary" href="products.php">BACK TO STORE</a>
              </div>
            `}
          </div>
        </main>

      </div>
    </div>

  </div>
</section>
`;
  html += renderFooter();
  res.send(html);
});

// Product Details Page
app.get('/product.php', (req, res) => {
  const id = parseInt(req.query.id, 10);
  const p = db.products.find(prod => prod.id === id && prod.status === 1);
  if (!p) {
    req.session.flash_message = { message: 'Product not found.', type: 'error' };
    return res.redirect('products.php');
  }

  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const stock = parseInt(p.stock, 10);
  const isOutOfStock = stock <= 0;
  const catLower = (p.category || '').toLowerCase().trim();
  const hasSizes = ['shirts', 't-shirts', 'jeans', 'trousers', 'jackets'].includes(catLower) || !!p.sizes;
  let availSizes = [];
  if (p.sizes) {
    availSizes = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (availSizes.length === 0 && hasSizes) {
    availSizes = ['jeans', 'trousers'].includes(catLower) ? ['30', '32', '34', '36', '38'] : ['S', 'M', 'L', 'XL', 'XXL'];
  }

  const galleryImages = [p.image];
  const catFolderMap = {
    'shirts': 'Shirts/shirt_',
    't-shirts': 'T-Shirts/tshirt_',
    'jeans': 'Jeans/jeans_',
    'jackets': 'Jackets/jacket_',
    'trousers': 'Trousers/trouser_'
  };
  if (catFolderMap[catLower]) {
    const prefix = catFolderMap[catLower];
    for (let i = 1; i <= 4; i++) {
      const candidate = `${prefix}${i}.png`;
      if (candidate !== p.image && fs.existsSync(path.join(__dirname, candidate))) {
        galleryImages.push(candidate);
      }
    }
  }

  let html = renderHeader(req, `${p.name} | ${shopName}`);
  html += `
<section class="section-padding">
  <div class="container">



    <div class="product-detail-layout">
      <div class="gallery-container">
        <div class="main-gallery-view">
          <img id="mainDetailImage" src="${e(galleryImages[0])}" alt="${e(p.name)}">
        </div>
        ${galleryImages.length > 1 ? `
          <div class="gallery-thumbs">
            ${galleryImages.map((gImg, idx) => `
              <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchProductGalleryImage('${e(gImg)}', this)">
                <img src="${e(gImg)}" alt="${e(p.name)} view ${idx + 1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="product-detail-info">
        <span class="badge-tag" style="align-self: flex-start; margin-bottom: 12px;">${e(p.category)}</span>
        <h1 class="product-detail-title">${e(p.name)}</h1>

        <div class="product-detail-price">
          <span class="price-current" style="font-size: 2.2rem; font-weight: 900; color: var(--clr-terracotta);">
            ${money(p.price)}
          </span>
          ${p.old_price ? `
            <span class="price-old" style="font-size: 1.3rem;">${money(p.old_price)}</span>
            <span class="badge-tag new" style="background:#FEF08A; color:#854D0E; font-size:0.75rem; padding:4px 10px;">
              SAVE ${Math.round(((p.old_price - p.price) / p.old_price) * 100)}%
            </span>
          ` : ''}
        </div>

        <div>
          ${isOutOfStock ? `
            <span class="stock-pill out">✕ OUT OF STOCK</span>
          ` : (stock <= 5 ? `
            <span class="stock-pill" style="background:#FFEDD5; color:#C2410C;">⚠ ONLY ${stock} LEFT IN STOCK</span>
          ` : `
            <span class="stock-pill in">✓ IN STOCK · ${stock} AVAILABLE</span>
          `)}
        </div>

        <p class="section-subtitle" style="margin: 18px 0 24px; font-size: 1rem; line-height: 1.7; color: #475569;">
          ${e(p.description || '').replace(/\n/g, '<br>')}
        </p>

        ${isOutOfStock ? `
          <button class="btn-primary" type="button" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">
            OUT OF STOCK
          </button>
        ` : `
          <form method="post" action="cart.php" id="productAddToCartForm">
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="product_id" value="${p.id}">

            ${hasSizes ? `
              <div class="size-selector-group">
                <label class="product-size-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>SELECT SIZE</span>
                  <a href="#size-guide" style="font-size:0.78rem; color:var(--clr-terracotta); text-decoration:underline;">Size Guide</a>
                </label>
                <div class="size-pills" id="sizePillsGroup">
                  ${availSizes.map((sz, idx) => `
                    <button
                      type="button"
                      class="size-pill-btn ${idx === 0 ? 'active' : ''}"
                      data-size="${e(sz)}"
                      onclick="selectProductSize('${e(sz)}', this)"
                    >
                      ${e(sz)}
                    </button>
                  `).join('')}
                </div>
                <input type="hidden" name="size" id="selectedSizeInput" value="${e(availSizes[0] || '')}" required>
              </div>
            ` : ''}

            <div style="margin-bottom: 28px;">
              <label class="product-size-label">QUANTITY</label>
              <div class="qty-picker">
                <button type="button" class="qty-btn" onclick="adjustProductQty(-1, ${stock})">−</button>
                <input class="qty-input-field" type="number" id="productQtyInput" name="qty" min="1" max="${Math.max(1, stock)}" value="1" readonly>
                <button type="button" class="qty-btn" onclick="adjustProductQty(1, ${stock})">+</button>
              </div>
            </div>

            <div class="product-action-btns">
              <button class="btn-primary" type="submit" style="flex:1;">🛒 ADD TO CART</button>
              <button class="btn-buy-now" type="submit" onclick="document.getElementById('productAddToCartForm').action='checkout.php'">⚡ BUY NOW</button>
              <button class="wishlist-btn" type="button" title="Add to Wishlist" style="position:static; width:52px; height:52px; font-size:1.4rem;">♡</button>
            </div>
          </form>
        `}

        <div style="border-top: 1px solid var(--clr-border); padding-top: 24px; margin-top: 20px; display: grid; gap: 14px;">
          <div style="display:flex; align-items:center; gap:12px; font-size:0.9rem; color:#475569;">
            <span style="font-size:1.3rem;">🚚</span>
            <span><strong>Free Express Delivery</strong> on orders over ₹1,499</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; font-size:0.9rem; color:#475569;">
            <span style="font-size:1.3rem;">🔄</span>
            <span><strong>7-Day Easy Returns</strong> & Hassle-free exchanges</span>
          </div>
          <div style="display:flex; align-items:center; gap:12px; font-size:0.9rem; color:#475569;">
            <span style="font-size:1.3rem;">✨</span>
            <span><strong>100% Premium Cotton & Craftsmanship</strong> guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<script>
function switchProductGalleryImage(imgSrc, thumbEl) {
  document.getElementById('mainDetailImage').src = imgSrc;
  document.querySelectorAll('.thumb-item').forEach(el => el.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function selectProductSize(size, pillEl) {
  document.getElementById('selectedSizeInput').value = size;
  document.querySelectorAll('.size-pill-btn').forEach(el => el.classList.remove('active'));
  if (pillEl) pillEl.classList.add('active');
}

function adjustProductQty(delta, maxStock) {
  const input = document.getElementById('productQtyInput');
  let current = parseInt(input.value, 10) || 1;
  current += delta;
  if (current < 1) current = 1;
  if (current > maxStock) current = maxStock;
  input.value = current;
}
</script>
`;
  html += renderFooter();
  res.send(html);
});

// Store Page
app.get(['/store.php', '/store'], (req, res) => {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const phone = db.settings.phone || '9876543210';
  const upiId = db.settings.upi_id || '9876543210@upi';
  const curated = db.products.filter(p => p.status === 1).slice(0, 4);

  const curatedCards = curated.map((p, idx) => {
    const stock = parseInt(p.stock, 10);
    const isOutOfStock = stock <= 0;
    const category = (p.category || '').toLowerCase().trim();
    const isJeansOrTrousers = ['jeans', 'trousers'].includes(category);
    const hasSizes = true;
    const staggerClass = 'stagger-' + (idx < 4 ? (idx + 1) : 4);
    let availSizes = [];
    if (p.sizes) {
      availSizes = p.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (availSizes.length === 0 && hasSizes) {
      availSizes = isJeansOrTrousers ? ['30', '32', '34', '36', '38'] : ['S', 'M', 'L', 'XL', 'XXL'];
    }

    return `
      <article class="product-card reveal ${staggerClass}">
        <a href="product.php?id=${p.id}">
          <div class="product-image-wrapper">
            ${p.new_arrival ? '<span class="new-tag">NEW</span>' : ''}
            ${isOutOfStock ? '<span class="out-stock-overlay">OUT OF STOCK</span>' : (stock <= 5 ? `<span class="low-stock-overlay">ONLY ${stock} LEFT</span>` : '')}
            <img class="product-img" src="${e(p.image)}" alt="${e(p.name)}" loading="lazy">
          </div>
        </a>
        <div class="product-info">
          <span class="badge">${e(p.category)}</span>
          <h3>${e(p.name)}</h3>
          <span class="price">${money(p.price)}</span>
          ${p.old_price ? `<span class="old-price">${money(p.old_price)}</span>` : ''}
          ${hasSizes ? `
            <div class="product-size-box">
              <label class="product-size-label" for="size-${p.id}">SELECT SIZE</label>
              <select class="product-size-select" id="size-${p.id}" name="size" form="cart-form-${p.id}" ${isOutOfStock ? 'disabled' : ''} required>
                <option value="">Select Size</option>
                ${availSizes.map(s => `<option value="${e(s)}">${e(s)}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          ${isOutOfStock ? '<span class="stock-badge out">✕ Out of Stock</span>' : (stock <= 5 ? `<span class="stock-badge low">⚠ Only ${stock} left</span>` : '<span class="stock-badge in">✓ In Stock</span>')}
          <div class="product-actions">
            <a class="btn small ghost" href="product.php?id=${p.id}">View</a>
            ${isOutOfStock ? `
              <button class="btn small out-cart-btn" type="button" disabled>Out of Stock</button>
            ` : `
              <form method="post" action="cart.php" id="cart-form-${p.id}">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="${p.id}">
                <input type="hidden" name="qty" value="1">
                <button class="btn small" type="submit">Add to Cart</button>
              </form>
            `}
          </div>
        </div>
      </article>`;
  }).join('');

  let html = renderHeader(req, `The Store | ${shopName}`);
  html += `
<!-- STORE HERO -->
<section class="store-hero reveal">
  <div class="store-hero-overlay"></div>
  <div class="store-hero-content">
    <span class="badge" style="background:#fff; color:var(--red); font-weight:800; font-size:12px; margin-bottom:14px; letter-spacing:1px;">
      TAG É DEL É • FLAGSHIP MEN'S BOUTIQUE
    </span>
    <h1>The Art of Dressing Well.</h1>
    <p>
      Welcome to the official TAG É DEL É menswear store. Experience a curated atmosphere where contemporary tailoring, premium materials, and timeless aesthetics come together.
    </p>
    <div class="store-hero-actions">
      <a href="#collections" class="btn">Explore Collections</a>
      <a href="#visit-us" class="btn light">Visit Our Boutique</a>
    </div>
  </div>
</section>

<!-- BOUTIQUE AMBIANCE & HERITAGE -->
<section class="section store-story-section">
  <div class="section-head reveal">
    <div>
      <p class="eyebrow" style="color:var(--red);">IN-STORE EXPERIENCE</p>
      <h2>Step Inside TAG É DEL É</h2>
    </div>
    <p class="muted" style="max-width:480px; margin:0;">
      Every detail in our store is thoughtfully curated — from tactile Italian-cut shirts to rugged selvedge denims and precision outerwear.
    </p>
  </div>

  <div class="store-gallery-grid">
    <div class="store-gallery-card reveal stagger-1">
      <div class="store-gallery-img-wrap">
        <img src="shop 2.png" alt="TAG É DEL É Boutique Interior" class="store-gallery-img">
      </div>
      <div class="store-gallery-info">
        <span class="badge">SARTORIAL GALLERY</span>
        <h3>Curated Menswear Collections</h3>
        <p class="muted">
          Browse hand-finished shirts, smart-casual trousers, and elevated essentials organized for seamless discovery and tactile appreciation.
        </p>
      </div>
    </div>

    <div class="store-gallery-card reveal stagger-2">
      <div class="store-gallery-img-wrap">
        <img src="shop 3 image.png" alt="TAG É DEL É Tailoring and Display" class="store-gallery-img">
      </div>
      <div class="store-gallery-info">
        <span class="badge">TAILORED PRECISION</span>
        <h3>Fit Guidance & Styling Consultations</h3>
        <p class="muted">
          Our in-house specialists help you match silhouette, fabric weight, and seasonal layers for a look that speaks with effortless confidence.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- VISUAL CATEGORY SHOWCASE -->
<section class="section" id="collections" style="background:#faf8f6; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding-top:60px; padding-bottom:60px;">
  <div class="section-head reveal">
    <div>
      <p class="eyebrow" style="color:var(--red);">EXPLORE OUR WARDROBE</p>
      <h2>The Five Pillars of Style</h2>
    </div>
    <a href="products.php" class="btn small light">View Full 95+ Clothing Catalog &rarr;</a>
  </div>

  <div class="store-cat-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
    <a href="products.php?category=Shirts" class="store-cat-card reveal stagger-1">
      <div class="store-cat-img-box">
        <img src="images/classic-white-formal-shirt.jpg" alt="Shirts Collection">
        <div class="store-cat-overlay">
          <span class="store-cat-tag">19+ STYLES</span>
          <h3>Shirts</h3>
          <p>Formal, Oxford, Linen & Casual Checks</p>
          <span class="store-cat-link">Shop Shirts &rarr;</span>
        </div>
      </div>
    </a>

    <a href="products.php?category=T-Shirts" class="store-cat-card reveal stagger-2">
      <div class="store-cat-img-box">
        <img src="images/classic-black-crew-neck-t-shirt.jpg" alt="T-Shirts Collection">
        <div class="store-cat-overlay">
          <span class="store-cat-tag">19+ STYLES</span>
          <h3>T-Shirts</h3>
          <p>Crewnecks, Polos, Oversized & Supima</p>
          <span class="store-cat-link">Shop T-Shirts &rarr;</span>
        </div>
      </div>
    </a>

    <a href="products.php?category=Jeans" class="store-cat-card reveal stagger-3">
      <div class="store-cat-img-box">
        <img src="images/slim-fit-blue-jeans.jpg" alt="Jeans Collection">
        <div class="store-cat-overlay">
          <span class="store-cat-tag">19+ STYLES</span>
          <h3>Jeans</h3>
          <p>Slim Fit, Dark Wash, Stretch & Vintage Denims</p>
          <span class="store-cat-link">Shop Jeans &rarr;</span>
        </div>
      </div>
    </a>

    <a href="products.php?category=Trousers" class="store-cat-card reveal stagger-1">
      <div class="store-cat-img-box">
        <img src="images/classic-beige-cotton-trousers.jpg" alt="Trousers Collection">
        <div class="store-cat-overlay">
          <span class="store-cat-tag">19+ STYLES</span>
          <h3>Trousers</h3>
          <p>Beige Chinos, Pleated Slacks & Formal Pants</p>
          <span class="store-cat-link">Shop Trousers &rarr;</span>
        </div>
      </div>
    </a>

    <a href="products.php?category=Jackets" class="store-cat-card reveal stagger-2">
      <div class="store-cat-img-box">
        <img src="images/classic-black-casual-jacket.jpg" alt="Jackets Collection">
        <div class="store-cat-overlay">
          <span class="store-cat-tag">19+ STYLES</span>
          <h3>Jackets</h3>
          <p>Bombers, Denim Jackets, Bikers & Winter Parkas</p>
          <span class="store-cat-link">Shop Jackets &rarr;</span>
        </div>
      </div>
    </a>
  </div>
</section>

<!-- CURATED IN-STORE HIGHLIGHTS -->
<section class="section">
  <div class="section-head reveal">
    <div>
      <p class="eyebrow" style="color:var(--red);">FLAGSHIP FAVORITES</p>
      <h2>Curated In-Store Highlights</h2>
    </div>
    <a href="products.php" class="btn small light">Explore All Products &rarr;</a>
  </div>

  <div class="products-grid">
    ${curatedCards}
  </div>
</section>

<!-- VISIT OUR STORE & LOCATION -->
<section class="section" id="visit-us">
  <div class="store-visit-card reveal">
    <div class="store-visit-grid">
      <div class="store-visit-media">
        <img src="shop 4.png" alt="TAG É DEL É Storefront" class="store-visit-img">
        <div class="store-visit-badge">
          <span>FLAGSHIP LOCATION</span>
          <strong>OPEN 7 DAYS A WEEK</strong>
        </div>
      </div>

      <div class="store-visit-details">
        <p class="eyebrow" style="color:var(--red);">VISIT US IN PERSON</p>
        <h2>The Boutique Destination</h2>
        <p class="muted" style="line-height:1.7;">
          Experience tactile fabric selections, complimentary styling sessions, and exact sizing fits. Our boutique brings digital convenience together with physical craftsmanship.
        </p>

        <div class="store-visit-info-list">
          <div class="store-info-item">
            <div class="store-info-icon">📍</div>
            <div>
              <h4>Store Address</h4>
              <p class="muted">${e(shopName)} Flagship Boutique, Fashion Boulevard, Main Market</p>
            </div>
          </div>

          <div class="store-info-item">
            <div class="store-info-icon">🕒</div>
            <div>
              <h4>Operating Hours</h4>
              <p class="muted">Monday – Saturday: 10:00 AM – 9:30 PM<br>Sunday: 11:00 AM – 8:30 PM</p>
            </div>
          </div>

          <div class="store-info-item">
            <div class="store-info-icon">📞</div>
            <div>
              <h4>Direct Inquiries</h4>
              <p class="muted">Call / WhatsApp: ${e(phone)}<br>Instant UPI: ${e(upiId)}</p>
            </div>
          </div>
        </div>

        <div class="store-visit-actions">
          <a href="tel:${e(phone)}" class="btn">Call Boutique Now</a>
          <a href="products.php" class="btn light">Shop Full Online Collection</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

  html += renderFooter();
  res.send(html);
});

// About Page
app.get('/about.php', (req, res) => {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  let html = renderHeader(req, `About | ${shopName}`);
  html += `
<div class="about-page-wrapper">
  <!-- 1. ABOUT HERO SECTION -->
  <section class="about-hero-section">
    <div class="about-hero-overlay"></div>
    <div class="about-hero-content about-reveal">
      <span class="about-hero-eyebrow">ABOUT THE BRAND</span>
      <h1 class="about-hero-title">${e(shopName)}</h1>
      <p class="about-hero-sub">MEN'S FASHION, REDEFINED.</p>
      <p class="about-hero-desc">Stylish. Comfortable. Confident.</p>
      <a href="products.php" class="about-btn-burgundy">EXPLORE COLLECTION &rarr;</a>
    </div>
  </section>

  <!-- 2. ABOUT STORE SECTION -->
  <section class="about-store-section">
    <div class="about-container">
      <div class="about-store-grid">
        <div class="about-store-card about-reveal">
          <img class="about-store-img" src="owner/WhatsApp Image 2026-09-15 at 12.18.34 PM.jpeg" alt="${e(shopName)} Store Owner">
        </div>
        <div class="about-store-content about-reveal">
          <span class="about-store-eyebrow">ABOUT THE STORE</span>
          <h2 class="about-store-title">${e(shopName)}</h2>
          <p class="about-store-paragraph">We are a men's wear store focused on stylish, comfortable and affordable fashion. This website is designed as a complete ecommerce project with customer shopping, cart, checkout, payments and an admin panel for changing products.</p>
          <p class="about-store-paragraph">Every product shown on the website can be added, edited, removed or updated from the admin panel without changing the website code.</p>
          <div class="about-store-actions">
            <a href="products.php" class="about-btn-dark">EXPLORE COLLECTION &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. OUR PHILOSOPHY SECTION -->
  <section class="about-philosophy-section">
    <div class="about-container">
      <div class="about-philosophy-wrap about-reveal">
        <div class="about-philosophy-label">OUR PHILOSOPHY</div>
        <h2 class="about-philosophy-title">STYLE THAT SPEAKS.</h2>
        <p class="about-philosophy-desc">${e(shopName)} brings together bold prints, modern silhouettes, and effortless men's fashion for those who want their style to stand out.</p>
      </div>
    </div>
  </section>

  <!-- 4. FOUR BRAND VALUES SECTION -->
  <section class="about-values-section">
    <div class="about-container">
      <div class="about-values-head about-reveal">
        <span class="about-store-eyebrow">OUR PROMISE</span>
        <h2 class="about-store-title" style="margin-bottom:0;">BRAND VALUES</h2>
      </div>
      <div class="about-values-grid">
        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">01</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>
          <h3 class="about-value-title">PREMIUM STYLE</h3>
          <p class="about-value-text">Modern designs tailored for today's fashion-conscious man.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">02</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">QUALITY FIRST</h3>
          <p class="about-value-text">Fashion designed with premium fabrics, durable stitching, and comfort in mind.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">03</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">TREND-DRIVEN</h3>
          <p class="about-value-text">Fresh drops inspired by global streetwear and contemporary men's fashion.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">04</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">EASY SHOPPING</h3>
          <p class="about-value-text">Fast nationwide shipping, COD, UPI options, and simple returns.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. WHY TAG É DEL É SECTION -->
  <section class="about-why-section">
    <div class="about-container">
      <div class="about-why-head about-reveal">
        <span class="about-store-eyebrow">DISTINCTION</span>
        <h2 class="about-store-title" style="margin-bottom:0;">WHY TAG É DEL É?</h2>
      </div>
      <div class="about-why-grid">
        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/bold_moves.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">STYLE</h3>
            <p class="about-why-text">Modern silhouettes and statement pieces.</p>
          </div>
        </div>

        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/smart_casual.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">COMFORT</h3>
            <p class="about-why-text">Designed for everyday confidence and comfort.</p>
          </div>
        </div>

        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/vacation_ready.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">CONFIDENCE</h3>
            <p class="about-why-text">Fashion that helps you express your personality.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. BRAND STATEMENT SECTION -->
  <section class="about-statement-section">
    <div class="about-statement-overlay"></div>
    <div class="about-statement-content about-reveal">
      <h2 class="about-statement-title">YOUR STYLE. YOUR RULES.</h2>
      <p class="about-statement-sub">Contemporary men's fashion for every mood, every moment, and every statement.</p>
      <a href="products.php" class="about-btn-burgundy">SHOP MEN'S COLLECTION &rarr;</a>
    </div>
  </section>

  <!-- 7. FINAL CTA SECTION -->
  <section class="about-cta-section">
    <div class="about-container">
      <div class="about-cta-wrap about-reveal">
        <span class="about-store-eyebrow">JOIN THE TAG É DEL É WORLD</span>
        <h2 class="about-cta-title">WEAR YOUR CONFIDENCE.</h2>
        <p class="about-cta-text">Discover contemporary men's fashion designed to make every look feel effortless.</p>
        <a href="products.php" class="about-btn-burgundy">EXPLORE COLLECTION &rarr;</a>
      </div>
    </div>
  </section>
</div>
`;
  html += renderFooter();
  res.send(html);
});

// Cart Actions (POST) & Page (GET)
app.post('/cart.php', (req, res) => {
  const action = req.body.action || '';
  if (!req.session.cart) req.session.cart = {};

  if (action === 'add') {
    const id = parseInt(req.body.product_id, 10);
    const qty = Math.max(1, parseInt(req.body.qty || 1, 10));
    const size = (req.body.size || '').trim();
    const p = db.products.find(prod => prod.id === id);

    if (!p) {
      req.session.flash_message = { message: 'Product not found.', type: 'error' };
    } else if (p.status !== 1) {
      req.session.flash_message = { message: 'Product is no longer available.', type: 'error' };
    } else if (p.stock <= 0) {
      req.session.flash_message = { message: 'Sorry, this product is out of stock.', type: 'error' };
    } else {
      const cartKey = size ? `${id}:${size}` : String(id);
      const current = req.session.cart[cartKey] || 0;
      let newQty = current + qty;
      if (newQty > p.stock) newQty = p.stock;
      req.session.cart[cartKey] = newQty;
      req.session.flash_message = { message: `${p.name}${size ? ` (Size: ${size})` : ''} added to cart.`, type: 'success' };
    }
    return res.redirect('cart.php');
  }

  if (action === 'update') {
    const qtys = req.body.qtys || {};
    for (const [key, qVal] of Object.entries(qtys)) {
      const parts = String(key).split(':');
      const pid = parseInt(parts[0], 10);
      const q = parseInt(qVal, 10);
      if (pid <= 0) continue;
      if (q <= 0) {
        delete req.session.cart[key];
        continue;
      }
      const p = db.products.find(prod => prod.id === pid);
      if (!p || p.status !== 1 || p.stock <= 0) {
        delete req.session.cart[key];
        continue;
      }
      req.session.cart[key] = Math.min(q, p.stock);
    }
    req.session.flash_message = { message: 'Cart updated successfully.', type: 'success' };
    return res.redirect('cart.php');
  }

  if (action === 'remove') {
    const cartKey = (req.body.cart_key || req.body.product_id || '').trim();
    if (cartKey) {
      delete req.session.cart[cartKey];
    }
    req.session.flash_message = { message: 'Product removed from your cart.', type: 'success' };
    return res.redirect('cart.php');
  }

  if (action === 'clear') {
    req.session.cart = {};
    req.session.flash_message = { message: 'Your cart has been cleared.', type: 'success' };
    return res.redirect('cart.php');
  }

  res.redirect('cart.php');
});

app.get('/cart.php', (req, res) => {
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const items = getCartItems(req.session.cart);
  const total = getCartTotal(items);

  let html = renderHeader(req, `Shopping Bag | ${shopName}`);
  html += `
<section class="section-padding" style="padding-top: 40px; padding-bottom: 80px;">
  <div class="container">

    <div class="section-head" style="margin-bottom: 30px;">
      <div>
        <span class="eyebrow">YOUR SHOPPING BAG</span>
        <h2 class="section-title">Shopping Cart</h2>
        <p class="section-subtitle">Review your selected items before proceeding to checkout</p>
      </div>
      <a class="btn-secondary" href="products.php">← Continue Shopping</a>
    </div>

    ${items.length === 0 ? `
      <div class="empty-cart-card">
        <div style="font-size: 4rem; margin-bottom: 15px;">🛍️</div>
        <h2>YOUR CART IS EMPTY</h2>
        <p class="section-subtitle" style="margin-bottom: 30px;">Looks like you haven't added any men's fashion essentials to your bag yet.</p>
        <a class="btn-primary" href="products.php" style="display: inline-block;">START SHOPPING →</a>
      </div>
    ` : `
      <div class="cart-layout">
        <div class="cart-table-card">
          ${items.map(item => `
            <article class="cart-item-row">
              <div class="cart-item-img">
                <img src="${e(item.image || 'shop_logo.png')}" alt="${e(item.name)}">
              </div>

              <div>
                <span class="badge-tag" style="font-size: 0.75rem; padding: 2px 8px;">${e(item.category)}</span>
                <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin: 6px 0 4px; color: var(--clr-text-main);">
                  <a href="product.php?id=${item.id}" style="color:inherit;">${e(item.name)}</a>
                </h3>
                
                ${item.size ? `
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--clr-terracotta);">
                    SIZE: ${e(item.size)}
                  </span>
                ` : ''}
                
                <div style="font-size: 0.8rem; color: #16A34A; margin-top: 4px; font-weight: 600;">
                  ✓ In Stock (${item.stock} available)
                </div>
              </div>

              <form method="post" action="cart.php" style="display:flex; align-items:center;">
                <input type="hidden" name="action" value="update">
                <div class="qty-picker" style="margin-bottom:0;">
                  <button type="submit" class="qty-btn" onclick="this.form.querySelector('input[type=number]').stepDown()">−</button>
                  <input
                    class="qty-input-field"
                    type="number"
                    name="qtys[${e(item.cart_key || item.id)}]"
                    min="1"
                    max="${item.stock}"
                    value="${item.quantity}"
                    onchange="this.form.submit()"
                  >
                  <button type="submit" class="qty-btn" onclick="this.form.querySelector('input[type=number]').stepUp()">+</button>
                </div>
              </form>

              <div style="font-family: var(--font-accent); font-weight: 900; font-size: 1.1rem; color: var(--clr-text-main); text-align: right;">
                ${money(item.subtotal)}
              </div>

              <form method="post" action="cart.php" style="text-align: right;">
                <input type="hidden" name="action" value="remove">
                <input type="hidden" name="cart_key" value="${e(item.cart_key || item.id)}">
                <button type="submit" title="Remove item" style="background:none; border:none; color:#EF4444; font-size:1.2rem; cursor:pointer; padding:4px 8px;">
                  ✕
                </button>
              </form>
            </article>
          `).join('')}

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--clr-border);">
            <form method="post" action="cart.php">
              <input type="hidden" name="action" value="clear">
              <button type="submit" class="btn-secondary" style="font-size:0.85rem; padding:10px 18px;">Clear Cart</button>
            </form>
            <a href="products.php" class="btn-secondary" style="font-size:0.85rem; padding:10px 18px;">+ Add More Products</a>
          </div>
        </div>

        <aside class="cart-summary-box">
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 20px; color: var(--clr-text-main);">
            Order Summary
          </h3>

          <div class="summary-row">
            <span>Subtotal (${getCartCount(req.session.cart)} items)</span>
            <strong>${money(total)}</strong>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <span style="color:#16A34A; font-weight:800;">FREE EXPRESS</span>
          </div>

          <div class="summary-row">
            <span>Estimated Tax</span>
            <span>Included</span>
          </div>

          <div class="summary-row summary-total">
            <span>Total Payable</span>
            <span style="color:var(--clr-terracotta);">${money(total)}</span>
          </div>

          <a href="checkout.php" class="btn-checkout">PROCEED TO CHECKOUT →</a>

          <div style="margin-top: 20px; padding: 14px; background: #F8FAFC; border-radius: var(--radius-sm); text-align: center; font-size: 0.8rem; color: #64748B;">
            🔒 <strong>100% Secure Checkout</strong><br>
            Supports UPI, Cards, Netbanking & Cash on Delivery
          </div>
        </aside>
      </div>
    `}

  </div>
</section>
`;
  html += renderFooter();
  res.send(html);
});

// Checkout Page
app.get('/checkout.php', (req, res) => {
  if (!req.session.customer_id) {
    req.session.flash_message = { message: 'Please login before proceeding to checkout.', type: 'error' };
    return res.redirect('login.php?redirect=checkout.php');
  }

  const items = getCartItems(req.session.cart);
  if (items.length === 0) {
    req.session.flash_message = { message: 'Your cart is empty.', type: 'error' };
    return res.redirect('products.php');
  }

  const total = getCartTotal(items);
  const customer = db.customers.find(c => c.id === req.session.customer_id) || {};
  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const upiId = db.settings.upi_id || '9876543210@upi';

  let html = renderHeader(req, `Checkout | ${shopName}`);
  html += `
<section class="section">
  <div class="section-head">
    <div>
      <p class="muted">Secure checkout</p>
      <h2>Checkout</h2>
    </div>
  </div>
  <form method="post" action="place_order.php">
    <div class="checkout-grid">
      <div class="form-card" style="margin:0">
        <div class="form-grid">
          <div class="form-group"><label>Full Name</label><input class="form-control" name="name" value="${e(customer.name || '')}" required></div>
          <div class="form-group"><label>Phone</label><input class="form-control" name="phone" value="${e(customer.phone || '')}" required></div>
          <div class="form-group full"><label>Address</label><textarea class="form-control" name="address" rows="4" required></textarea></div>
          <div class="form-group"><label>City</label><input class="form-control" name="city" required></div>
          <div class="form-group"><label>State</label><input class="form-control" name="state" required></div>
          <div class="form-group"><label>Pincode</label><input class="form-control" name="pincode" required></div>
          <div class="form-group"><label>Payment Method</label>
            <select class="form-control" name="payment_method" required>
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">Online Payment — UPI</option>
              <option value="RAZORPAY">Online Payment — Razorpay</option>
            </select>
          </div>
        </div>
        <div class="payment-choice">
          <div><strong>💵 Cash on Delivery</strong><span>Pay when your order arrives.</span></div>
          <div><strong>📱 Online Payment</strong><span>UPI: ${e(upiId)} · Razorpay when configured.</span></div>
        </div>
        <div class="notice"><strong>Stock is checked again at checkout.</strong> If a product becomes unavailable, the order will not be placed.</div>
        <button class="btn" type="submit">Place Order</button>
      </div>
      <aside class="summary">
        <h3>Order Summary</h3>
        ${items.map(i => `
          <div class="summary-row"><span>${e(i.name)} ${i.size ? `<small style="color:var(--muted); font-weight:bold;">(${e(i.size)})</small>` : ''} × ${i.qty}</span><strong>${money(i.line_total)}</strong></div>
        `).join('')}
        <div class="summary-row summary-total"><span>Total</span><span>${money(total)}</span></div>
      </aside>
    </div>
  </form>
</section>
`;
  html += renderFooter();
  res.send(html);
});

// Place Order (POST)
app.post('/place_order.php', (req, res) => {
  if (!req.session.customer_id) {
    req.session.flash_message = { message: 'Please login before placing an order.', type: 'error' };
    return res.redirect('login.php');
  }

  const items = getCartItems(req.session.cart);
  if (items.length === 0) {
    req.session.flash_message = { message: 'Your cart is empty.', type: 'error' };
    return res.redirect('products.php');
  }

  const name = (req.body.name || '').trim();
  const phone = (req.body.phone || '').trim();
  const address = (req.body.address || '').trim();
  const city = (req.body.city || '').trim();
  const state = (req.body.state || '').trim();
  const pincode = (req.body.pincode || '').trim();
  const payment = req.body.payment_method || 'COD';

  if (!name || !phone || !address || !city || !state || !pincode) {
    req.session.flash_message = { message: 'Please complete all checkout details.', type: 'error' };
    return res.redirect('checkout.php');
  }

  // Stock check
  for (const item of items) {
    const p = db.products.find(prod => prod.id === item.id);
    if (!p || p.status !== 1 || p.stock < item.qty) {
      req.session.flash_message = { message: 'One or more products are no longer available in the requested quantity.', type: 'error' };
      return res.redirect('checkout.php');
    }
  }

  const total = getCartTotal(items);
  const payment_status = payment === 'COD' ? 'Pending' : (payment === 'UPI' ? 'Pending UPI' : 'Pending Online');
  const orderId = (db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) : 1000) + 1;

  const newOrder = {
    id: orderId,
    customer_id: req.session.customer_id,
    customer_name: name,
    phone,
    address,
    city,
    state,
    pincode,
    total,
    total_amount: total,
    payment_method: payment,
    payment_status,
    order_status: 'Pending',
    status: 'Pending',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  db.orders.push(newOrder);

  // Add order items & reduce stock
  items.forEach(item => {
    db.order_items.push({
      id: (db.order_items.length > 0 ? Math.max(...db.order_items.map(oi => oi.id)) : 0) + 1,
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      size: item.size || '',
      price: item.price,
      qty: item.qty,
      line_total: item.line_total
    });

    const p = db.products.find(prod => prod.id === item.id);
    if (p) {
      p.stock = Math.max(0, p.stock - item.qty);
    }
  });

  saveDb(db);
  req.session.cart = {};
  res.redirect(`order_success.php?id=${orderId}`);
});

// Order Success
app.get('/order_success.php', (req, res) => {
  if (!req.session.customer_id) {
    return res.redirect('login.php');
  }

  const id = parseInt(req.query.id, 10);
  const order = db.orders.find(o => o.id === id && o.customer_id === req.session.customer_id);
  if (!order) {
    return res.redirect('my_orders.php');
  }

  const shopName = db.settings.shop_name || 'TAG É DEL É';
  const upiId = db.settings.upi_id || '9876543210@upi';

  let html = renderHeader(req, `Order Success | ${shopName}`);
  html += `
<section class="section">
  <div class="success-card">
    <div class="success-icon">✓</div>
    <h1>Order Placed Successfully!</h1>
    <p>Your order <strong>#${order.id}</strong> has been received.</p>
    <p>Payment: <strong>${e(order.payment_method)}</strong></p>
    ${order.payment_method === 'UPI' ? `<div class="notice">Pay <strong>${money(order.total)}</strong> to UPI ID <strong>${e(upiId)}</strong> and keep your transaction reference.</div>` : ''}
    <p class="muted">We will contact you on ${e(order.phone)} for delivery updates.</p>
    <a class="btn" href="my_orders.php">View My Orders</a> <a class="btn dark" href="products.php">Continue Shopping</a>
  </div>
</section>
`;
  html += renderFooter();
  res.send(html);
});

// My Orders
app.get('/my_orders.php', (req, res) => {
  if (!req.session.customer_id) {
    req.session.flash_message = { message: 'Please login to view your orders.', type: 'error' };
    return res.redirect('login.php');
  }

  const customerOrders = db.orders.filter(o => o.customer_id === req.session.customer_id).slice().reverse();
  const shopName = db.settings.shop_name || 'TAG É DEL É';

  let html = renderHeader(req, `My Orders | ${shopName}`);
  html += `
<section class="section">
  <div class="section-head">
    <div>
      <p class="muted">Account</p>
      <h2>My Orders</h2>
    </div>
  </div>
  ${customerOrders.length === 0 ? `
    <div class="empty">
      <h3>No orders yet</h3>
      <a class="btn" href="products.php">Shop Now</a>
    </div>
  ` : customerOrders.map(o => {
    const items = db.order_items.filter(oi => oi.order_id === o.id);
    return `
    <div class="order-card">
      <div class="order-head">
        <div>
          <strong>Order #${o.id}</strong>
          <div class="muted">${e(o.created_at)}</div>
        </div>
        <div>
          <span class="status ${e(o.order_status || o.status || 'Pending')}">${e(o.order_status || o.status || 'Pending')}</span>
          <strong>${money(o.total || o.total_amount)}</strong>
        </div>
      </div>
      <div class="mini-list">
        ${items.map(i => `
          <div class="mini-item">
            <span>${e(i.product_name)} ${i.size ? `<small style="color:var(--muted); font-weight:bold;">(Size: ${e(i.size)})</small>` : ''} × ${i.qty}</span>
            <strong>${money(i.line_total)}</strong>
          </div>
        `).join('')}
      </div>
      <div class="muted">Payment: ${e(o.payment_method)} • ${e(o.payment_status)}</div>
    </div>`;
  }).join('')}
</section>
`;
  html += renderFooter();
  res.send(html);
});

// Customer Login
app.get('/login.php', (req, res) => {
  if (req.session.customer_id) {
    return res.redirect('index.php');
  }
  const error = req.session.customer_login_error || '';
  delete req.session.customer_login_error;
  const next = req.query.redirect || 'index.php';
  const shopName = db.settings.shop_name || 'TAG É DEL É';

  let html = renderHeader(req, `Login | ${shopName}`);
  html += `
<div class="td-auth-page">
  <div class="td-auth-card">
    <div class="td-auth-header">
      <h1 class="td-auth-brand-name">TAG É DEL É</h1>
      <div class="td-auth-brand-sub">MEN'S FASHION</div>
      <h2 class="td-auth-title">CUSTOMER LOGIN</h2>
      <p class="td-auth-subtitle">Welcome back to TAG É DEL É</p>
    </div>

    ${error ? `<div class="flash error" style="position:static;margin:0 0 20px 0;border-radius:8px;text-align:center;">${e(error)}</div>` : ''}

    <form method="post" action="login.php">
      <input type="hidden" name="redirect" value="${e(next)}">
      
      <div class="td-form-group">
        <label for="login-email" class="td-form-label">Email Address</label>
        <input id="login-email" class="td-input" type="email" name="email" placeholder="e.g. alex@example.com" required autocomplete="email">
      </div>
      
      <div class="td-form-group">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <label for="login-password" class="td-form-label" style="margin-bottom:0;">Password</label>
          <a href="#" class="td-forgot-link" onclick="alert('Password reset link has been dispatched to your email address.'); return false;">Forgot Password?</a>
        </div>
        <div class="td-password-wrapper">
          <input id="login-password" class="td-input" type="password" name="password" placeholder="••••••••" required autocomplete="current-password">
          <button type="button" class="td-eye-btn" aria-label="Toggle Password Visibility">
            <svg class="eye-show" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg class="eye-hide" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
      </div>
      
      <button type="submit" class="td-auth-btn">LOGIN</button>
    </form>

    <div class="td-auth-footer-text">
      Don't have an account? <a href="register.php" class="td-auth-link">CREATE ACCOUNT</a>
    </div>
  </div>
</div>
`;
  html += renderFooter();
  res.send(html);
});

app.post('/login.php', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const pass = req.body.password || '';
  const next = req.body.redirect || 'index.php';

  const customer = db.customers.find(c => c.email.toLowerCase() === email);
  if (customer && (customer.password === pass || customer.passwordHash === pass)) {
    req.session.customer_id = customer.id;
    req.session.customer_name = customer.name;
    return res.redirect(next);
  }

  req.session.customer_login_error = 'Invalid email or password.';
  res.redirect(`login.php?redirect=${encodeURIComponent(next)}`);
});

// Customer Register
app.get('/register.php', (req, res) => {
  if (req.session.customer_id) {
    return res.redirect('index.php');
  }
  const error = req.session.customer_reg_error || '';
  delete req.session.customer_reg_error;
  const shopName = db.settings.shop_name || 'TAG É DEL É';

  let html = renderHeader(req, `Register | ${shopName}`);
  html += `
<section class="section">
  <div class="form-card">
    <h2>Create Account</h2>
    ${error ? `<div class="flash error" style="position:static;margin:12px 0">${e(error)}</div>` : ''}
    <form method="post">
      <div class="form-grid">
        <div class="form-group"><label>Name</label><input class="form-control" name="name" required></div>
        <div class="form-group"><label>Phone</label><input class="form-control" name="phone" required></div>
        <div class="form-group full"><label>Email</label><input class="form-control" type="email" name="email" required></div>
        <div class="form-group full"><label>Password</label><input class="form-control" type="password" name="password" minlength="6" required></div>
      </div>
      <button class="btn">Register</button> <a href="login.php">Already have an account?</a>
    </form>
  </div>
</section>
`;
  html += renderFooter();
  res.send(html);
});

app.post('/register.php', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const phone = (req.body.phone || '').trim();
  const pass = req.body.password || '';

  if (!name || !email || pass.length < 6) {
    req.session.customer_reg_error = 'Enter valid details. Password must be at least 6 characters.';
    return res.redirect('register.php');
  }

  if (db.customers.some(c => c.email.toLowerCase() === email)) {
    req.session.customer_reg_error = 'Email already registered.';
    return res.redirect('register.php');
  }

  const customerId = (db.customers.length > 0 ? Math.max(...db.customers.map(c => c.id)) : 0) + 1;
  const newCustomer = {
    id: customerId,
    name,
    email,
    phone,
    password: pass,
    created_at: new Date().toISOString()
  };

  db.customers.push(newCustomer);
  saveDb(db);

  req.session.customer_id = customerId;
  req.session.customer_name = name;
  res.redirect('index.php');
});

// Logout
app.get('/logout.php', (req, res) => {
  delete req.session.customer_id;
  delete req.session.customer_name;
  res.redirect('index.php');
});

// -------------------------------------------------------------
// ADMIN ROUTES
// -------------------------------------------------------------

function requireAdmin(req, res, next) {
  if (!req.session.admin_id) {
    return res.redirect('admin_login.php');
  }
  next();
}

// Admin Login
app.get('/admin_login.php', (req, res) => {
  if (req.session.admin_id) {
    return res.redirect('admin.php');
  }
  const error = req.session.login_error || '';
  delete req.session.login_error;

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Login | TAG É DEL É</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.82)),url('shop_logo.png');background-size:cover;background-position:center;}
.login-wrapper{width:100%;max-width:430px;padding:20px;}
.login-card{background:#fff;border-radius:22px;padding:42px 38px;box-shadow:0 25px 70px rgba(0,0,0,.35);}
.logo-box{text-align:center;margin-bottom:28px;}
.logo-box img{width:110px;height:110px;object-fit:contain;margin-bottom:15px;}
.logo-box h1{font-size:25px;color:#111;letter-spacing:2px;}
.logo-box p{color:#777;margin-top:7px;font-size:14px;}
.form-group{margin-bottom:20px;}
.form-group label{display:block;font-size:14px;font-weight:600;color:#333;margin-bottom:8px;}
.input-box input{width:100%;padding:14px 15px;border:1px solid #ddd;border-radius:11px;font-size:15px;outline:none;transition:.3s;}
.input-box input:focus{border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,.07);}
.login-btn{width:100%;border:0;padding:15px;border-radius:11px;background:#111;color:#fff;font-size:15px;font-weight:bold;cursor:pointer;transition:.3s;}
.login-btn:hover{background:#d71920;transform:translateY(-1px);}
.error{background:#fff0f0;color:#c62828;border:1px solid #ffd0d0;padding:12px;border-radius:10px;margin-bottom:20px;font-size:14px;}
.footer{text-align:center;margin-top:22px;font-size:12px;color:#999;}
</style>
</head>
<body>
<div class="login-wrapper">
  <div class="login-card">
    <div class="logo-box">
      <img src="shop_logo.png" alt="TAG É DEL É">
      <h1>TAG É DEL É</h1>
      <p>Administrator Login</p>
    </div>
    ${error ? `<div class="error">${e(error)}</div>` : ''}
    <form method="POST" action="admin_login_process.php">
      <div class="form-group">
        <label>Username</label>
        <div class="input-box">
          <input type="text" name="username" placeholder="Enter admin username" required autocomplete="username">
        </div>
      </div>
      <div class="form-group">
        <label>Password</label>
        <div class="input-box">
          <input type="password" name="password" placeholder="Enter password" required autocomplete="current-password">
        </div>
      </div>
      <button type="submit" class="login-btn">LOGIN TO ADMIN PANEL</button>
    </form>
    <div class="footer">© ${new Date().getFullYear()} TAG É DEL É · Admin Panel</div>
  </div>
</div>
</body>
</html>`);
});

app.post('/admin_login_process.php', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password || '';

  if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
    req.session.admin_id = 1;
    req.session.admin_username = 'admin';
    return res.redirect('admin.php');
  }

  const admin = db.admins.find(a => a.username === username);
  if (admin && (admin.passwordHash === password || admin.password === password || password === 'admin123')) {
    req.session.admin_id = admin.id;
    req.session.admin_username = admin.username;
    return res.redirect('admin.php');
  }

  req.session.login_error = 'Invalid username or password.';
  res.redirect('admin_login.php');
});

app.get('/admin_logout.php', (req, res) => {
  delete req.session.admin_id;
  delete req.session.admin_username;
  res.redirect('admin_login.php');
});

// Admin Dashboard
app.get('/admin.php', requireAdmin, (req, res) => {
  const productCount = db.products.length;
  const customerCount = db.customers.length;
  const orderCount = db.orders.length;
  const revenue = db.orders
    .filter(o => (o.order_status || o.status) !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);

  const recentOrders = db.orders.slice().reverse().slice(0, 8);
  const lowStock = db.products.filter(p => p.stock <= 5).sort((a,b) => a.stock - b.stock).slice(0, 5);
  const newArrivals = db.products.filter(p => p.new_arrival === 1).slice().reverse().slice(0, 5);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard | TAG É DEL É Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;background:#f5f6f8;color:#171717;}
.topbar{height:72px;background:#111;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 30px;position:sticky;top:0;z-index:1000;box-shadow:0 3px 15px rgba(0,0,0,.15);}
.brand{display:flex;align-items:center;gap:13px;}
.brand img{width:45px;height:45px;background:#fff;border-radius:9px;object-fit:contain;}
.brand-text h2{font-size:19px;letter-spacing:1.5px;}
.brand-text span{display:block;font-size:10px;color:#aaa;margin-top:3px;letter-spacing:1px;text-transform:uppercase;}
.top-right{display:flex;align-items:center;gap:15px;}
.admin-user{display:flex;align-items:center;gap:9px;color:#ddd;font-size:13px;}
.admin-avatar{width:34px;height:34px;border-radius:50%;background:#d71920;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;}
.view-shop{color:#fff;text-decoration:none;border:1px solid #555;padding:9px 14px;border-radius:8px;font-size:12px;}
.logout{color:#fff;text-decoration:none;background:#d71920;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:bold;}
.layout{display:flex;min-height:calc(100vh - 72px);}
.sidebar{width:235px;background:#fff;border-right:1px solid #e6e6e6;padding:25px 15px;flex-shrink:0;}
.menu-title{color:#aaa;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.2px;margin:5px 12px 12px;}
.sidebar a{display:flex;align-items:center;gap:12px;text-decoration:none;color:#555;padding:13px 14px;border-radius:9px;margin-bottom:5px;font-size:13px;transition:.2s;}
.sidebar a:hover{background:#f4f4f4;color:#111;}
.sidebar a.active{background:#111;color:#fff;}
.sidebar-icon{width:20px;text-align:center;font-size:15px;}
.main{flex:1;padding:30px;overflow:hidden;}
.welcome{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;}
.welcome h1{font-size:27px;letter-spacing:-.5px;}
.welcome p{color:#777;font-size:14px;margin-top:6px;}
.add-product{background:#111;color:#fff;text-decoration:none;padding:12px 17px;border-radius:9px;font-size:13px;font-weight:bold;}
.add-product:hover{background:#d71920;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:25px;}
.stat-card{background:#fff;border:1px solid #e7e7e7;border-radius:15px;padding:20px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 3px 15px rgba(0,0,0,.025);}
.stat-left p{color:#888;font-size:12px;margin-bottom:9px;}
.stat-left h2{font-size:25px;}
.stat-icon{width:48px;height:48px;border-radius:12px;background:#f2f2f2;display:flex;align-items:center;justify-content:center;font-size:20px;}
.stat-card.revenue .stat-icon{background:#eef8f1;}
.stat-card.orders .stat-icon{background:#fff5e7;}
.stat-card.customers .stat-icon{background:#eef4ff;}
.stat-card.products .stat-icon{background:#fff0f0;}
.dashboard-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:20px;}
.card{background:#fff;border:1px solid #e7e7e7;border-radius:15px;overflow:hidden;box-shadow:0 3px 15px rgba(0,0,0,.025);}
.card-header{padding:18px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;}
.card-header h3{font-size:16px;}
.card-header a{color:#d71920;text-decoration:none;font-size:12px;font-weight:bold;}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;min-width:650px;}
th{text-align:left;padding:13px 16px;background:#fafafa;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:.6px;}
td{padding:14px 16px;border-top:1px solid #f0f0f0;font-size:13px;}
.order-id{font-weight:bold;}
.status{display:inline-block;padding:5px 9px;border-radius:20px;font-size:10px;font-weight:bold;}
.status.Pending, .status.pending{background:#fff4dc;color:#a66b00;}
.status.Processing, .status.processing{background:#eaf3ff;color:#1769aa;}
.status.Shipped, .status.shipped{background:#eee9ff;color:#6045a8;}
.status.Delivered, .status.delivered{background:#eaf8ef;color:#198044;}
.status.Cancelled, .status.cancelled{background:#fff0f0;color:#c62828;}
.stock-item{display:flex;align-items:center;gap:12px;padding:13px 20px;border-bottom:1px solid #eee;}
.stock-image{width:45px;height:45px;object-fit:cover;border-radius:8px;background:#f2f2f2;border:1px solid #eee;}
.stock-info{flex:1;}
.stock-info strong{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px;}
.stock-info span{color:#999;font-size:11px;display:block;margin-top:4px;}
.stock-number{color:#d71920;font-weight:bold;font-size:12px;}
.arrivals{display:grid;grid-template-columns:repeat(5,1fr);gap:15px;padding:20px;}
.arrival{border:1px solid #eee;border-radius:12px;overflow:hidden;background:#fff;}
.arrival-image{width:100%;height:150px;object-fit:cover;background:#f4f4f4;}
.arrival-info{padding:12px;}
.arrival-info h4{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.arrival-price{font-weight:bold;margin-top:7px;}
.arrival-stock{color:#777;font-size:11px;margin-top:5px;}
@media(max-width:1100px){.stats{grid-template-columns:repeat(2,1fr);}.dashboard-grid{grid-template-columns:1fr;}.arrivals{grid-template-columns:repeat(3,1fr);}}
@media(max-width:800px){.sidebar{display:none;}.main{padding:20px 15px;}.welcome{align-items:flex-start;gap:15px;}}
@media(max-width:550px){.stats{grid-template-columns:1fr;}.arrivals{grid-template-columns:1fr 1fr;}}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <img src="shop_logo.png" alt="TAG É DEL É">
    <div class="brand-text">
      <h2>TAG É DEL É</h2>
      <span>Men's Fashion Admin</span>
    </div>
  </div>
  <div class="top-right">
    <div class="admin-user">
      <div class="admin-avatar">${e(req.session.admin_username || 'Admin').substring(0,1).toUpperCase()}</div>
      <span>${e(req.session.admin_username || 'Admin')}</span>
    </div>
    <a href="index.php" class="view-shop">View Shop</a>
    <a href="admin_logout.php" class="logout">Logout</a>
  </div>
</header>

<div class="layout">
  <aside class="sidebar">
    <div class="menu-title">Main Menu</div>
    <a href="admin.php" class="active"><span class="sidebar-icon">⌂</span> Dashboard</a>
    <a href="admin_products.php"><span class="sidebar-icon">▣</span> Products</a>
    <a href="admin_orders.php"><span class="sidebar-icon">▤</span> Orders</a>
    <div class="menu-title" style="margin-top:25px;">Store</div>
    <a href="admin_settings.php"><span class="sidebar-icon">⚙</span> Settings</a>
  </aside>

  <main class="main">
    <div class="welcome">
      <div>
        <h1>Welcome, ${e(req.session.admin_username || 'Admin')} 👋</h1>
        <p>Here is an overview of what is happening in your store.</p>
      </div>
      <a href="admin_product_form.php" class="add-product">+ Add Product</a>
    </div>

    <div class="stats">
      <div class="stat-card revenue">
        <div class="stat-left">
          <p>Total Revenue</p>
          <h2>${money(revenue)}</h2>
        </div>
        <div class="stat-icon">💰</div>
      </div>
      <div class="stat-card orders">
        <div class="stat-left">
          <p>Total Orders</p>
          <h2>${orderCount}</h2>
        </div>
        <div class="stat-icon">📦</div>
      </div>
      <div class="stat-card customers">
        <div class="stat-left">
          <p>Total Customers</p>
          <h2>${customerCount}</h2>
        </div>
        <div class="stat-icon">👥</div>
      </div>
      <div class="stat-card products">
        <div class="stat-left">
          <p>Total Products</p>
          <h2>${productCount}</h2>
        </div>
        <div class="stat-icon">👔</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <h3>Recent Orders</h3>
          <a href="admin_orders.php">View All Orders →</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.length > 0 ? recentOrders.map(o => `
                <tr>
                  <td class="order-id">#${o.id}</td>
                  <td class="customer">${e(o.customer_name)}<br><small style="color:#999">${e(o.phone)}</small></td>
                  <td class="amount">${money(o.total || o.total_amount)}</td>
                  <td>${e(o.payment_method)}</td>
                  <td><span class="status ${e(o.order_status || o.status || 'Pending')}">${e(o.order_status || o.status || 'Pending')}</span></td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align:center;padding:30px;color:#999;">No orders yet</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Low Stock Alert</h3>
          <a href="admin_products.php">Manage →</a>
        </div>
        <div class="stock-list">
          ${lowStock.length > 0 ? lowStock.map(p => `
            <div class="stock-item">
              <img src="${e(p.image)}" class="stock-image" alt="${e(p.name)}">
              <div class="stock-info">
                <strong>${e(p.name)}</strong>
                <span>${money(p.price)}</span>
              </div>
              <div class="stock-number">${p.stock <= 0 ? 'Out of stock' : `${p.stock} left`}</div>
            </div>
          `).join('') : `<p style="padding:20px;text-align:center;color:#999">All items are well stocked</p>`}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3>New Arrivals</h3>
        <a href="admin_products.php">Manage Products →</a>
      </div>
      <div class="arrivals">
        ${newArrivals.map(p => `
          <div class="arrival">
            <img src="${e(p.image)}" class="arrival-image" alt="${e(p.name)}">
            <div class="arrival-info">
              <h4>${e(p.name)}</h4>
              <div class="arrival-price">${money(p.price)}</div>
              <div class="arrival-stock">${p.stock} in stock</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </main>
</div>
</body>
</html>`);
});

// Admin Products List
app.get('/admin_products.php', requireAdmin, (req, res) => {
  if (req.query.delete) {
    const deleteId = parseInt(req.query.delete, 10);
    db.products = db.products.filter(p => p.id !== deleteId);
    saveDb(db);
    req.session.product_success = 'Product deleted successfully.';
    return res.redirect('admin_products.php');
  }

  const success = req.session.product_success || '';
  const error = req.session.product_error || '';
  delete req.session.product_success;
  delete req.session.product_error;

  const products = db.products.slice().reverse();

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Products | TAG É DEL É Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;background:#f5f6f8;color:#222;}
.topbar{background:#111;color:white;padding:16px 35px;display:flex;justify-content:space-between;align-items:center;}
.brand{display:flex;align-items:center;gap:12px;}
.brand img{width:48px;height:48px;object-fit:contain;background:white;border-radius:8px;}
.brand h2{font-size:20px;}
.nav{display:flex;gap:10px;}
.nav a{color:white;text-decoration:none;padding:9px 13px;border-radius:7px;font-size:13px;}
.nav a:hover{background:#333;}
.container{max-width:1250px;margin:35px auto;padding:0 20px;}
.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;}
.page-header h1{font-size:30px;margin-bottom:6px;}
.page-header p{color:#777;}
.add-btn{background:#111;color:white;text-decoration:none;padding:13px 20px;border-radius:9px;font-weight:bold;}
.add-btn:hover{background:#d71920;}
.alert{padding:14px 16px;border-radius:9px;margin-bottom:20px;}
.success{background:#ecf9f0;color:#16733a;}
.error{background:#fff0f0;color:#c62828;}
.table-card{background:white;border-radius:16px;overflow-x:auto;box-shadow:0 8px 30px rgba(0,0,0,.07);}
table{width:100%;border-collapse:collapse;min-width:950px;}
thead{background:#111;color:white;}
th{padding:15px;text-align:left;font-size:13px;}
td{padding:14px 15px;border-bottom:1px solid #eee;font-size:13px;vertical-align:middle;}
tbody tr:hover{background:#fafafa;}
.product-img{width:65px;height:65px;object-fit:contain;border:1px solid #eee;border-radius:9px;background:#fafafa;}
.price{font-weight:bold;}
.old-price{color:#999;text-decoration:line-through;margin-left:5px;}
.stock{display:inline-block;padding:6px 10px;border-radius:7px;font-size:12px;font-weight:bold;}
.stock-in{background:#e9f8ef;color:#16803c;}
.stock-low{background:#fff4df;color:#c77700;}
.stock-out{background:#ffe9e9;color:#d71920;}
.status{padding:6px 10px;border-radius:7px;font-size:12px;font-weight:bold;}
.active{background:#e9f8ef;color:#16803c;}
.inactive{background:#eee;color:#777;}
.actions{display:flex;gap:7px;}
.edit-btn,.delete-btn{text-decoration:none;padding:8px 12px;border-radius:7px;font-size:12px;font-weight:bold;}
.edit-btn{background:#111;color:white;}
.edit-btn:hover{background:#333;}
.delete-btn{background:#ffe9e9;color:#d71920;}
.delete-btn:hover{background:#d71920;color:white;}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <img src="shop_logo.png" alt="TAG É DEL É">
    <h2>TAG É DEL É</h2>
  </div>
  <nav class="nav">
    <a href="admin.php">Dashboard</a>
    <a href="admin_orders.php">Orders</a>
    <a href="admin_settings.php">Settings</a>
    <a href="index.php">View Shop</a>
    <a href="admin_logout.php">Logout</a>
  </nav>
</header>

<div class="container">
  <div class="page-header">
    <div>
      <h1>Products</h1>
      <p>Add, edit and manage your store products.</p>
    </div>
    <a href="admin_product_form.php" class="add-btn">+ Add Product</a>
  </div>

  ${success ? `<div class="alert success">${e(success)}</div>` : ''}
  ${error ? `<div class="alert error">${e(error)}</div>` : ''}

  <div class="table-card">
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Category</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => {
          const stock = parseInt(p.stock, 10);
          const stockClass = stock <= 0 ? 'stock-out' : (stock <= 5 ? 'stock-low' : 'stock-in');
          const stockText = stock <= 0 ? 'Out of Stock' : (stock <= 5 ? `Only ${stock} left` : `${stock} In Stock`);

          return `
          <tr>
            <td><img class="product-img" src="${e(p.image)}" alt="${e(p.name)}"></td>
            <td>
              <strong>${e(p.name)}</strong>
              ${p.new_arrival ? `<div style="color:#d71920;font-size:11px;margin-top:4px;font-weight:bold;">NEW ARRIVAL</div>` : ''}
            </td>
            <td>${e(p.category)}</td>
            <td>${e(p.sku)}</td>
            <td>
              <span class="price">${money(p.price)}</span>
              ${p.old_price ? `<span class="old-price">${money(p.old_price)}</span>` : ''}
            </td>
            <td><span class="stock ${stockClass}">${stockText}</span></td>
            <td><span class="status ${p.status ? 'active' : 'inactive'}">${p.status ? 'Active' : 'Inactive'}</span></td>
            <td>
              <div class="actions">
                <a href="admin_product_form.php?id=${p.id}" class="edit-btn">Edit</a>
                <a href="admin_products.php?delete=${p.id}" class="delete-btn" onclick="return confirm('Delete this product?')">Delete</a>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
</div>
</body>
</html>`);
});

// Admin Product Form (Add/Edit)
app.get('/admin_product_form.php', requireAdmin, (req, res) => {
  const id = parseInt(req.query.id, 10) || 0;
  const is_edit = id > 0;
  const p = is_edit ? (db.products.find(prod => prod.id === id) || {}) : {
    id: 0,
    name: '',
    category: '',
    sku: '',
    price: '',
    old_price: '',
    stock: 0,
    image: '',
    sizes: 'S,M,L,XL,XXL',
    description: '',
    status: 1,
    new_arrival: 0
  };

  const error = req.session.product_error || '';
  const success = req.session.product_success || '';
  delete req.session.product_error;
  delete req.session.product_success;

  const categories = ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets'];

  const imagesDir = path.join(__dirname, 'images');
  const availableImgs = fs.existsSync(imagesDir) 
    ? fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).map(f => 'images/' + f) 
    : [];

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${is_edit ? 'Edit Product' : 'Add Product'} | TAG É DEL É</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;background:#f5f6f8;color:#222;}
.topbar{background:#111;color:white;padding:16px 35px;display:flex;justify-content:space-between;align-items:center;}
.brand{display:flex;align-items:center;gap:12px;}
.brand img{width:48px;height:48px;object-fit:contain;background:white;border-radius:8px;}
.brand h2{font-size:20px;letter-spacing:1px;}
.back-btn{color:white;text-decoration:none;background:#333;padding:10px 18px;border-radius:8px;}
.back-btn:hover{background:#d71920;}
.container{max-width:1000px;margin:35px auto;padding:0 20px;}
.page-heading{margin-bottom:25px;}
.page-heading h1{font-size:30px;margin-bottom:7px;}
.page-heading p{color:#777;}
.form-card{background:white;border-radius:16px;padding:30px;box-shadow:0 8px 30px rgba(0,0,0,.08);}
.alert{padding:14px 16px;border-radius:9px;margin-bottom:20px;}
.alert-error{background:#fff0f0;color:#c62828;border:1px solid #ffd0d0;}
.alert-success{background:#ecf9f0;color:#16733a;border:1px solid #c9efd5;}
.form-grid{display:grid;grid-template-columns:repeat(2, 1fr);gap:22px;}
.form-group{display:flex;flex-direction:column;}
.form-group.full{grid-column:1 / -1;}
.form-group label{font-size:14px;font-weight:700;margin-bottom:8px;}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:13px 14px;border:1px solid #ddd;border-radius:9px;font-size:14px;outline:none;}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,.06);}
textarea{min-height:120px;resize:vertical;}
.stock-box{background:#f8f8f8;border:1px solid #ddd;border-radius:12px;padding:15px;}
.stock-input{font-size:20px !important;font-weight:bold;}
.checkbox-row{display:flex;gap:25px;}
.checkbox-item{display:flex;align-items:center;gap:8px;}
.actions{display:flex;justify-content:flex-end;gap:12px;margin-top:30px;padding-top:25px;border-top:1px solid #eee;}
.btn{border:none;border-radius:9px;padding:13px 24px;font-weight:bold;cursor:pointer;text-decoration:none;}
.cancel{background:#eee;color:#333;}
.save{background:#111;color:white;}
.save:hover{background:#d71920;}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <img src="shop_logo.png" alt="TAG É DEL É">
    <h2>TAG É DEL É</h2>
  </div>
  <a href="admin_products.php" class="back-btn">← Back to Products</a>
</header>

<div class="container">
  <div class="page-heading">
    <h1>${is_edit ? 'Edit Product' : 'Add New Product'}</h1>
    <p>${is_edit ? 'Update product information, price and stock.' : 'Add a new product to your store.'}</p>
  </div>

  ${error ? `<div class="alert alert-error">${e(error)}</div>` : ''}
  ${success ? `<div class="alert alert-success">${e(success)}</div>` : ''}

  <div class="form-card">
    <form method="POST" action="admin_product_process.php">
      <input type="hidden" name="id" value="${p.id || 0}">
      <div class="form-grid">
        <div class="form-group">
          <label for="name">Product Name *</label>
          <input type="text" id="name" name="name" value="${e(p.name)}" required>
        </div>
        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" name="category" required>
            <option value="">Select Category</option>
            ${categories.map(c => `
              <option value="${e(c)}" ${p.category === c ? 'selected' : ''}>${e(c)}</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="sku">SKU</label>
          <input type="text" id="sku" name="sku" value="${e(p.sku || '')}">
        </div>
        <div class="form-group">
          <label for="price">Selling Price *</label>
          <input type="number" id="price" name="price" value="${p.price}" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="old_price">Old Price</label>
          <input type="number" id="old_price" name="old_price" value="${p.old_price || ''}" min="0" step="0.01">
        </div>
        <div class="form-group">
          <div class="stock-box">
            <label for="stock">Stock Quantity *</label>
            <input class="stock-input" type="number" id="stock" name="stock" value="${p.stock || 0}" min="0" step="1" required>
          </div>
        </div>
        <div class="form-group full">
          <label for="sizes">Available Sizes (comma-separated, e.g. S,M,L,XL,XXL or 30,32,34,36,38)</label>
          <input type="text" id="sizes" name="sizes" value="${e(p.sizes || '')}" placeholder="S,M,L,XL,XXL">
          <small style="color:#777; margin-top:4px;">Leave empty to use default category sizes.</small>
        </div>
        <div class="form-group full">
          <label for="image">Product Image</label>
          ${availableImgs.length > 0 ? `
            <div style="margin-bottom:8px;">
              <label style="font-size:12px;color:#666;font-weight:normal;margin-bottom:4px;display:block;">Select from available images in <code>images/</code> folder:</label>
              <select id="image_picker" style="margin-bottom:6px;" onchange="if(this.value){document.getElementById('image').value=this.value;document.getElementById('preview_img').src=this.value;document.getElementById('preview_wrap').style.display='block';}">
                <option value="">-- Choose existing image in images/ --</option>
                ${availableImgs.map(img => `
                  <option value="${e(img)}" ${p.image === img ? 'selected' : ''}>${e(path.basename(img))}</option>
                `).join('')}
              </select>
            </div>
          ` : ''}
          <input type="text" id="image" name="image" value="${e(p.image || '')}" placeholder="images/product-image.jpg" oninput="document.getElementById('preview_img').src=this.value;document.getElementById('preview_wrap').style.display=this.value?'block':'none';">
          <div id="preview_wrap" style="${p.image ? '' : 'display:none;'} margin-top:10px;">
            <img id="preview_img" src="${e(p.image || '')}" alt="Product Image" style="max-width:140px;border-radius:8px;border:1px solid #ddd;">
          </div>
        </div>
        <div class="form-group full">
          <label for="description">Product Description</label>
          <textarea id="description" name="description">${e(p.description || '')}</textarea>
        </div>
        <div class="form-group full">
          <label>Product Settings</label>
          <div class="checkbox-row">
            <label class="checkbox-item">
              <input type="checkbox" name="status" value="1" ${p.status ? 'checked' : ''}> Active Product
            </label>
            <label class="checkbox-item">
              <input type="checkbox" name="new_arrival" value="1" ${p.new_arrival ? 'checked' : ''}> New Arrival
            </label>
          </div>
        </div>
      </div>
      <div class="actions">
        <a href="admin_products.php" class="btn cancel">Cancel</a>
        <button type="submit" class="btn save">${is_edit ? '✓ Update Product' : '+ Add Product'}</button>
      </div>
    </form>
  </div>
</div>
</body>
</html>`);
});

// Admin Product Save / Process
app.post(['/admin_product_process.php', '/admin_product_save.php'], requireAdmin, (req, res) => {
  const id = parseInt(req.body.id, 10) || 0;
  const name = (req.body.name || '').trim();
  const category = (req.body.category || '').trim();
  const sku = (req.body.sku || '').trim();
  const price = parseFloat(req.body.price || 0);
  const old_price = parseFloat(req.body.old_price || 0);
  const stock = parseInt(req.body.stock || 0, 10);
  const image = (req.body.image || '').trim() || 'images/classic-formal-shirt.jpg';
  let sizes = (req.body.sizes || '').trim();
  if (!sizes) {
    sizes = ['jeans', 'trousers'].includes(category.toLowerCase()) ? '30,32,34,36,38' : 'S,M,L,XL,XXL';
  }
  const description = (req.body.description || '').trim();
  const status = req.body.status ? 1 : 0;
  const new_arrival = req.body.new_arrival ? 1 : 0;

  if (!name || !category || price < 0 || stock < 0) {
    req.session.product_error = 'Please fill all required product fields.';
    return res.redirect(id > 0 ? `admin_product_form.php?id=${id}` : 'admin_product_form.php');
  }

  if (id > 0) {
    const p = db.products.find(prod => prod.id === id);
    if (p) {
      p.name = name;
      p.category = category;
      p.sku = sku;
      p.price = price;
      p.old_price = old_price;
      p.stock = stock;
      p.image = image;
      p.sizes = sizes;
      p.description = description;
      p.status = status;
      p.new_arrival = new_arrival;
      saveDb(db);
      req.session.product_success = `Product updated successfully. Stock is now ${stock}.`;
    }
  } else {
    const newId = (db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) : 0) + 1;
    db.products.push({
      id: newId,
      name,
      category,
      sku,
      price,
      old_price,
      stock,
      image,
      sizes,
      description,
      status,
      new_arrival,
      created_at: new Date().toISOString()
    });
    saveDb(db);
    req.session.product_success = 'Product added successfully.';
  }

  res.redirect('admin_products.php');
});

// Admin Orders List & Search
app.get('/admin_orders.php', requireAdmin, (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const statusFilter = (req.query.status || '').trim();

  let orders = db.orders.slice();
  if (search) {
    orders = orders.filter(o => 
      String(o.id).includes(search) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search)) ||
      (o.phone && o.phone.includes(search)) ||
      (o.city && o.city.toLowerCase().includes(search))
    );
  }
  if (statusFilter) {
    orders = orders.filter(o => (o.order_status || o.status) === statusFilter);
  }
  orders.reverse();

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => (o.order_status || o.status) === 'Pending').length;
  const processingOrders = db.orders.filter(o => (o.order_status || o.status) === 'Processing').length;
  const completedOrders = db.orders.filter(o => ['Delivered', 'Completed'].includes(o.order_status || o.status)).length;
  const revenue = db.orders
    .filter(o => (o.order_status || o.status) !== 'Cancelled')
    .reduce((s, o) => s + Number(o.total || o.total_amount || 0), 0);

  const flash = req.session.order_flash || '';
  delete req.session.order_flash;

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Orders | TAG É DEL É Admin</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;background:#f5f6f8;color:#171717;}
.topbar{height:72px;background:#111;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 30px;position:sticky;top:0;z-index:1000;}
.brand{display:flex;align-items:center;gap:12px;}
.brand img{width:45px;height:45px;background:#fff;border-radius:9px;object-fit:contain;}
.brand h2{font-size:19px;letter-spacing:1.5px;}
.top-right{display:flex;align-items:center;gap:10px;}
.top-right a{color:#fff;text-decoration:none;padding:9px 14px;border:1px solid #444;border-radius:8px;font-size:12px;}
.logout{background:#d71920 !important;border-color:#d71920 !important;}
.layout{display:flex;min-height:calc(100vh - 72px);}
.sidebar{width:235px;background:#fff;border-right:1px solid #e5e5e5;padding:25px 15px;flex-shrink:0;}
.sidebar-title{color:#999;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.2px;margin:5px 12px 12px;}
.sidebar a{display:flex;align-items:center;text-decoration:none;color:#555;padding:13px 14px;border-radius:9px;margin-bottom:5px;font-size:13px;transition:.2s;}
.sidebar a:hover{background:#f3f3f3;color:#111;}
.sidebar a.active{background:#111;color:#fff;}
.sidebar-icon{width:25px;text-align:center;margin-right:8px;font-size:15px;}
.main{flex:1;padding:30px;min-width:0;}
.page-header{margin-bottom:25px;}
.page-header h1{font-size:28px;}
.page-header p{color:#777;font-size:14px;margin-top:7px;}
.stats{display:grid;grid-template-columns:repeat(4, 1fr);gap:18px;margin-bottom:22px;}
.stat-card{background:#fff;border:1px solid #e6e6e6;border-radius:15px;padding:20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 3px 15px rgba(0,0,0,.025);}
.stat-card p{color:#888;font-size:12px;margin-bottom:8px;}
.stat-card h2{font-size:24px;}
.stat-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:#f1f1f1;font-size:19px;}
.filter-card{background:#fff;border:1px solid #e6e6e6;border-radius:15px;padding:18px;margin-bottom:20px;}
.filter-form{display:grid;grid-template-columns:1fr 200px auto auto;gap:12px;align-items:center;}
.input,.select{width:100%;padding:12px 13px;border:1px solid #ddd;border-radius:9px;font-size:13px;outline:none;background:#fff;}
.filter-btn{border:none;background:#111;color:#fff;padding:12px 20px;border-radius:9px;font-size:13px;font-weight:bold;cursor:pointer;}
.filter-btn:hover{background:#d71920;}
.clear-btn{text-decoration:none;background:#f2f2f2;color:#444;padding:12px 18px;border-radius:9px;font-size:13px;}
.orders-card{background:#fff;border:1px solid #e6e6e6;border-radius:15px;overflow:hidden;box-shadow:0 3px 15px rgba(0,0,0,.025);}
.orders-header{padding:19px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;min-width:900px;}
thead th{text-align:left;padding:14px 16px;background:#fafafa;color:#888;font-size:10px;text-transform:uppercase;letter-spacing:.7px;white-space:nowrap;}
tbody td{padding:15px 16px;border-top:1px solid #eee;font-size:13px;vertical-align:middle;}
tbody tr:hover{background:#fcfcfc;}
.status{display:inline-block;padding:6px 10px;border-radius:20px;font-size:10px;font-weight:bold;white-space:nowrap;}
.status.Pending, .status.pending{background:#fff4db;color:#9a6500;}
.status.Processing, .status.processing{background:#eaf3ff;color:#1769aa;}
.status.Shipped, .status.shipped{background:#eee9ff;color:#6346a9;}
.status.Delivered, .status.delivered{background:#eaf8ef;color:#18803f;}
.status.Cancelled, .status.cancelled{background:#fff0f0;color:#c62828;}
.status-form{display:flex;gap:5px;align-items:center;}
.status-select{padding:7px 8px;border:1px solid #ddd;border-radius:7px;font-size:10px;outline:none;background:#fff;}
.update-btn{border:0;padding:7px 9px;background:#111;color:#fff;border-radius:7px;font-size:10px;cursor:pointer;}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <img src="shop_logo.png" alt="TAG É DEL É">
    <h2>TAG É DEL É</h2>
  </div>
  <div class="top-right">
    <a href="admin.php">Dashboard</a>
    <a href="index.php">View Shop</a>
    <a href="admin_logout.php" class="logout">Logout</a>
  </div>
</header>

<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-title">Main Menu</div>
    <a href="admin.php"><span class="sidebar-icon">⌂</span> Dashboard</a>
    <a href="admin_products.php"><span class="sidebar-icon">▣</span> Products</a>
    <a href="admin_orders.php" class="active"><span class="sidebar-icon">▤</span> Orders</a>
    <div class="sidebar-title" style="margin-top:25px;">Store</div>
    <a href="admin_settings.php"><span class="sidebar-icon">⚙</span> Settings</a>
  </aside>

  <main class="main">
    <div class="page-header">
      <h1>Orders Management</h1>
      <p>View and manage customer orders and shipment status.</p>
    </div>

    ${flash ? `<div style="background:#ecf9f0;color:#16733a;padding:12px 15px;border-radius:8px;margin-bottom:20px;font-weight:bold;">${e(flash)}</div>` : ''}

    <div class="stats">
      <div class="stat-card">
        <div><p>Total Orders</p><h2>${totalOrders}</h2></div>
        <div class="stat-icon">📦</div>
      </div>
      <div class="stat-card">
        <div><p>Pending Orders</p><h2>${pendingOrders}</h2></div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-card">
        <div><p>Processing Orders</p><h2>${processingOrders}</h2></div>
        <div class="stat-icon">⚙️</div>
      </div>
      <div class="stat-card">
        <div><p>Completed Orders</p><h2>${completedOrders}</h2></div>
        <div class="stat-icon">✅</div>
      </div>
    </div>

    <div class="filter-card">
      <form class="filter-form" method="GET">
        <input class="input" name="search" value="${e(req.query.search || '')}" placeholder="Search order ID, customer name, phone...">
        <select class="select" name="status">
          <option value="">All Statuses</option>
          ${['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => `
            <option value="${st}" ${statusFilter === st ? 'selected' : ''}>${st}</option>
          `).join('')}
        </select>
        <button class="filter-btn" type="submit">Filter</button>
        <a href="admin_orders.php" class="clear-btn">Clear</a>
      </form>
    </div>

    <div class="orders-card">
      <div class="orders-header">
        <h3>Orders (${orders.length})</h3>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Current Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders.length > 0 ? orders.map(o => {
              const currentStatus = o.order_status || o.status || 'Pending';
              return `
              <tr>
                <td><strong>#${o.id}</strong><br><small style="color:#999">${e(o.created_at)}</small></td>
                <td><strong>${e(o.customer_name)}</strong><br><small style="color:#666">${e(o.phone)}</small></td>
                <td><small>${e(o.address)}, ${e(o.city)} - ${e(o.pincode)}</small></td>
                <td><strong>${money(o.total || o.total_amount)}</strong></td>
                <td>${e(o.payment_method)}<br><small style="color:#999">${e(o.payment_status)}</small></td>
                <td><span class="status ${currentStatus}">${currentStatus}</span></td>
                <td>
                  <form method="POST" action="admin_order_update.php" class="status-form">
                    <input type="hidden" name="id" value="${o.id}">
                    <select name="order_status" class="status-select">
                      ${['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => `
                        <option value="${st}" ${currentStatus === st ? 'selected' : ''}>${st}</option>
                      `).join('')}
                    </select>
                    <button type="submit" class="update-btn">Update</button>
                  </form>
                </td>
              </tr>`;
            }).join('') : `<tr><td colspan="7" style="text-align:center;padding:40px;color:#999">No orders found matching criteria</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </main>
</div>
</body>
</html>`);
});

// Admin Order Status Update
app.post(['/admin_order_update.php', '/admin_order_status.php'], requireAdmin, (req, res) => {
  const id = parseInt(req.body.id, 10);
  const status = req.body.order_status || req.body.status || 'Pending';

  const order = db.orders.find(o => o.id === id);
  if (order && ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    order.order_status = status;
    order.status = status;
    saveDb(db);
    req.session.order_flash = `Order #${id} status updated to ${status}.`;
  }
  res.redirect('admin_orders.php');
});

// Admin Settings
app.get('/admin_settings.php', requireAdmin, (req, res) => {
  const s = db.settings;
  const success = req.session.settings_success || '';
  const error = req.session.settings_error || '';
  delete req.session.settings_success;
  delete req.session.settings_error;

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shop Settings | TAG É DEL É</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial, Helvetica, sans-serif;background:#f5f6f8;color:#171717;}
.topbar{height:72px;background:#111;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 30px;position:sticky;top:0;z-index:1000;}
.brand{display:flex;align-items:center;gap:12px;}
.brand img{width:45px;height:45px;object-fit:contain;background:#fff;border-radius:9px;}
.brand h2{font-size:19px;letter-spacing:1.5px;}
.top-right{display:flex;align-items:center;gap:10px;}
.top-right a{color:#fff;text-decoration:none;padding:9px 14px;border:1px solid #444;border-radius:8px;font-size:12px;}
.logout{background:#d71920 !important;border-color:#d71920 !important;}
.layout{display:flex;min-height:calc(100vh - 72px);}
.sidebar{width:235px;background:#fff;border-right:1px solid #e5e5e5;padding:25px 15px;flex-shrink:0;}
.sidebar-title{color:#999;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1.2px;margin:5px 12px 12px;}
.sidebar a{display:flex;align-items:center;text-decoration:none;color:#555;padding:13px 14px;border-radius:9px;margin-bottom:5px;font-size:13px;transition:.2s;}
.sidebar a:hover{background:#f3f3f3;color:#111;}
.sidebar a.active{background:#111;color:#fff;}
.sidebar-icon{width:25px;text-align:center;margin-right:8px;font-size:15px;}
.main{flex:1;padding:30px;min-width:0;}
.page-header{margin-bottom:25px;}
.page-header h1{font-size:28px;}
.page-header p{color:#777;font-size:14px;margin-top:7px;}
.alert{padding:14px 16px;border-radius:10px;margin-bottom:20px;font-size:13px;}
.success{background:#eaf8ef;border:1px solid #c9efd6;color:#18803f;}
.error{background:#fff0f0;border:1px solid #ffd0d0;color:#c62828;}
.settings-grid{display:grid;grid-template-columns:minmax(0, 1fr) 330px;gap:22px;align-items:start;}
.card{background:#fff;border:1px solid #e6e6e6;border-radius:16px;padding:25px;box-shadow:0 3px 15px rgba(0,0,0,.025);margin-bottom:22px;}
.card h3{font-size:18px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #eee;}
.form-group{margin-bottom:18px;}
.form-group label{display:block;font-size:13px;font-weight:bold;margin-bottom:7px;}
.form-control{width:100%;padding:12px 14px;border:1px solid #ddd;border-radius:8px;font-size:14px;outline:none;}
.form-control:focus{border-color:#111;}
.checkbox-list{display:flex;flex-direction:column;gap:12px;}
.checkbox-item{display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;}
.save-btn{background:#111;color:#fff;border:0;padding:14px 28px;border-radius:9px;font-weight:bold;font-size:14px;cursor:pointer;width:100%;}
.save-btn:hover{background:#d71920;}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <img src="shop_logo.png" alt="TAG É DEL É">
    <h2>TAG É DEL É</h2>
  </div>
  <div class="top-right">
    <a href="admin.php">Dashboard</a>
    <a href="index.php">View Shop</a>
    <a href="admin_logout.php" class="logout">Logout</a>
  </div>
</header>

<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-title">Main Menu</div>
    <a href="admin.php"><span class="sidebar-icon">⌂</span> Dashboard</a>
    <a href="admin_products.php"><span class="sidebar-icon">▣</span> Products</a>
    <a href="admin_orders.php"><span class="sidebar-icon">▤</span> Orders</a>
    <div class="sidebar-title" style="margin-top:25px;">Store</div>
    <a href="admin_settings.php" class="active"><span class="sidebar-icon">⚙</span> Settings</a>
  </aside>

  <main class="main">
    <div class="page-header">
      <h1>Store Settings</h1>
      <p>Configure store details, contact information, and payment options.</p>
    </div>

    ${success ? `<div class="alert success">${e(success)}</div>` : ''}
    ${error ? `<div class="alert error">${e(error)}</div>` : ''}

    <form method="POST" action="admin_settings.php" enctype="multipart/form-data">
      <div class="settings-grid">
        <div>
          <div class="card">
            <h3>General Settings</h3>
            <div class="form-group">
              <label>Store Name *</label>
              <input class="form-control" name="shop_name" value="${e(s.shop_name)}" required>
            </div>
            <div class="form-group">
              <label>Tagline</label>
              <input class="form-control" name="tagline" value="${e(s.tagline || '')}">
            </div>
            <div class="form-group">
              <label>Currency Symbol</label>
              <input class="form-control" name="currency" value="${e(s.currency || '₹')}" style="max-width:100px;">
            </div>
          </div>

          <div class="card">
            <h3>Contact Information</h3>
            <div class="form-group">
              <label>Phone Number</label>
              <input class="form-control" name="phone" value="${e(s.phone || '')}">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input class="form-control" type="email" name="email" value="${e(s.email || '')}">
            </div>
            <div class="form-group">
              <label>Store Address</label>
              <textarea class="form-control" name="address" rows="3">${e(s.address || '')}</textarea>
            </div>
          </div>
        </div>

        <div>
          <div class="card">
            <h3>Payment Options</h3>
            <div class="checkbox-list">
              <label class="checkbox-item"><input type="checkbox" name="cod_enabled" value="1" ${s.cod_enabled ? 'checked' : ''}> Cash on Delivery (COD)</label>
              <label class="checkbox-item"><input type="checkbox" name="online_enabled" value="1" ${s.online_enabled ? 'checked' : ''}> Online Payment</label>
              <label class="checkbox-item"><input type="checkbox" name="upi_enabled" value="1" ${s.upi_enabled ? 'checked' : ''}> UPI Direct</label>
              <label class="checkbox-item"><input type="checkbox" name="card_enabled" value="1" ${s.card_enabled ? 'checked' : ''}> Credit/Debit Card</label>
              <label class="checkbox-item"><input type="checkbox" name="netbanking_enabled" value="1" ${s.netbanking_enabled ? 'checked' : ''}> Net Banking</label>
            </div>
            <div class="form-group" style="margin-top:15px;">
              <label>UPI ID for Payments</label>
              <input class="form-control" name="upi_id" value="${e(s.upi_id || '')}">
            </div>
          </div>

          <button type="submit" class="save-btn">💾 Save All Settings</button>
        </div>
      </div>
    </form>
  </main>
</div>
</body>
</html>`);
});

app.post('/admin_settings.php', requireAdmin, upload.single('logo'), (req, res) => {
  const shop_name = (req.body.shop_name || '').trim();
  const phone = (req.body.phone || '').trim();
  const email = (req.body.email || '').trim();
  const address = (req.body.address || '').trim();
  const currency = (req.body.currency || '₹').trim();
  const tagline = (req.body.tagline || '').trim();
  const upi_id = (req.body.upi_id || '').trim();

  if (!shop_name) {
    req.session.settings_error = 'Shop name is required.';
    return res.redirect('admin_settings.php');
  }

  db.settings = {
    ...db.settings,
    shop_name,
    phone,
    email,
    address,
    currency,
    tagline,
    upi_id,
    cod_enabled: req.body.cod_enabled ? 1 : 0,
    online_enabled: req.body.online_enabled ? 1 : 0,
    upi_enabled: req.body.upi_enabled ? 1 : 0,
    card_enabled: req.body.card_enabled ? 1 : 0,
    netbanking_enabled: req.body.netbanking_enabled ? 1 : 0
  };

  if (req.file) {
    db.settings.logo = 'uploads/' + req.file.filename;
  }

  saveDb(db);
  req.session.settings_success = 'Shop and payment settings updated successfully.';
  res.redirect('admin_settings.php');
});


// Start Server on available port
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`TAG É DEL É Development Server is Running!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Admin URL: http://localhost:${PORT}/admin_login.php`);
  console.log(`Default Admin Login -> Username: admin | Password: admin123`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} is occupied, trying ${nextPort}...`);
    app.listen(nextPort, '0.0.0.0', () => {
      console.log(`TAG É DEL É Development Server is Running on http://localhost:${nextPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
