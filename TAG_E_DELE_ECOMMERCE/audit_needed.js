const fs = require('fs');
const crypto = require('crypto');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const usedHashes = new Set();
const productsToKeep = [];
const productsNeedingImage = [];

data.products.forEach(p => {
  if (fs.existsSync(p.image)) {
    const buf = fs.readFileSync(p.image);
    const hash = crypto.createHash('md5').update(buf).digest('hex');
    // Check if filename roughly matches the product name
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = p.image.toLowerCase();
    
    // If not duplicate and matches category/name
    if (!usedHashes.has(hash)) {
      usedHashes.add(hash);
      productsToKeep.push({ id: p.id, name: p.name, category: p.category, image: p.image });
    } else {
      productsNeedingImage.push({ id: p.id, name: p.name, category: p.category, image: p.image });
    }
  } else {
    productsNeedingImage.push({ id: p.id, name: p.name, category: p.category, image: p.image });
  }
});

console.log('Products with unique image kept:', productsToKeep.length);
console.log('Products needing unique image:', productsNeedingImage.length);

console.log('\n--- BY CATEGORY NEEDING IMAGE ---');
const byCat = {};
productsNeedingImage.forEach(p => {
  byCat[p.category] = (byCat[p.category] || []).concat(p);
});
for (const c in byCat) {
  console.log(`\n${c} (${byCat[c].length}):`);
  byCat[c].forEach(p => console.log(`  [${p.id}] ${p.name}`));
}
