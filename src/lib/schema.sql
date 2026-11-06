-- ====================================================================
-- L'AURA ÉTOILE RESTAURANT MANAGEMENT SYSTEM - NEON POSTGRESQL SCHEMA
-- ====================================================================

-- 1. Table for Restaurant Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2,
  date DATE NOT NULL,
  time_slot VARCHAR(16) NOT NULL,
  area VARCHAR(64) NOT NULL DEFAULT 'Main Dining Room',
  special_requests TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'confirmed', -- 'pending', 'confirmed', 'seated', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- 2. Table for Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_signature BOOLEAN DEFAULT false,
  dietary_tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);

-- 3. Table for Kitchen Orders (KDS & Online Orders)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_code VARCHAR(32) NOT NULL UNIQUE,
  order_type VARCHAR(32) NOT NULL DEFAULT 'Dine-In', -- 'Dine-In', 'Takeaway', 'Tasting Box Delivery'
  table_number VARCHAR(32),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'received', -- 'received', 'in_kitchen', 'ready', 'served', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 4. Table for Dining Floor Tables
CREATE TABLE IF NOT EXISTS dining_tables (
  id VARCHAR(64) PRIMARY KEY,
  table_number VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  area VARCHAR(64) NOT NULL DEFAULT 'Main Dining Room',
  status VARCHAR(32) NOT NULL DEFAULT 'available', -- 'available', 'occupied', 'reserved', 'cleaning'
  current_guest VARCHAR(255),
  reservation_time VARCHAR(16)
);
