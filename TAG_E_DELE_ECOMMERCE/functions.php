<?php

/* =========================================================
   SESSION
========================================================= */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


/* =========================================================
   DATABASE
========================================================= */

require_once __DIR__ . '/db.php';


/* =========================================================
   SHOP SETTINGS
========================================================= */

if (!defined('SHOP_NAME')) {
    define('SHOP_NAME', 'TAG É DEL É');
}

if (!defined('SHOP_PHONE')) {
    define('SHOP_PHONE', '');
}

if (!defined('SHOP_EMAIL')) {
    define('SHOP_EMAIL', '');
}

if (!defined('SHOP_ADDRESS')) {
    define('SHOP_ADDRESS', '');
}

if (!defined('UPI_ID')) {
    define('UPI_ID', '');
}

if (!defined('CURRENCY')) {
    define('CURRENCY', '₹');
}


/* =========================================================
   HTML ESCAPE
========================================================= */

if (!function_exists('e')) {
    function e($value)
    {
        return htmlspecialchars(
            (string)$value,
            ENT_QUOTES,
            'UTF-8'
        );
    }
}


/* =========================================================
   MONEY
========================================================= */

if (!function_exists('money')) {
    function money($amount)
    {
        return CURRENCY . number_format(
            (float)$amount,
            2
        );
    }
}


/* =========================================================
   REDIRECT
========================================================= */

if (!function_exists('redirect')) {
    function redirect($url)
    {
        header('Location: ' . $url);
        exit;
    }
}


/* =========================================================
   FLASH MESSAGE
========================================================= */

if (!function_exists('set_flash')) {
    function set_flash($message, $type = 'success')
    {
        $_SESSION['flash'] = array(
            'message' => $message,
            'type' => $type
        );
    }
}


/* Compatible with flash('success','message') */

if (!function_exists('flash')) {
    function flash($type, $message)
    {
        set_flash($message, $type);
    }
}


/* =========================================================
   GET FLASH
========================================================= */

if (!function_exists('get_flash')) {
    function get_flash()
    {
        if (!isset($_SESSION['flash'])) {
            return '';
        }

        $flash = $_SESSION['flash'];

        unset($_SESSION['flash']);

        if (is_array($flash)) {

            $message = isset($flash['message'])
                ? $flash['message']
                : '';

            $type = isset($flash['type'])
                ? $flash['type']
                : 'success';

            if ($message === '') {
                return '';
            }

            return '<div class="flash-message flash-' .
                e($type) .
                '">' .
                e($message) .
                '</div>';
        }

        return '<div class="flash-message flash-success">' .
            e($flash) .
            '</div>';
    }
}


/* =========================================================
   ADMIN
========================================================= */

if (!function_exists('is_admin')) {
    function is_admin()
    {
        return !empty($_SESSION['admin_id']);
    }
}


if (!function_exists('require_admin')) {
    function require_admin()
    {
        if (!is_admin()) {
            redirect('admin_login.php');
        }
    }
}


/* =========================================================
   CUSTOMER
========================================================= */

if (!function_exists('is_customer')) {
    function is_customer()
    {
        return !empty($_SESSION['customer_id']);
    }
}


if (!function_exists('customer_id')) {
    function customer_id()
    {
        return isset($_SESSION['customer_id'])
            ? (int)$_SESSION['customer_id']
            : 0;
    }
}


if (!function_exists('customer_name')) {
    function customer_name()
    {
        return isset($_SESSION['customer_name'])
            ? $_SESSION['customer_name']
            : '';
    }
}


/* =========================================================
   REQUIRE CUSTOMER
========================================================= */

if (!function_exists('require_customer')) {
    function require_customer()
    {
        if (!is_customer()) {

            $_SESSION['login_redirect'] = 'checkout.php';

            set_flash(
                'Please login before proceeding to checkout.',
                'error'
            );

            header(
                'Location: login.php?redirect=checkout.php'
            );

            exit;
        }
    }
}


/* =========================================================
   CART INITIALIZATION
========================================================= */

