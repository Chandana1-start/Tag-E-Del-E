const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const shirtImages = fs.readdirSync(path.join(__dirname, 'Shirts')).filter(f => f.startsWith('shirt_')).sort((a,b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
const tshirtImages = fs.readdirSync(path.join(__dirname, 'T-Shirts')).filter(f => f.startsWith('tshirt_')).sort((a,b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
const jeansImages = fs.readdirSync(path.join(__dirname, 'Jeans')).filter(f => f.startsWith('jeans_')).sort((a,b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
const jacketImages = fs.readdirSync(path.join(__dirname, 'Jackets')).filter(f => f.startsWith('jacket_')).sort((a,b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
const trouserImages = fs.readdirSync(path.join(__dirname, 'Trousers')).filter(f => f.startsWith('trouser_')).sort((a,b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));

let shirtIdx = 0;
let tshirtIdx = 0;
let jeansIdx = 0;
let jacketIdx = 0;
let trouserIdx = 0;

db.products.forEach(p => {
  const cat = (p.category || '').toLowerCase().trim();
  if (cat === 'shirts') {
    const imgName = shirtImages[shirtIdx % shirtImages.length];
    p.image = `Shirts/${imgName}`;
    shirtIdx++;
  } else if (cat === 't-shirts') {
    const imgName = tshirtImages[tshirtIdx % tshirtImages.length];
    p.image = `T-Shirts/${imgName}`;
    tshirtIdx++;
  } else if (cat === 'jeans') {
    const imgName = jeansImages[jeansIdx % jeansImages.length];
    p.image = `Jeans/${imgName}`;
    jeansIdx++;
  } else if (cat === 'jackets') {
    const imgName = jacketImages[jacketIdx % jacketImages.length];
    p.image = `Jackets/${imgName}`;
    jacketIdx++;
  } else if (cat === 'trousers') {
    const imgName = trouserImages[trouserIdx % trouserImages.length];
    p.image = `Trousers/${imgName}`;
    trouserIdx++;
  }
});

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
console.log('data.json successfully updated with individual sliced product images!');
