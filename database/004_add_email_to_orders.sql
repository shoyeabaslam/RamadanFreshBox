-- Add email field to orders table
ALTER TABLE orders 
ADD COLUMN email VARCHAR(255);

-- Create index for email lookups
CREATE INDEX idx_orders_email
ON orders(email)
WHERE email IS NOT NULL;
