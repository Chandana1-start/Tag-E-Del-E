<?php
require_once 'functions.php';

$page_title = "The Store | " . SHOP_NAME;

// Fetch curated store highlights
$curated = $conn->query("
    SELECT *
    FROM products
    WHERE status = 1 AND (featured = 1 OR new_arrival = 1)
    ORDER BY id DESC
    LIMIT 4
");

if (!$curated || $curated->num_rows < 4) {
    $curated = $conn->query("
        SELECT *
        FROM products
        WHERE status = 1
        ORDER BY id DESC
        LIMIT 4
    ");
}

include 'header.php';
?>

<!-- =====================================================
     STORE HERO SECTION
===================================================== -->
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

<!-- =====================================================
     BOUTIQUE AMBIANCE & HERITAGE
===================================================== -->
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

<!-- =====================================================
     VISUAL CATEGORY SHOWCASE
===================================================== -->
<section class="section" id="collections" style="background:#faf8f6; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding-top:60px; padding-bottom:60px;">
    <div class="section-head reveal">
        <div>
            <p class="eyebrow" style="color:var(--red);">EXPLORE OUR WARDROBE</p>
            <h2>The Five Pillars of Style</h2>
        </div>
        <a href="products.php" class="btn small light">View Full 95+ Clothing Catalog &rarr;</a>
    </div>

    <div class="store-cat-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <!-- Shirts -->
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

        <!-- T-Shirts -->
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

        <!-- Jeans -->
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

        <!-- Trousers -->
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

        <!-- Jackets -->
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

<!-- =====================================================
     CURATED IN-STORE HIGHLIGHTS
===================================================== -->
<section class="section">
    <div class="section-head reveal">
        <div>
            <p class="eyebrow" style="color:var(--red);">FLAGSHIP FAVORITES</p>
            <h2>Curated In-Store Highlights</h2>
        </div>
        <a href="products.php" class="btn small light">Explore All Products &rarr;</a>
    </div>

    <div class="products-grid">
        <?php
        $staggerIndex = 1;
        while ($p = $curated->fetch_assoc()):
            $stock = (int)($p['stock'] ?? 10);
            $isOutOfStock = ($stock <= 0);
            $category = strtolower(trim($p['category'] ?? ''));
            $isJeansOrTrousers = in_array($category, ['jeans', 'trousers']);
            $hasSizes = true;
            $imgSrc = !empty($p['image']) ? $p['image'] : 'shop_logo.png';
            $staggerClass = 'stagger-' . ($staggerIndex <= 4 ? $staggerIndex : 4);
            $staggerIndex++;
        ?>
            <article class="product-card reveal <?= $staggerClass ?>">
                <!-- HIDDEN FORM FOR CART -->
                <form
                    id="cart-form-<?= (int)$p['id'] ?>"
                    action="cart.php"
                    method="post"
                    style="display:none;"
                >
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">
                    <input type="hidden" name="qty" value="1">
                </form>

                <div class="product-image-wrapper">
                    <?php if(!empty($p['new_arrival'])): ?>
                        <span class="new-tag">NEW</span>
                    <?php endif; ?>

                    <?php if($isOutOfStock): ?>
                        <span class="out-stock-overlay">OUT OF STOCK</span>
                    <?php elseif($stock <= 5): ?>
                        <span class="low-stock-overlay">LOW STOCK</span>
                    <?php endif; ?>

                    <img
                        class="product-img"
                        src="<?= e($imgSrc) ?>"
                        alt="<?= e($p['name']) ?>"
                        loading="lazy"
                    >
                </div>

                <div class="product-info">
                    <span class="badge"><?= e($p['category']) ?></span>

                    <h3><?= e($p['name']) ?></h3>

                    <span class="price"><?= money($p['price']) ?></span>

                    <?php if(!empty($p['old_price']) && $p['old_price'] > $p['price']): ?>
                        <span class="old-price"><?= money($p['old_price']) ?></span>
                    <?php endif; ?>

                    <!-- SIZES -->
                    <?php if($hasSizes): ?>
                        <div class="product-size-box">
                            <label class="product-size-label" for="size-<?= (int)$p['id'] ?>">SELECT SIZE</label>
                            <select
                                class="product-size-select"
                                id="size-<?= (int)$p['id'] ?>"
                                name="size"
                                form="cart-form-<?= (int)$p['id'] ?>"
                                required
                                <?= $isOutOfStock ? 'disabled' : '' ?>
                            >
                                <option value="">Select Size</option>
                                <?php
                                $availSizes = !empty($p['sizes']) ? explode(',', $p['sizes']) : ($isJeansOrTrousers ? ['30','32','34','36','38'] : ['S','M','L','XL','XXL']);
                                foreach($availSizes as $sz): $sz = trim($sz); if(!$sz) continue;
                                ?>
                                    <option value="<?= e($sz) ?>"><?= e($sz) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    <?php endif; ?>

                    <!-- STOCK BADGE -->
                    <?php if($isOutOfStock): ?>
                        <span class="stock-badge out">✕ Out of Stock</span>
                    <?php elseif($stock <= 5): ?>
                        <span class="stock-badge low">⚠ Only <?= $stock ?> left</span>
                    <?php else: ?>
                        <span class="stock-badge in">✓ In Stock</span>
                    <?php endif; ?>

                    <!-- BUTTONS -->
                    <div class="product-actions">
                        <a class="btn small ghost" href="product.php?id=<?= (int)$p['id'] ?>">View</a>

                        <?php if($isOutOfStock): ?>
                            <button class="btn small out-cart-btn" type="button" disabled>Out of Stock</button>
                        <?php else: ?>
                            <button class="btn small" type="submit" form="cart-form-<?= (int)$p['id'] ?>">Add to Cart</button>
                        <?php endif; ?>
                    </div>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</section>

<!-- =====================================================
     VISIT OUR STORE & LOCATION
===================================================== -->
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
                            <p class="muted"><?= e(SHOP_NAME) ?> Flagship Boutique, Fashion Boulevard, Main Market</p>
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
                            <p class="muted">Call / WhatsApp: <?= e(SHOP_PHONE) ?><br>Instant UPI: <?= e(UPI_ID) ?></p>
                        </div>
                    </div>
                </div>

                <div class="store-visit-actions">
                    <a href="tel:<?= e(SHOP_PHONE) ?>" class="btn">Call Boutique Now</a>
                    <a href="products.php" class="btn light">Shop Full Online Collection</a>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include 'footer.php'; ?>
