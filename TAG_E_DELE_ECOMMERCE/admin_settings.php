<?php

require_once 'functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_id'])) {
    header("Location: admin_login.php");
    exit;
}

/* =========================================================
   CREATE SETTINGS TABLE
========================================================= */

$conn->query("
    CREATE TABLE IF NOT EXISTS shop_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        shop_name VARCHAR(150) NOT NULL DEFAULT 'TAG É DEL É',
        phone VARCHAR(50) DEFAULT '',
        email VARCHAR(150) DEFAULT '',
        address TEXT,
        currency VARCHAR(20) DEFAULT '₹',
        logo VARCHAR(255) DEFAULT 'shop_logo.png',
        tagline VARCHAR(255) DEFAULT '',

        cod_enabled TINYINT(1) DEFAULT 1,
        online_enabled TINYINT(1) DEFAULT 1,
        upi_enabled TINYINT(1) DEFAULT 1,
        card_enabled TINYINT(1) DEFAULT 1,
        netbanking_enabled TINYINT(1) DEFAULT 1,

        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
");

/* =========================================================
   ADD PAYMENT COLUMNS IF OLD TABLE ALREADY EXISTS
========================================================= */

$columns = [
    'cod_enabled',
    'online_enabled',
    'upi_enabled',
    'card_enabled',
    'netbanking_enabled'
];

foreach ($columns as $column) {

    $check = $conn->query("
        SHOW COLUMNS FROM shop_settings
        LIKE '$column'
    ");

    if ($check && $check->num_rows == 0) {

        $conn->query("
            ALTER TABLE shop_settings
            ADD `$column` TINYINT(1) DEFAULT 1
        ");
    }
}


/* =========================================================
   GET SETTINGS
========================================================= */

$result = $conn->query("
    SELECT *
    FROM shop_settings
    ORDER BY id ASC
    LIMIT 1
");

if ($result && $result->num_rows > 0) {

    $settings = $result->fetch_assoc();

} else {

    $settings = [

        'id' => 0,

        'shop_name' => 'TAG É DEL É',

        'phone' => '',

        'email' => '',

        'address' => '',

        'currency' => '₹',

        'logo' => 'shop_logo.png',

        'tagline' => 'Premium Men’s Fashion',

        'cod_enabled' => 1,

        'online_enabled' => 1,

        'upi_enabled' => 1,

        'card_enabled' => 1,

        'netbanking_enabled' => 1
    ];
}


/* =========================================================
   SAVE SETTINGS
========================================================= */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $shop_name = trim($_POST['shop_name'] ?? '');

    $phone = trim($_POST['phone'] ?? '');

    $email = trim($_POST['email'] ?? '');

    $address = trim($_POST['address'] ?? '');

    $currency = trim($_POST['currency'] ?? '₹');

    $tagline = trim($_POST['tagline'] ?? '');


    /* PAYMENT SETTINGS */

    $cod_enabled =
        isset($_POST['cod_enabled']) ? 1 : 0;

    $online_enabled =
        isset($_POST['online_enabled']) ? 1 : 0;

    $upi_enabled =
        isset($_POST['upi_enabled']) ? 1 : 0;

    $card_enabled =
        isset($_POST['card_enabled']) ? 1 : 0;

    $netbanking_enabled =
        isset($_POST['netbanking_enabled']) ? 1 : 0;


    /* =====================================================
       VALIDATION
    ===================================================== */

    if ($shop_name === '') {

        $_SESSION['settings_error'] =
            'Shop name is required.';

        header("Location: admin_settings.php");

        exit;
    }


    if (
        $email !== '' &&
        !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {

        $_SESSION['settings_error'] =
            'Please enter a valid email address.';

        header("Location: admin_settings.php");

        exit;
    }


    /* =====================================================
       LOGO UPLOAD
    ===================================================== */

    $logo =
        $settings['logo'] ?? 'shop_logo.png';


    if (
        isset($_FILES['logo']) &&
        $_FILES['logo']['error'] === UPLOAD_ERR_OK
    ) {

        $uploadDir =
            __DIR__ . '/uploads/';


        if (!is_dir($uploadDir)) {

            mkdir(
                $uploadDir,
                0777,
                true
            );
        }


        $allowedTypes = [

            'image/jpeg',

            'image/png',

            'image/webp',

            'image/gif'
        ];


        $fileType =
            mime_content_type(
                $_FILES['logo']['tmp_name']
            );


        if (in_array(
            $fileType,
            $allowedTypes
        )) {

            $extension =
                strtolower(
                    pathinfo(
                        $_FILES['logo']['name'],
                        PATHINFO_EXTENSION
                    )
                );


            $newFileName =
                'shop_logo_' .
                time() .
                '.' .
                $extension;


            $destination =
                $uploadDir .
                $newFileName;


            if (
                move_uploaded_file(
                    $_FILES['logo']['tmp_name'],
                    $destination
                )
            ) {

                $logo =
                    'uploads/' .
                    $newFileName;
            }
        }
    }


    /* =====================================================
       UPDATE EXISTING SETTINGS
    ===================================================== */

    if ((int)$settings['id'] > 0) {

        $stmt = $conn->prepare("
            UPDATE shop_settings
            SET
                shop_name = ?,
                phone = ?,
                email = ?,
                address = ?,
                currency = ?,
                logo = ?,
                tagline = ?,

                cod_enabled = ?,
                online_enabled = ?,
                upi_enabled = ?,
                card_enabled = ?,
                netbanking_enabled = ?

            WHERE id = ?
        ");


        if (!$stmt) {

            $_SESSION['settings_error'] =
                'Database error: ' .
                $conn->error;

            header(
                "Location: admin_settings.php"
            );

            exit;
        }


        $settingsId =
            (int)$settings['id'];


        $stmt->bind_param(
            "sssssssiiiiii",

            $shop_name,

            $phone,

            $email,

            $address,

            $currency,

            $logo,

            $tagline,

            $cod_enabled,

            $online_enabled,

            $upi_enabled,

            $card_enabled,

            $netbanking_enabled,

            $settingsId
        );


    } else {

        /* =================================================
           INSERT FIRST SETTINGS
        ================================================= */

        $stmt = $conn->prepare("
            INSERT INTO shop_settings
            (
                shop_name,
                phone,
                email,
                address,
                currency,
                logo,
                tagline,

                cod_enabled,
                online_enabled,
                upi_enabled,
                card_enabled,
                netbanking_enabled
            )

            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            )
        ");


        if (!$stmt) {

            $_SESSION['settings_error'] =
                'Database error: ' .
                $conn->error;

            header(
                "Location: admin_settings.php"
            );

            exit;
        }


        $stmt->bind_param(
            "sssssssiiiii",

            $shop_name,

            $phone,

            $email,

            $address,

            $currency,

            $logo,

            $tagline,

            $cod_enabled,

            $online_enabled,

            $upi_enabled,

            $card_enabled,

            $netbanking_enabled
        );
    }


    /* =====================================================
       SAVE
    ===================================================== */

    if ($stmt->execute()) {

        $_SESSION['settings_success'] =
            'Shop and payment settings updated successfully.';

    } else {

        $_SESSION['settings_error'] =
            'Unable to save settings: ' .
            $stmt->error;
    }


    $stmt->close();


    header(
        "Location: admin_settings.php"
    );

    exit;
}


/* =========================================================
   MESSAGES
========================================================= */

$success =
    $_SESSION['settings_success'] ?? '';

$error =
    $_SESSION['settings_error'] ?? '';

unset($_SESSION['settings_success']);

unset($_SESSION['settings_error']);

?>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Shop Settings | TAG É DEL É
</title>


<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background: #f5f6f8;

    color: #171717;
}


/* =========================================================
   TOP BAR
========================================================= */

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

    box-shadow:
        0 3px 15px rgba(0,0,0,.15);
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


/* =========================================================
   LAYOUT
========================================================= */

.layout {

    display: flex;

    min-height:
        calc(100vh - 72px);
}


/* =========================================================
   SIDEBAR
========================================================= */

.sidebar {

    width: 235px;

    background: #fff;

    border-right:
        1px solid #e5e5e5;

    padding: 25px 15px;

    flex-shrink: 0;
}


.sidebar-title {

    color: #999;

    font-size: 10px;

    font-weight: bold;

    text-transform: uppercase;

    letter-spacing: 1.2px;

    margin:
        5px 12px 12px;
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


/* =========================================================
   MAIN
========================================================= */

.main {

    flex: 1;

    padding: 30px;

    min-width: 0;
}


.page-header {

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


/* =========================================================
   ALERTS
========================================================= */

.alert {

    padding: 14px 16px;

    border-radius: 10px;

    margin-bottom: 20px;

    font-size: 13px;
}


.success {

    background: #eaf8ef;

    border: 1px solid #c9efd6;

    color: #18803f;
}


.error {

    background: #fff0f0;

    border: 1px solid #ffd0d0;

    color: #c62828;
}


/* =========================================================
   GRID
========================================================= */

.settings-grid {

    display: grid;

    grid-template-columns:
        minmax(0, 1fr)
        330px;

    gap: 22px;

    align-items: start;
}


/* =========================================================
   CARD
========================================================= */

.card {

    background: #fff;

    border:
        1px solid #e6e6e6;

    border-radius: 16px;

    padding: 25px;

    box-shadow:
        0 3px 15px rgba(0,0,0,.025);

    margin-bottom: 22px;
}


.card-header {

    padding-bottom: 18px;

    border-bottom:
        1px solid #eee;

    margin-bottom: 22px;
}


.card-header h2 {

    font-size: 17px;
}


.card-header p {

    color: #888;

    font-size: 12px;

    margin-top: 5px;
}


/* =========================================================
   FORM
========================================================= */

.form-group {

    margin-bottom: 20px;
}


.form-group label {

    display: block;

    font-size: 12px;

    font-weight: bold;

    color: #333;

    margin-bottom: 8px;
}


.input,
.textarea,
.select {

    width: 100%;

    border:
        1px solid #ddd;

    border-radius: 9px;

    padding: 13px;

    font-size: 13px;

    outline: none;

    background: #fff;
}


.textarea {

    resize: vertical;

    min-height: 100px;
}


.input:focus,
.textarea:focus,
.select:focus {

    border-color: #111;

    box-shadow:
        0 0 0 3px rgba(0,0,0,.06);
}


.form-row {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 15px;
}


/* =========================================================
   PAYMENT
========================================================= */

.payment-list {

    display: grid;

    gap: 12px;
}


.payment-option {

    display: flex;

    align-items: center;

    justify-content: space-between;

    padding: 15px;

    border:
        1px solid #e5e5e5;

    border-radius: 12px;

    background: #fafafa;

    transition: .2s;
}


.payment-option:hover {

    border-color: #bbb;

    background: #fff;
}


.payment-info {

    display: flex;

    align-items: center;

    gap: 12px;
}


.payment-icon {

    width: 42px;

    height: 42px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 10px;

    background: #111;

    color: #fff;

    font-size: 18px;
}


.payment-name {

    font-size: 13px;

    font-weight: bold;
}


.payment-description {

    font-size: 10px;

    color: #999;

    margin-top: 4px;
}


/* =========================================================
   TOGGLE
========================================================= */

.switch {

    position: relative;

    display: inline-block;

    width: 48px;

    height: 26px;
}


.switch input {

    opacity: 0;

    width: 0;

    height: 0;
}


.slider {

    position: absolute;

    cursor: pointer;

    inset: 0;

    background: #ccc;

    border-radius: 30px;

    transition: .3s;
}


.slider:before {

    content: "";

    position: absolute;

    width: 20px;

    height: 20px;

    left: 3px;

    top: 3px;

    background: white;

    border-radius: 50%;

    transition: .3s;

    box-shadow:
        0 1px 4px rgba(0,0,0,.2);
}


.switch input:checked + .slider {

    background: #111;
}


.switch input:checked + .slider:before {

    transform:
        translateX(22px);
}


/* =========================================================
   LOGO
========================================================= */

.logo-preview {

    width: 150px;

    height: 150px;

    border:
        1px solid #eee;

    border-radius: 15px;

    background: #fafafa;

    display: flex;

    align-items: center;

    justify-content: center;

    margin: 0 auto 18px;

    overflow: hidden;
}


.logo-preview img {

    width: 100%;

    height: 100%;

    object-fit: contain;

    padding: 12px;
}


.file-input {

    width: 100%;

    font-size: 12px;
}


/* =========================================================
   BUTTON
========================================================= */

.save-btn {

    border: none;

    background: #111;

    color: #fff;

    padding: 14px 25px;

    border-radius: 9px;

    font-size: 13px;

    font-weight: bold;

    cursor: pointer;

    width: 100%;

    transition: .2s;
}


.save-btn:hover {

    background: #d71920;

    transform:
        translateY(-1px);
}


/* =========================================================
   INFO
========================================================= */

.info-box {

    background: #f8f8f8;

    border-radius: 12px;

    padding: 17px;

    margin-top: 20px;
}


.info-box h3 {

    font-size: 13px;

    margin-bottom: 10px;
}


.info-box p {

    color: #777;

    font-size: 11px;

    line-height: 1.7;
}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:1000px) {

    .settings-grid {

        grid-template-columns: 1fr;
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

}


@media(max-width:600px) {

    .form-row {

        grid-template-columns: 1fr;
    }

    .page-header h1 {

        font-size: 23px;
    }

}

</style>

</head>


<body>


<header class="topbar">

    <div class="brand">

        <img
            src="<?= htmlspecialchars(
                $settings['logo'] ?: 'shop_logo.png'
            ) ?>"
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


<aside class="sidebar">

    <div class="sidebar-title">
        Main Menu
    </div>


    <a href="admin.php">

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


    <div
        class="sidebar-title"
        style="margin-top:25px;"
    >
        Store
    </div>


    <a
        href="admin_settings.php"
        class="active"
    >

        <span class="sidebar-icon">⚙</span>

        Shop Settings

    </a>


    <a href="index.php">

        <span class="sidebar-icon">◉</span>

        View Store

    </a>


    <div
        class="sidebar-title"
        style="margin-top:25px;"
    >
        Account
    </div>


    <a href="admin_logout.php">

        <span class="sidebar-icon">↪</span>

        Logout

    </a>

</aside>


<main class="main">


<div class="page-header">

    <h1>
        Shop Settings
    </h1>

    <p>
        Manage your store information, branding and payment methods.
    </p>

</div>


<?php if ($success): ?>

<div class="alert success">

    ✓ <?= htmlspecialchars($success) ?>

</div>

<?php endif; ?>


<?php if ($error): ?>

<div class="alert error">

    ✕ <?= htmlspecialchars($error) ?>

</div>

<?php endif; ?>


<form
    method="POST"
    enctype="multipart/form-data"
>


<div class="settings-grid">


<!-- =====================================================
     LEFT SIDE
====================================================== -->

<div>


<div class="card">

<div class="card-header">

<h2>
    Store Information
</h2>

<p>
    Update the information displayed on your website.
</p>

</div>


<div class="form-group">

<label>
    Shop Name *
</label>

<input
    type="text"
    name="shop_name"
    class="input"
    value="<?= htmlspecialchars(
        $settings['shop_name']
    ) ?>"
    required
>

</div>


<div class="form-group">

<label>
    Tagline
</label>

<input
    type="text"
    name="tagline"
    class="input"
    value="<?= htmlspecialchars(
        $settings['tagline']
    ) ?>"
    placeholder="Premium Men's Fashion"
>

</div>


<div class="form-row">


<div class="form-group">

<label>
    Phone Number
</label>

<input
    type="text"
    name="phone"
    class="input"
    value="<?= htmlspecialchars(
        $settings['phone']
    ) ?>"
    placeholder="+91 XXXXX XXXXX"
>

</div>


<div class="form-group">

<label>
    Email Address
</label>

<input
    type="email"
    name="email"
    class="input"
    value="<?= htmlspecialchars(
        $settings['email']
    ) ?>"
    placeholder="shop@example.com"
>

</div>


</div>


<div class="form-group">

<label>
    Shop Address
</label>

<textarea
    name="address"
    class="textarea"
    placeholder="Enter complete shop address"
><?= htmlspecialchars(
    $settings['address']
) ?></textarea>

</div>


<div class="form-row">


<div class="form-group">

<label>
    Currency
</label>

<select
    name="currency"
    class="select"
>

<option
    value="₹"
    <?= $settings['currency'] === '₹'
        ? 'selected'
        : ''
    ?>
>
    ₹ Indian Rupee
</option>

<option
    value="$"
    <?= $settings['currency'] === '$'
        ? 'selected'
        : ''
    ?>
>
    $ US Dollar
</option>

<option
    value="€"
    <?= $settings['currency'] === '€'
        ? 'selected'
        : ''
    ?>
>
    € Euro
</option>

<option
    value="£"
    <?= $settings['currency'] === '£'
        ? 'selected'
        : ''
    ?>
>
    £ Pound
</option>

</select>

</div>


<div class="form-group">

<label>
    Store Status
</label>

<select
    class="select"
    disabled
>

<option>
    Store Online
</option>

</select>

</div>


</div>

</div>


<!-- =====================================================
     PAYMENT METHODS
====================================================== -->

<div class="card">

<div class="card-header">

<h2>
    💳 Payment Methods
</h2>

<p>
    Turn payment methods ON or OFF for customers.
</p>

</div>


<div class="payment-list">


<!-- COD -->

<div class="payment-option">

<div class="payment-info">

<div class="payment-icon">
    💵
</div>

<div>

<div class="payment-name">
    Cash on Delivery
</div>

<div class="payment-description">
    Customer pays when the order is delivered.
</div>

</div>

</div>


<label class="switch">

<input
    type="checkbox"
    name="cod_enabled"
    <?= !empty($settings['cod_enabled'])
        ? 'checked'
        : ''
    ?>
>

<span class="slider"></span>

</label>

</div>


<!-- ONLINE -->

<div class="payment-option">

<div class="payment-info">

<div class="payment-icon">
    💳
</div>

<div>

<div class="payment-name">
    Online Payment
</div>

<div class="payment-description">
    Allow customers to pay online.
</div>

</div>

</div>


<label class="switch">

<input
    type="checkbox"
    name="online_enabled"
    <?= !empty($settings['online_enabled'])
        ? 'checked'
        : ''
    ?>
>

<span class="slider"></span>

</label>

</div>


<!-- UPI -->

<div class="payment-option">

<div class="payment-info">

<div class="payment-icon">
    📱
</div>

<div>

<div class="payment-name">
    UPI
</div>

<div class="payment-description">
    Google Pay, PhonePe, Paytm and other UPI apps.
</div>

</div>

</div>


<label class="switch">

<input
    type="checkbox"
    name="upi_enabled"
    <?= !empty($settings['upi_enabled'])
        ? 'checked'
        : ''
    ?>
>

<span class="slider"></span>

</label>

</div>


<!-- CARD -->

<div class="payment-option">

<div class="payment-info">

<div class="payment-icon">
    💳
</div>

<div>

<div class="payment-name">
    Credit / Debit Card
</div>

<div class="payment-description">
    Visa, Mastercard and supported cards.
</div>

</div>

</div>


<label class="switch">

<input
    type="checkbox"
    name="card_enabled"
    <?= !empty($settings['card_enabled'])
        ? 'checked'
        : ''
    ?>
>

<span class="slider"></span>

</label>

</div>


<!-- NET BANKING -->

<div class="payment-option">

<div class="payment-info">

<div class="payment-icon">
    🏦
</div>

<div>

<div class="payment-name">
    Net Banking
</div>

<div class="payment-description">
    Customers can pay through their bank.
</div>

</div>

</div>


<label class="switch">

<input
    type="checkbox"
    name="netbanking_enabled"
    <?= !empty($settings['netbanking_enabled'])
        ? 'checked'
        : ''
    ?>
>

<span class="slider"></span>

</label>

</div>


</div>

</div>


</div>


<!-- =====================================================
     RIGHT SIDE
====================================================== -->

<div>


<div class="card">

<div class="card-header">

<h2>
    Shop Logo
</h2>

<p>
    Upload your store logo.
</p>

</div>


<div class="logo-preview">

<img
    src="<?= htmlspecialchars(
        $settings['logo']
        ?: 'shop_logo.png'
    ) ?>"
    alt="Shop Logo"
    onerror="
        this.src='shop_logo.png';
    "
>

</div>


<div class="form-group">

<label>
    Change Logo
</label>

<input
    type="file"
    name="logo"
    class="file-input"
    accept=".jpg,.jpeg,.png,.webp,.gif"
>

</div>


<div class="info-box">

<h3>
    💡 Recommended
</h3>

<p>
    Use a clear PNG or JPG logo.
    A square image works best.
    Keep the image below 2 MB.
</p>

</div>


</div>


<button
    type="submit"
    class="save-btn"
>
    SAVE ALL SETTINGS
</button>


</div>


</div>


</form>


</main>

</div>


</body>

</html>