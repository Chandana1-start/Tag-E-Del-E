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
   GET PRODUCT ID
========================= */

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

/* =========================
   DEFAULT PRODUCT
========================= */

$product = [
    'id' => 0,
    'name' => '',
    'category' => '',
    'sku' => '',
    'price' => '',
    'old_price' => '',
    'stock' => 0,
    'image' => '',
    'sizes' => 'S,M,L,XL,XXL',
    'description' => '',
    'status' => 1,
    'new_arrival' => 0
];

/* =========================
   LOAD PRODUCT FOR EDIT
========================= */

if ($id > 0) {

    $stmt = $conn->prepare("
        SELECT
            id,
            name,
            category,
            sku,
            price,
            old_price,
            stock,
            image,
            sizes,
            description,
            status,
            new_arrival
        FROM products
        WHERE id = ?
        LIMIT 1
    ");

    if (!$stmt) {
        die("Database error: " . $conn->error);
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        header("Location: admin_products.php");
        exit;
    }

    $product = $result->fetch_assoc();

    $stmt->close();
}

/* =========================
   MESSAGES
========================= */

$error = $_SESSION['product_error'] ?? '';
$success = $_SESSION['product_success'] ?? '';

unset($_SESSION['product_error']);
unset($_SESSION['product_success']);

$is_edit = ($id > 0);

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>
<?= $is_edit ? 'Edit Product' : 'Add Product' ?> | TAG É DEL É
</title>

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
    letter-spacing: 1px;
}

.back-btn {
    color: white;
    text-decoration: none;
    background: #333;
    padding: 10px 18px;
    border-radius: 8px;
}

.back-btn:hover {
    background: #d71920;
}

/* CONTAINER */

.container {
    max-width: 1000px;
    margin: 35px auto;
    padding: 0 20px;
}

.page-heading {
    margin-bottom: 25px;
}

.page-heading h1 {
    font-size: 30px;
    margin-bottom: 7px;
}

.page-heading p {
    color: #777;
}

/* CARD */

.form-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 8px 30px rgba(0,0,0,.08);
}

/* ALERT */

.alert {
    padding: 14px 16px;
    border-radius: 9px;
    margin-bottom: 20px;
}

.alert-error {
    background: #fff0f0;
    color: #c62828;
    border: 1px solid #ffd0d0;
}

.alert-success {
    background: #ecf9f0;
    color: #16733a;
    border: 1px solid #c9efd5;
}

/* GRID */

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full {
    grid-column: 1 / -1;
}

.form-group label {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 13px 14px;
    border: 1px solid #ddd;
    border-radius: 9px;
    font-size: 14px;
    outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #111;
    box-shadow: 0 0 0 3px rgba(0,0,0,.06);
}

textarea {
    min-height: 120px;
    resize: vertical;
}

/* STOCK */

.stock-box {
    background: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 15px;
}

.stock-input {
    font-size: 20px !important;
    font-weight: bold;
}

/* CHECKBOX */

.checkbox-row {
    display: flex;
    gap: 25px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.checkbox-item input {
    width: 18px;
    height: 18px;
}

/* IMAGE */

.image-preview {
    margin-top: 12px;
}

.image-preview img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 10px;
}

/* BUTTONS */

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid #eee;
}

.btn {
    border: none;
    border-radius: 9px;
    padding: 13px 24px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
}

.cancel {
    background: #eee;
    color: #333;
}

.save {
    background: #111;
    color: white;
}

.save:hover {
    background: #d71920;
}

@media(max-width:700px) {

    .topbar {
        padding: 15px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .form-group.full {
        grid-column: auto;
    }

    .form-card {
        padding: 20px;
    }

    .actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        text-align: center;
    }
}

</style>

</head>

<body>

<header class="topbar">

    <div class="brand">

        <img src="shop_logo.png" alt="TAG É DEL É">

        <h2>TAG É DEL É</h2>

    </div>

    <a href="admin_products.php" class="back-btn">
        ← Back to Products
    </a>

</header>


