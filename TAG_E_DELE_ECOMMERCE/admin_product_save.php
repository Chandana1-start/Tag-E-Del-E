<?php
require_once 'functions.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('admin_products.php');
}

$id          = (int)($_POST['id'] ?? 0);
$name        = trim($_POST['name'] ?? '');
$category    = trim($_POST['category'] ?? '');
$sku         = trim($_POST['sku'] ?? '');
$price       = (float)($_POST['price'] ?? 0);
$old         = (float)($_POST['old_price'] ?? 0);
$stock       = max(0, (int)($_POST['stock'] ?? 0));
$image       = trim($_POST['image'] ?? '');
$sizes       = trim($_POST['sizes'] ?? '');
if ($sizes === '') {
    $sizes = in_array(strtolower($category), ['jeans', 'trousers']) ? '30,32,34,36,38' : 'S,M,L,XL,XXL';
}
$desc        = trim($_POST['description'] ?? '');
$status      = isset($_POST['status']) ? 1 : 0;
$new_arrival = isset($_POST['new_arrival']) ? 1 : 0;

if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION));
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
        $image = 'images/product_' . time() . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $sku) . '.' . $ext;
        move_uploaded_file($_FILES['image_file']['tmp_name'], __DIR__ . '/' . $image);
    }
}

if (!$name || !$sku || $price <= 0) {
    flash('error', 'Please enter product name, SKU and valid price.');
    redirect($id ? 'admin_product_form.php?id=' . $id : 'admin_product_form.php');
}

if ($id) {
    $s = $conn->prepare('UPDATE products SET name=?, category=?, sku=?, price=?, old_price=?, stock=?, image=?, sizes=?, description=?, status=?, new_arrival=? WHERE id=?');
    $s->bind_param('sssddisssiii', $name, $category, $sku, $price, $old, $stock, $image, $sizes, $desc, $status, $new_arrival, $id);
    $s->execute();
    flash('success', 'Product updated successfully.');
} else {
    $s = $conn->prepare('INSERT INTO products(name, category, sku, price, old_price, stock, image, sizes, description, status, new_arrival) VALUES(?,?,?,?,?,?,?,?,?,?,?)');
    $s->bind_param('sssddisssii', $name, $category, $sku, $price, $old, $stock, $image, $sizes, $desc, $status, $new_arrival);
    $s->execute();
    flash('success', 'Product added successfully.');
}

redirect('admin_products.php');
