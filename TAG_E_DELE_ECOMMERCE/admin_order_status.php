<?php

require_once 'functions.php';

/*
|--------------------------------------------------------------------------
| ADMIN ACCESS
|--------------------------------------------------------------------------
*/

if (function_exists('require_admin')) {
    require_admin();
} else {
    /*
     * If your functions.php does not have require_admin(),
     * use your existing admin session check here.
     */
    if (empty($_SESSION['admin_id'])) {
        redirect('admin_login.php');
    }
}


/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $order_id = (int)($_POST['order_id'] ?? 0);
    $order_status = trim($_POST['order_status'] ?? '');
    $payment_status = trim($_POST['payment_status'] ?? '');

    $allowed_order_status = [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    ];

    $allowed_payment_status = [
        'Pending',
        'Pending UPI',
        'Pending Online',
        'Paid',
        'Failed',
        'Refunded'
    ];


    if (
        $order_id <= 0 ||
        !in_array($order_status, $allowed_order_status, true) ||
        !in_array($payment_status, $allowed_payment_status, true)
    ) {

        flash('error', 'Invalid order status or payment status.');
        redirect('admin_order_status.php');
    }


    /*
     * Update order
     */

    $stmt = $conn->prepare(
        'UPDATE orders
         SET order_status = ?, payment_status = ?
         WHERE id = ?'
    );

    if (!$stmt) {
        flash('error', 'Unable to update order.');
        redirect('admin_order_status.php');
    }


    $stmt->bind_param(
        'ssi',
        $order_status,
        $payment_status,
        $order_id
    );


    if ($stmt->execute()) {

        flash(
            'success',
            'Order #' . $order_id . ' updated successfully.'
        );

    } else {

        flash(
            'error',
            'Could not update order.'
        );
    }


    $stmt->close();

    redirect('admin_order_status.php');
}


/*
|--------------------------------------------------------------------------
| SEARCH AND FILTER
|--------------------------------------------------------------------------
*/

$search = trim($_GET['search'] ?? '');
$status = trim($_GET['status'] ?? '');


/*
|--------------------------------------------------------------------------
| GET ORDERS
|--------------------------------------------------------------------------
*/

$sql = "
    SELECT
        id,
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
        order_status,
        created_at
    FROM orders
    WHERE 1=1
";


$params = [];
$types = '';


/*
 * Search
 */

if ($search !== '') {

    $sql .= "
        AND (
            CAST(id AS CHAR) LIKE ?
            OR customer_name LIKE ?
            OR phone LIKE ?
        )
    ";

    $search_like = '%' . $search . '%';

    $params[] = $search_like;
    $params[] = $search_like;
    $params[] = $search_like;

    $types .= 'sss';
}


/*
 * Status filter
 */

if ($status !== '') {

    $sql .= " AND order_status = ?";

    $params[] = $status;

    $types .= 's';
}


$sql .= " ORDER BY id DESC";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    die(
        'Database error: ' .
        htmlspecialchars($conn->error)
    );
}


if ($params) {

    $stmt->bind_param(
        $types,
        ...$params
    );
}


$stmt->execute();

$orders = $stmt->get_result();


$page_title = 'Order Status | ' . SHOP_NAME;

include 'header.php';

?>


<style>

/* =========================================================
   ADMIN ORDER PAGE
========================================================= */

.admin-orders-page{
    padding:35px 20px 60px;
    max-width:1250px;
    margin:auto;
}


/* =========================================================
   PAGE HEADER
========================================================= */

.admin-orders-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    margin-bottom:25px;
    flex-wrap:wrap;
}

.admin-orders-header h1{
    margin:0;
    color:#8B1E3F;
    font-size:30px;
}

.admin-orders-header p{
    margin:6px 0 0;
    color:#777;
}


/* =========================================================
   FILTER CARD
========================================================= */

.order-filter{
    background:#fff;
    padding:20px;
    border-radius:14px;
    box-shadow:0 5px 20px rgba(0,0,0,.08);
    margin-bottom:25px;
}

