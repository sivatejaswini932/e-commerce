/*
# Seed Data for ShopSphere

1. Categories
- Electronics
- Fashion
- Home & Living
- Sports
- Books
- Beauty & Health

2. Products
- Sample products for each category with realistic data including Pexels images
- Mix of featured and trending products
- Various price points and stock levels

3. Coupons
- SAVE10: 10% off
- FLAT100: $100 off orders over $500
*/

-- Categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'electronics', 'Latest gadgets, smartphones, laptops, and electronic accessories', 'https://images.pexels.com/photos/35185/phones-apple-iphone-6-iphone-6s.jpg?auto=compress&cs=tinysrgb&w=600'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fashion', 'fashion', 'Trending styles, clothing, shoes, and accessories for all occasions', 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Home & Living', 'home-living', 'Furniture, decor, kitchen essentials, and home improvement items', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Sports', 'sports', 'Sports equipment, fitness gear, and outdoor essentials', 'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Books', 'books', 'Fiction, non-fiction, educational, and self-help books', 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Beauty & Health', 'beauty-health', 'Skincare, makeup, wellness products, and health essentials', 'https://images.pexels.com/photos/3290902/pexels-photo-3290902.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, description, price, compare_price, stock, category_id, image_url, images, rating, reviews_count, is_featured, is_trending) VALUES
  -- Electronics
  ('650e8400-e29b-41d4-a716-446655440001', 'Pro Wireless Earbuds', 'pro-wireless-earbuds', 'Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.', 149.99, 199.99, 250, '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/3780697/pexels-photo-3780697.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/3780697/pexels-photo-3780697.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/9282881/pexels-photo-9282881.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.8, 234, true, true),
  ('650e8400-e29b-41d4-a716-446655440002', 'Smart Watch Ultra', 'smart-watch-ultra', 'Advanced smartwatch with health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant up to 50 meters.', 399.99, 449.99, 120, '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.6, 189, true, false),
  ('650e8400-e29b-41d4-a716-446655440003', 'Mechanical Gaming Keyboard', 'mechanical-gaming-keyboard', 'RGB mechanical keyboard with Cherry MX switches, programmable keys, and durable aluminum frame. Built for serious gamers.', 129.99, 169.99, 180, '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.7, 156, false, true),
  ('650e8400-e29b-41d4-a716-446655440004', '4K Ultra HD Monitor', '4k-ultra-hd-monitor', '32-inch 4K monitor with HDR support, USB-C connectivity, and eye-care technology. Ideal for designers and content creators.', 549.99, 699.99, 75, '550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.5, 89, false, false),

  -- Fashion
  ('650e8400-e29b-41d4-a716-446655440005', 'Classic Leather Jacket', 'classic-leather-jacket', 'Genuine leather jacket with premium craftsmanship. Features multiple pockets, quilted lining, and timeless design.', 249.99, 349.99, 45, '550e8400-e29b-41d4-a716-446655440002', 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.9, 312, true, true),
  ('650e8400-e29b-41d4-a716-446655440006', 'Running Sneakers Pro', 'running-sneakers-pro', 'Lightweight running shoes with advanced cushioning technology, breathable mesh upper, and superior grip. Perfect for daily runs.', 119.99, 159.99, 200, '550e8400-e29b-41d4-a716-446655440002', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.7, 278, true, false),
  ('650e8400-e29b-41d4-a716-446655440007', 'Designer Sunglasses', 'designer-sunglasses', 'Premium polarized sunglasses with UV400 protection. Lightweight titanium frame with scratch-resistant lenses.', 189.99, NULL, 95, '550e8400-e29b-41d4-a716-446655440002', 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.4, 67, false, true),
  ('650e8400-e29b-41d4-a716-446655440008', 'Minimalist Watch', 'minimalist-watch', 'Elegant analog watch with Japanese movement, sapphire crystal glass, and genuine leather strap. Water-resistant to 30m.', 159.99, 199.99, 150, '550e8400-e29b-41d4-a716-446655440002', 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.8, 201, true, true),

  -- Home & Living
  ('650e8400-e29b-41d4-a716-446655440009', 'Modern Table Lamp', 'modern-table-lamp', 'Minimalist table lamp with adjustable brightness, USB charging port, and touch control. Perfect for modern homes.', 79.99, 99.99, 300, '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.6, 145, false, true),
  ('650e8400-e29b-41d4-a716-446655440010', 'Ergonomic Office Chair', 'ergonomic-office-chair', 'Premium office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort.', 349.99, 449.99, 60, '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/1957802/pexels-photo-1957802.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/1957802/pexels-photo-1957802.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.9, 234, true, true),
  ('650e8400-e29b-41d4-a716-446655440011', 'Cozy Throw Blanket', 'cozy-throw-blanket', 'Ultra-soft throw blanket made from premium microfiber. Machine washable and perfect for all seasons.', 49.99, NULL, 400, '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/6585752/pexels-photo-6585752.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/6585752/pexels-photo-6585752.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.7, 189, false, false),
  ('650e8400-e29b-41d4-a716-446655440012', 'Ceramic Planter Set', 'ceramic-planter-set', 'Set of 3 handmade ceramic planters with drainage holes. Perfect for indoor plants and succulents.', 59.99, 79.99, 180, '550e8400-e29b-41d4-a716-446655440003', 'https://images.pexels.com/photos/1457812/pexels-photo-1457812.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/1457812/pexels-photo-1457812.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.5, 78, false, true),

  -- Sports
  ('650e8400-e29b-41d4-a716-446655440013', 'Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick yoga mat with non-slip surface and carrying strap. Eco-friendly TPE material. Perfect for yoga and meditation.', 39.99, 59.99, 500, '550e8400-e29b-41d4-a716-446655440004', 'https://images.pexels.com/photos/4056390/pexels-photo-4056390.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/4056390/pexels-photo-4056390.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.8, 456, true, true),
  ('650e8400-e29b-41d4-a716-446655440014', 'Adjustable Dumbbell Set', 'adjustable-dumbbell-set', 'Space-saving adjustable dumbbells from 5-50 lbs. Quick-change weight system for efficient home workouts.', 299.99, 399.99, 85, '550e8400-e29b-41d4-a716-446655440004', 'https://images.pexels.com/photos/4162495/pexels-photo-4162495.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/4162495/pexels-photo-4162495.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.9, 167, true, false),
  ('650e8400-e29b-41d4-a716-446655440015', 'Running Hydration Vest', 'running-hydration-vest', 'Lightweight hydration vest with 2L bladder capacity. Multiple pockets for essentials, breathable mesh design.', 59.99, 79.99, 120, '550e8400-e29b-41d4-a716-446655440004', 'https://images.pexels.com/photos/12428859/pexels-photo-12428859.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/12428859/pexels-photo-12428859.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.6, 89, false, true),

  -- Books
  ('650e8400-e29b-41d4-a716-446655440016', 'The Art of Leadership', 'art-of-leadership', 'A comprehensive guide to modern leadership principles. Perfect for aspiring leaders and managers.', 24.99, NULL, 350, '550e8400-e29b-41d4-a716-446655440005', 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.7, 234, true, false),
  ('650e8400-e29b-41d4-a716-446655440017', 'Mediterranean Cookbook', 'mediterranean-cookbook', '150+ healthy Mediterranean recipes with beautiful photography. Includes nutritional information and meal plans.', 34.99, 44.99, 200, '550e8400-e29b-41d4-a716-446655440005', 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.8, 189, false, true),

  -- Beauty & Health
  ('650e8400-e29b-41d4-a716-446655440018', 'Skincare Essentials Kit', 'skincare-essentials-kit', 'Complete skincare set including cleanser, toner, serum, and moisturizer. Formulated for all skin types.', 89.99, 129.99, 150, '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/3290902/pexels-photo-3290902.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/3290902/pexels-photo-3290902.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.9, 345, true, true),
  ('650e8400-e29b-41d4-a716-446655440019', 'Electric Facial Cleansing Device', 'electric-facial-cleansing', 'Advanced facial cleansing brush with multiple speed settings and waterproof design. Deep pore cleaning technology.', 69.99, 99.99, 180, '550e8400-e29b-41d4-a716-446655440006', 'https://images.pexels.com/photos/3688988/pexels-photo-3688988.jpeg?auto=compress&cs=tinysrgb&w=600', ARRAY['https://images.pexels.com/photos/3688988/pexels-photo-3688988.jpeg?auto=compress&cs=tinysrgb&w=600'], 4.6, 167, false, true)
ON CONFLICT (id) DO NOTHING;

-- Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_uses, expires_at, is_active) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'SAVE10', 'percentage', 10, 50, NULL, NULL, true),
  ('750e8400-e29b-41d4-a716-446655440002', 'FLAT100', 'fixed', 100, 500, NULL, NULL, true),
  ('750e8400-e29b-41d4-a716-446655440003', 'WELCOME15', 'percentage', 15, 75, 1000, NULL, true),
  ('750e8400-e29b-41d4-a716-446655440004', 'FREESHIP', 'percentage', 0, 50, NULL, NULL, true)
ON CONFLICT (code) DO NOTHING;