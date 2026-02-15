CREATE TYPE order_type_enum AS ENUM (
  'self',
  'donate',
  'sponsor'
);

CREATE TYPE order_status_enum AS ENUM (
  'pending',
  'paid',
  'packing',
  'delivered',
  'cancelled'
);

-- Create the packages table

CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fruits_limit INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,

  highlights TEXT[] NOT NULL,  -- package bullet points
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE INDEX idx_packages_active 
ON packages(is_active) 
WHERE deleted_at IS NULL;

-- Create the fruits table

CREATE TABLE fruits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fruits_available 
ON fruits(is_available) 
WHERE deleted_at IS NULL;

-- Create the orders table

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  package_id INT NOT NULL REFERENCES packages(id),
  
  quantity INT NOT NULL CHECK (quantity > 0),
  order_type order_type_enum NOT NULL,

  delivery_date DATE NOT NULL,
  delivery_location VARCHAR(255),

  customer_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address TEXT,

  total_amount NUMERIC(10,2) NOT NULL,
  status order_status_enum DEFAULT 'pending',

  sponsor_name VARCHAR(150),
  sponsor_message TEXT,

  transaction_id BIGINT,

  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);



-- Fetch today’s delivery quickly
CREATE INDEX idx_orders_delivery_date
ON orders(delivery_date)
WHERE deleted_at IS NULL;

-- Status filtering (packing dashboard)
CREATE INDEX idx_orders_status
ON orders(status)
WHERE deleted_at IS NULL;

-- Order type filtering (donation reports)
CREATE INDEX idx_orders_type
ON orders(order_type)
WHERE deleted_at IS NULL;

-- Fast lookup by phone
CREATE INDEX idx_orders_phone
ON orders(phone_number);

-- Composite index for daily admin dashboard
CREATE INDEX idx_orders_date_status
ON orders(delivery_date, status)
WHERE deleted_at IS NULL;



-- Create the order_fruits table

CREATE TABLE order_fruits (
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  fruit_id INT REFERENCES fruits(id),
  PRIMARY KEY (order_id, fruit_id)
);

CREATE INDEX idx_order_fruits_order 
ON order_fruits(order_id);

CREATE INDEX idx_order_fruits_fruit 
ON order_fruits(fruit_id);


-- Create the transactions table

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  payment_gateway_id VARCHAR(150) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_gateway
ON transactions(payment_gateway_id);


-- Create the settings table

CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Create the banners table

CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150),
  caption TEXT,
  image_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_banners_active 
ON banners(is_active);



-- Delivery Batches

CREATE TABLE delivery_batches (
  id SERIAL PRIMARY KEY,
  delivery_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_delivery_batches_date
ON delivery_batches(delivery_date)
WHERE deleted_at IS NULL;

CREATE INDEX idx_delivery_batches_location
ON delivery_batches(location)
WHERE deleted_at IS NULL;
