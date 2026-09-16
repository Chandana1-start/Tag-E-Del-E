<?php require_once 'functions.php'; if(is_customer()) redirect('index.php'); $error=''; $next=$_GET['redirect']??'index.php'; if($_SERVER['REQUEST_METHOD']==='POST'){ $email=trim($_POST['email']??'');$pass=$_POST['password']??'';$s=$conn->prepare('SELECT * FROM customers WHERE email=?');$s->bind_param('s',$email);$s->execute();$u=$s->get_result()->fetch_assoc();if($u&&password_verify($pass,$u['password'])){$_SESSION['customer_id']=$u['id'];$_SESSION['customer_name']=$u['name'];redirect($next);}else $error='Invalid email or password.';} $page_title='Login | '.SHOP_NAME; include 'header.php'; ?>
<div class="td-auth-page">
  <div class="td-auth-card">
    <div class="td-auth-header">
      <h1 class="td-auth-brand-name">TAG É DEL É</h1>
      <div class="td-auth-brand-sub">MEN'S FASHION</div>
      <h2 class="td-auth-title">CUSTOMER LOGIN</h2>
      <p class="td-auth-subtitle">Welcome back to TAG É DEL É</p>
    </div>

    <?php if($error): ?>
      <div class="flash error" style="position:static;margin:0 0 20px 0;border-radius:8px;text-align:center;"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="post" action="login.php">
      <input type="hidden" name="redirect" value="<?= e($next) ?>">
      
      <div class="td-form-group">
        <label for="login-email" class="td-form-label">Email Address</label>
        <input id="login-email" class="td-input" type="email" name="email" placeholder="e.g. alex@example.com" required autocomplete="email">
      </div>
      
      <div class="td-form-group">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <label for="login-password" class="td-form-label" style="margin-bottom:0;">Password</label>
          <a href="#" class="td-forgot-link" onclick="alert('Password reset link has been dispatched to your email address.'); return false;">Forgot Password?</a>
        </div>
        <div class="td-password-wrapper">
          <input id="login-password" class="td-input" type="password" name="password" placeholder="••••••••" required autocomplete="current-password">
          <button type="button" class="td-eye-btn" aria-label="Toggle Password Visibility">
            <svg class="eye-show" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <svg class="eye-hide" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          </button>
        </div>
      </div>
      
      <button type="submit" class="td-auth-btn">LOGIN</button>
    </form>

    <div class="td-auth-footer-text">
      Don't have an account? <a href="register.php" class="td-auth-link">CREATE ACCOUNT</a>
    </div>
  </div>
</div>
<?php include 'footer.php'; ?>

