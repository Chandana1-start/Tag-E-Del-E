<?php
require_once 'functions.php';

$id = (int)($_GET['id'] ?? 0);

$stmt = $conn->prepare('SELECT * FROM products WHERE id = ? AND status = 1 LIMIT 1');
if ($stmt) {
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $p = $stmt->get_result()->fetch_assoc();
    $stmt->close();
} else {
    $p = null;
}

if (!$p) {
    flash('error', 'Product not found.');
    redirect('products.php');
}

$page_title = $p['name'] . ' | ' . SHOP_NAME;

$stock = (int)$p['stock'];
$isOutOfStock = ($stock <= 0);
$catLower = strtolower(trim($p['category']));
$hasSizes = in_array($catLower, ['shirts', 't-shirts', 'jeans', 'trousers', 'jackets', 'apparel'], true) || !empty($p['sizes']);

$availSizes = [];
if (!empty($p['sizes'])) {
    $availSizes = array_filter(array_map('trim', explode(',', $p['sizes'])));
}
if (empty($availSizes) && $hasSizes) {
    $availSizes = in_array($catLower, ['jeans', 'trousers'], true)
        ? ['30', '32', '34', '36', '38']
        : ['S', 'M', 'L', 'XL', 'XXL'];
}

// Generate thumbnail gallery candidates based on category
$galleryImages = [product_image($p['image'])];
$catFolderMap = [
    'shirts' => 'Shirts/shirt_',
    't-shirts' => 'T-Shirts/tshirt_',
    'jeans' => 'Jeans/jeans_',
    'jackets' => 'Jackets/jacket_',
    'trousers' => 'Trousers/trouser_'
];
if (isset($catFolderMap[$catLower])) {
    $prefix = $catFolderMap[$catLower];
    for ($i = 1; $i <= 4; $i++) {
        $candidate = $prefix . $i . '.png';
        if ($candidate !== $p['image'] && file_exists(__DIR__ . '/' . $candidate)) {
            $galleryImages[] = $candidate;
        }
    }
}
$galleryImages = array_unique(array_slice($galleryImages, 0, 4));

include 'header.php';
?>

<section class="section-padding">
  <div class="container">



    <!-- PRODUCT DETAIL LAYOUT -->
    <div class="product-detail-layout">

      <!-- LEFT COLUMN: IMAGE GALLERY -->
      <div class="gallery-container">
        <div class="main-gallery-view">
          <img id="mainDetailImage" src="<?= e($galleryImages[0]) ?>" alt="<?= e($p['name']) ?>">
        </div>

        <?php if (count($galleryImages) > 1): ?>
          <div class="gallery-thumbs">
            <?php foreach ($galleryImages as $idx => $gImg): ?>
              <div class="thumb-item <?= $idx === 0 ? 'active' : '' ?>" onclick="switchProductGalleryImage('<?= e($gImg) ?>', this)">
                <img src="<?= e($gImg) ?>" alt="<?= e($p['name']) ?> view <?= $idx + 1 ?>">
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>

      <!-- RIGHT COLUMN: PRODUCT INFORMATION -->
      <div class="product-detail-info">
        <span class="badge-tag" style="align-self: flex-start; margin-bottom: 12px;"><?= e($p['category']) ?></span>

        <h1 class="product-detail-title"><?= e($p['name']) ?></h1>

        <div class="product-detail-price">
          <span class="price-current" style="font-size: 2.2rem; font-weight: 900; color: var(--clr-terracotta);">
            <?= money($p['price']) ?>
          </span>
          <?php if (!empty($p['old_price']) && $p['old_price'] > 0): ?>
            <span class="price-old" style="font-size: 1.3rem;">
              <?= money($p['old_price']) ?>
            </span>
            <span class="badge-tag new" style="background:#FEF08A; color:#854D0E; font-size:0.75rem; padding:4px 10px;">
              SAVE <?= round((($p['old_price'] - $p['price']) / $p['old_price']) * 100) ?>%
            </span>
          <?php endif; ?>
        </div>

        <div>
          <?php if ($isOutOfStock): ?>
            <span class="stock-pill out">✕ OUT OF STOCK</span>
          <?php elseif ($stock <= 5): ?>
            <span class="stock-pill" style="background:#FFEDD5; color:#C2410C;">⚠ ONLY <?= $stock ?> LEFT IN STOCK</span>
          <?php else: ?>
            <span class="stock-pill in">✓ IN STOCK · <?= $stock ?> AVAILABLE</span>
          <?php endif; ?>
        </div>

        <p class="section-subtitle" style="margin: 18px 0 24px; font-size: 1rem; line-height: 1.7; color: #475569;">
          <?= nl2br(e($p['description'])) ?>
        </p>

        <?php if ($isOutOfStock): ?>
          <button class="btn-primary" type="button" disabled style="opacity: 0.6; cursor: not-allowed; width: 100%;">
            OUT OF STOCK
          </button>
        <?php else: ?>
          <form method="post" action="cart.php" id="productAddToCartForm">
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="product_id" value="<?= (int)$p['id'] ?>">

            <!-- SIZE SELECTOR -->
            <?php if ($hasSizes): ?>
              <div class="size-selector-group">
                <label class="product-size-label" style="display:flex; justify-content:space-between; align-items:center;">
                  <span>SELECT SIZE</span>
                  <a href="#size-guide" style="font-size:0.78rem; color:var(--clr-terracotta); text-decoration:underline;">Size Guide</a>
                </label>
                <div class="size-pills" id="sizePillsGroup">
                  <?php foreach ($availSizes as $idx => $sz): ?>
                    <button
                      type="button"
                      class="size-pill-btn <?= $idx === 0 ? 'active' : '' ?>"
                      data-size="<?= e($sz) ?>"
                      onclick="selectProductSize('<?= e($sz) ?>', this)"
                    >
                      <?= e($sz) ?>
                    </button>
                  <?php endforeach; ?>
                </div>
                <input type="hidden" name="size" id="selectedSizeInput" value="<?= e($availSizes[0] ?? '') ?>" required>
              </div>
            <?php endif; ?>

            <!-- QUANTITY PICKER -->
            <div style="margin-bottom: 28px;">
              <label class="product-size-label">QUANTITY</label>
              <div class="qty-picker">
                <button type="button" class="qty-btn" onclick="adjustProductQty(-1, <?= $stock ?>)">−</button>
                <input class="qty-input-field" type="number" id="productQtyInput" name="qty" min="1" max="<?= max(1, $stock) ?>" value="1" readonly>
                <button type="button" class="qty-btn" onclick="adjustProductQty(1, <?= $stock ?>)">+</button>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="product-action-btns">
              <button class="btn-primary" type="submit" style="flex:1;">
                🛒 ADD TO CART
              </button>
              <button class="btn-buy-now" type="submit" onclick="document.getElementById('productAddToCartForm').action='checkout.php'">
                ⚡ BUY NOW
              </button>
              <button class="wishlist-btn" type="button" title="Add to Wishlist" style="position:static; width:52px; height:52px; font-size:1.4rem;">
                ♡
              </button>
            </div>
          </form>
        <?php endif; ?>

        <!-- PRODUCT HIGHLIGHTS & SHIPPING POLICY -->
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

<?php include 'footer.php'; ?>
