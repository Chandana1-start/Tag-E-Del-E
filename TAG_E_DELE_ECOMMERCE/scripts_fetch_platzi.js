const https = require('https');

https.get('https://api.escuelajs.co/api/v1/products', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    try {
      const prods = JSON.parse(d);
      const keywords = ['shirt', 'tee', 't-shirt', 'jean', 'pant', 'trouser', 'jacket', 'chino', 'denim', 'coat', 'hoodie', 'sweat', 'polo', 'suit', 'blazer', 'pullover'];
      const matched = prods.filter(p => {
        const t = (p.title || '').toLowerCase();
        return keywords.some(k => t.includes(k)) && p.images && p.images.length > 0;
      });
      console.log('Matched clothing products:', matched.length);
      matched.forEach(p => {
        let img = p.images[0];
        img = img.replace(/^\[?"?/, '').replace(/"?\]?$/, '');
        console.log(p.id + ' | ' + p.title + ' | ' + img);
      });
    } catch(e) {
      console.log('Error:', e.message);
    }
  });
});
