const fs = require('fs');
const crypto = require('crypto');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const hashToFile = {};
const duplicates = [];
const uniqueProducts = [];

data.products.forEach(p => {
  const buf = fs.readFileSync(p.image);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (hashToFile[hash]) {
    duplicates.push({ id: p.id, category: p.category, name: p.name, image: p.image, sharedWith: hashToFile[hash].name });
  } else {
    hashToFile[hash] = p;
    uniqueProducts.push(p);
  }
});

console.log('Unique images:', uniqueProducts.length);
console.log('Duplicates needing unique replacement:', duplicates.length);
console.log('\n--- DUPLICATES LIST ---');
duplicates.forEach(d => console.log(`[${d.id}] ${d.category} - "${d.name}" (shares image with: "${d.sharedWith}")`));
