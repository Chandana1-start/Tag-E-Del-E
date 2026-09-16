<?php
require_once 'functions.php';

/* =========================================================
   CART ACTIONS
========================================================= */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    /* --- ADD PRODUCT --- */
    if ($action === 'add') {
        $id = (int)($_POST['product_id'] ?? 0);
        $qty = (int)($_POST['qty'] ?? 1);
        $size = trim($_POST['size'] ?? '');

        if ($qty < 1) $qty = 1;

        if ($id <= 0) {
            set_flash('Invalid product.', 'error');
            redirect('cart.php');
        }

        $stmt = $conn->prepare("SELECT id, name, category, stock, status FROM products WHERE id = ? LIMIT 1");
        if ($stmt) {
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result ? $result->fetch_assoc() : null;
            $stmt->close();
        } else {
            $product = null;
        }

        if (!$product) {
            set_flash('Product not found.', 'error');
        } elseif ((int)$product['status'] !== 1) {
            set_flash('Product is no longer available.', 'error');
        } elseif ((int)$product['stock'] <= 0) {
            set_flash('Sorry, this product is out of stock.', 'error');
        } else {
            $category = strtolower(trim($product['category']));
            $hasSizes = in_array($category, ['shirts', 't-shirts', 'jeans', 'trousers', 'jackets'], true);

            if ($hasSizes && $size === '') {
                set_flash('Please select a size before adding to cart.', 'error');
                redirect(isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'cart.php');
            }

            add_to_cart($id, $qty, $size);
            set_flash($product['name'] . ($size ? ' (Size ' . $size . ')' : '') . ' added to cart.', 'success');
        }
        redirect('cart.php');
    }

    /* --- UPDATE CART --- */
    if ($action === 'update') {
        $quantities = $_POST['qtys'] ?? [];
        if (is_array($quantities)) {
            foreach ($quantities as $cart_key => $quantity) {
                $quantity = (int)$quantity;
                $parts = explode(':', (string)$cart_key, 2);
                $pid = (int)$parts[0];

                if ($pid <= 0) continue;

                if ($quantity <= 0) {
                    unset($_SESSION['cart'][$cart_key]);
                    continue;
                }

                $stmt = $conn->prepare("SELECT stock, status FROM products WHERE id = ? LIMIT 1");
                if ($stmt) {
                    $stmt->bind_param("i", $pid);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $product = $result ? $result->fetch_assoc() : null;
                    $stmt->close();
                } else {
                    $product = null;
                }

                if (!$product || (int)$product['status'] !== 1 || (int)$product['stock'] <= 0) {
                    unset($_SESSION['cart'][$cart_key]);
                    continue;
                }

                $stock = (int)$product['stock'];
                if ($quantity > $stock) $quantity = $stock;

                $_SESSION['cart'][$cart_key] = $quantity;
            }
        }
        set_flash('Cart updated successfully.', 'success');
        redirect('cart.php');
    }

    /* --- REMOVE PRODUCT --- */
    if ($action === 'remove') {
        $cart_key = $_POST['cart_key'] ?? '';
        if ($cart_key === '') {
            $cart_key = (string)($_POST['product_id'] ?? '');
        }

        if ($cart_key !== '') {
            unset($_SESSION['cart'][$cart_key]);
        }

        set_flash('Product removed from your cart.', 'success');
        redirect('cart.php');
    }

    /* --- CLEAR CART --- */
    if ($action === 'clear') {
        $_SESSION['cart'] = [];
        set_flash('Your cart has been cleared.', 'success');
        redirect('cart.php');
    }
}

/* =========================================================
   PAGE DATA
========================================================= */

$page_title = 'Shopping Bag | ' . SHOP_NAME;
$items = cart_items();
$total = cart_total();

include 'header.php';
?>

