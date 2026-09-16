<?php

session_start();

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: admin_login.php");
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

/* =========================
   VALIDATE INPUT
========================= */

if ($username === '' || $password === '') {

    $_SESSION['login_error'] = 'Please enter username and password.';

    header("Location: admin_login.php");
    exit;
}

/* =========================
   FIND ADMIN
========================= */

$stmt = $conn->prepare(
    "SELECT id, username, password
     FROM admins
     WHERE username = ?
     LIMIT 1"
);

if (!$stmt) {

    $_SESSION['login_error'] = 'Database error: ' . $conn->error;

    header("Location: admin_login.php");
    exit;
}

$stmt->bind_param("s", $username);

$stmt->execute();

$result = $stmt->get_result();

/* =========================
   CHECK USER
========================= */

if ($result->num_rows !== 1) {

    $_SESSION['login_error'] = 'Invalid username or password.';

    $stmt->close();

    header("Location: admin_login.php");
    exit;
}

$admin = $result->fetch_assoc();

/* =========================
   CHECK PASSWORD
========================= */

if (!password_verify($password, $admin['password'])) {

    $_SESSION['login_error'] = 'Invalid username or password.';

    $stmt->close();

    header("Location: admin_login.php");
    exit;
}

/* =========================
   LOGIN SUCCESS
========================= */

session_regenerate_id(true);

$_SESSION['admin_id'] = $admin['id'];

$_SESSION['admin_username'] = $admin['username'];

unset($_SESSION['login_error']);

$stmt->close();

header("Location: admin.php");

exit;

?>