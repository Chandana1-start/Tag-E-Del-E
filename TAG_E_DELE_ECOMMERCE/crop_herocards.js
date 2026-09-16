const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'herocards', 'ChatGPT Image Sep 12, 2026, 01_27_28 PM.png');
const outputDir = path.join(__dirname, 'herocards');

async function cropCards() {
  const metadata = await sharp(inputPath).metadata();
  console.log(`Original image size: ${metadata.width}x${metadata.height}`);

  const rows = 3;
  const cols = 5;

  const cardWidth = Math.floor(metadata.width / cols);
  const cardHeight = Math.floor(metadata.height / rows);

  const cardTitles = [
    // Row 1
    { file: 'casual_vibes.png', name: 'Casual Vibes', cat: 'Casual Wear' },
    { file: 'street_style.png', name: 'Street Style', cat: 'Streetwear' },
    { file: 'classic_look.png', name: 'Classic Look', cat: 'Shirts' },
    { file: 'minimal_style.png', name: 'Minimal Style', cat: 'Casual Wear' },
    { file: 'bold_moves.png', name: 'Bold Moves', cat: 'Jackets' },
    // Row 2
    { file: 'everyday_comfort.png', name: 'Everyday Comfort', cat: 'T-Shirts' },
    { file: 'soft_colours.png', name: 'Soft Colours', cat: 'Hoodies' },
    { file: 'smart_casual.png', name: 'Smart Casual', cat: 'Formal Wear' },
    { file: 'summer_vibes.png', name: 'Summer Vibes', cat: 'Shirts' },
    { file: 'denim_days.png', name: 'Denim Days', cat: 'Jeans' },
    // Row 3
    { file: 'relax_mode.png', name: 'Relax Mode', cat: 'Casual Wear' },
    { file: 'athleisure_fit.png', name: 'Athleisure Fit', cat: 'Co-Ord Sets' },
    { file: 'vacation_ready.png', name: 'Vacation Ready', cat: 'Shirts' },
    { file: 'urban_edge.png', name: 'Urban Edge', cat: 'Jackets' },
    { file: 'timeless_style.png', name: 'Timeless Style', cat: 'Trousers' }
  ];

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const info = cardTitles[index];
      const left = Math.floor(c * cardWidth);
      const top = Math.floor(r * cardHeight);
      
      const width = (c === cols - 1) ? (metadata.width - left) : cardWidth;
      const height = (r === rows - 1) ? (metadata.height - top) : cardHeight;

      const outPath = path.join(outputDir, info.file);
      await sharp(inputPath)
        .extract({ left, top, width, height })
        .toFile(outPath);

      // Also save card_1.png to card_15.png for generic reference
      const genericPath = path.join(outputDir, `card_${index + 1}.png`);
      await sharp(inputPath)
        .extract({ left, top, width, height })
        .toFile(genericPath);

      console.log(`Saved: ${info.file} & card_${index + 1}.png (${width}x${height})`);
      index++;
    }
  }

  console.log('All 15 cards successfully cropped and saved!');
}

cropCards().catch(console.error);
