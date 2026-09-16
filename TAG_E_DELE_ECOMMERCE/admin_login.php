<?php
session_start();

if (isset($_SESSION['admin_id'])) {
    header("Location: admin.php");
    exit;
}

$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Login | TAG É DEL É</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:
        linear-gradient(rgba(0,0,0,.72),rgba(0,0,0,.82)),
        url('shop_logo.png');
    background-size:cover;
    background-position:center;
}

.login-wrapper{
    width:100%;
    max-width:430px;
    padding:20px;
}

.login-card{
    background:#fff;
    border-radius:22px;
    padding:42px 38px;
    box-shadow:0 25px 70px rgba(0,0,0,.35);
}

.logo-box{
    text-align:center;
    margin-bottom:28px;
}

.logo-box img{
    width:110px;
    height:110px;
    object-fit:contain;
    margin-bottom:15px;
}

.logo-box h1{
    font-size:25px;
    color:#111;
    letter-spacing:2px;
}

.logo-box p{
    color:#777;
    margin-top:7px;
    font-size:14px;
}

.form-group{
    margin-bottom:20px;
}

.form-group label{
    display:block;
    font-size:14px;
    font-weight:600;
    color:#333;
    margin-bottom:8px;
}

.input-box{
    position:relative;
}

.input-box input{
    width:100%;
    padding:14px 15px;
    border:1px solid #ddd;
    border-radius:11px;
    font-size:15px;
    outline:none;
    transition:.3s;
}

.input-box input:focus{
    border-color:#111;
    box-shadow:0 0 0 3px rgba(0,0,0,.07);
}

.login-btn{
    width:100%;
    border:0;
    padding:15px;
    border-radius:11px;
    background:#111;
    color:#fff;
    font-size:15px;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;
}

.login-btn:hover{
    background:#d71920;
    transform:translateY(-1px);
}

.error{
    background:#fff0f0;
    color:#c62828;
    border:1px solid #ffd0d0;
    padding:12px;
    border-radius:10px;
    margin-bottom:20px;
    font-size:14px;
}

.footer{
    text-align:center;
    margin-top:22px;
    font-size:12px;
    color:#999;
}

@media(max-width:480px){
    .login-card{
        padding:32px 24px;
    }
}
</style>
</head>

<body>

<div class="login-wrapper">

    <div class="login-card">

        <div class="logo-box">
            <img src="shop_logo.png" alt="TAG É DEL É">
            <h1>TAG É DEL É</h1>
            <p>Administrator Login</p>
        </div>

        <?php if($error): ?>
            <div class="error">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="admin_login_process.php">

            <div class="form-group">
                <label>Username</label>

                <div class="input-box">
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter admin username"
                        required
                        autocomplete="username"
                    >
                </div>
            </div>

            <div class="form-group">
                <label>Password</label>

                <div class="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        required
                        autocomplete="current-password"
                    >
                </div>
            </div>

            <button type="submit" class="login-btn">
                LOGIN TO ADMIN PANEL
            </button>

        </form>

        <div class="footer">
            © <?= date('Y') ?> TAG É DEL É · Admin Panel
        </div>

    </div>

</div>

</body>
</html>
