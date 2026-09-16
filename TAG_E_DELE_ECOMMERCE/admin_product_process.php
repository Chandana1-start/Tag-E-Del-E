<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'db.php';

if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: admin_products.php");
    exit;
}


/* =====================================================
   GET DATA
===================================================== */

$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

$name = trim($_POST['name'] ?? '');
$category = trim($_POST['category'] ?? '');
$sku = trim($_POST['sku'] ?? '');

$price = isset($_POST['price'])
    ? (float)$_POST['price']
    : 0;

$old_price = isset($_POST['old_price'])
    ? (float)$_POST['old_price']
    : 0;

$stock = isset($_POST['stock'])
    ? (int)$_POST['stock']
    : 0;

$image = trim($_POST['image'] ?? '');

$sizes = trim($_POST['sizes'] ?? '');
if ($sizes === '') {
    $sizes = in_array(strtolower($category), ['jeans', 'trousers']) ? '30,32,34,36,38' : 'S,M,L,XL,XXL';
}

$description = trim($_POST['description'] ?? '');

$status = isset($_POST['status']) ? 1 : 0;

$new_arrival = isset($_POST['new_arrival']) ? 1 : 0;


/* =====================================================
   VALIDATION
===================================================== */

if ($name === '') {

    $_SESSION['product_error'] =
        'Product name is required.';

    header(
        "Location: admin_product_form.php" .
        ($id > 0 ? "?id=" . $id : "")
    );

    exit;
}


if ($category === '') {

    $_SESSION['product_error'] =
        'Please select a category.';

    header(
        "Location: admin_product_form.php" .
        ($id > 0 ? "?id=" . $id : "")
    );

    exit;
}


if ($price < 0) {

    $_SESSION['product_error'] =
        'Price cannot be negative.';

    header(
        "Location: admin_product_form.php" .
        ($id > 0 ? "?id=" . $id : "")
    );

    exit;
}


if ($stock < 0) {

    $_SESSION['product_error'] =
        'Stock cannot be negative.';

    header(
        "Location: admin_product_form.php" .
        ($id > 0 ? "?id=" . $id : "")
    );

    exit;
}


/* =====================================================
   UPDATE EXISTING PRODUCT
===================================================== */

if ($id > 0) {

    /*
       IMPORTANT:
       First check that this product actually exists.
    */

    $check = $conn->prepare("
        SELECT id
        FROM products
        WHERE id = ?
        LIMIT 1
    ");

    if (!$check) {

        $_SESSION['product_error'] =
            'Database error: ' . $conn->error;

        header(
            "Location: admin_product_form.php?id=" . $id
        );

        exit;
    }

    $check->bind_param("i", $id);

    $check->execute();

    $check_result = $check->get_result();

    if (!$check_result || $check_result->num_rows === 0) {

        $check->close();

        $_SESSION['product_error'] =
            'Product not found.';

        header("Location: admin_products.php");

        exit;
    }

    $check->close();


    /*
       Check SKU.

       SKU must be unique, but the current product
       is allowed to keep its own SKU.
    */

    if ($sku !== '') {

        $sku_check = $conn->prepare("
            SELECT id
            FROM products
            WHERE sku = ?
            AND id != ?
            LIMIT 1
        ");

        if (!$sku_check) {

            $_SESSION['product_error'] =
                'Database error: ' . $conn->error;

            header(
                "Location: admin_product_form.php?id=" . $id
            );

            exit;
        }

        $sku_check->bind_param(
            "si",
            $sku,
            $id
        );

        $sku_check->execute();

        $sku_result = $sku_check->get_result();

        if ($sku_result && $sku_result->num_rows > 0) {

            $sku_check->close();

            $_SESSION['product_error'] =
                'This SKU is already used by another product.';

            header(
                "Location: admin_product_form.php?id=" . $id
            );

            exit;
        }

        $sku_check->close();
    }


    /*
       UPDATE PRODUCT
    */

    $stmt = $conn->prepare("
        UPDATE products
        SET
            name = ?,
            category = ?,
            sku = ?,
            price = ?,
            old_price = ?,
            stock = ?,
            image = ?,
            sizes = ?,
            description = ?,
            status = ?,
            new_arrival = ?
        WHERE id = ?
    ");

    if (!$stmt) {

        $_SESSION['product_error'] =
            'Database error: ' . $conn->error;

        header(
            "Location: admin_product_form.php?id=" . $id
        );

        exit;
    }


    $stmt->bind_param(
        "sssddisssiii",
        $name,
        $category,
        $sku,
        $price,
        $old_price,
        $stock,
        $image,
        $sizes,
        $description,
        $status,
        $new_arrival,
        $id
    );


    if ($stmt->execute()) {

        $_SESSION['product_success'] =
            'Product updated successfully. Stock is now ' .
            $stock . '.';

    } else {

        $_SESSION['product_error'] =
            'Unable to update product: ' .
            $stmt->error;
    }


    $stmt->close();

    header("Location: admin_products.php");

    exit;
}


/* =====================================================
   ADD NEW PRODUCT
===================================================== */

if ($id === 0) {

    /*
       Check SKU before INSERT.
    */

    if ($sku !== '') {

        $sku_check = $conn->prepare("
            SELECT id
            FROM products
            WHERE sku = ?
            LIMIT 1
        ");

        if (!$sku_check) {

            $_SESSION['product_error'] =
                'Database error: ' . $conn->error;

            header("Location: admin_product_form.php");

            exit;
        }

        $sku_check->bind_param(
            "s",
            $sku
        );

        $sku_check->execute();

        $sku_result = $sku_check->get_result();

        if ($sku_result && $sku_result->num_rows > 0) {

            $sku_check->close();

            $_SESSION['product_error'] =
                'This SKU already exists. Please use a different SKU.';

            header("Location: admin_product_form.php");

            exit;
        }

        $sku_check->close();
    }


    /*
       INSERT NEW PRODUCT
    */

    $stmt = $conn->prepare("
        INSERT INTO products
        (
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
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {

        $_SESSION['product_error'] =
            'Database error: ' . $conn->error;

        header("Location: admin_product_form.php");

        exit;
    }


    $stmt->bind_param(
        "sssddisssii",
        $name,
        $category,
        $sku,
        $price,
        $old_price,
        $stock,
        $image,
        $sizes,
        $description,
        $status,
        $new_arrival
    );


    if ($stmt->execute()) {

        $_SESSION['product_success'] =
            'Product added successfully.';

    } else {

        $_SESSION['product_error'] =
            'Unable to add product: ' .
            $stmt->error;
    }


    $stmt->close();

    header("Location: admin_products.php");

    exit;
}

?>