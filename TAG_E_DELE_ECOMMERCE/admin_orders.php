<?php

require_once 'functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

/* =========================================
   FILTERS
========================================= */

$search = trim($_GET['search'] ?? '');
$statusFilter = trim($_GET['status'] ?? '');

/* =========================================
   BUILD QUERY
========================================= */

$sql = "SELECT * FROM orders WHERE 1=1";

$params = [];
$types = '';

if ($search !== '') {

    $sql .= "
        AND (
            CAST(id AS CHAR) LIKE ?
            OR customer_name LIKE ?
            OR name LIKE ?
            OR email LIKE ?
            OR phone LIKE ?
        )
    ";

    $searchValue = '%' . $search . '%';

    $params[] = $searchValue;
    $params[] = $searchValue;
    $params[] = $searchValue;
    $params[] = $searchValue;
    $params[] = $searchValue;

    $types .= 'sssss';
}

if ($statusFilter !== '') {

    $sql .= " AND status = ?";

    $params[] = $statusFilter;

    $types .= 's';
}

$sql .= " ORDER BY id DESC";

/* =========================================
   EXECUTE QUERY
========================================= */

$stmt = $conn->prepare($sql);

$orders = false;

if ($stmt) {

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();

    $orders = $stmt->get_result();
}

/* =========================================
   STATISTICS
========================================= */

$totalOrders = 0;
$pendingOrders = 0;
$processingOrders = 0;
$completedOrders = 0;
$totalRevenue = 0;

$result = $conn->query("
    SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(
            CASE
                WHEN status != 'Cancelled'
                THEN total_amount
                ELSE 0
            END
        ),0) AS revenue
    FROM orders
");

if ($result) {

    $row = $result->fetch_assoc();

    $totalOrders = (int)($row['total_orders'] ?? 0);

    $totalRevenue = (float)($row['revenue'] ?? 0);
}


$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM orders
    WHERE status = 'Pending'
");

if ($result) {

    $pendingOrders =
        (int)$result->fetch_assoc()['total'];
}


$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM orders
    WHERE status = 'Processing'
");

if ($result) {

    $processingOrders =
        (int)$result->fetch_assoc()['total'];
}


