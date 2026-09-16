<?php
require_once 'functions.php';
require_customer();

$s = $conn->prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC');
$s->bind_param('i', $_SESSION['customer_id']);
$s->execute();
$orders = $s->get_result();

$page_title = 'My Orders | ' . SHOP_NAME;
include 'header.php';
?>

<section class="section">

    <div class="section-head">
        <div>
            <p class="muted">Account</p>
            <h2>My Orders</h2>
        </div>
    </div>

    <?php if (!$orders || !$orders->num_rows): ?>
        <div class="empty">
            <div class="empty-icon">🛍️</div>
            <h3>No orders yet</h3>
            <p class="muted">You haven't placed any orders yet. Start exploring our collection!</p>
            <br>
            <a class="btn" href="products.php">Shop Now</a>
        </div>
    <?php else: ?>
        <?php while ($o = $orders->fetch_assoc()): ?>
            <div class="order-card">
                <div class="order-head">
                    <div>
                        <strong>Order #<?= (int)$o['id'] ?></strong>
                        <div class="muted"><?= e($o['created_at']) ?></div>
                    </div>
                    <div>
                        <span class="status <?= e($o['order_status']) ?>"><?= e($o['order_status']) ?></span>
                        <strong style="margin-left: 10px; font-size: 16px;"><?= money($o['total']) ?></strong>
                    </div>
                </div>

                <div class="mini-list">
                    <?php
                    $x = $conn->prepare('SELECT * FROM order_items WHERE order_id = ?');
                    $x->bind_param('i', $o['id']);
                    $x->execute();
                    $its = $x->get_result();
                    while ($i = $its->fetch_assoc()):
                    ?>
                        <div class="mini-item">
                            <span>
                                <?= e($i['product_name']) ?>
                                <?= !empty($i['size']) ? '<small style="color:var(--muted); font-weight:bold;">(Size: ' . e($i['size']) . ')</small>' : '' ?>
                                × <?= (int)$i['qty'] ?>
                            </span>
                            <strong><?= money($i['line_total']) ?></strong>
                        </div>
                    <?php endwhile; $x->close(); ?>
                </div>

                <div class="muted" style="font-size: 13px;">
                    Payment: <strong><?= e($o['payment_method']) ?></strong> • Status: <strong><?= e($o['payment_status']) ?></strong>
                </div>
            </div>
        <?php endwhile; ?>
    <?php endif; ?>

</section>

<?php include 'footer.php'; ?>