if (
    !isset($_SESSION['cart']) ||
    !is_array($_SESSION['cart'])
) {
    $_SESSION['cart'] = array();
}


/* =========================================================
   ADD TO CART (WITH SIZE SUPPORT)
========================================================= */

if (!function_exists('add_to_cart')) {
    function add_to_cart($product_id, $quantity = 1, $size = '')
    {
        $product_id = (int)$product_id;
        $quantity = (int)$quantity;
        $size = trim((string)$size);

        if ($product_id <= 0) {
            return false;
        }

        if ($quantity <= 0) {
            $quantity = 1;
        }

        if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
            $_SESSION['cart'] = array();
        }

        $cart_key = $product_id . ($size !== '' ? ':' . $size : '');

        if (!isset($_SESSION['cart'][$cart_key])) {
            $_SESSION['cart'][$cart_key] = 0;
        }

        $_SESSION['cart'][$cart_key] += $quantity;

        return true;
    }
}


/* =========================================================
   CART COUNT
========================================================= */

if (!function_exists('cart_count')) {
    function cart_count()
    {
        $count = 0;

        if (
            isset($_SESSION['cart']) &&
            is_array($_SESSION['cart'])
        ) {
            foreach ($_SESSION['cart'] as $quantity) {
                $quantity = (int)$quantity;
                if ($quantity > 0) {
                    $count += $quantity;
                }
            }
        }

        return $count;
    }
}


/* =========================================================
   STOCK STATUS
========================================================= */

if (!function_exists('stock_status')) {
    function stock_status($stock)
    {
        $stock = (int)$stock;

        if ($stock <= 0) {
            return 'Out of Stock';
        }

        if ($stock <= 5) {
            return 'Only ' . $stock . ' left';
        }

        return 'In Stock';
    }
}


if (!function_exists('stock_class')) {
    function stock_class($stock)
    {
        $stock = (int)$stock;

        if ($stock <= 0) {
            return 'out';
        }

        if ($stock <= 5) {
            return 'low';
        }

        return 'in';
    }
}


/* =========================================================
   CART ITEMS
========================================================= */

if (!function_exists('cart_items')) {
    function cart_items()
    {
        global $conn;

        $items = array();

        if (
            !isset($_SESSION['cart']) ||
            !is_array($_SESSION['cart']) ||
            empty($_SESSION['cart'])
        ) {
            return $items;
        }

        foreach ($_SESSION['cart'] as $cart_key => $quantity) {

            $parts = explode(':', (string)$cart_key, 2);
            $product_id = (int)$parts[0];
            $size = isset($parts[1]) ? $parts[1] : '';
            $quantity = (int)$quantity;

            if (
                $product_id <= 0 ||
                $quantity <= 0
            ) {
                continue;
            }

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
                    description,
                    status,
                    new_arrival
                FROM products
                WHERE id = ?
                LIMIT 1
            ");

            if (!$stmt) {
                continue;
            }

            $stmt->bind_param(
                'i',
                $product_id
            );

            $stmt->execute();

            $result = $stmt->get_result();

            if (
                $result &&
                $result->num_rows > 0
            ) {

                $product = $result->fetch_assoc();

                $current_stock =
                    (int)$product['stock'];

                /*
                 * Product no longer available
                 */
                if (
                    (int)$product['status'] !== 1 ||
                    $current_stock <= 0
                ) {

                    unset(
                        $_SESSION['cart'][$cart_key]
                    );

                    $stmt->close();

                    continue;
                }

                /*
                 * Do not allow cart quantity
                 * above available stock.
                 */
                if ($quantity > $current_stock) {

                    $quantity = $current_stock;

                    $_SESSION['cart'][$cart_key] =
                        $current_stock;
                }

                $product['cart_key'] = (string)$cart_key;
                $product['size'] = $size;
                $product['qty'] = $quantity;
                $product['quantity'] = $quantity;

                $product['line_total'] =
                    (float)$product['price']
                    * $quantity;

                $product['subtotal'] =
                    (float)$product['price']
                    * $quantity;

                $product['stock_status'] =
                    stock_status($current_stock);

                $product['stock_class'] =
                    stock_class($current_stock);

                $items[] = $product;
            }

            $stmt->close();
        }

        return $items;
    }
}