.order-filter form{
    display:flex;
    gap:12px;
    align-items:end;
    flex-wrap:wrap;
}

.order-filter-group{
    flex:1;
    min-width:180px;
}

.order-filter label{
    display:block;
    font-size:13px;
    font-weight:700;
    margin-bottom:6px;
}

.order-filter input,
.order-filter select{
    width:100%;
    box-sizing:border-box;
    padding:11px 12px;
    border:1px solid #ddd;
    border-radius:8px;
    background:#fff;
    font-size:14px;
}

.order-filter button{
    border:0;
    cursor:pointer;
}


/* =========================================================
   ORDER CARD
========================================================= */

.admin-order-card{
    background:#fff;
    border-radius:16px;
    margin-bottom:22px;
    box-shadow:0 5px 22px rgba(0,0,0,.08);
    overflow:hidden;
    border:1px solid #eee;
}


/* =========================================================
   ORDER HEADER
========================================================= */

.admin-order-top{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:15px;
    padding:18px 20px;
    background:#fafafa;
    border-bottom:1px solid #eee;
    flex-wrap:wrap;
}

.order-number{
    color:#8B1E3F;
    font-size:18px;
    font-weight:800;
}

.order-date{
    color:#777;
    font-size:13px;
    margin-top:4px;
}


/* =========================================================
   ORDER BODY
========================================================= */

.admin-order-body{
    padding:20px;
}

.customer-info{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:15px;
    margin-bottom:20px;
}

.info-box{
    background:#f8f8f8;
    border-radius:10px;
    padding:13px;
}

.info-box small{
    display:block;
    color:#777;
    font-size:12px;
    margin-bottom:4px;
}

.info-box strong{
    font-size:14px;
}


/* =========================================================
   ORDER ITEMS
========================================================= */

.order-items{
    border:1px solid #eee;
    border-radius:10px;
    overflow:hidden;
    margin-bottom:20px;
}

.order-item{
    display:flex;
    justify-content:space-between;
    gap:15px;
    padding:13px 15px;
    border-bottom:1px solid #eee;
}

.order-item:last-child{
    border-bottom:0;
}

.order-item-name{
    font-weight:600;
}

.order-item-price{
    font-weight:700;
}


/* =========================================================
   ORDER FOOTER
========================================================= */

.admin-order-bottom{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    flex-wrap:wrap;
    padding-top:18px;
    border-top:1px solid #eee;
}

.order-total{
    font-size:20px;
    color:#16803C;
    font-weight:800;
}


/* =========================================================
   STATUS
========================================================= */

.status-badge{
    display:inline-flex;
    align-items:center;
    padding:6px 10px;
    border-radius:20px;
    font-size:12px;
    font-weight:800;
    margin-left:5px;
}

.status-pending{
    background:#fff3cd;
    color:#856404;
}

.status-confirmed{
    background:#dbeafe;
    color:#1d4ed8;
}

.status-processing{
    background:#e0e7ff;
    color:#4338ca;
}

.status-shipped{
    background:#ede9fe;
    color:#6d28d9;
}

.status-out{
    background:#cffafe;
    color:#0e7490;
}

.status-delivered{
    background:#dcfce7;
    color:#166534;
}

.status-cancelled{
    background:#fee2e2;
    color:#b91c1c;
}


/* =========================================================
   UPDATE FORM
========================================================= */

.status-update{
    display:flex;
    gap:10px;
    align-items:center;
    flex-wrap:wrap;
}

.status-update select{
    padding:9px 10px;
    border:1px solid #ddd;
    border-radius:8px;
    background:#fff;
    min-width:145px;
}

.update-btn{
    border:0;
    padding:10px 16px;
    border-radius:8px;
    background:#8B1E3F;
    color:#fff;
    font-weight:700;
    cursor:pointer;
    transition:.2s;
}

.update-btn:hover{
    background:#6F1732;
    transform:translateY(-1px);
}


/* =========================================================
   EMPTY
========================================================= */

