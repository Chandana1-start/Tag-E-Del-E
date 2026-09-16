-- =========================================================
-- TAG É DEL É — Complete Database Schema & Seed Data
-- =========================================================

CREATE DATABASE IF NOT EXISTS `tag_e_dele` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tag_e_dele`;

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `shop_name` VARCHAR(150) NOT NULL DEFAULT 'TAG É DEL É',
  `phone` VARCHAR(50) DEFAULT '9876543210',
  `email` VARCHAR(120) DEFAULT 'contact@tagedele.com',
  `address` TEXT,
  `currency` VARCHAR(10) DEFAULT '₹',
  `logo` VARCHAR(255) DEFAULT 'shop_logo.png',
  `tagline` VARCHAR(255) DEFAULT 'Style that speaks for you.',
  `upi_id` VARCHAR(80) DEFAULT '9876543210@upi',
  `cod_enabled` TINYINT(1) DEFAULT 1,
  `online_enabled` TINYINT(1) DEFAULT 1
);

INSERT INTO `settings` (`shop_name`, `phone`, `email`, `address`, `currency`, `logo`, `tagline`, `upi_id`)
VALUES ('TAG É DEL É', '9876543210', 'contact@tagedele.com', '123 Fashion Street, Mumbai, India', '₹', 'shop_logo.png', 'Style that speaks for you.', '9876543210@upi');

CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `admins` (`username`, `password`)
VALUES ('admin', '$2y$10$Q7eY5FvYw9d1KzV9Lq3eUe5s5s5s5s5s5s5s5s5s5s5s5s5s5s5s.');

CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(60) NOT NULL,
  `sku` VARCHAR(60) NOT NULL UNIQUE,
  `price` DECIMAL(10,2) NOT NULL,
  `old_price` DECIMAL(10,2) DEFAULT 0,
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `new_arrival` TINYINT(1) NOT NULL DEFAULT 0,
  `sizes` VARCHAR(100) DEFAULT 'S,M,L,XL,XXL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `customer_name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(80) NOT NULL,
  `state` VARCHAR(80) NOT NULL,
  `pincode` VARCHAR(15) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(30) NOT NULL,
  `payment_status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `order_status` VARCHAR(30) NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_order_customer` FOREIGN KEY(`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
);

CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `size` VARCHAR(20) DEFAULT '',
  `price` DECIMAL(10,2) NOT NULL,
  `qty` INT NOT NULL,
  `line_total` DECIMAL(10,2) NOT NULL,
  CONSTRAINT `fk_item_order` FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
);

INSERT INTO `products` (`name`, `category`, `sku`, `price`, `old_price`, `stock`, `image`, `description`, `status`, `new_arrival`, `sizes`) VALUES
('Khaki Cargo Utility Shirt', 'Shirts', 'TED-SH-001', 999, 1399, 25, 'Shirts/images (10).jfif', 'Rugged combed cotton utility shirt with dual chest flap cargo pockets and reinforced stitching.', 1, 1, 'S,M,L,XL,XXL'),
('Floral Printed Resort Shirt', 'Shirts', 'TED-SH-002', 899, 1299, 20, 'Shirts/images (2).jfif', 'Camp collar short-sleeve resort shirt with floral art and contrasting vertical graphic panels.', 1, 1, 'S,M,L,XL,XXL'),
('Urban Graphic Printed Shirt', 'Shirts', 'TED-SH-003', 949, 1349, 22, 'Shirts/images (3).jfif', 'Contemporary relaxed-fit graphic printed casual shirt with Cuban lapel collar and resort drape.', 1, 0, 'S,M,L,XL,XXL'),
('Black Pleated Casual Shirt', 'Shirts', 'TED-SH-004', 1099, 1599, 18, 'Shirts/images (4).jfif', 'Modern relaxed black shirt featuring elegant front vertical pleating and textured drape.', 1, 1, 'S,M,L,XL,XXL'),
('Sky Blue Ombre Gradient Shirt', 'Shirts', 'TED-SH-005', 899, 1249, 30, 'Shirts/images (5).jfif', 'Summer resort short-sleeve shirt with sky blue to white dip-dye ombre and neat camp collar.', 1, 0, 'S,M,L,XL,XXL'),
('Sage Green Relaxed Linen Shirt', 'Shirts', 'TED-SH-006', 1199, 1699, 15, 'Shirts/images (7).jfif', 'Breathable coastal sage green linen shirt with roll-up sleeve tabs and relaxed point collar.', 1, 1, 'S,M,L,XL,XXL'),
('Dark Green Cotton Overshirt', 'Shirts', 'TED-SH-007', 1049, 1499, 24, 'Shirts/images (8).jfif', 'Heavyweight forest green twill overshirt with utility flap chest pockets and tailored seams.', 1, 0, 'S,M,L,XL,XXL'),
('Black & Royal Blue Gradient Shirt', 'Shirts', 'TED-SH-008', 999, 1399, 19, 'Shirts/images (9).jfif', 'Tailored slim-fit evening shirt featuring a dip-dye black to cobalt blue gradient wash.', 1, 1, 'S,M,L,XL,XXL'),
('White Graphic Print Streetwear T-Shirt', 'T-Shirts', 'TED-TS-001', 699, 949, 35, 'T-shirts/images (17).jfif', 'Heavyweight drop-shoulder white tee with vintage gold graphic artwork and ribbed collar.', 1, 1, 'S,M,L,XL,XXL'),
('Royal Blue Oversized Graphic T-Shirt', 'T-Shirts', 'TED-TS-002', 749, 1049, 30, 'T-shirts/images (18).jfif', 'Vibrant cobalt blue oversized streetwear t-shirt with back floral typography and relaxed drape.', 1, 1, 'S,M,L,XL,XXL'),
('Cream Collegiate Oversized T-Shirt', 'T-Shirts', 'TED-TS-003', 699, 999, 28, 'T-shirts/images (19).jfif', 'Boxy off-white collegiate varsity print crewneck t-shirt in heavy combed jersey.', 1, 0, 'S,M,L,XL,XXL'),
('Maroon & Navy Striped Rugby Polo T-Shirt', 'T-Shirts', 'TED-TS-004', 799, 1099, 25, 'T-shirts/images (20).jfif', 'Heritage colorblocked rugby polo tee with contrast white woven collar and chest embroidery.', 1, 1, 'S,M,L,XL,XXL'),
('White Graffiti Typography Street T-Shirt', 'T-Shirts', 'TED-TS-005', 649, 899, 32, 'T-shirts/images (21).jfif', 'Monochrome all-over graffiti typography artwork crewneck t-shirt with ribbed neck.', 1, 0, 'S,M,L,XL,XXL'),
('Beige New York Graphic T-Shirt', 'T-Shirts', 'TED-TS-006', 599, 849, 30, 'T-shirts/images (22).jfif', 'Soft combed oatmeal beige t-shirt with green collegiate varsity arch chest print.', 1, 0, 'S,M,L,XL,XXL'),
('Retro Knit Zip-Collar Polo T-Shirt', 'T-Shirts', 'TED-TS-007', 849, 1199, 20, 'T-shirts/images (23).jfif', 'Textured vertical cable knit polo shirt with front quarter zipper and tailored collar.', 1, 1, 'S,M,L,XL,XXL'),
('Brown Long Sleeve Basketball T-Shirt', 'T-Shirts', 'TED-TS-008', 699, 949, 22, 'T-shirts/images (24).jfif', 'Chocolate brown cotton jersey long-sleeve tee with vintage basketball graphic and ribbed cuffs.', 1, 0, 'S,M,L,XL,XXL'),
('Brown Vintage Striped Knit Polo T-Shirt', 'T-Shirts', 'TED-TS-009', 849, 1199, 18, 'T-shirts/images (25).jfif', 'Retro 70s vertical striped knit polo t-shirt with open Johnny collar and ribbed waist hem.', 1, 1, 'S,M,L,XL,XXL'),
('Classic Red Crewneck T-Shirt', 'T-Shirts', 'TED-TS-010', 549, 749, 40, 'T-shirts/images (26).jfif', 'Pure combed ring-spun cotton solid scarlet red crewneck t-shirt with durable seam finish.', 1, 0, 'S,M,L,XL,XXL'),
('Black Waffle Knit Henley T-Shirt', 'T-Shirts', 'TED-TS-011', 749, 999, 26, 'T-shirts/images (27).jfif', 'Textured thermal waffle knit long-sleeve Henley tee with four-button placket.', 1, 1, 'S,M,L,XL,XXL'),
('Solid Brown Pique Polo T-Shirt', 'T-Shirts', 'TED-TS-012', 699, 949, 28, 'T-shirts/images (28).jfif', 'Classic honeycombed pique knit polo t-shirt in rich mocha brown with two-button placket.', 1, 0, 'S,M,L,XL,XXL'),
('White Graphic Slogan T-Shirt', 'T-Shirts', 'TED-TS-013', 599, 799, 35, 'T-shirts/images (29).jfif', 'Clean white summer jersey t-shirt with bold retro chest slogan print and crew neck.', 1, 0, 'S,M,L,XL,XXL'),
('White Linen Formal Trousers', 'Trousers', 'TED-TR-001', 1299, 1799, 20, 'Trousers/2_4214be52-bd6e-493a-84ba-bfb0169fea43.webp', 'Pristine white linen dress slacks with permanent pressed crease and tailored slash pockets.', 1, 1, '30,32,34,36,38'),
('Black Slim Fit Formal Trousers', 'Trousers', 'TED-TR-002', 1199, 1699, 25, 'Trousers/images (42).jfif', 'Tailored midnight black dress slacks in wrinkle-resistant poly-viscose blend with sharp crease.', 1, 1, '30,32,34,36,38'),
('Dark Brown Wide Leg Relaxed Trousers', 'Trousers', 'TED-TR-003', 1349, 1899, 18, 'Trousers/images (43).jfif', 'Fashion-forward wide-leg relaxed trousers in deep espresso brown with extended waist tabs.', 1, 1, '30,32,34,36,38'),
('Royal Blue Slim Fit Dress Trousers', 'Trousers', 'TED-TR-004', 1199, 1649, 22, 'Trousers/images (44).jfif', 'Sharp cobalt blue formal trousers tailored slim through the leg with interior waistband grip.', 1, 0, '30,32,34,36,38'),
('Beige Textured Cotton Formal Trousers', 'Trousers', 'TED-TR-005', 1099, 1499, 24, 'Trousers/images (45).jfif', 'Lightweight micro-textured sand beige trousers with flat front styling and clean hem.', 1, 1, '30,32,34,36,38'),
('Off-White Relaxed Linen Trousers', 'Trousers', 'TED-TR-006', 1249, 1749, 17, 'Trousers/images (46).jfif', 'Casual pleated linen-cotton trousers with elasticated waist in natural off-white.', 1, 0, '30,32,34,36,38'),
('Olive Green Slim Fit Chinos', 'Trousers', 'TED-TR-007', 1149, 1599, 26, 'Trousers/images (47).jfif', 'Military olive stretch cotton chinos featuring coin pocket and tapered ankle cut.', 1, 0, '30,32,34,36,38'),
('Cream Slim Fit Casual Chinos', 'Trousers', 'TED-TR-008', 1099, 1499, 28, 'Trousers/images (6).jfif', 'Clean ivory cream chinos woven with comfort stretch for versatile smart-casual wear.', 1, 1, '30,32,34,36,38'),
('Khaki Loose Fit Linen Drawstring Trousers', 'Trousers', 'TED-TR-009', 1299, 1799, 19, 'Trousers/plustroulinloosep-khaki-1.webp', 'Relaxed coastal khaki linen trousers with comfortable adjustable drawstring waistband.', 1, 0, '30,32,34,36,38'),
('Light Blue Distressed Ripped Jeans', 'Jeans', 'TED-JN-001', 1499, 2099, 16, 'jeans/jeans_2.png', 'Bleached ice-blue denim jeans with artisanal knee rips and raw fraying details.', 1, 1, '30,32,34,36,38'),
('Vintage Wash Relaxed Straight Jeans', 'Jeans', 'TED-JN-002', 1399, 1899, 20, 'jeans/jeans_2.png', 'Authentic 90s vintage wash straight-leg blue denim jeans with classic 5-pocket styling.', 1, 1, '30,32,34,36,38'),
('Classic Relaxed Fit Baggy Blue Jeans', 'Jeans', 'TED-JN-003', 1349, 1799, 22, 'jeans/jeans_2.png'', 'Medium indigo skater baggy denim with easy roomy thigh and straight leg opening.', 1, 0, '30,32,34,36,38'),
('Heavy Distressed Grunge Denim Jeans', 'Jeans', 'TED-JN-004', 1599, 2299, 14, 'jeans/jeans_2.png', 'Statement grunge destroyed blue jeans with layered fraying and distressing on thighs and knees.', 1, 1, '30,32,34,36,38'),
('Classic Slim Fit Blue Denim Jeans', 'Jeans', 'TED-JN-005', 1299, 1799, 25, 'jeans/jeans_2.png', 'Timeless clean blue denim with flexible comfort stretch and tailored slim leg contour.', 1, 0, '30,32,34,36,38'),
('Light Blue Denim Jogger Jeans', 'Jeans', 'TED-JN-006', 1399, 1949, 18, 'jeans/jeans_2.png', 'Elasticated drawstring waist light blue denim joggers with gathered cuffs and slash pockets.', 1, 1, '30,32,34,36,38'),
('Camo Patch Distressed Tapered Jeans', 'Jeans', 'TED-JN-007', 1449, 1999, 19, 'jeans/jeans_2.png', 'Dark wash distressed tapered jeans with reinforced camouflage backing patches behind knee tears.', 1, 0, '30,32,34,36,38'),
('Washed Dark Grey Relaxed Jeans', 'Jeans', 'TED-JN-008', 1399, 1899, 21, 'jeans/jeans_2.png', 'Smoky charcoal grey enzyme-washed wide-leg denim jeans with clean modern finish.', 1, 1, '30,32,34,36,38'),
('Brown Leather Aviator Bomber Jacket', 'Jackets', 'TED-JK-001', 2699, 3799, 10, 'jackets/jacket_1.png', 'Genuine flight styling with plush shearling faux-fur collar, aviation badges, and zip sleeve pocket.', 1, 1, 'S,M,L,XL,XXL'),
('Tan Suede Bomber Jacket', 'Jackets', 'TED-JK-002', 2499, 3499, 12, 'jackets/jacket_1.png', 'Supple caramel tan suede bomber jacket with ribbed collar, hem, cuffs, and front zip closure.', 1, 1, 'S,M,L,XL,XXL'),
('Distressed Brown Leather Field Jacket', 'Jackets', 'TED-JK-003', 2899, 3999, 8, 'jackets/jacket_1.png'', 'Vintage burnished brown leather coat with notched lapels, button front, and flap hip pockets.', 1, 1, 'S,M,L,XL,XXL'),
('Burnished Brown Leather Zip Jacket', 'Jackets', 'TED-JK-004', 2599, 3599, 11, 'jackets/jacket_1.png', 'Sleek front-zip burnished leather jacket with structured shirt collar and dual chest pockets.', 1, 0, 'S,M,L,XL,XXL'),
('Camouflage Hooded Utility Parka', 'Jackets', 'TED-JK-005', 2399, 3299, 14, 'jackets/jacket_1.png', 'High-spec hooded camo utility jacket with technical weatherproofing and multi-compartment storage.', 1, 1, 'S,M,L,XL,XXL'),
('Caramel Lightweight Bomber Jacket', 'Jackets', 'TED-JK-006', 1999, 2799, 16, 'jackets/jacket_1.png', 'Clean minimalist caramel brown bomber jacket with smooth matte zip and ribbed trims.', 1, 0, 'S,M,L,XL,XXL'),
('Olive Green Harrington Jacket', 'Jackets', 'TED-JK-007', 2199, 2999, 15, 'jackets/jacket_1.png', 'Classic British Harrington silhouette with funnel collar, zip closure, and elasticated hem in army olive.', 1, 0, 'S,M,L,XL,XXL'),
('Cream Suede Shearling Collar Jacket', 'Jackets', 'TED-JK-008', 2799, 3899, 9, 'jackets/jacket_1.png', 'Warm ivory cream faux-suede jacket with cozy shearling fleece collar and neck buckle strap.', 1, 1, 'S,M,L,XL,XXL'),
('Stonewash Blue Denim Trucker Jacket', 'Jackets', 'TED-JK-009', 1899, 2599, 18, 'jackets/jacket_1.png', 'Heritage medium blue denim trucker jacket with dual chest flap pockets and shank buttons.', 1, 0, 'S,M,L,XL,XXL'),
('Washed Grey Leather Moto Jacket', 'Jackets', 'TED-JK-010', 2499, 3499, 12, 'jackets/jacket_1.png', 'Distressed acid-wash grey leather jacket with biker mandarin collar and dual chest flap pockets.', 1, 1, 'S,M,L,XL,XXL'),
('Speed Racing Biker Leather Jacket', 'Jackets', 'TED-JK-011', 2999, 4299, 7, 'jackets/jacket_1.png', 'Colorblocked black and white leather motorcycle jacket with racing badges and snap collar.', 1, 1, 'S,M,L,XL,XXL'),
('Scuba Suede Oversized Contrast Jacket', 'Jackets', 'TED-JK-012', 2299, 3199, 13, 'jackets/jacket_1.png', 'Modern drop-shoulder cream and olive contrast scuba suede jacket with asymmetric biker zipper.', 1, 1, 'S,M,L,XL,XXL');
