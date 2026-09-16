<?php require_once __DIR__ . '/functions.php'; ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($page_title ?? (defined('SHOP_NAME') ? SHOP_NAME : 'TAG É DEL É')) ?> | Premium Men's Wear</title>
  
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
        <!-- Brand Logo -->
        <a class="brand" href="index.php">
          <div class="brand-text">
            <span class="brand-name">TAG É DEL É</span>
            <span class="brand-tagline">MENS FASHION</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="main-nav">
          <a href="index.php">Home</a>
          <a href="products.php" class="<?= (basename($_SERVER['PHP_SELF']) == 'products.php' && empty($_GET['category']) && empty($_GET['q'])) ? 'active' : '' ?>">STORE</a>
          <a href="products.php?category=Shirts" class="<?= (isset($_GET['category']) && strcasecmp($_GET['category'], 'Shirts') === 0) ? 'active' : '' ?>">Shirts</a>
          <a href="products.php?category=T-Shirts" class="<?= (isset($_GET['category']) && strcasecmp($_GET['category'], 'T-Shirts') === 0) ? 'active' : '' ?>">T-Shirts</a>
          <a href="products.php?category=Jeans" class="<?= (isset($_GET['category']) && strcasecmp($_GET['category'], 'Jeans') === 0) ? 'active' : '' ?>">Jeans</a>
          <a href="products.php?category=Jackets" class="<?= (isset($_GET['category']) && strcasecmp($_GET['category'], 'Jackets') === 0) ? 'active' : '' ?>">Jackets</a>
          <a href="products.php?category=Trousers" class="<?= (isset($_GET['category']) && strcasecmp($_GET['category'], 'Trousers') === 0) ? 'active' : '' ?>">Trousers</a>
          <a href="about.php">About</a>
        </nav>

        <!-- Nav Action Icons & Buttons -->
        <div class="nav-actions">
          <!-- Search Trigger -->
          <button class="nav-icon-btn" id="searchToggleBtn" title="Search">
            🔍
          </button>

          <!-- Wishlist Button -->
          <a href="#" class="nav-icon-btn" title="Wishlist">
            ♡
            <span class="badge-count">0</span>
          </a>

          <!-- Cart Button -->
          <a href="cart.php" class="nav-icon-btn" title="Cart">
            🛒
            <span class="badge-count"><?= function_exists('cart_count') ? cart_count() : 0 ?></span>
          </a>

          <?php if(function_exists('is_customer') && !is_customer()): ?>
            <a href="login.php" class="nav-btn-link">Login</a>
            <a href="admin_login.php" class="nav-btn-link nav-btn-admin">Admin</a>
          <?php else: ?>
            <a href="my_orders.php" class="nav-btn-link">My Orders</a>
            <a href="logout.php" class="nav-btn-link" style="background:#475569;">Logout</a>
          <?php endif; ?>

          <!-- Mobile Toggle Button -->
          <button class="mobile-toggle" id="mobileToggleBtn" aria-label="Open Navigation">
            ☰
          </button>
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
      <?php if(function_exists('is_customer') && !is_customer()): ?>
        <a href="login.php" style="color:var(--clr-sky);">Customer Login</a>
        <a href="admin_login.php" style="color:var(--clr-terracotta);">Admin Portal</a>
      <?php else: ?>
        <a href="my_orders.php">My Orders</a>
        <a href="logout.php">Logout</a>
      <?php endif; ?>
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

  <!-- Flash Messages -->
  <?php if(function_exists('get_flash') && $m=get_flash('success')): ?>
    <div class="flash success"><?= e($m) ?></div>
  <?php endif; ?>

  <?php if(function_exists('get_flash') && $m=get_flash('error')): ?>
    <div class="flash error"><?= e($m) ?></div>
  <?php endif; ?>

  <main>