<section class="section-padding" style="padding-bottom: 80px;">
  <div class="container">

    <div class="section-head" style="margin-bottom: 30px;">
      <div>
        <span class="eyebrow">YOUR SHOPPING BAG</span>
        <h2 class="section-title">Shopping Cart</h2>
        <p class="section-subtitle">Review your selected items before proceeding to checkout</p>
      </div>
      <a class="btn-secondary" href="products.php">← Continue Shopping</a>
    </div>

    <?php if (empty($items)): ?>

      <div class="empty-cart-card">
        <div style="font-size: 4rem; margin-bottom: 15px;">🛍️</div>
        <h2>YOUR CART IS EMPTY</h2>
        <p class="section-subtitle" style="margin-bottom: 30px;">Looks like you haven't added any men's fashion essentials to your bag yet.</p>
        <a class="btn-primary" href="products.php" style="display: inline-block;">START SHOPPING →</a>
      </div>

    <?php else: ?>

      <div class="cart-layout">

        <!-- CART ITEMS LIST -->
        <div class="cart-table-card">
          <?php foreach ($items as $item): ?>
            <article class="cart-item-row">
              
              <div class="cart-item-img">
                <img src="<?= e(product_image($item['image'])) ?>" alt="<?= e($item['name']) ?>">
              </div>

              <div>
                <span class="badge-tag" style="font-size: 0.75rem; padding: 2px 8px;"><?= e($item['category']) ?></span>
                <h3 style="font-family: var(--font-heading); font-size: 1.15rem; margin: 6px 0 4px; color: var(--clr-text-main);">
                  <a href="product.php?id=<?= (int)$item['id'] ?>" style="color:inherit;"><?= e($item['name']) ?></a>
                </h3>
                
                <?php if (!empty($item['size'])): ?>
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--clr-terracotta);">
                    SIZE: <?= e($item['size']) ?>
                  </span>
                <?php endif; ?>
                
                <div style="font-size: 0.8rem; color: #16A34A; margin-top: 4px; font-weight: 600;">
                  ✓ In Stock (<?= (int)$item['stock'] ?> available)
                </div>
              </div>

              <!-- QUANTITY FORM -->
              <form method="post" action="cart.php" style="display:flex; align-items:center;">
                <input type="hidden" name="action" value="update">
                <div class="qty-picker" style="margin-bottom:0;">
                  <button type="submit" class="qty-btn" onclick="this.form.querySelector('input[type=number]').stepDown()">−</button>
                  <input
                    class="qty-input-field"
                    type="number"
                    name="qtys[<?= e($item['cart_key'] ?? $item['id']) ?>]"
                    min="1"
                    max="<?= (int)$item['stock'] ?>"
                    value="<?= (int)$item['quantity'] ?>"
                    onchange="this.form.submit()"
                  >
                  <button type="submit" class="qty-btn" onclick="this.form.querySelector('input[type=number]').stepUp()">+</button>
                </div>
              </form>

              <!-- LINE TOTAL -->
              <div style="font-family: var(--font-accent); font-weight: 900; font-size: 1.1rem; color: var(--clr-text-main); text-align: right;">
                <?= money($item['subtotal']) ?>
              </div>

              <!-- REMOVE BUTTON -->
              <form method="post" action="cart.php" style="text-align: right;">
                <input type="hidden" name="action" value="remove">
                <input type="hidden" name="cart_key" value="<?= e($item['cart_key'] ?? $item['id']) ?>">
                <button type="submit" title="Remove item" style="background:none; border:none; color:#EF4444; font-size:1.2rem; cursor:pointer; padding:4px 8px;">
                  ✕
                </button>
              </form>

            </article>
          <?php endforeach; ?>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--clr-border);">
            <form method="post" action="cart.php">
              <input type="hidden" name="action" value="clear">
              <button type="submit" class="btn-secondary" style="font-size:0.85rem; padding:10px 18px;">
                Clear Cart
              </button>
            </form>
            <a href="products.php" class="btn-secondary" style="font-size:0.85rem; padding:10px 18px;">
              + Add More Products
            </a>
          </div>
        </div>

        <!-- ORDER SUMMARY -->
        <aside class="cart-summary-box">
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 20px; color: var(--clr-text-main);">
            Order Summary
          </h3>

          <div class="summary-row">
            <span>Subtotal (<?= cart_count() ?> items)</span>
            <strong><?= money($total) ?></strong>
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
            <span style="color:var(--clr-terracotta);"><?= money($total) ?></span>
          </div>

          <a href="checkout.php" class="btn-checkout">
            PROCEED TO CHECKOUT →
          </a>

          <div style="margin-top: 20px; padding: 14px; background: #F8FAFC; border-radius: var(--radius-sm); text-align: center; font-size: 0.8rem; color: #64748B;">
            🔒 <strong>100% Secure Checkout</strong><br>
            Supports UPI, Cards, Netbanking & Cash on Delivery
          </div>
        </aside>

      </div>

    <?php endif; ?>

  </div>
</section>

<?php include 'footer.php'; ?>