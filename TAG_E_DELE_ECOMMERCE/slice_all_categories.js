const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseDir = __dirname;

const categories = [
  { dir: 'Shirts', file: 'ChatGPT Image Sep 12, 2026, 02_31_23 PM.png', rows: 4, cols: 6, prefix: 'shirt_' },
  { dir: 'T-Shirts', file: 'ChatGPT Image Sep 12, 2026, 02_37_50 PM.png', rows: 4, cols: 6, prefix: 'tshirt_' },
  { dir: 'Jeans', file: 'ChatGPT Image Sep 12, 2026, 02_27_26 PM.png', rows: 4, cols: 6, prefix: 'jeans_' },
  { dir: 'Jackets', file: 'ChatGPT Image Sep 12, 2026, 02_39_58 PM.png', rows: 4, cols: 5, prefix: 'jacket_' },
  { dir: 'Trousers', file: 'ChatGPT Image Sep 12, 2026, 02_49_35 PM.png', rows: 4, cols: 5, prefix: 'trouser_' }
];

async function sliceAll() {
  for (const cat of categories) {
    const inputPath = path.join(baseDir, cat.dir, cat.file);
    if (!fs.existsSync(inputPath)) {
      console.log(`File not found: ${inputPath}`);
      continue;
    }

    const meta = await sharp(inputPath).metadata();
    console.log(`Processing ${cat.dir}: ${meta.width}x${meta.height}`);

    const cellWidth = Math.floor(meta.width / cat.cols);
    const cellHeight = Math.floor(meta.height / cat.rows);

    let count = 1;
    for (let r = 0; r < cat.rows; r++) {
      for (let c = 0; c < cat.cols; c++) {
        const left = Math.floor(c * cellWidth);
        const top = Math.floor(r * cellHeight);
        const width = (c === cat.cols - 1) ? (meta.width - left) : cellWidth;
        const height = (r === cat.rows - 1) ? (meta.height - top) : cellHeight;

        const fileName = `${cat.prefix}${count}.png`;
        const outputPath = path.join(baseDir, cat.dir, fileName);

        await sharp(inputPath)
          .extract({ left, top, width, height })
          .toFile(outputPath);

        console.log(`Saved ${cat.dir}/${fileName} (${width}x${height})`);
        count++;
      }
    }
  }
  console.log('All category images sliced successfully!');
}

sliceAll().catch(console.error);
