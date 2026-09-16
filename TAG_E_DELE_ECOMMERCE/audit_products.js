const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const hashes = {};
data.products.forEach(p => {
  const buf = fs.readFileSync(p.image);
  const h = crypto.createHash('md5').update(buf).digest('hex');
  if (!hashes[h]) hashes[h] = [];
  hashes[h].push(p.id);
});

data.products.forEach(p => {
  const buf = fs.readFileSync(p.image);
  const h = crypto.createHash('md5').update(buf).digest('hex');
  const count = hashes[h].length;
  const isDup = count > 1;
  const status = isDup ? ('DUP(' + count + ')') : 'UNIQUE ';
  console.log('[' + p.id.toString().padStart(2, ' ') + '] [' + p.category.padEnd(8, ' ') + '] ' + status + ' | ' + p.name.padEnd(32, ' ') + ' | ' + p.image);
});
