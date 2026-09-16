<?php
require_once 'functions.php';

$page_title = (defined('SHOP_NAME') ? SHOP_NAME : 'TAG É DEL É') . " | Premium Men's Fashion";

function fetch_mixed_products($conn, $is_new_arrival = false, $limit = 8) {
    $where = "status = 1" . ($is_new_arrival ? " AND new_arrival = 1" : "");
    $res = $conn->query("SELECT * FROM products WHERE $where ORDER BY id DESC");
    $all = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $all[] = $row;
        }
    }
    $shirts = array_values(array_filter($all, fn($p) => strtolower(trim($p['category'])) === 'shirts'));
    $tshirts = array_values(array_filter($all, fn($p) => strtolower(trim($p['category'])) === 't-shirts'));
    $jeans = array_values(array_filter($all, fn($p) => strtolower(trim($p['category'])) === 'jeans'));
    $others = array_values(array_filter($all, fn($p) => !in_array(strtolower(trim($p['category'])), ['shirts', 't-shirts', 'jeans'])));

    $mixed = [];
    $maxLen = max(count($shirts), count($tshirts), count($jeans), count($others), 1);
    for ($i = 0; $i < $maxLen; $i++) {
        if (isset($shirts[$i])) $mixed[] = $shirts[$i];
        if (isset($tshirts[$i])) $mixed[] = $tshirts[$i];
        if (isset($jeans[$i])) $mixed[] = $jeans[$i];
        if (isset($others[$i])) $mixed[] = $others[$i];
    }
    return array_slice(count($mixed) > 0 ? $mixed : $all, 0, $limit);
}

$products = fetch_mixed_products($conn, false, 8);
$newArrivals = fetch_mixed_products($conn, true, 8);

include 'header.php';
?>

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
      <?php if (!empty($products)): ?>
        <?php foreach($products as $p): ?>
          <?php
            $stock = (int)$p['stock'];
            $isOutOfStock = ($stock <= 0);
            $catLower = strtolower(trim($p['category']));
            $availSizes = !empty($p['sizes']) ? explode(',', $p['sizes']) : (in_array($catLower, ['jeans', 'trousers']) ? ['30','32','34','36','38'] : ['S','M','L','XL','XXL']);
          ?>
          <article class="product-card trending-item" data-category="<?= e($catLower) ?>">
            <button class="wishlist-btn" title="Add to Wishlist">♡</button>

            <!-- CLICKABLE PRODUCT IMAGE -->
            <a href="product.php?id=<?= (int)$p['id'] ?>">
              <div class="product-image-wrapper">
                <img class="product-img" src="<?= e($p['image']) ?>" alt="<?= e($p['name']) ?>">
              </div>
            </a>

            <div class="product-info">
              <span class="product-cat"><?= e($p['category']) ?></span>
              <h3 class="product-name">
                <a href="product.php?id=<?= (int)$p['id'] ?>"><?= e($p['name']) ?></a>
              </h3>
              
              <div class="product-price-row">
                <span class="price-current"><?= money($p['price']) ?></span>
                <?php if($p['old_price']): ?>
                  <span class="price-old"><?= money($p['old_price']) ?></span>
                <?php endif; ?>
              </div>

              <!-- Size Selector -->
              <div class="product-size-box">
                <label class="product-size-label" for="size-trend-<?= (int)$p['id'] ?>">SIZE</label>
                <select class="product-size-select" id="size-trend-<?= (int)$p['id'] ?>" name="size" form="cart-form-trend-<?= (int)$p['id'] ?>" required <?= $isOutOfStock ? 'disabled' : '' ?>>
                  <option value="">Select Size</option>
                  <?php foreach($availSizes as $sz): $sz = trim($sz); if(!$sz) continue; ?>
                    <option value="<?= e($sz) ?>"><?= e($sz) ?></option>
                  <?php endforeach; ?>
                </select>
              </div>

              <div class="product-actions">
                <?php if($isOutOfStock): ?>
                  <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
                <?php else: ?>
                  <form method="post" action="cart.php" id="cart-form-trend-<?= (int)$p['id'] ?>" style="width:100%;">
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">
                    <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                  </form>
                <?php endif; ?>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
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

<!-- =========================================================
     6. NEW ARRIVALS SECTION (CLICKABLE PRODUCT CARDS)
