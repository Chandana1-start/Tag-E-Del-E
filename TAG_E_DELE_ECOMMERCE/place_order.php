<?php

require_once 'functions.php';
require_customer();

/* =========================================================
   ONLY ALLOW POST REQUEST
========================================================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('checkout.php');
}


/* =========================================================
   CHECK CUSTOMER SESSION
========================================================= */

if (empty($_SESSION['customer_id'])) {
    flash('error', 'Please login before placing an order.');
    redirect('login.php');
}

$customer_id = (int) $_SESSION['customer_id'];


/* =========================================================
   GET CART ITEMS
========================================================= */

$items = cart_items($conn);

if (!$items) {
    flash('error', 'Your cart is empty.');
    redirect('products.php');
}


/* =========================================================
   CHECKOUT DETAILS
========================================================= */

$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$city    = trim($_POST['city'] ?? '');
$state   = trim($_POST['state'] ?? '');
$pincode = trim($_POST['pincode'] ?? '');

$payment = $_POST['payment_method'] ?? 'COD';


/* =========================================================
   VALIDATE DETAILS
========================================================= */

if (
    !$name ||
    !$phone ||
    !$address ||
    !$city ||
    !$state ||
    !$pincode ||
    !in_array($payment, ['COD', 'UPI', 'RAZORPAY'], true)
) {
    flash('error', 'Please complete all checkout details.');
    redirect('checkout.php');
}


/* =========================================================
   CALCULATE TOTAL
========================================================= */

$total = cart_total($items);


/* =========================================================
   PAYMENT STATUS
========================================================= */

if ($payment === 'COD') {

    $payment_status = 'Pending';

} elseif ($payment === 'UPI') {

    $payment_status = 'Pending UPI';

} else {

    $payment_status = 'Pending Online';

}


/* =========================================================
   ORDER STATUS
========================================================= */

$order_status = 'Pending';


/* =========================================================
   START DATABASE TRANSACTION
========================================================= */

$conn->begin_transaction();

try {

    /* =====================================================
       CHECK STOCK BEFORE CREATING ORDER
    ===================================================== */

    foreach ($items as $i) {

        $check = $conn->prepare(
            'SELECT stock, status
             FROM products
             WHERE id=?
             FOR UPDATE'
        );

        if (!$check) {
            throw new Exception('Unable to check product stock.');
        }

        $product_id = (int) $i['id'];

        $check->bind_param('i', $product_id);
        $check->execute();

        $latest = $check->get_result()->fetch_assoc();

        $check->close();

        if (
            !$latest ||
            !(int) $latest['status'] ||
            (int) $latest['stock'] < (int) $i['qty']
        ) {
            throw new Exception(
                'One or more products are no longer available in the requested quantity.'
            );
        }
    }


    /* =====================================================
       INSERT ORDER
    ===================================================== */

    $s = $conn->prepare(
        'INSERT INTO orders
        (
            customer_id,
            customer_name,
            phone,
            address,
            city,
            state,
            pincode,
            total,
            payment_method,
            payment_status,
            order_status
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )'
    );

    if (!$s) {
        throw new Exception('Unable to create order.');
    }


    /*
     * IMPORTANT:
     * Save the logged-in customer's ID.
     */

    $s->bind_param(
        'isssssssdss',
        $customer_id,
        $name,
        $phone,
        $address,
        $city,
        $state,
        $pincode,
        $total,
        $payment,
        $payment_status,
        $order_status
    );


    if (!$s->execute()) {
        throw new Exception('Unable to save order.');
    }


    $order_id = $s->insert_id;

    $s->close();


    /* =====================================================
       INSERT ORDER ITEMS
    ===================================================== */

    $s2 = $conn->prepare(
        'INSERT INTO order_items
        (
            order_id,
            product_id,
            product_name,
            size,
            price,
            qty,
            line_total
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)'
    );

    if (!$s2) {
        throw new Exception('Unable to create order items.');
    }


    /* =====================================================
       UPDATE PRODUCT STOCK
    ===================================================== */

    $stockStmt = $conn->prepare(
        'UPDATE products
         SET stock = stock - ?
         WHERE id = ?
         AND stock >= ?'
    );

    if (!$stockStmt) {
        throw new Exception('Unable to update product stock.');
    }


    foreach ($items as $i) {

        $product_id   = (int) $i['id'];
        $product_name = $i['name'];
        $size         = (string) ($i['size'] ?? '');
        $price        = (float) $i['price'];
        $qty          = (int) $i['qty'];
        $line         = (float) $i['line_total'];


        /* Save order item */

        $s2->bind_param(
            'iissdid',
            $order_id,
            $product_id,
            $product_name,
            $size,
            $price,
            $qty,
            $line
        );


        if (!$s2->execute()) {
            throw new Exception('Unable to save order item.');
        }


        /* Reduce stock */

        $stockStmt->bind_param(
            'iii',
            $qty,
            $product_id,
            $qty
        );


        if (!$stockStmt->execute()) {
            throw new Exception('Unable to update product stock.');
        }


        if ($stockStmt->affected_rows !== 1) {
            throw new Exception(
                'Stock changed. Please review your cart.'
            );
        }
    }


    $s2->close();
    $stockStmt->close();


    /* =====================================================
       COMPLETE TRANSACTION
    ===================================================== */

    $conn->commit();


    /* =====================================================
       CLEAR CART
    ===================================================== */

    $_SESSION['cart'] = [];


    /* =====================================================
       SAVE LAST ORDER
    ===================================================== */

    $_SESSION['last_order_id'] = $order_id;


    /* =====================================================
       GO TO ORDER SUCCESS PAGE
    ===================================================== */

    redirect('order_success.php?id=' . $order_id);


} catch (Throwable $e) {

    /* =====================================================
       ROLLBACK IF SOMETHING FAILS
    ===================================================== */

    $conn->rollback();

    flash(
        'error',
        'Could not place order. Please try again.'
    );

    redirect('checkout.php');
}

?>
