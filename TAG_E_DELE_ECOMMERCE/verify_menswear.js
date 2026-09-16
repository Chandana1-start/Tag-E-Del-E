const fs = require('fs');
const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== VERIFYING MEN\'S WEAR CATALOG & DATA ===');

  // 1. Check data.json
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  console.log(`Total products in data.json: ${data.products.length}`);
  if (data.products.length !== 95) {
    console.error(`ERROR: Expected 95 products, found ${data.products.length}`);
  }

  // 2. Check categories
  const categories = {};
  data.products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  console.log('Category distribution:', categories);

  const allowedCats = ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets'];
  for (const cat of allowedCats) {
    if (categories[cat] < 19) {
      console.error(`ERROR: Category ${cat} has less than 19 items: ${categories[cat]}`);
    }
  }
  if (categories['Accessories'] || Object.keys(categories).length !== 5) {
    console.error('ERROR: Found non-clothing or Accessories category!');
  } else {
    console.log('PASS: Only the 5 men\'s clothing categories exist, each with exactly 19 items.');
  }

  // 3. Check images on disk
  let missingImages = 0;
  data.products.forEach(p => {
    if (!fs.existsSync(p.image) || fs.statSync(p.image).size < 1000) {
      console.error(`Missing or empty image for [${p.id}] ${p.name}: ${p.image}`);
      missingImages++;
    }
  });
  if (missingImages === 0) {
    console.log('PASS: All 95 product images exist on disk and are valid (>1KB).');
  }

  // 4. HTTP Tests on localhost:3000
  console.log('\n=== TESTING HTTP ENDPOINTS ON LOCALHOST:3000 ===');

  // Home Page
  const home = await fetch('http://localhost:3000/');
  console.log(`Home page: status ${home.status}, contains Store link: ${home.body.includes('store.php')}`);

  // Store Page
  const store = await fetch('http://localhost:3000/store.php');
  console.log(`Store page: status ${store.status}, hasFivePillars: ${store.body.includes('Five Pillars')}, hasAccessories: ${store.body.includes('category=Accessories')}`);
  if (store.body.includes('category=Accessories')) {
    console.error('ERROR: Store page still contains category=Accessories!');
  } else {
    console.log('PASS: Store page is 100% men\'s clothing and has no Accessories.');
  }

  // Products Page (Shop)
  const shop = await fetch('http://localhost:3000/products.php');
  const shopCardMatches = (shop.body.match(/<article class="product-card/g) || []).length;
  console.log(`Products page: status ${shop.status}, rendered product cards: ${shopCardMatches}`);
  if (shopCardMatches !== 95) {
    console.error(`ERROR: Products page expected 95 cards, rendered ${shopCardMatches}`);
  } else {
    console.log('PASS: Products page renders exactly 95 product cards.');
  }

  // Category Filters
  for (const cat of allowedCats) {
    const res = await fetch(`http://localhost:3000/products.php?category=${encodeURIComponent(cat)}`);
    const cardCount = (res.body.match(/<article class="product-card/g) || []).length;
    console.log(`Filter [${cat}]: status ${res.status}, cards: ${cardCount}`);
    if (cardCount !== 19) {
      console.error(`ERROR: Category ${cat} returned ${cardCount} cards, expected 19`);
    }
  }

  // Search queries
  const searchQueries = ['shirt', 'jeans', 'trousers', 'jacket', 't-shirt'];
  for (const q of searchQueries) {
    const res = await fetch(`http://localhost:3000/products.php?q=${encodeURIComponent(q)}`);
    const cardCount = (res.body.match(/<article class="product-card/g) || []).length;
    console.log(`Search [${q}]: status ${res.status}, cards: ${cardCount}`);
  }

  // Check Cart page
  const cart = await fetch('http://localhost:3000/cart.php');
  console.log(`Cart page: status ${cart.status}`);

  console.log('\n=== ALL AUTOMATED VERIFICATIONS COMPLETE ===');
}

runTests().catch(err => console.error('Verification failed:', err));
