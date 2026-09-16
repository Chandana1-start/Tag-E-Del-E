<?php require_once 'functions.php';
$page_title = 'About | ' . SHOP_NAME;
include 'header.php';
?>

<div class="about-page-wrapper">
  <!-- 1. ABOUT HERO SECTION -->
  <section class="about-hero-section">
    <div class="about-hero-overlay"></div>
    <div class="about-hero-content about-reveal">
      <span class="about-hero-eyebrow">ABOUT THE BRAND</span>
      <h1 class="about-hero-title"><?= e(SHOP_NAME) ?></h1>
      <p class="about-hero-sub">MEN'S FASHION, REDEFINED.</p>
      <p class="about-hero-desc">Stylish. Comfortable. Confident.</p>
      <a href="products.php" class="about-btn-burgundy">EXPLORE COLLECTION &rarr;</a>
    </div>
  </section>

  <!-- 2. ABOUT STORE SECTION -->
  <section class="about-store-section">
    <div class="about-container">
      <div class="about-store-grid">
        <div class="about-store-card about-reveal">
          <img class="about-store-img" src="owner/WhatsApp Image 2026-09-15 at 12.18.34 PM.jpeg" alt="<?= e(SHOP_NAME) ?> Store Owner">
        </div>
        <div class="about-store-content about-reveal">
          <span class="about-store-eyebrow">ABOUT THE STORE</span>
          <h2 class="about-store-title"><?= e(SHOP_NAME) ?></h2>
          <p class="about-store-paragraph">We are a men's wear store focused on stylish, comfortable and affordable fashion. This website is designed as a complete ecommerce project with customer shopping, cart, checkout, payments and an admin panel for changing products.</p>
          <p class="about-store-paragraph">Every product shown on the website can be added, edited, removed or updated from the admin panel without changing the website code.</p>
          <div class="about-store-actions">
            <a href="products.php" class="about-btn-dark">EXPLORE COLLECTION &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. OUR PHILOSOPHY SECTION -->
  <section class="about-philosophy-section">
    <div class="about-container">
      <div class="about-philosophy-wrap about-reveal">
        <div class="about-philosophy-label">OUR PHILOSOPHY</div>
        <h2 class="about-philosophy-title">STYLE THAT SPEAKS.</h2>
        <p class="about-philosophy-desc"><?= e(SHOP_NAME) ?> brings together bold prints, modern silhouettes, and effortless men's fashion for those who want their style to stand out.</p>
      </div>
    </div>
  </section>

  <!-- 4. FOUR BRAND VALUES SECTION -->
  <section class="about-values-section">
    <div class="about-container">
      <div class="about-values-head about-reveal">
        <span class="about-store-eyebrow">OUR PROMISE</span>
        <h2 class="about-store-title" style="margin-bottom:0;">BRAND VALUES</h2>
      </div>
      <div class="about-values-grid">
        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">01</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>
          <h3 class="about-value-title">PREMIUM STYLE</h3>
          <p class="about-value-text">Modern designs tailored for today's fashion-conscious man.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">02</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">QUALITY FIRST</h3>
          <p class="about-value-text">Fashion designed with premium fabrics, durable stitching, and comfort in mind.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">03</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">TREND-DRIVEN</h3>
          <p class="about-value-text">Fresh drops inspired by global streetwear and contemporary men's fashion.</p>
        </div>

        <div class="about-value-card about-reveal">
          <div class="about-value-header">
            <span class="about-value-num">04</span>
            <div class="about-value-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
          </div>
          <h3 class="about-value-title">EASY SHOPPING</h3>
          <p class="about-value-text">Fast nationwide shipping, COD, UPI options, and simple returns.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. WHY TAG É DEL É SECTION -->
  <section class="about-why-section">
    <div class="about-container">
      <div class="about-why-head about-reveal">
        <span class="about-store-eyebrow">DISTINCTION</span>
        <h2 class="about-store-title" style="margin-bottom:0;">WHY TAG É DEL É?</h2>
      </div>
      <div class="about-why-grid">
        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/bold_moves.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">STYLE</h3>
            <p class="about-why-text">Modern silhouettes and statement pieces.</p>
          </div>
        </div>

        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/smart_casual.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">COMFORT</h3>
            <p class="about-why-text">Designed for everyday confidence and comfort.</p>
          </div>
        </div>

        <div class="about-why-card about-reveal">
          <div class="about-why-bg" style="background-image: url('herocards/vacation_ready.png');"></div>
          <div class="about-why-overlay">
            <h3 class="about-why-title">CONFIDENCE</h3>
            <p class="about-why-text">Fashion that helps you express your personality.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. BRAND STATEMENT SECTION -->
  <section class="about-statement-section">
    <div class="about-statement-overlay"></div>
    <div class="about-statement-content about-reveal">
      <h2 class="about-statement-title">YOUR STYLE. YOUR RULES.</h2>
      <p class="about-statement-sub">Contemporary men's fashion for every mood, every moment, and every statement.</p>
      <a href="products.php" class="about-btn-burgundy">SHOP MEN'S COLLECTION &rarr;</a>
    </div>
  </section>

  <!-- 7. FINAL CTA SECTION -->
  <section class="about-cta-section">
    <div class="about-container">
      <div class="about-cta-wrap about-reveal">
        <span class="about-store-eyebrow">JOIN THE TAG É DEL É WORLD</span>
        <h2 class="about-cta-title">WEAR YOUR CONFIDENCE.</h2>
        <p class="about-cta-text">Discover contemporary men's fashion designed to make every look feel effortless.</p>
        <a href="products.php" class="about-btn-burgundy">EXPLORE COLLECTION &rarr;</a>
      </div>
    </div>
  </section>
</div>

<?php include 'footer.php'; ?>

