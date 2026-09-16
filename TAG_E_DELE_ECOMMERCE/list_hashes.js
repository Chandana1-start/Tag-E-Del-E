const fs = require('fs');
const crypto = require('crypto');

const files = fs.readdirSync('images').filter(f => f.endsWith('.jpg'));
const hashes = {};

files.forEach(f => {
  const buf = fs.readFileSync('images/' + f);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  if (!hashes[hash]) hashes[hash] = [];
  hashes[hash].push(f);
});

console.log('Unique hashes in images/:', Object.keys(hashes).length);
for (const h in hashes) {
  console.log(`[${hashes[h].length} files] ${hashes[h].slice(0, 3).join(', ')} (hash: ${h.slice(0,8)}, size: ${fs.statSync('images/' + hashes[h][0]).size})`);
}
