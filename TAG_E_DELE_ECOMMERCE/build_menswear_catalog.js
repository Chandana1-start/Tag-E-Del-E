const fs = require('fs');
const path = require('path');
const https = require('https');

const productsData = [
  // --- SHIRTS (19 items) ---
  {
    name: 'Classic White Formal Shirt',
    category: 'Shirts',
    sku: 'TED-SH-001',
    price: 899,
    old_price: 1299,
    stock: 25,
    sizes: 'S,M,L,XL,XXL',
    description: 'Crisp Egyptian cotton formal shirt with a stiff spread collar and French cuffs, ideal for black-tie and boardroom meetings.',
    new_arrival: 1,
    imagePreference: ['images/classic-white-formal-shirt.jpg', 'images/premium-white-shirt.jpg', 'images/classic-formal-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Black Formal Shirt',
    category: 'Shirts',
    sku: 'TED-SH-002',
    price: 999,
    old_price: 1499,
    stock: 20,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep midnight-black formal shirt woven from high-count satin cotton with tonal buttons and tailored slim silhouette.',
    new_arrival: 1,
    imagePreference: ['images/premium-black-formal-shirt.jpg', 'images/premium-black-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Slim Fit Navy Shirt',
    category: 'Shirts',
    sku: 'TED-SH-003',
    price: 949,
    old_price: 1399,
    stock: 22,
    sizes: 'S,M,L,XL,XXL',
    description: 'Refined dark navy poplin shirt with tapered waist darting, offering a clean, athletic silhouette.',
    new_arrival: 0,
    imagePreference: ['images/slim-fit-navy-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Oxford Blue Cotton Shirt',
    category: 'Shirts',
    sku: 'TED-SH-004',
    price: 1099,
    old_price: 1599,
    stock: 18,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heavyweight basketweave Oxford cloth button-down shirt that softens and drapes with age.',
    new_arrival: 1,
    imagePreference: ['images/oxford-blue-cotton-shirt.jpg', 'images/classic-white-oxford-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Checked Casual Shirt',
    category: 'Shirts',
    sku: 'TED-SH-005',
    price: 899,
    old_price: 1249,
    stock: 30,
    sizes: 'S,M,L,XL,XXL',
    description: 'Micro-gingham checked casual shirt in pure combed cotton, versatile for denim or chinos.',
    new_arrival: 0,
    imagePreference: ['images/checked-casual-shirt.jpg', 'images/checked-cotton-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Beige Linen Shirt',
    category: 'Shirts',
    sku: 'TED-SH-006',
    price: 1199,
    old_price: 1699,
    stock: 15,
    sizes: 'S,M,L,XL,XXL',
    description: 'Airy natural linen shirt woven in organic sand beige yarns, perfect for hot days and warm evening events.',
    new_arrival: 1,
    imagePreference: ['images/premium-beige-linen-shirt.jpg', 'images/linen-casual-shirt.jpg', 'images/textured-beige-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Slim Fit Grey Shirt',
    category: 'Shirts',
    sku: 'TED-SH-007',
    price: 929,
    old_price: 1299,
    stock: 24,
    sizes: 'S,M,L,XL,XXL',
    description: 'Subtle heather charcoal grey shirt with pearlescent buttons and a neat semi-cutaway collar.',
    new_arrival: 0,
    imagePreference: ['images/slim-fit-grey-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Maroon Casual Shirt',
    category: 'Shirts',
    sku: 'TED-SH-008',
    price: 949,
    old_price: 1349,
    stock: 19,
    sizes: 'S,M,L,XL,XXL',
    description: 'Rich wine-maroon casual shirt cut from soft brushed cotton twill with chest pocket detail.',
    new_arrival: 0,
    imagePreference: ['images/maroon-casual-shirt.jpg', 'images/classic-maroon-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Olive Green Casual Shirt',
    category: 'Shirts',
    sku: 'TED-SH-009',
    price: 999,
    old_price: 1399,
    stock: 21,
    sizes: 'S,M,L,XL,XXL',
    description: 'Military-inspired olive green overshirt featuring dual flap utility pockets and structured shoulder seams.',
    new_arrival: 0,
    imagePreference: ['images/olive-green-casual-shirt.jpg', 'images/casual-olive-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Striped Blue Shirt',
    category: 'Shirts',
    sku: 'TED-SH-010',
    price: 979,
    old_price: 1399,
    stock: 26,
    sizes: 'S,M,L,XL,XXL',
    description: 'Timeless Bengal stripe blue shirt in lightweight poplin, offering a crisp look under blazers.',
    new_arrival: 1,
    imagePreference: ['images/striped-blue-shirt.jpg', 'images/striped-casual-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Denim Casual Shirt',
    category: 'Shirts',
    sku: 'TED-SH-011',
    price: 1149,
    old_price: 1649,
    stock: 20,
    sizes: 'S,M,L,XL,XXL',
    description: 'Western-cut indigo denim shirt with snap buttons, pointed yokes, and washed highs and lows.',
    new_arrival: 0,
    imagePreference: ['images/denim-casual-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Cotton Cuban Collar Shirt',
    category: 'Shirts',
    sku: 'TED-SH-012',
    price: 1049,
    old_price: 1499,
    stock: 17,
    sizes: 'S,M,L,XL,XXL',
    description: 'Retro-inspired camp Cuban collar shirt in breathable cotton weave for leisurely weekend styling.',
    new_arrival: 1,
    imagePreference: ['images/cotton-cuban-collar-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Relaxed Fit Printed Shirt',
    category: 'Shirts',
    sku: 'TED-SH-013',
    price: 999,
    old_price: 1399,
    stock: 23,
    sizes: 'S,M,L,XL,XXL',
    description: 'Monochrome abstract resort print shirt with a relaxed silhouette and breezy drape.',
    new_arrival: 0,
    imagePreference: ['images/relaxed-fit-printed-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Cream Shirt',
    category: 'Shirts',
    sku: 'TED-SH-014',
    price: 1049,
    old_price: 1499,
    stock: 16,
    sizes: 'S,M,L,XL,XXL',
    description: 'Warm ivory cream shirt with subtle silk-touch sheen and sharp point collar.',
    new_arrival: 0,
    imagePreference: ['images/premium-cream-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Brown Checked Shirt',
    category: 'Shirts',
    sku: 'TED-SH-015',
    price: 929,
    old_price: 1299,
    stock: 28,
    sizes: 'S,M,L,XL,XXL',
    description: 'Tartan plaid flannel shirt in earthy warm brown tones, brushed for exceptional softness.',
    new_arrival: 0,
    imagePreference: ['images/brown-checked-shirt.jpg', 'images/checked-brown-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Sky Blue Formal Shirt',
    category: 'Shirts',
    sku: 'TED-SH-016',
    price: 999,
    old_price: 1399,
    stock: 25,
    sizes: 'S,M,L,XL,XXL',
    description: 'Light sky-blue business formal shirt in easy-iron twill with structured convertible cuffs.',
    new_arrival: 1,
    imagePreference: ['images/sky-blue-formal-shirt.jpg', 'images/premium-blue-formal-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Textured Shirt',
    category: 'Shirts',
    sku: 'TED-SH-017',
    price: 1099,
    old_price: 1599,
    stock: 19,
    sizes: 'S,M,L,XL,XXL',
    description: 'Subtle dobby jacquard texture elevates this all-black shirt with dimensional depth and distinction.',
    new_arrival: 0,
    imagePreference: ['images/black-textured-shirt.jpg', 'images/modern-black-overshirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'White Linen Casual Shirt',
    category: 'Shirts',
    sku: 'TED-SH-018',
    price: 1199,
    old_price: 1699,
    stock: 14,
    sizes: 'S,M,L,XL,XXL',
    description: 'Pure coastal white linen shirt with roll-tab sleeves and natural cooling properties.',
    new_arrival: 0,
    imagePreference: ['images/white-linen-casual-shirt.jpg', 'images/resort-linen-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Premium Shirt',
    category: 'Shirts',
    sku: 'TED-SH-019',
    price: 1049,
    old_price: 1499,
    stock: 22,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep navy formal shirt in royal oxford weave, pairing effortlessly with suits or dark denims.',
    new_arrival: 1,
    imagePreference: ['images/navy-premium-shirt.jpg', 'images/classic-formal-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  },

  // --- T-SHIRTS (19 items) ---
  {
    name: 'Classic Black Crew Neck T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-001',
    price: 599,
    old_price: 799,
    stock: 40,
    sizes: 'S,M,L,XL,XXL',
    description: 'Ultra-soft combed organic cotton crewneck tee with reinforced ribbed neck band and durable hem.',
    new_arrival: 1,
    imagePreference: ['images/classic-black-crew-neck-t-shirt.jpg', 'images/essential-black-t-shirt.jpg', 'images/essential-black-crewneck-tee.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium White T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-002',
    price: 549,
    old_price: 749,
    stock: 45,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heavyweight 220 GSM pure white cotton t-shirt that stays opaque, crisp, and retain its shape.',
    new_arrival: 1,
    imagePreference: ['images/premium-white-t-shirt.jpg', 'images/classic-crewneck-white-t-shirt.jpg', 'images/premium-supima-white-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Oversized Beige T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-003',
    price: 699,
    old_price: 949,
    stock: 32,
    sizes: 'S,M,L,XL,XXL',
    description: 'Drop-shoulder relaxed silhouette in sandy oatmeal beige jersey with a contemporary streetwear drape.',
    new_arrival: 0,
    imagePreference: ['images/oversized-beige-t-shirt.jpg', 'images/beige-earth-tone-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Blue Polo T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-004',
    price: 699,
    old_price: 999,
    stock: 30,
    sizes: 'S,M,L,XL,XXL',
    description: 'Honeycombed pique knit polo in midnight navy with a two-button placket and ribbed sleeve cuffs.',
    new_arrival: 1,
    imagePreference: ['images/navy-blue-polo-t-shirt.jpg', 'images/urban-polo-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Olive Green Casual T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-005',
    price: 599,
    old_price: 849,
    stock: 28,
    sizes: 'S,M,L,XL,XXL',
    description: 'Garment-washed military olive crewneck with vintage fade and an exceptionally broken-in hand feel.',
    new_arrival: 0,
    imagePreference: ['images/olive-green-casual-t-shirt.jpg', 'images/olive-green-regular-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Grey Slim Fit T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-006',
    price: 599,
    old_price: 799,
    stock: 35,
    sizes: 'S,M,L,XL,XXL',
    description: 'Athletic cut heather grey tri-blend t-shirt with 4-way stretch that holds its contour wash after wash.',
    new_arrival: 0,
    imagePreference: ['images/grey-slim-fit-t-shirt.jpg', 'images/heather-grey-athletic-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Maroon Cotton T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-007',
    price: 649,
    old_price: 899,
    stock: 24,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep burgundy red t-shirt crafted from 100% ring-spun jersey with pre-shrunk fabrication.',
    new_arrival: 0,
    imagePreference: ['images/maroon-cotton-t-shirt.jpg', 'images/maroon-pique-polo-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Oversized T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-008',
    price: 749,
    old_price: 1049,
    stock: 30,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heavyweight boxy cut black t-shirt featuring wide half sleeves and a robust mock neck collar.',
    new_arrival: 1,
    imagePreference: ['images/black-oversized-t-shirt.jpg', 'images/heavyweight-oversized-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Printed T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-009',
    price: 699,
    old_price: 949,
    stock: 25,
    sizes: 'S,M,L,XL,XXL',
    description: 'Minimalist chest typographic print on pitch black jersey with water-based eco-friendly ink.',
    new_arrival: 0,
    imagePreference: ['images/premium-printed-t-shirt.jpg', 'images/vintage-graphic-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'White Polo T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-010',
    price: 749,
    old_price: 1049,
    stock: 28,
    sizes: 'S,M,L,XL,XXL',
    description: 'Classic tennis white polo shirt with tipped navy collar lining and mother-of-pearl buttons.',
    new_arrival: 1,
    imagePreference: ['images/white-polo-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Dark Green T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-011',
    price: 599,
    old_price: 849,
    stock: 31,
    sizes: 'S,M,L,XL,XXL',
    description: 'Rich forest green regular fit t-shirt woven from soft combed cotton jersey.',
    new_arrival: 0,
    imagePreference: ['images/dark-green-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Relaxed Fit Blue T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-012',
    price: 629,
    old_price: 899,
    stock: 26,
    sizes: 'S,M,L,XL,XXL',
    description: 'Coastal slate blue t-shirt with a relaxed cut and chest patch pocket detail.',
    new_arrival: 0,
    imagePreference: ['images/relaxed-fit-blue-t-shirt.jpg', 'images/navy-pocket-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Brown Cotton T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-013',
    price: 629,
    old_price: 849,
    stock: 22,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep chocolate brown crewneck t-shirt with ribbed neck and tonal stitching.',
    new_arrival: 0,
    imagePreference: ['images/brown-cotton-t-shirt.jpg', 'images/ribbed-collar-brown-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Charcoal Grey T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-014',
    price: 629,
    old_price: 899,
    stock: 29,
    sizes: 'S,M,L,XL,XXL',
    description: 'Tailored fit dark charcoal t-shirt cut slim through the chest with a sculpted silhouette.',
    new_arrival: 1,
    imagePreference: ['images/charcoal-grey-t-shirt.jpg', 'images/slim-fit-charcoal-t-shirt.jpg', 'images/anthracite-muscle-fit-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Navy T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-015',
    price: 649,
    old_price: 899,
    stock: 33,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep saturated navy crewneck t-shirt made from luxury Pima cotton fibers.',
    new_arrival: 0,
    imagePreference: ['images/premium-navy-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Rust Orange T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-016',
    price: 599,
    old_price: 799,
    stock: 20,
    sizes: 'S,M,L,XL,XXL',
    description: 'Warm terracotta rust t-shirt that adds warmth and earthy character to summer layering.',
    new_arrival: 0,
    imagePreference: ['images/rust-orange-t-shirt.jpg', 'images/mustard-yellow-summer-t-shirt.jpg', 'images/coral-casual-v-neck-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Cream Oversized T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-017',
    price: 749,
    old_price: 999,
    stock: 27,
    sizes: 'S,M,L,XL,XXL',
    description: 'Off-white ivory cream heavyweight drop-shoulder t-shirt in unbleached organic cotton.',
    new_arrival: 1,
    imagePreference: ['images/cream-oversized-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Polo T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-018',
    price: 749,
    old_price: 1049,
    stock: 30,
    sizes: 'S,M,L,XL,XXL',
    description: 'Sharp solid black polo shirt in luxury mercerized cotton with a structured collar stand.',
    new_arrival: 0,
    imagePreference: ['images/black-polo-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Graphic T-Shirt',
    category: 'T-Shirts',
    sku: 'TED-TS-019',
    price: 699,
    old_price: 949,
    stock: 24,
    sizes: 'S,M,L,XL,XXL',
    description: 'Editorial fashion artwork printed across back with subtle chest emblem on luxury jersey.',
    new_arrival: 1,
    imagePreference: ['images/premium-graphic-t-shirt.jpg', 'images/vintage-graphic-t-shirt.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=700&q=80'
  },

  // --- JEANS (19 items) ---
  {
    name: 'Slim Fit Blue Jeans',
    category: 'Jeans',
    sku: 'TED-JN-001',
    price: 1299,
    old_price: 1799,
    stock: 18,
    sizes: '30,32,34,36,38',
    description: 'Tailored slim fit medium wash denim with 2% elastane for flexible movement and shape retention.',
    new_arrival: 1,
    imagePreference: ['images/slim-fit-blue-jeans.jpg', 'images/slim-fit-deep-indigo-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Dark Wash Jeans',
    category: 'Jeans',
    sku: 'TED-JN-002',
    price: 1399,
    old_price: 1999,
    stock: 16,
    sizes: '30,32,34,36,38',
    description: 'Deep midnight indigo rinse denim featuring antique copper hardware and clean tailored leg.',
    new_arrival: 1,
    imagePreference: ['images/dark-wash-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Classic Black Jeans',
    category: 'Jeans',
    sku: 'TED-JN-003',
    price: 1349,
    old_price: 1899,
    stock: 22,
    sizes: '30,32,34,36,38',
    description: 'Stay-black sulfur-dyed denim engineered to resist fading through numerous laundry cycles.',
    new_arrival: 0,
    imagePreference: ['images/classic-black-jeans.jpg', 'images/regular-fit-black-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Regular Fit Blue Jeans',
    category: 'Jeans',
    sku: 'TED-JN-004',
    price: 1249,
    old_price: 1699,
    stock: 25,
    sizes: '30,32,34,36,38',
    description: 'Timeless straight-leg cut in medium indigo denim with authentic whiskering and comfort waist.',
    new_arrival: 0,
    imagePreference: ['images/regular-fit-blue-jeans.jpg', 'images/classic-straight-cut-blue-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Light Wash Denim',
    category: 'Jeans',
    sku: 'TED-JN-005',
    price: 1449,
    old_price: 2099,
    stock: 15,
    sizes: '30,32,34,36,38',
    description: 'Vintage 90s light blue stonewashed denim with subtle hand-sanded abrasion highlights.',
    new_arrival: 1,
    imagePreference: ['images/light-wash-denim.jpg', 'images/light-wash-distressed-jeans.jpg', 'images/bleached-blue-summer-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Dark Blue Jeans',
    category: 'Jeans',
    sku: 'TED-JN-006',
    price: 1499,
    old_price: 2199,
    stock: 19,
    sizes: '30,32,34,36,38',
    description: 'High-density 13 oz ring-spun denim in deep ocean blue with contrast tobacco topstitching.',
    new_arrival: 0,
    imagePreference: ['images/premium-dark-blue-jeans.jpg', 'images/bootcut-dark-navy-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Tapered Fit Jeans',
    category: 'Jeans',
    sku: 'TED-JN-007',
    price: 1599,
    old_price: 2299,
    stock: 14,
    sizes: '30,32,34,36,38',
    description: 'Roomy through the thigh with a dramatic taper from knee to ankle for a modern, sharp silhouette.',
    new_arrival: 1,
    imagePreference: ['images/tapered-fit-jeans.jpg', 'images/tapered-indigo-selvedge-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Relaxed Fit Denim',
    category: 'Jeans',
    sku: 'TED-JN-008',
    price: 1399,
    old_price: 1899,
    stock: 20,
    sizes: '30,32,34,36,38',
    description: 'Wide easy-leg cut in soft vintage-wash blue denim for effortless casual weekend styling.',
    new_arrival: 0,
    imagePreference: ['images/relaxed-fit-denim.jpg', 'images/relaxed-fit-vintage-wash-jeans.jpg', 'images/carpenter-denim-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Washed Black Jeans',
    category: 'Jeans',
    sku: 'TED-JN-009',
    price: 1349,
    old_price: 1899,
    stock: 21,
    sizes: '30,32,34,36,38',
    description: 'Smoky faded black jeans with subtle enzyme-washed textures and matte hardware.',
    new_arrival: 0,
    imagePreference: ['images/washed-black-jeans.jpg', 'images/skinny-fit-jet-black-jeans.jpg', 'images/charcoal-fade-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Stretch Blue Jeans',
    category: 'Jeans',
    sku: 'TED-JN-010',
    price: 1399,
    old_price: 1949,
    stock: 26,
    sizes: '30,32,34,36,38',
    description: 'High-performance 360-degree stretch denim offering unmatched flexibility and all-day comfort.',
    new_arrival: 1,
    imagePreference: ['images/stretch-blue-jeans.jpg', 'images/flexible-comfort-stretch-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Mid Wash Jeans',
    category: 'Jeans',
    sku: 'TED-JN-011',
    price: 1299,
    old_price: 1799,
    stock: 24,
    sizes: '30,32,34,36,38',
    description: 'Balanced medium authentic blue wash with light fading along thighs and subtle honeycomb creases.',
    new_arrival: 0,
    imagePreference: ['images/mid-wash-jeans.jpg', 'images/mid-blue-whisker-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Classic Indigo Jeans',
    category: 'Jeans',
    sku: 'TED-JN-012',
    price: 1449,
    old_price: 1999,
    stock: 17,
    sizes: '30,32,34,36,38',
    description: 'Pure indigo-dyed twill denim featuring a clean front without distressing, ideal for smart-casual wear.',
    new_arrival: 1,
    imagePreference: ['images/classic-indigo-jeans.jpg', 'images/deep-indigo-rinse-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Grey Denim Jeans',
    category: 'Jeans',
    sku: 'TED-JN-013',
    price: 1349,
    old_price: 1849,
    stock: 19,
    sizes: '30,32,34,36,38',
    description: 'Refined slate grey denim jeans with subtle whiskering, bridging the gap between trousers and casual jeans.',
    new_arrival: 0,
    imagePreference: ['images/grey-denim-jeans.jpg', 'images/washed-grey-denim-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Slim Black Denim',
    category: 'Jeans',
    sku: 'TED-JN-014',
    price: 1399,
    old_price: 1949,
    stock: 23,
    sizes: '30,32,34,36,38',
    description: 'Sleek slim silhouette black denim with tonal black rivets and leather brand patch.',
    new_arrival: 0,
    imagePreference: ['images/slim-black-denim.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Vintage Wash Jeans',
    category: 'Jeans',
    sku: 'TED-JN-015',
    price: 1499,
    old_price: 2099,
    stock: 16,
    sizes: '30,32,34,36,38',
    description: 'Hand-distressed vintage finish with aged brass buttons and character-rich highs and lows.',
    new_arrival: 1,
    imagePreference: ['images/vintage-wash-jeans.jpg', 'images/acid-wash-retro-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Deep Indigo Jeans',
    category: 'Jeans',
    sku: 'TED-JN-016',
    price: 1449,
    old_price: 1999,
    stock: 20,
    sizes: '30,32,34,36,38',
    description: 'Unwashed raw indigo denim with rigid structure that molds to the wearer over time.',
    new_arrival: 0,
    imagePreference: ['images/deep-indigo-jeans.jpg', 'images/raw-denim-clean-jeans.jpg', 'images/heavyweight-raw-denim-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Straight Fit Blue Jeans',
    category: 'Jeans',
    sku: 'TED-JN-017',
    price: 1299,
    old_price: 1749,
    stock: 27,
    sizes: '30,32,34,36,38',
    description: 'Classic regular straight cut from waist down, delivering an authentic heritage aesthetic.',
    new_arrival: 0,
    imagePreference: ['images/straight-fit-blue-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Stone Wash Jeans',
    category: 'Jeans',
    sku: 'TED-JN-018',
    price: 1399,
    old_price: 1899,
    stock: 18,
    sizes: '30,32,34,36,38',
    description: 'Authentic pumice stone-washed light blue denim with broken-in softness and durable seam construction.',
    new_arrival: 0,
    imagePreference: ['images/stone-wash-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Stretch Jeans',
    category: 'Jeans',
    sku: 'TED-JN-019',
    price: 1499,
    old_price: 2199,
    stock: 22,
    sizes: '30,32,34,36,38',
    description: 'Luxury modal-cotton blend denim delivering velvet-soft touch and high recovery stretch.',
    new_arrival: 1,
    imagePreference: ['images/premium-stretch-jeans.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=80'
  },

  // --- TROUSERS (19 items) ---
  {
    name: 'Classic Beige Cotton Trousers',
    category: 'Trousers',
    sku: 'TED-TR-001',
    price: 1099,
    old_price: 1499,
    stock: 22,
    sizes: '30,32,34,36,38',
    description: 'Lightweight twill cotton chinos in warm neutral beige with flat front and tailored slash pockets.',
    new_arrival: 1,
    imagePreference: ['images/classic-beige-cotton-trousers.jpg', 'images/casual-cotton-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Slim Fit Black Trousers',
    category: 'Trousers',
    sku: 'TED-TR-002',
    price: 1199,
    old_price: 1699,
    stock: 25,
    sizes: '30,32,34,36,38',
    description: 'Sleek black formal trousers in wrinkle-resistant poly-viscose blend with sharp crease and tapered leg.',
    new_arrival: 1,
    imagePreference: ['images/slim-fit-black-trousers.jpg', 'images/classic-black-tailored-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Formal Trousers',
    category: 'Trousers',
    sku: 'TED-TR-003',
    price: 1199,
    old_price: 1699,
    stock: 20,
    sizes: '30,32,34,36,38',
    description: 'Impeccable midnight navy dress trousers with interior shirt-grip waistband and concealed hook closure.',
    new_arrival: 0,
    imagePreference: ['images/navy-formal-trousers.jpg', 'images/formal-navy-pleated-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Grey Trousers',
    category: 'Trousers',
    sku: 'TED-TR-004',
    price: 1249,
    old_price: 1799,
    stock: 18,
    sizes: '30,32,34,36,38',
    description: 'Wool-touch medium grey dress slacks engineered with natural give for all-day office comfort.',
    new_arrival: 1,
    imagePreference: ['images/premium-grey-trousers.jpg', 'images/charcoal-grey-dress-trousers.jpg', 'images/tailored-slim-fit-charcoal-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Olive Casual Trousers',
    category: 'Trousers',
    sku: 'TED-TR-005',
    price: 1149,
    old_price: 1599,
    stock: 24,
    sizes: '30,32,34,36,38',
    description: 'Garment-dyed military olive stretch chinos with coin pocket detail and tailored hem.',
    new_arrival: 0,
    imagePreference: ['images/olive-casual-trousers.jpg', 'images/olive-green-casual-chinos.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Relaxed Fit Beige Trousers',
    category: 'Trousers',
    sku: 'TED-TR-006',
    price: 1199,
    old_price: 1699,
    stock: 17,
    sizes: '30,32,34,36,38',
    description: 'Pleated front relaxed trousers in breathable linen-cotton blend with elasticated side tabs.',
    new_arrival: 0,
    imagePreference: ['images/relaxed-fit-beige-trousers.jpg', 'images/beige-linen-summer-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Charcoal Formal Trousers',
    category: 'Trousers',
    sku: 'TED-TR-007',
    price: 1299,
    old_price: 1849,
    stock: 19,
    sizes: '30,32,34,36,38',
    description: 'Dark charcoal wool-blend formal trousers with immaculate drape and permanent pressed crease.',
    new_arrival: 1,
    imagePreference: ['images/charcoal-formal-trousers.jpg', 'images/textured-wool-blend-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Brown Cotton Trousers',
    category: 'Trousers',
    sku: 'TED-TR-008',
    price: 1149,
    old_price: 1599,
    stock: 21,
    sizes: '30,32,34,36,38',
    description: 'Warm chestnut brown cotton trousers in brushed micro-twill, perfect with sweaters and blazers.',
    new_arrival: 0,
    imagePreference: ['images/brown-cotton-trousers.jpg', 'images/brown-corduroy-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Slim Fit Navy Trousers',
    category: 'Trousers',
    sku: 'TED-TR-009',
    price: 1199,
    old_price: 1649,
    stock: 26,
    sizes: '30,32,34,36,38',
    description: 'Modern slim silhouette navy chinos featuring comfort stretch waistband and rear welt pockets.',
    new_arrival: 1,
    imagePreference: ['images/slim-fit-navy-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Cream Linen Trousers',
    category: 'Trousers',
    sku: 'TED-TR-010',
    price: 1349,
    old_price: 1899,
    stock: 15,
    sizes: '30,32,34,36,38',
    description: 'Sophisticated natural off-white linen slacks with drawstring interior waist and breezy luxury feel.',
    new_arrival: 1,
    imagePreference: ['images/cream-linen-trousers.jpg', 'images/off-white-cotton-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Pleated Trousers',
    category: 'Trousers',
    sku: 'TED-TR-011',
    price: 1299,
    old_price: 1849,
    stock: 18,
    sizes: '30,32,34,36,38',
    description: 'Vintage single-pleat dress trousers in jet black with high-rise waist and extended tab closure.',
    new_arrival: 0,
    imagePreference: ['images/black-pleated-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Khaki Casual Trousers',
    category: 'Trousers',
    sku: 'TED-TR-012',
    price: 1099,
    old_price: 1499,
    stock: 28,
    sizes: '30,32,34,36,38',
    description: 'Standard khaki chinos with clean lines, belt loops, and durable double-needle stitching.',
    new_arrival: 0,
    imagePreference: ['images/khaki-casual-trousers.jpg', 'images/slim-fit-khaki-chinos.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Grey Check Trousers',
    category: 'Trousers',
    sku: 'TED-TR-013',
    price: 1399,
    old_price: 1999,
    stock: 16,
    sizes: '30,32,34,36,38',
    description: 'Subtle Prince of Wales Glen check trousers tailored with a clean tapered ankle hem.',
    new_arrival: 1,
    imagePreference: ['images/grey-check-trousers.jpg', 'images/houndstooth-pattern-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Dark Brown Trousers',
    category: 'Trousers',
    sku: 'TED-TR-014',
    price: 1199,
    old_price: 1699,
    stock: 20,
    sizes: '30,32,34,36,38',
    description: 'Espresso dark brown formal trousers cut from premium Italian-inspired stretch fabric.',
    new_arrival: 0,
    imagePreference: ['images/dark-brown-trousers.jpg', 'images/coffee-brown-formal-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Black Formal Trousers',
    category: 'Trousers',
    sku: 'TED-TR-015',
    price: 1299,
    old_price: 1899,
    stock: 23,
    sizes: '30,32,34,36,38',
    description: 'Executive-level tailored black dress pants with clean silhouette and stain-repellent finish.',
    new_arrival: 1,
    imagePreference: ['images/premium-black-formal-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Stone Cotton Trousers',
    category: 'Trousers',
    sku: 'TED-TR-016',
    price: 1099,
    old_price: 1499,
    stock: 25,
    sizes: '30,32,34,36,38',
    description: 'Clean light stone grey cotton trousers designed for versatile smart-casual transitions.',
    new_arrival: 0,
    imagePreference: ['images/stone-cotton-trousers.jpg', 'images/flat-front-tan-chinos.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Slim Trousers',
    category: 'Trousers',
    sku: 'TED-TR-017',
    price: 1149,
    old_price: 1599,
    stock: 22,
    sizes: '30,32,34,36,38',
    description: 'Sharp slim leg navy trousers woven with 3% spandex for uncompromised mobility.',
    new_arrival: 0,
    imagePreference: ['images/navy-slim-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Light Grey Trousers',
    category: 'Trousers',
    sku: 'TED-TR-018',
    price: 1199,
    old_price: 1699,
    stock: 21,
    sizes: '30,32,34,36,38',
    description: 'Crisp light dove-grey trousers with tailored waistband and smooth flat-front styling.',
    new_arrival: 0,
    imagePreference: ['images/light-grey-trousers.jpg', 'images/slate-grey-smart-casual-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Classic Khaki Trousers',
    category: 'Trousers',
    sku: 'TED-TR-019',
    price: 1149,
    old_price: 1599,
    stock: 29,
    sizes: '30,32,34,36,38',
    description: 'Original military twill khaki trousers offering timeless comfort and enduring durability.',
    new_arrival: 1,
    imagePreference: ['images/classic-khaki-trousers.jpg', 'images/khaki-stretch-twill-trousers.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80'
  },

  // --- JACKETS (19 items) ---
  {
    name: 'Classic Black Casual Jacket',
    category: 'Jackets',
    sku: 'TED-JK-001',
    price: 1799,
    old_price: 2499,
    stock: 12,
    sizes: 'S,M,L,XL,XXL',
    description: 'Versatile zip-front lightweight black jacket with storm flap, standing collar and zippered pockets.',
    new_arrival: 1,
    imagePreference: ['images/classic-black-casual-jacket.jpg', 'images/classic-casual-jacket.jpg', 'images/black-harrington-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Brown Bomber Jacket',
    category: 'Jackets',
    sku: 'TED-JK-002',
    price: 2499,
    old_price: 3499,
    stock: 10,
    sizes: 'S,M,L,XL,XXL',
    description: 'Supple brown faux-suede bomber jacket with ribbed collar, hem, cuffs, and antique brass zipper.',
    new_arrival: 1,
    imagePreference: ['images/premium-brown-bomber-jacket.jpg', 'images/suede-bomber-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Bomber Jacket',
    category: 'Jackets',
    sku: 'TED-JK-003',
    price: 2199,
    old_price: 2999,
    stock: 14,
    sizes: 'S,M,L,XL,XXL',
    description: 'Sleek dark navy nylon flight bomber jacket with orange contrast quilted lining and utility arm pocket.',
    new_arrival: 0,
    imagePreference: ['images/navy-bomber-jacket.jpg', 'images/trackside-sports-bomber-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Denim Jacket',
    category: 'Jackets',
    sku: 'TED-JK-004',
    price: 1899,
    old_price: 2699,
    stock: 16,
    sizes: 'S,M,L,XL,XXL',
    description: 'Washed black rigid denim trucker jacket featuring dual chest flap pockets and waist adjuster tabs.',
    new_arrival: 1,
    imagePreference: ['images/black-denim-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Olive Field Jacket',
    category: 'Jackets',
    sku: 'TED-JK-005',
    price: 2399,
    old_price: 3299,
    stock: 11,
    sizes: 'S,M,L,XL,XXL',
    description: 'Military M-65 field jacket in heavy cotton twill with four front cargo bellows pockets and internal drawstring.',
    new_arrival: 0,
    imagePreference: ['images/olive-field-jacket.jpg', 'images/khaki-field-utility-jacket.jpg', 'images/olive-green-aviator-bomber-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Tan Suede Jacket',
    category: 'Jackets',
    sku: 'TED-JK-006',
    price: 2799,
    old_price: 3899,
    stock: 9,
    sizes: 'S,M,L,XL,XXL',
    description: 'Buttery tan-cognac suede trucker jacket with pointed collar and satin inner lining.',
    new_arrival: 1,
    imagePreference: ['images/tan-suede-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Charcoal Casual Jacket',
    category: 'Jackets',
    sku: 'TED-JK-007',
    price: 2299,
    old_price: 3199,
    stock: 13,
    sizes: 'S,M,L,XL,XXL',
    description: 'Wool-blend unstructured casual overshirt jacket in deep charcoal melange with buttoned cuffs.',
    new_arrival: 0,
    imagePreference: ['images/charcoal-casual-jacket.jpg', 'images/charcoal-wool-overcoat.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Blue Denim Jacket',
    category: 'Jackets',
    sku: 'TED-JK-008',
    price: 1899,
    old_price: 2599,
    stock: 18,
    sizes: 'S,M,L,XL,XXL',
    description: 'Classic medium stonewash denim trucker jacket with authentic copper shank buttons.',
    new_arrival: 0,
    imagePreference: ['images/blue-denim-jacket.jpg', 'images/classic-denim-trucker-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Black Biker Jacket',
    category: 'Jackets',
    sku: 'TED-JK-009',
    price: 2999,
    old_price: 4299,
    stock: 8,
    sizes: 'S,M,L,XL,XXL',
    description: 'Iconic asymmetrical zip biker jacket in premium vegan leather with heavy silver hardware and snap lapels.',
    new_arrival: 1,
    imagePreference: ['images/premium-black-biker-jacket.jpg', 'images/premium-leather-biker-jacket.jpg', 'images/classic-black-leather-biker-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Beige Utility Jacket',
    category: 'Jackets',
    sku: 'TED-JK-010',
    price: 1999,
    old_price: 2799,
    stock: 15,
    sizes: 'S,M,L,XL,XXL',
    description: 'Clean sand beige safari jacket featuring multiple utility cargo pockets and zip-through front.',
    new_arrival: 0,
    imagePreference: ['images/beige-utility-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Dark Green Bomber Jacket',
    category: 'Jackets',
    sku: 'TED-JK-011',
    price: 2199,
    old_price: 2999,
    stock: 14,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep forest green satin finish bomber jacket with tonal ribbed trims and matte black zips.',
    new_arrival: 0,
    imagePreference: ['images/dark-green-bomber-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Grey Puffer Jacket',
    category: 'Jackets',
    sku: 'TED-JK-012',
    price: 2699,
    old_price: 3699,
    stock: 12,
    sizes: 'S,M,L,XL,XXL',
    description: 'Thermal down-alternative insulated grey quilted puffer jacket with detachable hood and fleece-lined pockets.',
    new_arrival: 1,
    imagePreference: ['images/grey-puffer-jacket.jpg', 'images/quilted-winter-puffer-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Navy Casual Jacket',
    category: 'Jackets',
    sku: 'TED-JK-013',
    price: 2199,
    old_price: 2999,
    stock: 17,
    sizes: 'S,M,L,XL,XXL',
    description: 'Lightweight showerproof navy coach jacket with snap closure and adjustable drawstring hem.',
    new_arrival: 0,
    imagePreference: ['images/navy-casual-jacket.jpg', 'images/navy-blue-tailored-blazer.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Brown Corduroy Jacket',
    category: 'Jackets',
    sku: 'TED-JK-014',
    price: 2299,
    old_price: 3199,
    stock: 11,
    sizes: 'S,M,L,XL,XXL',
    description: 'Textured wide-wale brown corduroy jacket with warm plush sherpa fleece collar lining.',
    new_arrival: 1,
    imagePreference: ['images/brown-corduroy-jacket.jpg', 'images/sherpa-lined-corduroy-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Harrington Jacket',
    category: 'Jackets',
    sku: 'TED-JK-015',
    price: 2199,
    old_price: 2999,
    stock: 16,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heritage British Harrington silhouette in sleek black cotton twill with double-button funnel collar.',
    new_arrival: 0,
    imagePreference: ['images/black-harrington-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Cream Overshirt Jacket',
    category: 'Jackets',
    sku: 'TED-JK-016',
    price: 1999,
    old_price: 2799,
    stock: 15,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heavyweight ivory cream wool-blend shacket with tortoise buttons and dual chest pockets.',
    new_arrival: 0,
    imagePreference: ['images/cream-overshirt-jacket.jpg', 'images/camel-cashmere-blend-blazer.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Dark Blue Denim Jacket',
    category: 'Jackets',
    sku: 'TED-JK-017',
    price: 1949,
    old_price: 2699,
    stock: 17,
    sizes: 'S,M,L,XL,XXL',
    description: 'Deep unwashed indigo denim jacket with clean tobacco stitching and tailored regular cut.',
    new_arrival: 0,
    imagePreference: ['images/dark-blue-denim-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Premium Winter Jacket',
    category: 'Jackets',
    sku: 'TED-JK-018',
    price: 2899,
    old_price: 3999,
    stock: 10,
    sizes: 'S,M,L,XL,XXL',
    description: 'Heavy insulated all-weather winter parka with water-resistant shell and cozy high-neck collar.',
    new_arrival: 1,
    imagePreference: ['images/premium-winter-jacket.jpg', 'images/water-resistant-hooded-parka.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Black Quilted Jacket',
    category: 'Jackets',
    sku: 'TED-JK-019',
    price: 2399,
    old_price: 3299,
    stock: 14,
    sizes: 'S,M,L,XL,XXL',
    description: 'Diamond-quilted lightweight transitional black jacket with corduroy-trimmed collar and snap vents.',
    new_arrival: 1,
    imagePreference: ['images/black-quilted-jacket.jpg'],
    fallbackUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', () => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Processing 95 men\'s clothing products...');
  const finalProducts = [];

  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const id = i + 1;
    const targetSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const canonicalPath = `images/${targetSlug}.jpg`;

    // Check if canonical path or any preference exists and is valid
    let resolvedImage = null;
    for (const pref of [canonicalPath, ...p.imagePreference]) {
      if (fs.existsSync(pref) && fs.statSync(pref).size > 1000) {
        resolvedImage = pref;
        break;
      }
    }

    // If a preference exists but not at canonical path, copy it to canonicalPath
    if (resolvedImage && resolvedImage !== canonicalPath) {
      fs.copyFileSync(resolvedImage, canonicalPath);
      resolvedImage = canonicalPath;
    }

    // If still missing, download from fallbackUrl
    if (!resolvedImage || !fs.existsSync(canonicalPath) || fs.statSync(canonicalPath).size < 1000) {
      console.log(`[${id}/95] Downloading image for: ${p.name} -> ${canonicalPath}`);
      const ok = await downloadFile(p.fallbackUrl, canonicalPath);
      if (!ok) {
        // Find ANY valid image in that category to copy as fallback
        const existingCat = finalProducts.find(fp => fp.category === p.category && fs.existsSync(fp.image));
        if (existingCat) {
          fs.copyFileSync(existingCat.image, canonicalPath);
          resolvedImage = canonicalPath;
        } else {
          fs.copyFileSync('shop_logo.png', canonicalPath);
          resolvedImage = canonicalPath;
        }
      } else {
        resolvedImage = canonicalPath;
      }
    }

    finalProducts.push({
      id: id,
      name: p.name,
      category: p.category,
      sku: p.sku,
      price: p.price,
      old_price: p.old_price,
      stock: p.stock,
      image: canonicalPath,
      sizes: p.sizes,
      description: p.description,
      status: 1,
      new_arrival: p.new_arrival,
      created_at: new Date().toISOString()
    });
  }

  // Read data.json and update products
  const dataPath = path.join(__dirname, 'data.json');
  let currentData = {};
  if (fs.existsSync(dataPath)) {
    currentData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  currentData.products = finalProducts;
  fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2), 'utf8');
  console.log(`data.json updated with exactly ${finalProducts.length} men's clothing products.`);

  // Generate database.sql seed
  let sqlValues = finalProducts.map(p => {
    const escName = p.name.replace(/'/g, "''");
    const escDesc = p.description.replace(/'/g, "''");
    return `('${escName}', '${p.category}', '${p.sku}', ${p.price}, ${p.old_price}, ${p.stock}, '${p.image}', '${escDesc}', 1, ${p.new_arrival}, '${p.sizes}')`;
  }).join(',\n');

  let sqlFile = fs.readFileSync('database.sql', 'utf8');
  const insertStart = sqlFile.indexOf('INSERT INTO `products`');
  if (insertStart !== -1) {
    const pre = sqlFile.substring(0, insertStart);
    const newInsert = `INSERT INTO \`products\` (\`name\`, \`category\`, \`sku\`, \`price\`, \`old_price\`, \`stock\`, \`image\`, \`description\`, \`status\`, \`new_arrival\`, \`sizes\`) VALUES\n${sqlValues};\n`;
    fs.writeFileSync('database.sql', pre + newInsert, 'utf8');
    console.log('database.sql updated with 95 clothing seeds!');
  } else {
    fs.appendFileSync('database.sql', `\nINSERT INTO \`products\` (\`name\`, \`category\`, \`sku\`, \`price\`, \`old_price\`, \`stock\`, \`image\`, \`description\`, \`status\`, \`new_arrival\`, \`sizes\`) VALUES\n${sqlValues};\n`);
    console.log('database.sql appended with 95 clothing seeds!');
  }

  // Summary per category
  const counts = {};
  finalProducts.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  console.log('Category breakdown:', counts);
}

run();