========================================================= -->
<section class="section-padding" id="new-arrivals" style="background:var(--clr-surface-light);">
  <div class="container">
    <div class="section-head text-center" style="text-align:center; justify-content:center; flex-direction:column; align-items:center; margin-bottom:44px;">
      <span class="eyebrow">FRESH DROPS</span>
      <h2 class="section-title">New Arrivals</h2>
      <p class="section-subtitle" style="margin:8px auto 0; text-align:center;">The latest printed shirts, streetwear tees and statement menswear</p>
    </div>

    <div class="products-grid">
      <?php if (!empty($newArrivals)): ?>
        <?php foreach($newArrivals as $p): ?>
          <?php
            $stock = (int)$p['stock'];
            $isOutOfStock = ($stock <= 0);
            $catLower = strtolower(trim($p['category']));
            $availSizes = !empty($p['sizes']) ? explode(',', $p['sizes']) : (in_array($catLower, ['jeans', 'trousers']) ? ['30','32','34','36','38'] : ['S','M','L','XL','XXL']);
          ?>
          <article class="product-card">
            <span class="badge-tag new">NEW</span>
            <button class="wishlist-btn" title="Add to Wishlist">♡</button>

            <!-- CLICKABLE PRODUCT IMAGE -->
            <a href="product.php?id=<?= (int)$p['id'] ?>">
              <div class="product-image-wrapper">
                <img class="product-img" src="<?= e($p['image']) ?>" alt="<?= e($p['name']) ?>">
              </div>
            </a>

            <div class="product-info">
              <span class="product-cat"><?= e($p['category']) ?></span>
              <h3 class="product-name">
                <a href="product.php?id=<?= (int)$p['id'] ?>"><?= e($p['name']) ?></a>
              </h3>
              
              <div class="product-price-row">
                <span class="price-current"><?= money($p['price']) ?></span>
                <?php if($p['old_price']): ?>
                  <span class="price-old"><?= money($p['old_price']) ?></span>
                <?php endif; ?>
              </div>

              <!-- Size Selector -->
              <div class="product-size-box">
                <label class="product-size-label" for="size-new-<?= (int)$p['id'] ?>">SIZE</label>
                <select class="product-size-select" id="size-new-<?= (int)$p['id'] ?>" name="size" form="cart-form-new-<?= (int)$p['id'] ?>" required <?= $isOutOfStock ? 'disabled' : '' ?>>
                  <option value="">Select Size</option>
                  <?php foreach($availSizes as $sz): $sz = trim($sz); if(!$sz) continue; ?>
                    <option value="<?= e($sz) ?>"><?= e($sz) ?></option>
                  <?php endforeach; ?>
                </select>
              </div>

              <div class="product-actions">
                <?php if($isOutOfStock): ?>
                  <button class="btn-add-cart disabled" type="button" disabled>OUT OF STOCK</button>
                <?php else: ?>
                  <form method="post" action="cart.php" id="cart-form-new-<?= (int)$p['id'] ?>" style="width:100%;">
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">
                    <button class="btn-add-cart" type="submit">🛒 ADD TO CART</button>
                  </form>
                <?php endif; ?>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>
</section>


<!-- =========================================================
     4. EDITORIAL CAMPAIGN
========================================================= -->
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


<!-- =========================================================
     5. LIMITED TIME DROPS
========================================================= -->
<section class="limited-drops-section">
  <div class="container">
    <div class="limited-drops-box">
      <span class="td-eyebrow gold">LIMITED TIME DROPS</span>
      <h2 class="limited-drops-title">NEW SEASON. NEW ATTITUDE.</h2>
      <a href="products.php" class="td-btn-burgundy">SHOP SALE — UP TO 40% OFF <span class="btn-arrow">→</span></a>
    </div>
  </div>
</section>


<!-- =========================================================
     6. EXCLUSIVELY MENSWEAR
========================================================= -->
<section class="exclusively-menswear-section">
  <div class="container">
    <div class="exclusively-menswear-box">
      <span class="td-eyebrow">EXCLUSIVELY MENSWEAR</span>
      <h2 class="exclusively-menswear-title">YOUR STYLE. YOUR RULES.</h2>
      <a href="products.php" class="td-btn-primary">EXPLORE TAG É DEL É <span class="btn-arrow">→</span></a>
    </div>
  </div>
</section>


<!-- =========================================================
     7. OUR PHILOSOPHY
========================================================= -->
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


<!-- =========================================================
     8. PHILOSOPHY FEATURES
========================================================= -->
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


<!-- =========================================================
     9. REAL FEEDBACK
========================================================= -->
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


<!-- =========================================================
     10. JOIN THE CLUB
========================================================= -->
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

<?php include 'footer.php'; ?>