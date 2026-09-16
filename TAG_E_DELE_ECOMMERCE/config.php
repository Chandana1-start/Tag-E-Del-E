<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


/* DATABASE */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'tag_e_dele_shop');


/* SHOP */

define('SHOP_NAME', 'TAG É DEL É');
define('SHOP_PHONE', '');
define('SHOP_EMAIL', '');
define('SHOP_ADDRESS', '');


/* PAYMENT */

define('UPI_ID', '9876543210@upi');


/* CURRENCY */

define('CURRENCY', '₹');


/* TIMEZONE */

date_default_timezone_set('Asia/Kolkata');

?>