.no-orders{
    background:#fff;
    padding:50px 20px;
    text-align:center;
    border-radius:15px;
    box-shadow:0 5px 20px rgba(0,0,0,.06);
}

.no-orders h3{
    margin-bottom:8px;
}


/* =========================================================
   MOBILE
========================================================= */

@media(max-width:800px){

    .customer-info{
        grid-template-columns:1fr;
    }

    .admin-orders-page{
        padding:25px 12px 40px;
    }

    .admin-orders-header h1{
        font-size:25px;
    }

}

@media(max-width:550px){

    .admin-order-top{
        align-items:flex-start;
    }

    .order-item{
        flex-direction:column;
        gap:5px;
    }

    .admin-order-bottom{
        align-items:flex-start;
    }

    .status-update{
        width:100%;
    }

    .status-update select{
        flex:1;
    }

    .update-btn{
        width:100%;
    }

}

</style>


<section class="admin-orders-page">


    <!-- =====================================================
         HEADER
    ===================================================== -->

    <div class="admin-orders-header">

        <div>

            <h1>Order Management</h1>

            <p>
                View and update customer orders
            </p>

        </div>

    </div>


    <!-- =====================================================
         FILTER
    ===================================================== -->

    <div class="order-filter">

        <form method="get">

            <div class="order-filter-group">

                <label>Search Order / Customer / Phone</label>

                <input
                    type="text"
                    name="search"
                    value="<?= e($search) ?>"
                    placeholder="Search..."
                >

            </div>


            <div class="order-filter-group">

                <label>Order Status</label>

                <select name="status">

                    <option value="">All Orders</option>

                    <?php foreach([
                        'Pending',
                        'Confirmed',
                        'Processing',
                        'Shipped',
                        'Out for Delivery',
                        'Delivered',
                        'Cancelled'
                    ] as $st): ?>

                        <option
                            value="<?= e($st) ?>"
                            <?= $status === $st ? 'selected' : '' ?>
                        >
                            <?= e($st) ?>
                        </option>

                    <?php endforeach; ?>

                </select>

            </div>


            <button
                type="submit"
                class="update-btn"
            >
                Search
            </button>


            <a
                href="admin_order_status.php"
                class="btn"
            >
                Reset
            </a>

        </form>

    </div>


    <!-- =====================================================
         ORDERS
    ===================================================== -->

    <?php if (!$orders->num_rows): ?>

        <div class="no-orders">

            <h3>No orders found</h3>

            <p class="muted">
                There are no orders matching your search.
            </p>

        </div>

    <?php else: ?>


        <?php while ($o = $orders->fetch_assoc()): ?>


            <div class="admin-order-card">


                <!-- ORDER HEADER -->

                <div class="admin-order-top">

                    <div>

                        <div class="order-number">

                            Order #<?= (int)$o['id'] ?>

                        </div>

                        <div class="order-date">

                            <?= e($o['created_at']) ?>

                        </div>

                    </div>


                    <div>

                        <?php

                        $status_class = 'status-pending';

                        switch ($o['order_status']) {

                            case 'Confirmed':
                                $status_class = 'status-confirmed';
                                break;

                            case 'Processing':
                                $status_class = 'status-processing';
                                break;

                            case 'Shipped':
                                $status_class = 'status-shipped';
                                break;

                            case 'Out for Delivery':
                                $status_class = 'status-out';
                                break;

                            case 'Delivered':
                                $status_class = 'status-delivered';
                                break;

                            case 'Cancelled':
                                $status_class = 'status-cancelled';
                                break;
                        }

                        ?>

                        <span
                            class="status-badge <?= $status_class ?>"
                        >
                            <?= e($o['order_status']) ?>
                        </span>

                    </div>

                </div>


                <!-- ORDER BODY -->

                <div class="admin-order-body">


                    <!-- CUSTOMER INFORMATION -->

                    <div class="customer-info">


                        <div class="info-box">

                            <small>Customer</small>

                            <strong>
                                <?= e($o['customer_name']) ?>
                            </strong>

                        </div>


                        <div class="info-box">

                            <small>Phone</small>

                            <strong>
                                <?= e($o['phone']) ?>
                            </strong>

                        </div>


                        <div class="info-box">

                            <small>Customer ID</small>

                            <strong>
                                #<?= (int)$o['customer_id'] ?>
                            </strong>

                        </div>


                        <div class="info-box">

                            <small>Address</small>

                            <strong>
                                <?= e($o['address']) ?>
                            </strong>

                        </div>


                        <div class="info-box">

                            <small>City / State</small>

                            <strong>
                                <?= e($o['city']) ?>,
                                <?= e($o['state']) ?>
                            </strong>

                        </div>


                        <div class="info-box">

                            <small>Pincode</small>

                            <strong>
                                <?= e($o['pincode']) ?>
                            </strong>

                        </div>

                    </div>


                    <!-- =================================================
                         ORDER ITEMS
                    ================================================= -->

                    <div class="order-items">

                        <?php

                        $itemStmt = $conn->prepare(
                            'SELECT
                                product_name,
                                price,
                                qty,
                                line_total
                             FROM order_items
                             WHERE order_id=?
                             ORDER BY id ASC'
                        );

                        $itemStmt->bind_param(
                            'i',
                            $o['id']
                        );

                        $itemStmt->execute();

                        $itemsResult = $itemStmt->get_result();

                        ?>


                        <?php while ($item = $itemsResult->fetch_assoc()): ?>

                            <div class="order-item">

                                <div>

                                    <div class="order-item-name">

                                        <?= e($item['product_name']) ?>

                                    </div>

                                    <small class="muted">

                                        <?= money($item['price']) ?>

                                        ×

                                        <?= (int)$item['qty'] ?>

                                    </small>

                                </div>


                                <div class="order-item-price">

                                    <?= money($item['line_total']) ?>

                                </div>

                            </div>

                        <?php endwhile; ?>


                        <?php $itemStmt->close(); ?>

                    </div>


                    <!-- =================================================
                         ORDER BOTTOM
                    ================================================= -->

                    <div class="admin-order-bottom">


                        <div>

                            <div>

                                Payment:

                                <strong>
                                    <?= e($o['payment_method']) ?>
                                </strong>

                            </div>

                            <div>

                                Payment Status:

                                <strong>
                                    <?= e($o['payment_status']) ?>
                                </strong>

                            </div>

                        </div>


                        <div class="order-total">

                            <?= money($o['total']) ?>

                        </div>


                        <!-- UPDATE -->

                        <form
                            method="post"
                            class="status-update"
                        >

                            <input
                                type="hidden"
                                name="order_id"
                                value="<?= (int)$o['id'] ?>"
                            >


                            <select name="order_status">

                                <?php foreach([
                                    'Pending',
                                    'Confirmed',
                                    'Processing',
                                    'Shipped',
                                    'Out for Delivery',
                                    'Delivered',
                                    'Cancelled'
                                ] as $st): ?>

                                    <option
                                        value="<?= e($st) ?>"
                                        <?= $o['order_status'] === $st ? 'selected' : '' ?>
                                    >
                                        <?= e($st) ?>
                                    </option>

                                <?php endforeach; ?>

                            </select>


                            <select name="payment_status">

                                <?php foreach([
                                    'Pending',
                                    'Pending UPI',
                                    'Pending Online',
                                    'Paid',
                                    'Failed',
                                    'Refunded'
                                ] as $ps): ?>

                                    <option
                                        value="<?= e($ps) ?>"
                                        <?= $o['payment_status'] === $ps ? 'selected' : '' ?>
                                    >
                                        <?= e($ps) ?>
                                    </option>

                                <?php endforeach; ?>

                            </select>


                            <button
                                type="submit"
                                class="update-btn"
                            >
                                Update Order
                            </button>

                        </form>


                    </div>

                </div>

            </div>


        <?php endwhile; ?>


    <?php endif; ?>


</section>


<?php include 'footer.php'; ?>