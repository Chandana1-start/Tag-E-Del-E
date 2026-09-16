<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'db.php';

if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

/* =========================
   DELETE PRODUCT
========================= */

if (isset($_GET['delete'])) {

    $delete_id = (int)$_GET['delete'];

    if ($delete_id > 0) {

        $stmt = $conn->prepare("
            DELETE FROM products
            WHERE id = ?
        ");

        if ($stmt) {

            $stmt->bind_param("i", $delete_id);
            $stmt->execute();
            $stmt->close();

            $_SESSION['product_success'] =
                'Product deleted successfully.';
        }
    }

    header("Location: admin_products.php");
    exit;
}


/* =========================
   MESSAGES
========================= */

$success = $_SESSION['product_success'] ?? '';
$error = $_SESSION['product_error'] ?? '';

unset($_SESSION['product_success']);
unset($_SESSION['product_error']);


/* =========================
   GET PRODUCTS
========================= */

$result = $conn->query("
    SELECT
        id,
        name,
        category,
        sku,
        price,
        old_price,
        stock,
        image,
        status,
        new_arrival
    FROM products
    ORDER BY id DESC
");

if (!$result) {
    die("Database error: " . $conn->error);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Products | TAG É DEL É Admin</title>

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {

    font-family: Arial, Helvetica, sans-serif;

    background: #f5f6f8;

    color: #222;
}

/* HEADER */

.topbar {

    background: #111;

    color: white;

    padding: 16px 35px;

    display: flex;

    justify-content: space-between;

    align-items: center;

}

.brand {

    display: flex;

    align-items: center;

    gap: 12px;

}

.brand img {

    width: 48px;

    height: 48px;

    object-fit: contain;

    background: white;

    border-radius: 8px;

}

.brand h2 {

    font-size: 20px;

}

.nav {

    display: flex;

    gap: 10px;

}

.nav a {

    color: white;

    text-decoration: none;

    padding: 9px 13px;

    border-radius: 7px;

    font-size: 13px;

}

.nav a:hover {

    background: #333;

}

/* CONTAINER */

.container {

    max-width: 1250px;

    margin: 35px auto;

    padding: 0 20px;

}

/* HEADER AREA */

.page-header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 25px;

}

.page-header h1 {

    font-size: 30px;

    margin-bottom: 6px;

}

.page-header p {

    color: #777;

}

/* ADD BUTTON */

.add-btn {

    background: #111;

    color: white;

    text-decoration: none;

    padding: 13px 20px;

    border-radius: 9px;

    font-weight: bold;

}

.add-btn:hover {

    background: #d71920;

}

/* ALERT */

.alert {

    padding: 14px 16px;

    border-radius: 9px;

    margin-bottom: 20px;

}

.success {

    background: #ecf9f0;

    color: #16733a;

}

.error {

    background: #fff0f0;

    color: #c62828;

}

/* TABLE CARD */

.table-card {

    background: white;

    border-radius: 16px;

    overflow-x: auto;

    box-shadow: 0 8px 30px rgba(0,0,0,.07);

}

/* TABLE */

table {

    width: 100%;

    border-collapse: collapse;

    min-width: 950px;

}

thead {

    background: #111;

    color: white;

}

th {

    padding: 15px;

    text-align: left;

    font-size: 13px;

}

td {

    padding: 14px 15px;

    border-bottom: 1px solid #eee;

    font-size: 13px;

    vertical-align: middle;

}

tbody tr:hover {

    background: #fafafa;

}

/* IMAGE */

.product-img {

    width: 65px;

    height: 65px;

    object-fit: contain;

    border: 1px solid #eee;

    border-radius: 9px;

    background: #fafafa;

}

/* PRICE */

.price {

    font-weight: bold;

}

.old-price {

    color: #999;

    text-decoration: line-through;

    margin-left: 5px;

}

/* STOCK */

.stock {

    display: inline-block;

    padding: 6px 10px;

    border-radius: 7px;

    font-size: 12px;

    font-weight: bold;

}

.stock-in {

    background: #e9f8ef;

    color: #16803c;

}

.stock-low {

    background: #fff4df;

    color: #c77700;

}

.stock-out {

    background: #ffe9e9;

    color: #d71920;

}

/* STATUS */

.status {

    padding: 6px 10px;

    border-radius: 7px;

    font-size: 12px;

    font-weight: bold;

}

.active {

    background: #e9f8ef;

    color: #16803c;

}

.inactive {

    background: #eee;

    color: #777;

}

/* ACTIONS */

.actions {

    display: flex;

    gap: 7px;

}

.edit-btn,
.delete-btn {

    text-decoration: none;

    padding: 8px 12px;

    border-radius: 7px;

    font-size: 12px;

    font-weight: bold;

}

.edit-btn {

    background: #111;

    color: white;

}

.edit-btn:hover {

    background: #333;

}

.delete-btn {

    background: #ffe9e9;

    color: #d71920;

}

.delete-btn:hover {

    background: #d71920;

    color: white;

}

/* EMPTY */

.empty {

    padding: 50px;

    text-align: center;

    color: #777;

}

/* MOBILE */

@media(max-width:700px) {

    .topbar {

        padding: 15px;

    }

    .nav {

        display: none;

    }

    .page-header {

        flex-direction: column;

        align-items: flex-start;

        gap: 15px;

    }

    .add-btn {

        width: 100%;

        text-align: center;

    }

}

</style>

</head>

<body>


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


    <nav class="nav">

        <a href="admin.php">
            Dashboard
        </a>

        <a href="admin_orders.php">
            Orders
        </a>

        <a href="admin_settings.php">
            Settings
        </a>

        <a href="index.php">
            View Shop
        </a>

        <a href="admin_logout.php">
            Logout
        </a>

    </nav>

</header>


<div class="container">


    <div class="page-header">

        <div>

            <h1>
                Products
            </h1>

            <p>
                Add, edit and manage your store products.
            </p>

        </div>


        <a
            href="admin_product_form.php"
            class="add-btn"
        >
            + Add Product
        </a>

    </div>


    <?php if ($success): ?>

        <div class="alert success">
            <?= htmlspecialchars($success) ?>
        </div>

    <?php endif; ?>


    <?php if ($error): ?>

        <div class="alert error">
            <?= htmlspecialchars($error) ?>
        </div>

    <?php endif; ?>


    <div class="table-card">

        <?php if ($result->num_rows > 0): ?>

            <table>

                <thead>

                    <tr>

                        <th>
                            Image
                        </th>

                        <th>
                            Product
                        </th>

                        <th>
                            Category
                        </th>

                        <th>
                            SKU
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Stock
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

                <?php while ($p = $result->fetch_assoc()): ?>

                    <?php

                    $stock = (int)$p['stock'];

                    if ($stock <= 0) {

                        $stock_class = 'stock-out';

                        $stock_text = 'Out of Stock';

                    } elseif ($stock <= 5) {

                        $stock_class = 'stock-low';

                        $stock_text = 'Only ' . $stock . ' left';

                    } else {

                        $stock_class = 'stock-in';

                        $stock_text = $stock . ' In Stock';

                    }

                    ?>


                    <tr>


                        <!-- IMAGE -->

                        <td>

                            <img
                                class="product-img"
                                src="<?= htmlspecialchars($p['image']) ?>"
                                alt="<?= htmlspecialchars($p['name']) ?>"
                            >

                        </td>


                        <!-- PRODUCT -->

                        <td>

                            <strong>
                                <?= htmlspecialchars($p['name']) ?>
                            </strong>

                            <?php if ((int)$p['new_arrival'] === 1): ?>

                                <div style="
                                    color:#d71920;
                                    font-size:11px;
                                    margin-top:4px;
                                    font-weight:bold;
                                ">
                                    NEW ARRIVAL
                                </div>

                            <?php endif; ?>

                        </td>


                        <!-- CATEGORY -->

                        <td>

                            <?= htmlspecialchars($p['category']) ?>

                        </td>


                        <!-- SKU -->

                        <td>

                            <?= htmlspecialchars($p['sku']) ?>

                        </td>


                        <!-- PRICE -->

                        <td>

                            <span class="price">
                                ₹<?= number_format((float)$p['price'], 2) ?>
                            </span>

                            <?php if ((float)$p['old_price'] > 0): ?>

                                <span class="old-price">
                                    ₹<?= number_format((float)$p['old_price'], 2) ?>
                                </span>

                            <?php endif; ?>

                        </td>


                        <!-- STOCK -->

                        <td>

                            <span class="stock <?= $stock_class ?>">
                                <?= htmlspecialchars($stock_text) ?>
                            </span>

                        </td>


                        <!-- STATUS -->

                        <td>

                            <?php if ((int)$p['status'] === 1): ?>

                                <span class="status active">
                                    Active
                                </span>

                            <?php else: ?>

                                <span class="status inactive">
                                    Inactive
                                </span>

                            <?php endif; ?>

                        </td>


                        <!-- ACTIONS -->

                        <td>

                            <div class="actions">

                                <!-- IMPORTANT -->
                                <!-- PRODUCT ID IS INCLUDED -->

                                <a
                                    href="admin_product_form.php?id=<?= (int)$p['id'] ?>"
                                    class="edit-btn"
                                >
                                    Edit
                                </a>


                                <a
                                    href="admin_products.php?delete=<?= (int)$p['id'] ?>"
                                    class="delete-btn"
                                    onclick="return confirm('Are you sure you want to delete this product?');"
                                >
                                    Delete
                                </a>

                            </div>

                        </td>


                    </tr>

                <?php endwhile; ?>

                </tbody>

            </table>

        <?php else: ?>

            <div class="empty">

                <h3>
                    No products found
                </h3>

                <p>
                    Click "Add Product" to create your first product.
                </p>

            </div>

        <?php endif; ?>

    </div>

</div>


</body>

</html>