$result = $conn->query("
    SELECT COUNT(*) AS total
    FROM orders
    WHERE status IN ('Delivered','Completed')
");

if ($result) {

    $completedOrders =
        (int)$result->fetch_assoc()['total'];
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>
    Orders | TAG É DEL É Admin
</title>

<style>

/* =========================================
   RESET
========================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background: #f5f6f8;
    color: #171717;
}

/* =========================================
   TOP BAR
========================================= */

.topbar {
    height: 72px;
    background: #111;
    color: #fff;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 30px;

    position: sticky;
    top: 0;
    z-index: 1000;

    box-shadow: 0 3px 15px rgba(0,0,0,.15);
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand img {
    width: 45px;
    height: 45px;

    object-fit: contain;

    background: #fff;

    border-radius: 9px;
}

.brand h2 {
    font-size: 19px;
    letter-spacing: 1.5px;
}

.top-right {
    display: flex;
    align-items: center;
    gap: 10px;
}

.top-right a {
    color: #fff;
    text-decoration: none;

    padding: 9px 14px;

    border: 1px solid #444;

    border-radius: 8px;

    font-size: 12px;
}

.top-right a:hover {
    background: #333;
}

.logout {
    background: #d71920 !important;
    border-color: #d71920 !important;
}

/* =========================================
   LAYOUT
========================================= */

.layout {
    display: flex;

    min-height: calc(100vh - 72px);
}

/* =========================================
   SIDEBAR
========================================= */

.sidebar {
    width: 235px;

    background: #fff;

    border-right: 1px solid #e5e5e5;

    padding: 25px 15px;

    flex-shrink: 0;
}

.sidebar-title {
    color: #999;

    font-size: 10px;

    font-weight: bold;

    text-transform: uppercase;

    letter-spacing: 1.2px;

    margin: 5px 12px 12px;
}

.sidebar a {
    display: flex;
    align-items: center;

    text-decoration: none;

    color: #555;

    padding: 13px 14px;

    border-radius: 9px;

    margin-bottom: 5px;

    font-size: 13px;

    transition: .2s;
}

.sidebar a:hover {
    background: #f3f3f3;

    color: #111;
}

.sidebar a.active {
    background: #111;

    color: #fff;
}

.sidebar-icon {
    width: 25px;

    text-align: center;

    margin-right: 8px;

    font-size: 15px;
}

/* =========================================
   MAIN
========================================= */

.main {
    flex: 1;

    padding: 30px;

    min-width: 0;
}

/* =========================================
   HEADER
========================================= */

.page-header {
    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 20px;

    margin-bottom: 25px;
}

.page-header h1 {
    font-size: 28px;
}

.page-header p {
    color: #777;

    font-size: 14px;

    margin-top: 7px;
}

/* =========================================
   STATS
========================================= */

.stats {
    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 18px;

    margin-bottom: 22px;
}

.stat-card {
    background: #fff;

    border: 1px solid #e6e6e6;

    border-radius: 15px;

    padding: 20px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    box-shadow:
        0 3px 15px rgba(0,0,0,.025);
}

.stat-card p {
    color: #888;

    font-size: 12px;

    margin-bottom: 8px;
}

.stat-card h2 {
    font-size: 24px;
}

.stat-icon {
    width: 46px;
    height: 46px;

    border-radius: 12px;

    display: flex;

    align-items: center;

    justify-content: center;

    background: #f1f1f1;

    font-size: 19px;
}

/* =========================================
   FILTER CARD
========================================= */

.filter-card {
    background: #fff;

    border: 1px solid #e6e6e6;

    border-radius: 15px;

    padding: 18px;

    margin-bottom: 20px;
}

.filter-form {
    display: grid;

    grid-template-columns:
        1fr 200px auto auto;

    gap: 12px;

    align-items: center;
}

.input,
.select {
    width: 100%;

    padding: 12px 13px;

    border: 1px solid #ddd;

    border-radius: 9px;

    font-size: 13px;

    outline: none;

    background: #fff;
}

.input:focus,
.select:focus {
    border-color: #111;

    box-shadow:
        0 0 0 3px rgba(0,0,0,.06);
}

.filter-btn {
    border: none;

    background: #111;

    color: #fff;

    padding: 12px 20px;

    border-radius: 9px;

    font-size: 13px;

    font-weight: bold;

    cursor: pointer;
}

.filter-btn:hover {
    background: #d71920;
}

.clear-btn {
    text-decoration: none;

    background: #f2f2f2;

    color: #444;

    padding: 12px 18px;

    border-radius: 9px;

    font-size: 13px;
}

.clear-btn:hover {
    background: #e5e5e5;
}

/* =========================================
   ORDERS CARD
========================================= */

.orders-card {
    background: #fff;

    border: 1px solid #e6e6e6;

    border-radius: 15px;

    overflow: hidden;

    box-shadow:
        0 3px 15px rgba(0,0,0,.025);
}

.orders-header {
    padding: 19px 20px;

    border-bottom: 1px solid #eee;

    display: flex;

    justify-content: space-between;

    align-items: center;
}

.orders-header h3 {
    font-size: 16px;
}

.orders-count {
    font-size: 12px;

    color: #888;
}

/* =========================================
   TABLE
========================================= */

.table-wrap {
    overflow-x: auto;
}

table {
    width: 100%;

    border-collapse: collapse;

    min-width: 900px;
}

thead th {
    text-align: left;

    padding: 14px 16px;

    background: #fafafa;

    color: #888;

    font-size: 10px;

    text-transform: uppercase;

    letter-spacing: .7px;

    white-space: nowrap;
}

tbody td {
    padding: 15px 16px;

    border-top: 1px solid #eee;

    font-size: 13px;

    vertical-align: middle;
}

tbody tr:hover {
    background: #fcfcfc;
}

/* =========================================
   ORDER ID
========================================= */

.order-id {
    font-weight: bold;

    color: #111;
}

/* =========================================
   CUSTOMER
========================================= */

.customer-name {
    font-weight: bold;

    color: #222;
}

.customer-info {
    color: #999;

    font-size: 11px;

    margin-top: 4px;
}

/* =========================================
   TOTAL
========================================= */

.total {
    font-weight: bold;
}

/* =========================================
   PAYMENT
========================================= */

.payment {
    display: inline-block;

    padding: 6px 9px;

    background: #f5f5f5;

    border-radius: 7px;

    font-size: 11px;

    font-weight: bold;
}

/* =========================================
   STATUS
========================================= */

.status {
    display: inline-block;

    padding: 6px 10px;

    border-radius: 20px;

    font-size: 10px;

    font-weight: bold;

    white-space: nowrap;
}

.status.pending {
    background: #fff4db;

    color: #9a6500;
}

.status.processing {
    background: #eaf3ff;

    color: #1769aa;
}

.status.shipped {
    background: #eee9ff;

    color: #6346a9;
}

.status.delivered,
.status.completed {
    background: #eaf8ef;

    color: #18803f;
}

.status.cancelled {
    background: #fff0f0;

    color: #c62828;
}

/* =========================================
   ACTIONS
========================================= */

.actions {
    display: flex;

    gap: 7px;

    align-items: center;
}

.view-btn {
    display: inline-block;

    text-decoration: none;

    padding: 7px 10px;

    border-radius: 7px;

    background: #111;

    color: #fff;

    font-size: 10px;

    font-weight: bold;
}

.view-btn:hover {
    background: #d71920;
}

/* =========================================
   STATUS FORM
========================================= */

.status-form {
    display: flex;

    gap: 5px;

    align-items: center;
}

.status-select {
    padding: 7px 8px;

    border: 1px solid #ddd;

    border-radius: 7px;

    font-size: 10px;

    outline: none;

    background: #fff;
}

.update-btn {
    border: 0;

    padding: 7px 9px;

    background: #111;

    color: #fff;

    border-radius: 7px;

    font-size: 10px;

    cursor: pointer;
}

.update-btn:hover {
    background: #d71920;
}

/* =========================================
   EMPTY
========================================= */

.empty {
    padding: 60px 20px;

    text-align: center;

    color: #999;
}

.empty-icon {
    font-size: 42px;

    margin-bottom: 12px;
}

.empty h3 {
    color: #555;

    margin-bottom: 6px;
}

.empty p {
    font-size: 13px;
}

/* =========================================
   MOBILE
========================================= */

@media(max-width:1100px) {

    .stats {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .filter-form {
        grid-template-columns:
            1fr 1fr;
    }

}

@media(max-width:800px) {

    .sidebar {
        display: none;
    }

    .main {
        padding: 20px 15px;
    }

    .topbar {
        padding: 0 15px;
    }

    .top-right a:not(.logout) {
        display: none;
    }

    .page-header {
        align-items: flex-start;
    }

}

@media(max-width:550px) {

    .stats {
        grid-template-columns: 1fr;
    }

    .filter-form {
        grid-template-columns: 1fr;
    }

    .page-header h1 {
        font-size: 23px;
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

        <img
            src="shop_logo.png"
            alt="TAG É DEL É"
        >

        <h2>
            TAG É DEL É
        </h2>

    </div>


    <div class="top-right">

        <a href="admin.php">
            Dashboard
        </a>

        <a href="index.php">
            View Shop
        </a>

        <a
            href="admin_logout.php"
            class="logout"
        >
            Logout
        </a>

    </div>

</header>


<div class="layout">


<!-- =========================================
     SIDEBAR
========================================= -->

<aside class="sidebar">

    <div class="sidebar-title">
        Main Menu
    </div>


    <a href="admin.php">

        <span class="sidebar-icon">
            ⌂
        </span>

        Dashboard

    </a>


    <a href="admin_products.php">

        <span class="sidebar-icon">
            ▣
        </span>

        Products

    </a>


    <a
        href="admin_orders.php"
        class="active"
    >

        <span class="sidebar-icon">
            ▤
        </span>

        Orders

    </a>


    <div
        class="sidebar-title"
        style="margin-top:25px;"
    >

        Store

    </div>


    <a href="admin_settings.php">

        <span class="sidebar-icon">
            ⚙
        </span>

        Shop Settings

    </a>


    <a href="index.php">

        <span class="sidebar-icon">
            ◉
        </span>

        View Store

    </a>


    <div
        class="sidebar-title"
        style="margin-top:25px;"
    >

        Account

    </div>


    <a href="admin_logout.php">

        <span class="sidebar-icon">
            ↪
        </span>

        Logout

    </a>

</aside>


<!-- =========================================
     MAIN
========================================= -->

<main class="main">


<!-- PAGE HEADER -->

<div class="page-header">

    <div>

        <h1>
            Orders
        </h1>

        <p>
            Manage customer orders, payments and delivery status.
        </p>

    </div>

</div>


<!-- =========================================
     STATISTICS
========================================= -->

<div class="stats">


    <div class="stat-card">

        <div>

            <p>
                Total Orders
            </p>

            <h2>
                <?= number_format($totalOrders) ?>
            </h2>

        </div>

        <div class="stat-icon">
            🛍️
        </div>

    </div>


    <div class="stat-card">

        <div>

            <p>
                Pending
            </p>

            <h2>
                <?= number_format($pendingOrders) ?>
            </h2>

        </div>

        <div class="stat-icon">
            ⏳
        </div>

    </div>


    <div class="stat-card">

        <div>

            <p>
                Processing
            </p>

            <h2>
                <?= number_format($processingOrders) ?>
            </h2>

        </div>

        <div class="stat-icon">
            📦
        </div>

    </div>


    <div class="stat-card">

        <div>

            <p>
                Revenue
            </p>

            <h2>
                ₹<?= number_format($totalRevenue, 2) ?>
            </h2>

        </div>

        <div class="stat-icon">
            ₹
        </div>

    </div>

</div>


<!-- =========================================
     FILTERS
========================================= -->

<div class="filter-card">

    <form
        method="GET"
        class="filter-form"
    >


        <input
            type="text"
            name="search"
            class="input"
            placeholder="Search order, customer, email..."
            value="<?= htmlspecialchars($search) ?>"
        >


        <select
            name="status"
            class="select"
        >

            <option value="">
                All Statuses
            </option>

            <option
                value="Pending"
                <?= $statusFilter === 'Pending'
                    ? 'selected'
                    : ''
                ?>
            >
                Pending
            </option>

            <option
                value="Processing"
                <?= $statusFilter === 'Processing'
                    ? 'selected'
                    : ''
                ?>
            >
                Processing
            </option>

            <option
                value="Shipped"
                <?= $statusFilter === 'Shipped'
                    ? 'selected'
                    : ''
                ?>
            >
                Shipped
            </option>

            <option
                value="Delivered"
                <?= $statusFilter === 'Delivered'
                    ? 'selected'
                    : ''
                ?>
            >
                Delivered
            </option>

            <option
                value="Completed"
                <?= $statusFilter === 'Completed'
                    ? 'selected'
                    : ''
                ?>
            >
                Completed
            </option>

            <option
                value="Cancelled"
                <?= $statusFilter === 'Cancelled'
                    ? 'selected'
                    : ''
                ?>
            >
                Cancelled
            </option>

        </select>


        <button
            type="submit"
            class="filter-btn"
        >
            Search
        </button>


        <a
            href="admin_orders.php"
            class="clear-btn"
        >
            Clear
        </a>


    </form>

</div>


<!-- =========================================
     ORDERS
========================================= -->

<div class="orders-card">


    <div class="orders-header">

        <h3>
            All Orders
        </h3>

        <span class="orders-count">

            <?php

            if ($orders) {
                echo $orders->num_rows;
            } else {
                echo 0;
            }

            ?>

            order(s)

        </span>

    </div>


    <?php if ($orders && $orders->num_rows > 0): ?>


    <div class="table-wrap">

        <table>

            <thead>

                <tr>

                    <th>
                        Order
                    </th>

                    <th>
                        Customer
                    </th>

                    <th>
                        Date
                    </th>

                    <th>
                        Total
                    </th>

                    <th>
                        Payment
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Actions
                    </th>

                </tr>

            </thead>


            <tbody>


            <?php while ($order = $orders->fetch_assoc()): ?>


                <?php

                $orderId =
                    (int)($order['id'] ?? 0);

                $customerName =
                    $order['customer_name']
                    ?? $order['name']
                    ?? $order['customer']
                    ?? 'Guest';

                $email =
                    $order['email']
                    ?? '';

                $date =
                    $order['created_at']
                    ?? $order['order_date']
                    ?? $order['date']
                    ?? '';

                $total =
                    $order['total_amount']
                    ?? $order['total']
                    ?? 0;

                $payment =
                    $order['payment_method']
                    ?? $order['payment']
                    ?? 'Not specified';

                $status =
                    $order['status']
                    ?? 'Pending';

                $statusClass =
                    strtolower($status);

                ?>


                <tr>


                    <!-- ORDER -->

                    <td>

                        <div class="order-id">

                            #<?= $orderId ?>

                        </div>

                    </td>


                    <!-- CUSTOMER -->

                    <td>

                        <div class="customer-name">

                            <?= htmlspecialchars($customerName) ?>

                        </div>


                        <?php if ($email !== ''): ?>

                            <div class="customer-info">

                                <?= htmlspecialchars($email) ?>

                            </div>

                        <?php endif; ?>

                    </td>


                    <!-- DATE -->

                    <td>

                        <?php

                        if ($date !== '') {

                            $timestamp =
                                strtotime($date);

                            if ($timestamp) {

                                echo date(
                                    'd M Y',
                                    $timestamp
                                );

                            } else {

                                echo htmlspecialchars($date);

                            }

                        } else {

                            echo '—';

                        }

                        ?>

                    </td>


                    <!-- TOTAL -->

                    <td>

                        <span class="total">

                            ₹<?= number_format(
                                (float)$total,
                                2
                            ) ?>

                        </span>

                    </td>


                    <!-- PAYMENT -->

                    <td>

                        <span class="payment">

                            <?= htmlspecialchars($payment) ?>

                        </span>

                    </td>


                    <!-- STATUS -->

                    <td>

                        <span
                            class="status
                            <?= htmlspecialchars($statusClass) ?>"
                        >

                            <?= htmlspecialchars($status) ?>

                        </span>

                    </td>


                    <!-- ACTIONS -->

                    <td>

                        <div class="actions">


                            <?php if (
                                file_exists('admin_order_view.php')
                            ): ?>

                                <a
                                    href="admin_order_view.php?id=<?= $orderId ?>"
                                    class="view-btn"
                                >
                                    View
                                </a>

                            <?php endif; ?>


                            <form
                                method="POST"
                                action="admin_order_status.php"
                                class="status-form"
                            >

                                <input
                                    type="hidden"
                                    name="order_id"
                                    value="<?= $orderId ?>"
                                >


                                <select
                                    name="status"
                                    class="status-select"
                                >

                                    <option
                                        value="Pending"
                                        <?= $status === 'Pending'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Pending
                                    </option>

                                    <option
                                        value="Processing"
                                        <?= $status === 'Processing'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Processing
                                    </option>

                                    <option
                                        value="Shipped"
                                        <?= $status === 'Shipped'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Shipped
                                    </option>

                                    <option
                                        value="Delivered"
                                        <?= $status === 'Delivered'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Delivered
                                    </option>

                                    <option
                                        value="Completed"
                                        <?= $status === 'Completed'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Completed
                                    </option>

                                    <option
                                        value="Cancelled"
                                        <?= $status === 'Cancelled'
                                            ? 'selected'
                                            : ''
                                        ?>
                                    >
                                        Cancelled
                                    </option>

                                </select>


                                <button
                                    type="submit"
                                    class="update-btn"
                                >
                                    ✓
                                </button>

                            </form>


                        </div>

                    </td>


                </tr>


            <?php endwhile; ?>


            </tbody>

        </table>

    </div>


    <?php else: ?>


        <div class="empty">

            <div class="empty-icon">
                🛍️
            </div>

            <h3>
                No orders found
            </h3>

            <p>
                Customer orders will appear here when someone places an order.
            </p>

        </div>


    <?php endif; ?>


</div>


</main>

</div>

</body>

</html>
