<?php
require_once 'functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

/* =========================
   DASHBOARD DATA
========================= */

$productCount = 0;
$customerCount = 0;
$orderCount = 0;
$revenue = 0;

$result = $conn->query("SELECT COUNT(*) AS total FROM products");
if ($result) {
    $row = $result->fetch_assoc();
    $productCount = (int)$row['total'];
}

$result = $conn->query("SELECT COUNT(*) AS total FROM customers");
if ($result) {
    $row = $result->fetch_assoc();
    $customerCount = (int)$row['total'];
}

$result = $conn->query("SELECT COUNT(*) AS total FROM orders");
if ($result) {
    $row = $result->fetch_assoc();
    $orderCount = (int)$row['total'];
}

/* Revenue */
$result = $conn->query("
    SELECT COALESCE(SUM(total_amount),0) AS revenue
    FROM orders
    WHERE status != 'Cancelled'
");

if ($result) {
    $row = $result->fetch_assoc();
    $revenue = (float)$row['revenue'];
}

/* Recent orders */
$recentOrders = $conn->query("
    SELECT *
    FROM orders
    ORDER BY id DESC
    LIMIT 8
");

/* Low stock */
$lowStock = $conn->query("
    SELECT id,name,stock,price,image
    FROM products
    WHERE stock <= 5
    ORDER BY stock ASC
    LIMIT 5
");

/* New arrivals */
$newArrivals = $conn->query("
    SELECT id,name,price,stock,image
    FROM products
    WHERE new_arrival = 1
    ORDER BY id DESC
    LIMIT 5
");

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Dashboard | TAG É DEL É Admin</title>

<style>

/* =========================================
   RESET
========================================= */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    background:#f5f6f8;
    color:#171717;
}

/* =========================================
   TOP BAR
========================================= */

.topbar{
    height:72px;
    background:#111;
    color:#fff;

    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:0 30px;

    position:sticky;
    top:0;
    z-index:1000;

    box-shadow:0 3px 15px rgba(0,0,0,.15);
}

.brand{
    display:flex;
    align-items:center;
    gap:13px;
}

.brand img{
    width:45px;
    height:45px;
    background:#fff;
    border-radius:9px;
    object-fit:contain;
}

.brand-text h2{
    font-size:19px;
    letter-spacing:1.5px;
}

.brand-text span{
    display:block;
    font-size:10px;
    color:#aaa;
    margin-top:3px;
    letter-spacing:1px;
    text-transform:uppercase;
}

.top-right{
    display:flex;
    align-items:center;
    gap:15px;
}

.admin-user{
    display:flex;
    align-items:center;
    gap:9px;
    color:#ddd;
    font-size:13px;
}

.admin-avatar{
    width:34px;
    height:34px;
    border-radius:50%;
    background:#d71920;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    font-weight:bold;
}

.view-shop{
    color:#fff;
    text-decoration:none;
    border:1px solid #555;
    padding:9px 14px;
    border-radius:8px;
    font-size:12px;
}

.logout{
    color:#fff;
    text-decoration:none;
    background:#d71920;
    padding:9px 14px;
    border-radius:8px;
    font-size:12px;
    font-weight:bold;
}

/* =========================================
   LAYOUT
========================================= */

.layout{
    display:flex;
    min-height:calc(100vh - 72px);
}

/* =========================================
   SIDEBAR
========================================= */

.sidebar{
    width:235px;
    background:#fff;
    border-right:1px solid #e6e6e6;
    padding:25px 15px;

    flex-shrink:0;
}

.menu-title{
    color:#aaa;
    font-size:10px;
    font-weight:bold;
    text-transform:uppercase;
    letter-spacing:1.2px;
    margin:5px 12px 12px;
}

.sidebar a{
    display:flex;
    align-items:center;
    gap:12px;

    text-decoration:none;
    color:#555;

    padding:13px 14px;
    border-radius:9px;

    margin-bottom:5px;

    font-size:13px;

    transition:.2s;
}

.sidebar a:hover{
    background:#f4f4f4;
    color:#111;
}

.sidebar a.active{
    background:#111;
    color:#fff;
}

.sidebar-icon{
    width:20px;
    text-align:center;
    font-size:15px;
}

/* =========================================
   MAIN
========================================= */

.main{
    flex:1;
    padding:30px;
    overflow:hidden;
}

/* =========================================
   WELCOME
========================================= */

.welcome{
    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:25px;
}

.welcome h1{
    font-size:27px;
    letter-spacing:-.5px;
}

.welcome p{
    color:#777;
    font-size:14px;
    margin-top:6px;
}

.add-product{
    background:#111;
    color:#fff;

    text-decoration:none;

    padding:12px 17px;

    border-radius:9px;

    font-size:13px;
    font-weight:bold;
}

.add-product:hover{
    background:#d71920;
}

/* =========================================
   STAT CARDS
========================================= */

.stats{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:18px;
    margin-bottom:25px;
}

.stat-card{
    background:#fff;
    border:1px solid #e7e7e7;
    border-radius:15px;

    padding:20px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    box-shadow:0 3px 15px rgba(0,0,0,.025);
}

.stat-left p{
    color:#888;
    font-size:12px;
    margin-bottom:9px;
}

.stat-left h2{
    font-size:25px;
}

.stat-icon{
    width:48px;
    height:48px;

    border-radius:12px;

    background:#f2f2f2;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:20px;
}

.stat-card.revenue .stat-icon{
    background:#eef8f1;
}

.stat-card.orders .stat-icon{
    background:#fff5e7;
}

.stat-card.customers .stat-icon{
    background:#eef4ff;
}

.stat-card.products .stat-icon{
    background:#fff0f0;
}

/* =========================================
   GRID
========================================= */

.dashboard-grid{
    display:grid;
    grid-template-columns:2fr 1fr;
    gap:20px;
    margin-bottom:20px;
}

/* =========================================
   CARD
========================================= */

.card{
    background:#fff;
    border:1px solid #e7e7e7;
    border-radius:15px;
    overflow:hidden;

    box-shadow:0 3px 15px rgba(0,0,0,.025);
}

.card-header{
    padding:18px 20px;

    display:flex;
    justify-content:space-between;
    align-items:center;

    border-bottom:1px solid #eee;
}

.card-header h3{
    font-size:16px;
}

.card-header a{
    color:#d71920;
    text-decoration:none;
    font-size:12px;
    font-weight:bold;
}

/* =========================================
   ORDERS TABLE
========================================= */

.table-wrap{
    overflow-x:auto;
}

table{
    width:100%;
    border-collapse:collapse;
    min-width:650px;
}

th{
    text-align:left;
    padding:13px 16px;

    background:#fafafa;

    color:#888;

    font-size:10px;
    text-transform:uppercase;
    letter-spacing:.6px;
}

td{
    padding:14px 16px;

    border-top:1px solid #f0f0f0;

    font-size:13px;
}

.order-id{
    font-weight:bold;
}

.customer{
    color:#555;
}

.amount{
    font-weight:bold;
}

.status{
    display:inline-block;

    padding:5px 9px;

    border-radius:20px;

    font-size:10px;
    font-weight:bold;
}

.status.pending{
    background:#fff4dc;
    color:#a66b00;
}

.status.processing{
    background:#eaf3ff;
    color:#1769aa;
}

.status.shipped{
    background:#eee9ff;
    color:#6045a8;
}

.status.delivered{
    background:#eaf8ef;
    color:#198044;
}

.status.cancelled{
    background:#fff0f0;
    color:#c62828;
}

/* =========================================
   LOW STOCK
========================================= */

.stock-list{
    padding:5px 0;
}

.stock-item{
    display:flex;
    align-items:center;
    gap:12px;

    padding:13px 20px;

    border-bottom:1px solid #eee;
}

.stock-item:last-child{
    border-bottom:0;
}

.stock-image{
    width:45px;
    height:45px;

    object-fit:cover;

    border-radius:8px;

    background:#f2f2f2;

    border:1px solid #eee;
}

.stock-info{
    flex:1;
}

.stock-info strong{
    display:block;
    font-size:13px;

    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;

    max-width:170px;
}

.stock-info span{
    color:#999;
    font-size:11px;
    display:block;
    margin-top:4px;
}

.stock-number{
    color:#d71920;
    font-weight:bold;
    font-size:12px;
}

/* =========================================
   NEW ARRIVALS
========================================= */

.arrivals{
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:15px;
    padding:20px;
}

.arrival{
    border:1px solid #eee;
    border-radius:12px;
    overflow:hidden;
    background:#fff;
}

.arrival-image{
    width:100%;
    height:150px;
    object-fit:cover;
    background:#f4f4f4;
}

.arrival-info{
    padding:12px;
}

.arrival-info h4{
    font-size:13px;

    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}

.arrival-price{
    font-weight:bold;
    margin-top:7px;
}

.arrival-stock{
    color:#777;
    font-size:11px;
    margin-top:5px;
}

/* =========================================
   EMPTY
========================================= */

.empty{
    padding:35px 20px;
    text-align:center;
    color:#999;
    font-size:13px;
}

/* =========================================
   RESPONSIVE
========================================= */

@media(max-width:1100px){

    .stats{
        grid-template-columns:repeat(2,1fr);
    }

    .dashboard-grid{
        grid-template-columns:1fr;
    }

    .arrivals{
        grid-template-columns:repeat(3,1fr);
    }
}

@media(max-width:800px){

    .sidebar{
        display:none;
    }

    .main{
        padding:20px 15px;
    }

    .topbar{
        padding:0 15px;
    }

    .admin-user{
        display:none;
    }

    .view-shop{
        display:none;
    }

    .welcome{
        align-items:flex-start;
        gap:15px;
    }

}

@media(max-width:550px){

    .stats{
        grid-template-columns:1fr;
    }

    .arrivals{
        grid-template-columns:1fr 1fr;
    }

    .brand-text span{
        display:none;
    }

    .brand-text h2{
        font-size:15px;
    }

}

</style>

</head>

<body>

<!-- =========================================
     TOP BAR
========================================= -->

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

            <div class="admin-avatar">
                <?= strtoupper(substr($_SESSION['admin_username'] ?? 'A',0,1)) ?>
            </div>

            <span>
                <?= htmlspecialchars($_SESSION['admin_username'] ?? 'Admin') ?>
            </span>

        </div>

        <a href="index.php" class="view-shop">
            View Shop
        </a>

        <a href="admin_logout.php" class="logout">
            Logout
        </a>

    </div>

</header>


<!-- =========================================
     MAIN LAYOUT
========================================= -->

<div class="layout">


<!-- SIDEBAR -->

<aside class="sidebar">

    <div class="menu-title">
        Main Menu
    </div>

    <a href="admin.php" class="active">

        <span class="sidebar-icon">⌂</span>

        Dashboard

    </a>

    <a href="admin_products.php">

        <span class="sidebar-icon">▣</span>

        Products

    </a>

    <a href="admin_orders.php">

        <span class="sidebar-icon">▤</span>

        Orders

    </a>


    <div class="menu-title" style="margin-top:25px;">
        Store
    </div>

    <a href="admin_settings.php">

        <span class="sidebar-icon">⚙</span>

        Shop Settings

    </a>

    <a href="index.php">

        <span class="sidebar-icon">◉</span>

        View Store

    </a>


    <div class="menu-title" style="margin-top:25px;">
        Account
    </div>

    <a href="admin_logout.php">

        <span class="sidebar-icon">↪</span>

        Logout

    </a>

</aside>


<!-- MAIN -->

<main class="main">


<!-- WELCOME -->

<div class="welcome">

    <div>

        <h1>Dashboard</h1>

        <p>
            Welcome back, <?= htmlspecialchars($_SESSION['admin_username'] ?? 'Admin') ?>.
            Here's what's happening in your store.
        </p>

    </div>

    <a href="admin_product_form.php" class="add-product">
        + Add Product
    </a>

</div>


<!-- =========================================
     STATISTICS
========================================= -->

<div class="stats">


    <div class="stat-card products">

        <div class="stat-left">

            <p>Total Products</p>

            <h2>
                <?= number_format($productCount) ?>
            </h2>

        </div>

        <div class="stat-icon">
            👕
        </div>

    </div>


    <div class="stat-card customers">

        <div class="stat-left">

            <p>Total Customers</p>

            <h2>
                <?= number_format($customerCount) ?>
            </h2>

        </div>

        <div class="stat-icon">
            👤
        </div>

    </div>


    <div class="stat-card orders">

        <div class="stat-left">

            <p>Total Orders</p>

            <h2>
                <?= number_format($orderCount) ?>
            </h2>

        </div>

        <div class="stat-icon">
            🛍️
        </div>

    </div>


    <div class="stat-card revenue">

        <div class="stat-left">

            <p>Total Revenue</p>

            <h2>
                ₹<?= number_format($revenue,2) ?>
            </h2>

        </div>

        <div class="stat-icon">
            ₹
        </div>

    </div>

</div>


<!-- =========================================
     ORDERS + LOW STOCK
========================================= -->

<div class="dashboard-grid">


<!-- RECENT ORDERS -->

<div class="card">

    <div class="card-header">

        <h3>Recent Orders</h3>

        <a href="admin_orders.php">
            View All
        </a>

    </div>


    <?php if($recentOrders && $recentOrders->num_rows > 0): ?>

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

            <?php while($order = $recentOrders->fetch_assoc()): ?>

                <?php

                $status = strtolower($order['status'] ?? 'pending');

                $customerName =
                    $order['customer_name']
                    ?? $order['name']
                    ?? $order['customer']
                    ?? 'Guest';

                $total =
                    $order['total_amount']
                    ?? $order['total']
                    ?? 0;

                $payment =
                    $order['payment_method']
                    ?? $order['payment']
                    ?? '—';

                ?>

                <tr>

                    <td class="order-id">

                        #<?= (int)$order['id'] ?>

                    </td>

                    <td class="customer">

                        <?= htmlspecialchars($customerName) ?>

                    </td>

                    <td class="amount">

                        ₹<?= number_format((float)$total,2) ?>

                    </td>

                    <td>

                        <?= htmlspecialchars($payment) ?>

                    </td>

                    <td>

                        <span class="status <?= htmlspecialchars($status) ?>">

                            <?= ucfirst($status) ?>

                        </span>

                    </td>

                </tr>

            <?php endwhile; ?>

            </tbody>

        </table>

    </div>

    <?php else: ?>

        <div class="empty">

            No orders yet.

        </div>

    <?php endif; ?>

</div>


<!-- LOW STOCK -->

<div class="card">

    <div class="card-header">

        <h3>Low Stock</h3>

        <a href="admin_products.php">
            Manage
        </a>

    </div>


    <?php if($lowStock && $lowStock->num_rows > 0): ?>

    <div class="stock-list">

        <?php while($item = $lowStock->fetch_assoc()): ?>

            <?php

            $image =
                !empty($item['image'])
                && file_exists($item['image'])
                ? $item['image']
                : 'shop_logo.png';

            ?>

            <div class="stock-item">

                <img
                    src="<?= htmlspecialchars($image) ?>"
                    class="stock-image"
                    alt=""
                >

                <div class="stock-info">

                    <strong>
                        <?= htmlspecialchars($item['name']) ?>
                    </strong>

                    <span>
                        ₹<?= number_format((float)$item['price'],2) ?>
                    </span>

                </div>

                <div class="stock-number">

                    <?= (int)$item['stock'] ?> left

                </div>

            </div>

        <?php endwhile; ?>

    </div>

    <?php else: ?>

        <div class="empty">

            ✓ All products have healthy stock.

        </div>

    <?php endif; ?>

</div>

</div>


<!-- =========================================
     NEW ARRIVALS
========================================= -->

<div class="card">

    <div class="card-header">

        <h3>New Arrivals</h3>

        <a href="admin_products.php">
            Manage Products
        </a>

    </div>


    <?php if($newArrivals && $newArrivals->num_rows > 0): ?>

    <div class="arrivals">

        <?php while($item = $newArrivals->fetch_assoc()): ?>

            <?php

            $image =
                !empty($item['image'])
                && file_exists($item['image'])
                ? $item['image']
                : 'shop_logo.png';

            ?>

            <div class="arrival">

                <img
                    src="<?= htmlspecialchars($image) ?>"
                    class="arrival-image"
                    alt=""
                >

                <div class="arrival-info">

                    <h4>
                        <?= htmlspecialchars($item['name']) ?>
                    </h4>

                    <div class="arrival-price">

                        ₹<?= number_format((float)$item['price'],2) ?>

                    </div>

                    <div class="arrival-stock">

                        Stock:
                        <?= (int)$item['stock'] ?>

                    </div>

                </div>

            </div>

        <?php endwhile; ?>

    </div>

    <?php else: ?>

        <div class="empty">

            No products marked as New Arrival yet.

        </div>

    <?php endif; ?>

</div>


</main>

</div>

</body>

</html>