<?php
require_once 'functions.php';
require_customer();

$items = cart_items($conn);
if (!$items) {
    flash('error', 'Your cart is empty.');
    redirect('products.php');
}

$total = cart_total($items);
$page_title = 'Checkout | ' . SHOP_NAME;

$customer_stmt = $conn->prepare('SELECT * FROM customers WHERE id = ? LIMIT 1');
$customer_stmt->bind_param('i', $_SESSION['customer_id']);
$customer_stmt->execute();
$customer = $customer_stmt->get_result()->fetch_assoc();
$customer_stmt->close();

include 'header.php';
?>

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
                    <div class="form-group">
                        <label>Full Name</label>
                        <input class="form-control" name="name" value="<?= e($customer['name'] ?? '') ?>" required>
                    </div>

                    <div class="form-group">
                        <label>Phone</label>
                        <input class="form-control" name="phone" value="<?= e($customer['phone'] ?? '') ?>" required>
                    </div>

                    <div class="form-group full">
                        <label>Address</label>
                        <textarea class="form-control" name="address" rows="4" required></textarea>
                    </div>

                    <div class="form-group">
                        <label>City</label>
                        <input class="form-control" name="city" required>
                    </div>

                    <div class="form-group">
                        <label>State</label>
                        <input class="form-control" name="state" required>
                    </div>

                    <div class="form-group">
                        <label>Pincode</label>
                        <input class="form-control" name="pincode" required>
                    </div>

                    <div class="form-group">
                        <label>Payment Method</label>
                        <select class="form-control" name="payment_method" required>
                            <option value="COD">Cash on Delivery</option>
                            <option value="UPI">Online Payment — UPI</option>
                            <option value="RAZORPAY">Online Payment — Razorpay</option>
                        </select>
                    </div>
                </div>

                <div class="payment-choice">
                    <div>
                        <strong>💵 Cash on Delivery</strong>
                        <span>Pay when your order arrives.</span>
                    </div>
                    <div>
                        <strong>📱 Online Payment</strong>
                        <span>UPI: <?= e(UPI_ID) ?> · Razorpay when configured.</span>
                    </div>
                </div>

                <div class="notice">
                    <strong>Stock is checked again at checkout.</strong> If a product becomes unavailable, the order will not be placed.
                </div>

                <button class="btn" type="submit">Place Order</button>
            </div>

            <aside class="summary">
                <h3>Order Summary</h3>
                <?php foreach ($items as $i): ?>
                    <div class="summary-row">
                        <span>
                            <?= e($i['name']) ?>
                            <?= !empty($i['size']) ? '<small style="color:var(--muted); font-weight:bold;">(' . e($i['size']) . ')</small>' : '' ?>
                            × <?= (int)$i['qty'] ?>
                        </span>
                        <strong><?= money($i['line_total']) ?></strong>
                    </div>
                <?php endforeach; ?>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <span><?= money($total) ?></span>
                </div>
            </aside>

        </div>
    </form>

</section>

<?php include 'footer.php'; ?>
