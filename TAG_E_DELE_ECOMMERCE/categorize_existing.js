const fs = require('fs');
const crypto = require('crypto');

const files = fs.readdirSync('images').filter(f => f.endsWith('.jpg'));
const seenHashes = new Map();
const uniqueFiles = [];

files.forEach(f => {
  const buf = fs.readFileSync('images/' + f);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (!seenHashes.has(hash)) {
    seenHashes.set(hash, f);
    uniqueFiles.push({ file: f, hash, size: buf.length });
  }
});

console.log('Total unique images:', uniqueFiles.length);

const categories = {
  shirts: [],
  tshirts: [],
  jeans: [],
  trousers: [],
  jackets: [],
  accessories: [],
  unknown: []
};

uniqueFiles.forEach(u => {
  const f = u.file.toLowerCase();
  if (f.includes('belt') || f.includes('wallet') || f.includes('sunglasses') || f.includes('tie') || f.includes('bag') || f.includes('scarf') || f.includes('bracelet') || f.includes('cufflinks') || f.includes('beanie') || f.includes('fedora') || f.includes('watch') || f.includes('gloves') || f.includes('card-holder')) {
    categories.accessories.push(u.file);
  } else if (f.includes('shirt') && !f.includes('t-shirt') && !f.includes('tshirt') && !f.includes('overshirt')) {
    categories.shirts.push(u.file);
  } else if (f.includes('t-shirt') || f.includes('tshirt') || f.includes('polo') || f.includes('tee')) {
    categories.tshirts.push(u.file);
  } else if (f.includes('jeans') || f.includes('denim-jeans')) {
    categories.jeans.push(u.file);
  } else if (f.includes('trouser') || f.includes('chino') || f.includes('slacks') || f.includes('pant')) {
    categories.trousers.push(u.file);
  } else if (f.includes('jacket') || f.includes('blazer') || f.includes('coat') || f.includes('parka') || f.includes('bomber') || f.includes('shacket') || f.includes('overshirt')) {
    categories.jackets.push(u.file);
  } else {
    categories.unknown.push(u.file);
  }
});

console.log('\n--- CATEGORY BREAKDOWN OF UNIQUE FILES ---');
console.log('Shirts (' + categories.shirts.length + '):', categories.shirts);
console.log('T-Shirts (' + categories.tshirts.length + '):', categories.tshirts);
console.log('Jeans (' + categories.jeans.length + '):', categories.jeans);
console.log('Trousers (' + categories.trousers.length + '):', categories.trousers);
console.log('Jackets (' + categories.jackets.length + '):', categories.jackets);
console.log('Accessories to EXCLUDE (' + categories.accessories.length + '):', categories.accessories);
console.log('Unknown (' + categories.unknown.length + '):', categories.unknown);