<div class="container">

    <div class="page-heading">

        <h1>
            <?= $is_edit ? 'Edit Product' : 'Add New Product' ?>
        </h1>

        <p>
            <?= $is_edit
                ? 'Update product information, price and stock.'
                : 'Add a new product to your store.'
            ?>
        </p>

    </div>


    <?php if ($error): ?>

        <div class="alert alert-error">
            <?= htmlspecialchars($error) ?>
        </div>

    <?php endif; ?>


    <?php if ($success): ?>

        <div class="alert alert-success">
            <?= htmlspecialchars($success) ?>
        </div>

    <?php endif; ?>


    <div class="form-card">

        <form
            method="POST"
            action="admin_product_process.php"
        >

            <!-- VERY IMPORTANT -->
            <!-- This tells PHP which product to UPDATE -->

            <input
                type="hidden"
                name="id"
                value="<?= (int)$product['id'] ?>"
            >


            <div class="form-grid">


                <!-- NAME -->

                <div class="form-group">

                    <label for="name">
                        Product Name *
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        value="<?= htmlspecialchars($product['name']) ?>"
                        required
                    >

                </div>


                <!-- CATEGORY -->

                <div class="form-group">

                    <label for="category">
                        Category *
                    </label>

                    <select
                        id="category"
                        name="category"
                        required
                    >

                        <option value="">
                            Select Category
                        </option>

                        <?php

                        $categories = [
                            'Shirts',
                            'T-Shirts',
                            'Jeans',
                            'Trousers',
                            'Jackets'
                        ];

                        foreach ($categories as $category):

                        ?>

                            <option
                                value="<?= htmlspecialchars($category) ?>"
                                <?= $product['category'] === $category ? 'selected' : '' ?>
                            >
                                <?= htmlspecialchars($category) ?>
                            </option>

                        <?php endforeach; ?>

                    </select>

                </div>


                <!-- SKU -->

                <div class="form-group">

                    <label for="sku">
                        SKU
                    </label>

                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value="<?= htmlspecialchars($product['sku']) ?>"
                    >

                </div>


                <!-- PRICE -->

                <div class="form-group">

                    <label for="price">
                        Selling Price *
                    </label>

                    <input
                        type="number"
                        id="price"
                        name="price"
                        value="<?= htmlspecialchars($product['price']) ?>"
                        min="0"
                        step="0.01"
                        required
                    >

                </div>


                <!-- OLD PRICE -->

                <div class="form-group">

                    <label for="old_price">
                        Old Price
                    </label>

                    <input
                        type="number"
                        id="old_price"
                        name="old_price"
                        value="<?= htmlspecialchars($product['old_price']) ?>"
                        min="0"
                        step="0.01"
                    >

                </div>


                <!-- STOCK -->

                <div class="form-group">

                    <div class="stock-box">

                        <label for="stock">
                            Stock Quantity *
                        </label>

                        <input
                            class="stock-input"
                            type="number"
                            id="stock"
                            name="stock"
                            value="<?= (int)$product['stock'] ?>"
                            min="0"
                            step="1"
                            required
                        >

                    </div>

                </div>


                <!-- SIZES -->
                <div class="form-group full">
                    <label for="sizes">
                        Available Sizes (comma separated, e.g. S,M,L,XL,XXL or 30,32,34,36,38)
                    </label>
                    <input
                        type="text"
                        id="sizes"
                        name="sizes"
                        value="<?= htmlspecialchars($product['sizes'] ?? '') ?>"
                        placeholder="S,M,L,XL,XXL"
                    >
                    <small style="color:#777; margin-top:4px; display:block;">Enter comma-separated sizes or leave empty to use standard category sizes.</small>
                </div>

                <!-- IMAGE -->
                <div class="form-group full">
                    <label for="image">
                        Product Image
                    </label>

                    <?php
                    $available_imgs = glob('images/*.{jpg,jpeg,png,webp}', GLOB_BRACE) ?: [];
                    ?>
                    <?php if (!empty($available_imgs)): ?>
                        <div style="margin-bottom: 8px;">
                            <label style="font-size:12px; color:#666; font-weight:normal; margin-bottom:4px; display:block;">Select from available images in <code>images/</code> folder:</label>
                            <select id="image_picker" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:7px; margin-bottom:6px;" onchange="if(this.value){document.getElementById('image').value=this.value; document.getElementById('preview_img').src=this.value; document.getElementById('preview_wrap').style.display='block';}">
                                <option value="">-- Choose existing image in images/ --</option>
                                <?php foreach($available_imgs as $img_path): ?>
                                    <option value="<?= htmlspecialchars($img_path) ?>" <?= ($product['image'] === $img_path) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars(basename($img_path)) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    <?php endif; ?>

                    <input
                        type="text"
                        id="image"
                        name="image"
                        value="<?= htmlspecialchars($product['image']) ?>"
                        placeholder="images/product-image.jpg"
                        oninput="document.getElementById('preview_img').src=this.value; document.getElementById('preview_wrap').style.display=this.value?'block':'none';"
                    >

                    <div id="preview_wrap" class="image-preview" style="<?= empty($product['image']) ? 'display:none;' : '' ?> margin-top: 10px;">
                        <img
                            id="preview_img"
                            src="<?= htmlspecialchars($product['image']) ?>"
                            alt="Product Image"
                            style="max-width: 140px; border-radius: 8px; border: 1px solid #ddd;"
                        >
                    </div>
                </div>


                <!-- DESCRIPTION -->

                <div class="form-group full">

                    <label for="description">
                        Product Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                    ><?= htmlspecialchars($product['description']) ?></textarea>

                </div>


                <!-- SETTINGS -->

                <div class="form-group full">

                    <label>
                        Product Settings
                    </label>

                    <div class="checkbox-row">

                        <label class="checkbox-item">

                            <input
                                type="checkbox"
                                name="status"
                                value="1"
                                <?= (int)$product['status'] === 1 ? 'checked' : '' ?>
                            >

                            Active Product

                        </label>


                        <label class="checkbox-item">

                            <input
                                type="checkbox"
                                name="new_arrival"
                                value="1"
                                <?= (int)$product['new_arrival'] === 1 ? 'checked' : '' ?>
                            >

                            New Arrival

                        </label>

                    </div>

                </div>

            </div>


            <div class="actions">

                <a
                    href="admin_products.php"
                    class="btn cancel"
                >
                    Cancel
                </a>

                <button
                    type="submit"
                    class="btn save"
                >
                    <?= $is_edit ? '✓ Update Product' : '+ Add Product' ?>
                </button>

            </div>

        </form>

    </div>

</div>

</body>
</html>