/* =========================================================
   CART TOTAL
========================================================= */

if (!function_exists('cart_total')) {
    function cart_total($items = null)
    {
        if ($items === null) {
            $items = cart_items();
        }

        $total = 0;

        foreach ($items as $item) {

            if (isset($item['line_total'])) {

                $total +=
                    (float)$item['line_total'];

            } elseif (isset($item['subtotal'])) {

                $total +=
                    (float)$item['subtotal'];

            } else {

                $total +=
                    (float)$item['price']
                    * (int)$item['qty'];
            }
        }

        return $total;
    }
}


/* =========================================================
   UPDATE CART
========================================================= */

if (!function_exists('update_cart_item')) {
    function update_cart_item(
        $cart_key,
        $quantity
    ) {
        $quantity = (int)$quantity;

        if ($quantity <= 0) {

            unset(
                $_SESSION['cart'][$cart_key]
            );

            return true;
        }

        $_SESSION['cart'][$cart_key] =
            $quantity;

        return true;
    }
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

if (!function_exists('remove_from_cart')) {
    function remove_from_cart($cart_key)
    {
        unset(
            $_SESSION['cart'][$cart_key]
        );

        return true;
    }
}


/* =========================================================
   CLEAR CART
========================================================= */

if (!function_exists('clear_cart')) {
    function clear_cart()
    {
        $_SESSION['cart'] = array();

        return true;
    }
}


/* =========================================================
   PRODUCT STOCK CHECK
========================================================= */

if (!function_exists('product_in_stock')) {
    function product_in_stock($product_id)
    {
        global $conn;

        $product_id = (int)$product_id;

        if ($product_id <= 0) {
            return false;
        }

        $stmt = $conn->prepare("
            SELECT stock
            FROM products
            WHERE id = ?
            AND status = 1
            LIMIT 1
        ");

        if (!$stmt) {
            return false;
        }

        $stmt->bind_param(
            'i',
            $product_id
        );

        $stmt->execute();

        $result =
            $stmt->get_result();

        if (
            !$result ||
            $result->num_rows === 0
        ) {

            $stmt->close();

            return false;
        }

        $product =
            $result->fetch_assoc();

        $stmt->close();

        return
            (int)$product['stock'] > 0;
    }
}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

if (!function_exists('product_image')) {
    function product_image($image)
    {
        $image = trim(
            (string)$image
        );

        if ($image === '') {
            return 'shop_logo.png';
        }

        // Map any old SVG placeholders to realistic fashion photography
        $svgMap = array(
            'product_shirt_1.svg' => 'images/classic-formal-shirt.jpg',
            'product_shirt_2.svg' => 'images/premium-white-shirt.jpg',
            'product_tshirt_1.svg' => 'images/essential-black-tshirt.jpg',
            'product_tshirt_2.svg' => 'images/urban-polo-tshirt.jpg',
            'product_jeans_1.svg' => 'images/slim-fit-blue-jeans.jpg',
            'product_jeans_2.svg' => 'images/dark-wash-jeans.jpg',
            'product_trouser_1.svg' => 'images/casual-cotton-trousers.jpg',
            'product_jacket_1.svg' => 'images/classic-casual-jacket.jpg'
        );

        if (isset($svgMap[$image])) {
            return $svgMap[$image];
        }

        return $image;
    }
}


/* =========================================================
   OLD FORM DATA
========================================================= */

if (!function_exists('old')) {
    function old(
        $key,
        $default = ''
    ) {

        if (
            isset($_SESSION['old']) &&
            isset($_SESSION['old'][$key])
        ) {
            return $_SESSION['old'][$key];
        }

        return $default;
    }
}


/* =========================================================
   CLEAR OLD DATA
========================================================= */

if (!function_exists('clear_old')) {
    function clear_old()
    {
        unset($_SESSION['old']);
    }
}

?>