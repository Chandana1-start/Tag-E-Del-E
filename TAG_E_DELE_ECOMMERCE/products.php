<?php
require_once 'functions.php';

$category = trim($_GET['category'] ?? '');
$q = trim($_GET['q'] ?? '');

$page_title = ($category === '' && $q === '') ? 'STORE | ' . SHOP_NAME : ($category ? e($category) . ' Collection | ' . SHOP_NAME : 'Store Search | ' . SHOP_NAME);

include 'header.php';

if ($category === '' && $q === ''):
?>

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

<?php
else:

$sql = "SELECT * FROM products WHERE status = 1";
$types = '';
$params = [];

if ($category !== '') {
    $sql .= " AND category = ?";
    $types .= 's';
    $params[] = $category;
}

if ($q !== '') {
    $sql .= " AND (name LIKE ? OR category LIKE ? OR description LIKE ?)";
    $types .= 'sss';
    $kw = '%' . $q . '%';
    $params[] = $kw;
    $params[] = $kw;
    $params[] = $kw;
}

$sql .= " ORDER BY id DESC";

$stmt = $conn->prepare($sql);
if ($stmt) {
    if ($types !== '') {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $products = $stmt->get_result();
} else {
    $products = false;
}

$catBanners = [
    'Shirts' => [
        'tag' => 'SHIRTS COLLECTION',
        'title' => 'PRINTED & CASUAL SHIRTS',
        'desc' => 'Bold prints, modern fits, and premium casual cotton shirts engineered for everyday confidence.',
        'img' => 'herocards/summer_vibes.png'
    ],
    'T-Shirts' => [
        'tag' => 'T-SHIRTS COLLECTION',
        'title' => 'OVERSIZED & GRAPHIC TEES',
        'desc' => 'Relaxed street fits, premium heavyweight cotton, and iconic urban graphic T-shirts.',
        'img' => 'herocards/everyday_comfort.png'
    ],
    'Jeans' => [
        'tag' => 'DENIM COLLECTION',
        'title' => 'SLIM & STREET DENIM JEANS',
        'desc' => 'Contemporary washes, relaxed street cuts, and durable stretch denim engineered for maximum comfort.',
        'img' => 'herocards/denim_days.png'
    ],
    'Jackets' => [
        'tag' => 'OUTERWEAR COLLECTION',
        'title' => 'CASUAL & BOMBER JACKETS',
        'desc' => 'Statement layering pieces, bomber jackets, and casual outerwear to elevate any outfit.',
        'img' => 'herocards/urban_edge.png'
    ],
    'Trousers' => [
        'tag' => 'TROUSERS COLLECTION',
        'title' => 'CARGO & TAILORED TROUSERS',
        'desc' => 'Sleek tailored trousers, utility cargos, and relaxed bottomwear for modern menswear.',
        'img' => 'herocards/timeless_style.png'
    ]
];

$activeBanner = isset($catBanners[$category]) ? $catBanners[$category] : null;

function getProductFilterAttrsPHP($p) {
    $name = strtolower($p['name'] ?? '');
    $desc = strtolower($p['description'] ?? '');
    $cat = strtolower($p['category'] ?? '');
    $id = (int)($p['id'] ?? 1);

    $brand = !empty($p['brand']) ? $p['brand'] : null;
    if (!$brand) {
        if ($id % 5 === 0) $brand = 'TAG É DEL É';
        elseif ($id % 5 === 1) $brand = 'Urban Thread';
        elseif ($id % 5 === 2) $brand = 'Classic Fit';
        elseif ($id % 5 === 3) $brand = 'Street Line';
        else $brand = 'Premium Wear';
    }

    $color = !empty($p['color']) ? $p['color'] : null;
    if (!$color) {
        if (strpos($name, 'black') !== false || strpos($desc, 'black') !== false) $color = 'Black';
        elseif (strpos($name, 'white') !== false || strpos($desc, 'white') !== false) $color = 'White';
        elseif (strpos($name, 'blue') !== false || strpos($name, 'indigo') !== false || strpos($desc, 'blue') !== false) $color = 'Blue';
        elseif (strpos($name, 'red') !== false || strpos($desc, 'red') !== false) $color = 'Red';
        elseif (strpos($name, 'green') !== false || strpos($desc, 'green') !== false || strpos($desc, 'olive') !== false) $color = 'Green';
        elseif (strpos($name, 'khaki') !== false || strpos($name, 'beige') !== false || strpos($desc, 'khaki') !== false) $color = 'Beige';
        elseif (strpos($name, 'grey') !== false || strpos($name, 'gray') !== false || strpos($desc, 'grey') !== false) $color = 'Grey';
        elseif (strpos($name, 'brown') !== false || strpos($desc, 'brown') !== false) $color = 'Brown';
        elseif (strpos($name, 'purple') !== false || strpos($desc, 'purple') !== false) $color = 'Purple';
        else {
            $colors = ['Black', 'Blue', 'White', 'Beige', 'Grey', 'Green'];
            $color = $colors[$id % count($colors)];
        }
    }

    $fabric = !empty($p['fabric']) ? $p['fabric'] : null;
    if (!$fabric) {
        if (strpos($cat, 'jeans') !== false) {
            $fabric = strpos($desc, 'stretch') !== false ? 'Stretch Denim' : 'Denim';
        } elseif (strpos($cat, 'shirts') !== false) {
            if (strpos($name, 'linen') !== false || strpos($desc, 'linen') !== false) $fabric = 'Linen';
            elseif (strpos($desc, 'blend') !== false) $fabric = 'Cotton Blend';
            else $fabric = 'Cotton';
        } elseif (strpos($cat, 't-shirts') !== false) {
            $fabric = (strpos($desc, 'blend') !== false || strpos($desc, 'poly') !== false) ? 'Cotton Blend' : 'Cotton';
        } elseif (strpos($cat, 'jackets') !== false) {
            if (strpos($name, 'denim') !== false) $fabric = 'Denim';
            elseif (strpos($name, 'nylon') !== false) $fabric = 'Nylon';
            else $fabric = 'Polyester';
        } elseif (strpos($cat, 'trousers') !== false) {
            if (strpos($name, 'twill') !== false || strpos($desc, 'twill') !== false) $fabric = 'Twill';
            elseif (strpos($name, 'linen') !== false) $fabric = 'Linen';
            else $fabric = 'Cotton';
        } else {
            $fabric = 'Cotton';
        }
    }

    $pattern = !empty($p['pattern']) ? $p['pattern'] : null;
    if (!$pattern) {
        if (strpos($name, 'print') !== false || strpos($desc, 'print') !== false || strpos($desc, 'floral') !== false) $pattern = 'Printed';
        elseif (strpos($name, 'stripe') !== false || strpos($desc, 'stripe') !== false) $pattern = 'Striped';
        elseif (strpos($name, 'check') !== false || strpos($desc, 'check') !== false) $pattern = 'Checked';
        elseif (strpos($name, 'graphic') !== false || strpos($desc, 'graphic') !== false) $pattern = 'Graphic';
        elseif (strpos($desc, 'texture') !== false) $pattern = 'Textured';
        elseif (strpos($name, 'camo') !== false || strpos($desc, 'camo') !== false) $pattern = 'Camouflage';
        else $pattern = 'Solid';
    }

    $fit = !empty($p['fit']) ? $p['fit'] : null;
    if (!$fit) {
        if (strpos($name, 'slim') !== false || strpos($desc, 'slim') !== false) $fit = 'Slim Fit';
        elseif (strpos($name, 'oversize') !== false || strpos($desc, 'oversize') !== false || strpos($name, 'relaxed') !== false) $fit = 'Oversized';
        elseif (strpos($name, 'relaxed') !== false || strpos($desc, 'relaxed') !== false) $fit = 'Relaxed Fit';
        else $fit = 'Regular Fit';
    }

    return compact('brand', 'color', 'fabric', 'pattern', 'fit');
}
?>

<section class="section-padding">
  <div class="container">



    <!-- EDITORIAL CATEGORY BANNER (IF CATEGORY SELECTED) -->
    <?php if ($activeBanner): ?>
      <div style="position:relative; border-radius:var(--radius-lg); overflow:hidden; margin-bottom: 40px; background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border:1px solid var(--clr-border); padding: 50px 40px; display:grid; grid-template-columns:1fr 280px; gap:30px; align-items:center;">
        <div>
          <span class="eyebrow"><?= e($activeBanner['tag']) ?></span>
          <h1 style="font-family:var(--font-heading); font-size:2.8rem; color:var(--clr-text-main); margin:10px 0 14px; line-height:1.1;">
            <?= e($activeBanner['title']) ?>
          </h1>
          <p style="font-size:1.05rem; color:#475569; max-width:600px; line-height:1.6;">
            <?= e($activeBanner['desc']) ?>
          </p>
        </div>
        <div style="height: 180px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md);">
          <img src="<?= e($activeBanner['img']) ?>" alt="<?= e($category) ?>" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>
    <?php else: ?>
      <div class="section-head" style="margin-bottom: 30px;">
        <div>
          <span class="eyebrow">MEN'S CATALOGUE</span>
          <h1 class="section-title"><?= $q !== '' ? 'Search Results for "' . e($q) . '"' : 'Category Products' ?></h1>
          <p class="section-subtitle">Discover premium menswear essentials across all categories</p>
        </div>
      </div>
    <?php endif; ?>

    <!-- FILTER TABS & SEARCH BAR -->
    <div style="background:#FFFFFF; border-radius:var(--radius-lg); padding:20px 26px; border:1px solid var(--clr-border); box-shadow:var(--shadow-sm); margin-bottom: 30px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:20px;">
      
      <!-- CATEGORY PILL TABS -->
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <a href="products.php" class="size-pill-btn <?= $category === '' ? 'active' : '' ?>" style="border-radius:var(--radius-pill); padding:0 20px; height:38px; display:inline-flex; align-items:center;">
          STORE LANDING
        </a>
        <?php foreach (['Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Trousers'] as $c): ?>
          <a href="products.php?category=<?= urlencode($c) ?><?= $q !== '' ? '&q=' . urlencode($q) : '' ?>" class="size-pill-btn <?= strcasecmp($category, $c) === 0 ? 'active' : '' ?>" style="border-radius:var(--radius-pill); padding:0 20px; height:38px; display:inline-flex; align-items:center;">
            <?= e($c) ?>
          </a>
        <?php endforeach; ?>
      </div>

      <!-- SEARCH FORM -->
      <form method="get" action="products.php" style="display:flex; gap:10px; align-items:center; flex:1; max-width:360px;">
        <?php if ($category !== ''): ?>
          <input type="hidden" name="category" value="<?= e($category) ?>">
        <?php endif; ?>
        <input
          type="text"
          name="q"
          value="<?= e($q) ?>"
          placeholder="Search products..."
          style="flex:1; padding:10px 16px; border-radius:var(--radius-pill); border:1px solid var(--clr-border); background:var(--clr-bg); font-size:0.9rem;"
        >
        <button class="btn-primary" type="submit" style="padding:10px 20px; font-size:0.85rem; border-radius:var(--radius-pill);">
          Search
        </button>
        <?php if ($category !== '' || $q !== ''): ?>
          <a href="products.php" class="btn-secondary" style="padding:10px 16px; font-size:0.85rem; border-radius:var(--radius-pill);">Clear</a>
        <?php endif; ?>
      </form>

    </div>

    <!-- CATEGORY PAGE WRAPPER WITH SIDEBAR & GRID -->
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
            <?php if ($products && $products->num_rows > 0): ?>
              <?php while ($p = $products->fetch_assoc()): ?>
                <?php
                $stock = (int)$p['stock'];
                $isOutOfStock = ($stock <= 0);
                $catLower = strtolower(trim($p['category']));
                $hasSizes = in_array($catLower, ['shirts', 't-shirts', 'jeans', 'trousers', 'jackets'], true) || !empty($p['sizes']);

                $availSizes = [];
                if (!empty($p['sizes'])) {
                    $availSizes = array_filter(array_map('trim', explode(',', $p['sizes'])));
                }
                if (empty($availSizes) && $hasSizes) {
                    $availSizes = in_array($catLower, ['jeans', 'trousers'], true)
                        ? ['30', '32', '34', '36', '38']
                        : ['S', 'M', 'L', 'XL', 'XXL'];
                }

                $meta = getProductFilterAttrsPHP($p);
                $sizesStr = implode(',', $availSizes);
                ?>
                <article
                  class="product-card"
                  data-id="<?= (int)$p['id'] ?>"
                  data-name="<?= e($p['name']) ?>"
                  data-category="<?= e($p['category']) ?>"
                  data-price="<?= (float)$p['price'] ?>"
                  data-brand="<?= e($meta['brand']) ?>"
                  data-color="<?= e($meta['color']) ?>"
                  data-fabric="<?= e($meta['fabric']) ?>"
                  data-pattern="<?= e($meta['pattern']) ?>"
                  data-fit="<?= e($meta['fit']) ?>"
                  data-sizes="<?= e($sizesStr) ?>"
                >
                  <?php if (!empty($p['new_arrival'])): ?>
                    <span class="badge-tag new">NEW</span>
                  <?php endif; ?>

                  <button class="wishlist-btn" title="Add to Wishlist">♡</button>

                  <a href="product.php?id=<?= (int)$p['id'] ?>">
                    <div class="product-image-wrapper">
                      <img class="product-img" src="<?= e(product_image($p['image'])) ?>" alt="<?= e($p['name']) ?>">
                      <div class="quick-view-overlay"><span class="btn-quickview">Quick View</span></div>
                    </div>
                  </a>

                  <div class="product-info">
                    <span class="product-cat"><?= e($p['category']) ?></span>
                    <h3 class="product-name">
                      <a href="product.php?id=<?= (int)$p['id'] ?>"><?= e($p['name']) ?></a>
                    </h3>

                    <div class="product-price-row">
                      <span class="price-current"><?= money($p['price']) ?></span>
                      <?php if (!empty($p['old_price']) && $p['old_price'] > 0): ?>
                        <span class="price-old"><?= money($p['old_price']) ?></span>
                      <?php endif; ?>
                    </div>

                    <!-- SIZE SELECTION -->
                    <?php if ($hasSizes): ?>
                      <div class="product-size-box">
                        <label class="product-size-label" for="size-<?= (int)$p['id'] ?>">SIZE</label>
                        <select
                          class="product-size-select"
                          id="size-<?= (int)$p['id'] ?>"
                          name="size"
                          form="cart-form-<?= (int)$p['id'] ?>"
                          required
                          <?= $isOutOfStock ? 'disabled' : '' ?>
                        >
                          <option value="">Select Size</option>
                          <?php foreach ($availSizes as $sz): ?>
                            <option value="<?= e($sz) ?>"><?= e($sz) ?></option>
                          <?php endforeach; ?>
                        </select>
                      </div>
                    <?php endif; ?>

                    <!-- BUTTONS -->
                    <div class="product-actions">
                      <?php if ($isOutOfStock): ?>
                        <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
                      <?php else: ?>
                        <form method="post" action="cart.php" id="cart-form-<?= (int)$p['id'] ?>" style="width:100%;">
                          <input type="hidden" name="action" value="add">
                          <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">
                          <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                        </form>
                      <?php endif; ?>
                    </div>
                  </div>
                </article>
              <?php endwhile; ?>
            <?php else: ?>
              <div class="empty-cart-card" style="grid-column: 1 / -1; margin:0;">
                <div style="font-size:3.5rem; margin-bottom:12px;">🔍</div>
                <h2>NO PRODUCTS FOUND</h2>
                <p class="section-subtitle">We couldn't find any products matching your selected criteria.</p>
                <br>
                <a class="btn-primary" href="products.php">BACK TO STORE</a>
              </div>
            <?php endif; ?>
          </div>
        </main>

      </div>
    </div>

  </div>
</section>


<?php
endif;
include 'footer.php';
?>

