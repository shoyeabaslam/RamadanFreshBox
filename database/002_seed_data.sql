INSERT INTO packages 
(name, fruits_limit, price, highlights, display_order, is_active)
VALUES
(
  '4 Fruit Iftar Box',
  4,
  199.00,
  ARRAY[
    'Choose any 4 fresh fruits',
    'Premium quality seasonal fruits',
    'Hygienically packed',
    'Perfect for small families'
  ],
  1,
  TRUE
),
(
  '6 Fruit Iftar Box',
  6,
  299.00,
  ARRAY[
    'Choose any 6 fresh fruits',
    'Best value for money',
    'Premium quality seasonal fruits',
    'Hygienically packed'
  ],
  2,
  TRUE
),
(
  '8 Fruit Iftar Box',
  8,
  399.00,
  ARRAY[
    'Choose any 8 fresh fruits',
    'Ideal for large families',
    'Premium assorted fruits',
    'Hygienically packed & sealed'
  ],
  3,
  TRUE
);



INSERT INTO fruits (name, is_available)
VALUES
('Apple', TRUE),
('Banana', TRUE),
('Orange', TRUE),
('Grapes', TRUE),
('Papaya', TRUE),
('Pomegranate', TRUE),
('Watermelon', TRUE),
('Musk Melon', TRUE),
('Guava', TRUE);


INSERT INTO settings (key, value)
VALUES
('self_cutoff_time', '18:00'),
('donate_cutoff_time', '16:00'),
('max_boxes_per_day', '100');


INSERT INTO orders (
  package_id,
  quantity,
  order_type,
  delivery_date,
  customer_name,
  phone_number,
  address,
  total_amount,
  status
)
VALUES (
  1,
  2,
  'self',
  CURRENT_DATE,
  'Ahmed Khan',
  '9876543210',
  'Tolichowki, Hyderabad',
  398.00,
  'paid'
) RETURNING id;



INSERT INTO order_fruits (order_id, fruit_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);


INSERT INTO orders (
  package_id,
  quantity,
  order_type,
  delivery_date,
  delivery_location,
  customer_name,
  phone_number,
  total_amount,
  status
)
VALUES (
  2,
  5,
  'donate',
  CURRENT_DATE,
  'Masjid Noor, Mehdipatnam',
  'Irfan Ali',
  '9123456789',
  1495.00,
  'packing'
) RETURNING id;


INSERT INTO order_fruits (order_id, fruit_id)
VALUES
(2, 1),
(2, 3),
(2, 4),
(2, 6),
(2, 7),
(2, 8);


INSERT INTO orders (
  package_id,
  quantity,
  order_type,
  delivery_date,
  delivery_location,
  customer_name,
  phone_number,
  sponsor_name,
  sponsor_message,
  total_amount,
  status
)
VALUES (
  3,
  20,
  'sponsor',
  CURRENT_DATE + INTERVAL '1 day',
  'Government Hospital, Nampally',
  'Rahman Enterprises',
  '9988776655',
  'Rahman Enterprises',
  'Ramadan Mubarak – Sponsored with care',
  7980.00,
  'pending'
) RETURNING id;


INSERT INTO order_fruits (order_id, fruit_id)
VALUES
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8);


INSERT INTO transactions (
  order_id,
  payment_gateway_id,
  amount,
  status,
  paid_at
)
VALUES (
  1,
  'razorpay_txn_ABC123',
  398.00,
  'success',
  NOW()
);


-- Seed delivery batches (Today's delivery reel)
INSERT INTO delivery_batches (
  delivery_date,
  location,
  instagram_url
)
VALUES (
  CURRENT_DATE,
  'Tolichowki & Surrounding Areas',
  'https://www.instagram.com/reel/C6yGfD5RnZM/'
);



