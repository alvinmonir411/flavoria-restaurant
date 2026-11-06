import { neon } from '@neondatabase/serverless';
import { 
  MenuItem, 
  Reservation, 
  ReservationStatus, 
  DiningTable, 
  TableStatus, 
  Order, 
  OrderStatus,
  InventoryItem,
  WaitlistEntry,
  StaffMember,
  GuestProfile,
  PromoCode,
  GiftCard,
  EventInquiry,
  DeliveryDriver,
  DeliveryZone,
  Recipe,
  Supplier,
  PurchaseOrder,
  Expense,
  CustomerReview,
  AuditLog,
  TableCallRequest,
  RestaurantSettings
} from '@/types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_TABLES, 
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_WAITLIST,
  INITIAL_STAFF,
  INITIAL_GUEST_PROFILES,
  INITIAL_PROMO_CODES,
  INITIAL_GIFT_CARDS,
  INITIAL_EVENTS,
  INITIAL_DELIVERY_DRIVERS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_RECIPES,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TABLE_CALLS,
  DEFAULT_SETTINGS
} from './seed-data';

// Global singleton in-memory fallback store
interface LocalStore {
  menu: MenuItem[];
  reservations: Reservation[];
  tables: DiningTable[];
  orders: Order[];
  inventory: InventoryItem[];
  waitlist: WaitlistEntry[];
  staff: StaffMember[];
  guestProfiles: GuestProfile[];
  promoCodes: PromoCode[];
  giftCards: GiftCard[];
  events: EventInquiry[];
  drivers: DeliveryDriver[];
  zones: DeliveryZone[];
  recipes: Recipe[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  expenses: Expense[];
  reviews: CustomerReview[];
  auditLogs: AuditLog[];
  tableCalls: TableCallRequest[];
  settings: RestaurantSettings;
  initialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __restaurant_store: LocalStore | undefined;
}

function getLocalStore(): LocalStore {
  if (!globalThis.__restaurant_store) {
    globalThis.__restaurant_store = {
      menu: [...INITIAL_MENU_ITEMS],
      reservations: [...INITIAL_RESERVATIONS],
      tables: [...INITIAL_TABLES],
      orders: [...INITIAL_ORDERS],
      inventory: [...INITIAL_INVENTORY],
      waitlist: [...INITIAL_WAITLIST],
      staff: [...INITIAL_STAFF],
      guestProfiles: [...INITIAL_GUEST_PROFILES],
      promoCodes: [...INITIAL_PROMO_CODES],
      giftCards: [...INITIAL_GIFT_CARDS],
      events: [...INITIAL_EVENTS],
      drivers: [...INITIAL_DELIVERY_DRIVERS],
      zones: [...INITIAL_DELIVERY_ZONES],
      recipes: [...INITIAL_RECIPES],
      suppliers: [...INITIAL_SUPPLIERS],
      purchaseOrders: [...INITIAL_PURCHASE_ORDERS],
      expenses: [...INITIAL_EXPENSES],
      reviews: [...INITIAL_REVIEWS],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      tableCalls: [...INITIAL_TABLE_CALLS],
      settings: { ...DEFAULT_SETTINGS },
      initialized: true
    };
  }
  return globalThis.__restaurant_store;
}

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.startsWith('postgres') && !url.includes('placeholder'));
}

export function getNeonSql() {
  if (!isNeonConfigured()) return null;
  try {
    return neon(process.env.DATABASE_URL!);
  } catch (err) {
    console.error('Failed to initialize Neon client:', err);
    return null;
  }
}

// Ensure Neon tables exist if connected
let schemaEnsured = false;
export async function ensureNeonSchema() {
  if (schemaEnsured) return true;
  const sql = getNeonSql();
  if (!sql) return false;

  try {
    // 1. Reservations Table
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(32) NOT NULL UNIQUE,
        guest_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        guests INTEGER NOT NULL DEFAULT 2,
        date VARCHAR(32) NOT NULL,
        time_slot VARCHAR(16) NOT NULL,
        area VARCHAR(64) NOT NULL DEFAULT 'Main Dining Room',
        table_number VARCHAR(32),
        special_requests TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS table_number VARCHAR(32);`;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_table_slot 
      ON reservations (table_number, date, time_slot) 
      WHERE status != 'cancelled';
    `;

    // 2. Menu Items Table
    await sql`
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
    `;

    // 3. Orders Table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        order_code VARCHAR(32) NOT NULL UNIQUE,
        order_type VARCHAR(32) NOT NULL DEFAULT 'Dine-In',
        table_number VARCHAR(32),
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(64) NOT NULL,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'received',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Dining Tables Table
    await sql`
      CREATE TABLE IF NOT EXISTS dining_tables (
        id VARCHAR(64) PRIMARY KEY,
        table_number VARCHAR(32) NOT NULL UNIQUE,
        name VARCHAR(128) NOT NULL,
        capacity INTEGER NOT NULL DEFAULT 2,
        area VARCHAR(64) NOT NULL DEFAULT 'Main Dining Room',
        status VARCHAR(32) NOT NULL DEFAULT 'available',
        current_guest VARCHAR(255),
        reservation_time VARCHAR(16)
      );
    `;

    // 5. Inventory Items Table
    await sql`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        current_stock NUMERIC(10, 2) NOT NULL,
        unit VARCHAR(32) NOT NULL,
        reorder_level NUMERIC(10, 2) NOT NULL,
        cost_per_unit NUMERIC(10, 2) NOT NULL,
        supplier VARCHAR(255) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'in_stock',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Waitlist Table
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id VARCHAR(64) PRIMARY KEY,
        guest_name VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        party_size INTEGER NOT NULL DEFAULT 2,
        area_preference VARCHAR(64) NOT NULL DEFAULT 'Main Dining Room',
        estimated_wait_mins INTEGER NOT NULL DEFAULT 15,
        status VARCHAR(32) NOT NULL DEFAULT 'waiting',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Staff Members Table
    await sql`
      CREATE TABLE IF NOT EXISTS staff_members (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        pin_code VARCHAR(16) DEFAULT '1234',
        role VARCHAR(64) NOT NULL,
        shift VARCHAR(32) NOT NULL DEFAULT 'Evening',
        is_clocked_in BOOLEAN DEFAULT false,
        hours_worked_today NUMERIC(5, 2) DEFAULT 0,
        phone VARCHAR(64) NOT NULL,
        station VARCHAR(32) NOT NULL DEFAULT 'Floor',
        permissions TEXT[] DEFAULT '{}'
      );
    `;

    // Ensure columns for existing staff_members table
    await sql`ALTER TABLE staff_members ADD COLUMN IF NOT EXISTS email VARCHAR(255);`;
    await sql`ALTER TABLE staff_members ADD COLUMN IF NOT EXISTS pin_code VARCHAR(16) DEFAULT '1234';`;
    await sql`ALTER TABLE staff_members ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';`;

    // 8. Guest Profiles Table
    await sql`
      CREATE TABLE IF NOT EXISTS guest_profiles (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        total_visits INTEGER DEFAULT 1,
        lifetime_spend NUMERIC(10, 2) DEFAULT 0,
        vip_tier VARCHAR(64) DEFAULT 'Regular',
        allergies TEXT[] DEFAULT '{}',
        favorite_table VARCHAR(64),
        notes TEXT,
        last_visit VARCHAR(32)
      );
    `;

    // 9. Promo Codes Table
    await sql`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code VARCHAR(64) PRIMARY KEY,
        discount_percent INTEGER NOT NULL,
        description TEXT NOT NULL,
        min_order_amount NUMERIC(10, 2) DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        max_uses INTEGER DEFAULT 1000,
        expires_at VARCHAR(32),
        is_active BOOLEAN DEFAULT true
      );
    `;

    // 10. Gift Cards Table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(64) NOT NULL UNIQUE,
        initial_balance NUMERIC(10, 2) NOT NULL,
        current_balance NUMERIC(10, 2) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        message TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 11. Event Inquiries Table
    await sql`
      CREATE TABLE IF NOT EXISTS event_inquiries (
        id VARCHAR(64) PRIMARY KEY,
        contact_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        event_type VARCHAR(128) NOT NULL,
        guest_count INTEGER NOT NULL,
        preferred_date VARCHAR(32) NOT NULL,
        package_tier VARCHAR(64) NOT NULL,
        estimated_budget NUMERIC(10, 2) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 12. Delivery Drivers
    await sql`
      CREATE TABLE IF NOT EXISTS delivery_drivers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        vehicle VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'available',
        active_orders_count INTEGER NOT NULL DEFAULT 0,
        rating NUMERIC(3, 1) NOT NULL DEFAULT 5.0
      );
    `;

    // 13. Delivery Zones
    await sql`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        min_time_mins INTEGER NOT NULL,
        max_time_mins INTEGER NOT NULL,
        delivery_fee NUMERIC(10, 2) NOT NULL,
        min_order_amount NUMERIC(10, 2) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true
      );
    `;

    // 14. Recipes & Food Costing
    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id VARCHAR(64) PRIMARY KEY,
        menu_item_id VARCHAR(64) NOT NULL,
        dish_name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        ingredients JSONB NOT NULL DEFAULT '[]',
        total_cost NUMERIC(10, 2) NOT NULL,
        selling_price NUMERIC(10, 2) NOT NULL,
        gross_margin_percent NUMERIC(5, 2) NOT NULL,
        target_food_cost_percent NUMERIC(5, 2) NOT NULL
      );
    `;

    // 15. Suppliers
    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        category VARCHAR(128) NOT NULL,
        payment_terms VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'active'
      );
    `;

    // 16. Purchase Orders
    await sql`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id VARCHAR(64) PRIMARY KEY,
        po_number VARCHAR(64) NOT NULL UNIQUE,
        supplier_id VARCHAR(64) NOT NULL,
        supplier_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL DEFAULT '[]',
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'draft',
        expected_delivery_date VARCHAR(32) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 17. Operating Expenses
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(64) PRIMARY KEY,
        category VARCHAR(64) NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(64) NOT NULL,
        vendor VARCHAR(255) NOT NULL,
        date VARCHAR(32) NOT NULL,
        recorded_by VARCHAR(255) NOT NULL
      );
    `;

    // 18. Customer Reviews
    await sql`
      CREATE TABLE IF NOT EXISTS customer_reviews (
        id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        dish_name VARCHAR(255),
        comment TEXT NOT NULL,
        date VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'published',
        staff_response TEXT
      );
    `;

    // 19. Audit Logs
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        action VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        "user" VARCHAR(255) NOT NULL,
        role VARCHAR(64) NOT NULL,
        details TEXT NOT NULL
      );
    `;

    // 20. Table Call Requests (Assistance & Bill)
    await sql`
      CREATE TABLE IF NOT EXISTS table_calls (
        id VARCHAR(64) PRIMARY KEY,
        table_number VARCHAR(32) NOT NULL,
        type VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 21. Global Settings
    await sql`
      CREATE TABLE IF NOT EXISTS restaurant_settings (
        id VARCHAR(32) PRIMARY KEY DEFAULT 'current',
        name VARCHAR(255) NOT NULL,
        tagline TEXT NOT NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        currency VARCHAR(16) NOT NULL DEFAULT 'USD',
        tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 8.5,
        delivery_fee_default NUMERIC(5, 2) NOT NULL DEFAULT 4.99,
        announcement_banner TEXT,
        is_online_ordering_open BOOLEAN NOT NULL DEFAULT true,
        is_reservations_open BOOLEAN NOT NULL DEFAULT true,
        theme_mode VARCHAR(16) NOT NULL DEFAULT 'light'
      );
    `;

    // Seed Neon if empty
    const menuCount = await sql`SELECT count(*) FROM menu_items`;
    if (parseInt(menuCount[0].count) === 0) {
      for (const item of INITIAL_MENU_ITEMS) {
        await sql`
          INSERT INTO menu_items (id, name, category, description, price, is_available, is_signature, dietary_tags, image_url, created_at)
          VALUES (${item.id}, ${item.name}, ${item.category}, ${item.description}, ${item.price}, ${item.isAvailable}, ${item.isSignature}, ${item.dietaryTags}, ${item.imageUrl}, ${item.createdAt})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    const tableCount = await sql`SELECT count(*) FROM dining_tables`;
    if (parseInt(tableCount[0].count) === 0) {
      for (const t of INITIAL_TABLES) {
        await sql`
          INSERT INTO dining_tables (id, table_number, name, capacity, area, status, current_guest, reservation_time)
          VALUES (${t.id}, ${t.tableNumber}, ${t.name}, ${t.capacity}, ${t.area}, ${t.status}, ${t.currentGuest || null}, ${t.reservationTime || null})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    const resCount = await sql`SELECT count(*) FROM reservations`;
    if (parseInt(resCount[0].count) === 0) {
      for (const r of INITIAL_RESERVATIONS) {
        await sql`
          INSERT INTO reservations (id, code, guest_name, email, phone, guests, date, time_slot, area, special_requests, status, created_at)
          VALUES (${r.id}, ${r.code}, ${r.guestName}, ${r.email}, ${r.phone}, ${r.guests}, ${r.date}, ${r.timeSlot}, ${r.area}, ${r.specialRequests || ''}, ${r.status}, ${r.createdAt})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    const orderCount = await sql`SELECT count(*) FROM orders`;
    if (parseInt(orderCount[0].count) === 0) {
      for (const o of INITIAL_ORDERS) {
        await sql`
          INSERT INTO orders (id, order_code, order_type, table_number, customer_name, customer_phone, items, total_amount, status, notes, created_at)
          VALUES (${o.id}, ${o.orderCode}, ${o.orderType}, ${o.tableNumber || null}, ${o.customerName}, ${o.customerPhone}, ${JSON.stringify(o.items)}, ${o.totalAmount}, ${o.status}, ${o.notes || ''}, ${o.createdAt})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    const invCount = await sql`SELECT count(*) FROM inventory_items`;
    if (parseInt(invCount[0].count) === 0) {
      for (const inv of INITIAL_INVENTORY) {
        await sql`
          INSERT INTO inventory_items (id, name, category, current_stock, unit, reorder_level, cost_per_unit, supplier, status, updated_at)
          VALUES (${inv.id}, ${inv.name}, ${inv.category}, ${inv.currentStock}, ${inv.unit}, ${inv.reorderLevel}, ${inv.costPerUnit}, ${inv.supplier}, ${inv.status}, ${inv.updatedAt})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    const promoCount = await sql`SELECT count(*) FROM promo_codes`;
    if (parseInt(promoCount[0].count) === 0) {
      for (const p of INITIAL_PROMO_CODES) {
        await sql`
          INSERT INTO promo_codes (code, discount_percent, description, min_order_amount, usage_count, max_uses, expires_at, is_active)
          VALUES (${p.code}, ${p.discountPercent}, ${p.description}, ${p.minOrderAmount}, ${p.usageCount}, ${p.maxUses}, ${p.expiresAt}, ${p.isActive})
          ON CONFLICT (code) DO NOTHING;
        `;
      }
    }

    schemaEnsured = true;
    return true;
  } catch (error) {
    console.error('Neon schema ensure error:', error);
    return false;
  }
}

// ========================
// MENU METHODS
// ========================
export async function getMenuItems(): Promise<MenuItem[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM menu_items ORDER BY created_at ASC`;
      return rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        name: String(r.name),
        category: r.category as MenuItem['category'],
        description: String(r.description),
        price: Number(r.price),
        isAvailable: Boolean(r.is_available),
        isSignature: Boolean(r.is_signature),
        dietaryTags: Array.isArray(r.dietary_tags) ? r.dietary_tags : [],
        imageUrl: String(r.image_url || ''),
        createdAt: String(r.created_at)
      }));
    } catch (e) {
      console.warn('Neon menu query failed:', e);
    }
  }
  return getLocalStore().menu;
}

export async function createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem> {
  const newItem: MenuItem = {
    ...item,
    id: `menu-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO menu_items (id, name, category, description, price, is_available, is_signature, dietary_tags, image_url, created_at)
        VALUES (${newItem.id}, ${newItem.name}, ${newItem.category}, ${newItem.description}, ${newItem.price}, ${newItem.isAvailable}, ${newItem.isSignature}, ${newItem.dietaryTags}, ${newItem.imageUrl}, ${newItem.createdAt})
      `;
      return newItem;
    } catch (e) {
      console.warn('Neon insert failed, fallback:', e);
    }
  }

  const store = getLocalStore();
  store.menu.unshift(newItem);
  return newItem;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      if (updates.isAvailable !== undefined) {
        await sql`UPDATE menu_items SET is_available = ${updates.isAvailable} WHERE id = ${id}`;
      }
      if (updates.price !== undefined) {
        await sql`UPDATE menu_items SET price = ${updates.price} WHERE id = ${id}`;
      }
      if (updates.name !== undefined) {
        await sql`UPDATE menu_items SET name = ${updates.name}, description = ${updates.description || ''}, category = ${updates.category || 'Mains'} WHERE id = ${id}`;
      }
      const rows = await sql`SELECT * FROM menu_items WHERE id = ${id}`;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: String(r.id),
          name: String(r.name),
          category: r.category as MenuItem['category'],
          description: String(r.description),
          price: Number(r.price),
          isAvailable: Boolean(r.is_available),
          isSignature: Boolean(r.is_signature),
          dietaryTags: Array.isArray(r.dietary_tags) ? r.dietary_tags : [],
          imageUrl: String(r.image_url || ''),
          createdAt: String(r.created_at)
        };
      }
    } catch (e) {
      console.warn('Neon update failed:', e);
    }
  }

  const store = getLocalStore();
  const index = store.menu.findIndex(m => m.id === id);
  if (index !== -1) {
    store.menu[index] = { ...store.menu[index], ...updates };
    return store.menu[index];
  }
  return null;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`DELETE FROM menu_items WHERE id = ${id}`;
      return true;
    } catch (e) {
      console.warn('Neon delete failed:', e);
    }
  }

  const store = getLocalStore();
  const index = store.menu.findIndex(m => m.id === id);
  if (index !== -1) {
    store.menu.splice(index, 1);
    return true;
  }
  return false;
}

// ========================
// RESERVATIONS METHODS
// ========================
export async function getReservations(): Promise<Reservation[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM reservations ORDER BY date DESC, time_slot ASC`;
      return rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        code: String(r.code),
        guestName: String(r.guest_name),
        email: String(r.email),
        phone: String(r.phone),
        guests: Number(r.guests),
        date: String(r.date),
        timeSlot: String(r.time_slot),
        area: r.area as Reservation['area'],
        tableNumber: r.table_number ? String(r.table_number) : undefined,
        specialRequests: String(r.special_requests || ''),
        status: r.status as ReservationStatus,
        createdAt: String(r.created_at)
      }));
    } catch (e) {
      console.warn('Neon reservations query failed:', e);
    }
  }
  return getLocalStore().reservations;
}

export async function createReservation(res: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status'>): Promise<Reservation> {
  const code = `FLV-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRes: Reservation = {
    ...res,
    id: `res-${Date.now()}`,
    code,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO reservations (id, code, guest_name, email, phone, guests, date, time_slot, area, table_number, special_requests, status, created_at)
        VALUES (${newRes.id}, ${newRes.code}, ${newRes.guestName}, ${newRes.email}, ${newRes.phone}, ${newRes.guests}, ${newRes.date}, ${newRes.timeSlot}, ${newRes.area}, ${newRes.tableNumber || null}, ${newRes.specialRequests || ''}, ${newRes.status}, ${newRes.createdAt})
      `;
      return newRes;
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      console.error('Neon insert reservation error:', err);
      if (err?.code === '23505' || err?.message?.includes('unique') || err?.message?.includes('conflict') || err?.message?.includes('reservations_table_slot')) {
        throw new Error(`CONCURRENCY_CONFLICT: Table ${newRes.tableNumber} is already booked for ${newRes.timeSlot} on ${newRes.date}.`);
      }
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database transaction failed. Reservation not confirmed.');
      }
    }
  }

  const store = getLocalStore();
  store.reservations.unshift(newRes);
  return newRes;
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`UPDATE reservations SET status = ${status} WHERE id = ${id}`;
      const rows = await sql`SELECT * FROM reservations WHERE id = ${id}`;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: String(r.id),
          code: String(r.code),
          guestName: String(r.guest_name),
          email: String(r.email),
          phone: String(r.phone),
          guests: Number(r.guests),
          date: String(r.date),
          timeSlot: String(r.time_slot),
          area: r.area as Reservation['area'],
          specialRequests: String(r.special_requests || ''),
          status: r.status as ReservationStatus,
          createdAt: String(r.created_at)
        };
      }
    } catch (e) {
      console.warn('Neon update reservation failed:', e);
    }
  }

  const store = getLocalStore();
  const index = store.reservations.findIndex(r => r.id === id);
  if (index !== -1) {
    store.reservations[index].status = status;
    return store.reservations[index];
  }
  return null;
}

// ========================
// ORDERS METHODS (KDS & POS)
// ========================
export async function getOrders(): Promise<Order[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
      return rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        orderCode: String(r.order_code),
        orderType: (r.order_type as Order['orderType']) || 'Dine-In',
        tableNumber: r.table_number ? String(r.table_number) : undefined,
        customerName: String(r.customer_name),
        customerPhone: String(r.customer_phone),
        customerEmail: r.customer_email ? String(r.customer_email) : undefined,
        deliveryAddress: r.delivery_address ? String(r.delivery_address) : undefined,
        deliveryZone: r.delivery_zone ? String(r.delivery_zone) : undefined,
        deliveryFee: r.delivery_fee ? Number(r.delivery_fee) : 0,
        scheduledFor: r.scheduled_for ? String(r.scheduled_for) : 'ASAP',
        assignedDriverId: r.assigned_driver_id ? String(r.assigned_driver_id) : undefined,
        assignedDriverName: r.assigned_driver_name ? String(r.assigned_driver_name) : undefined,
        paymentMethod: (r.payment_method as Order['paymentMethod']) || 'Credit Card',
        paymentStatus: (r.payment_status as Order['paymentStatus']) || 'paid',
        items: (Array.isArray(r.items) ? r.items : (typeof r.items === 'string' ? JSON.parse(r.items) : [])) as Order['items'],
        subtotal: r.subtotal ? Number(r.subtotal) : undefined,
        taxAmount: r.tax_amount ? Number(r.tax_amount) : undefined,
        tipAmount: r.tip_amount ? Number(r.tip_amount) : undefined,
        discountAmount: r.discount_amount ? Number(r.discount_amount) : undefined,
        totalAmount: Number(r.total_amount),
        status: r.status as OrderStatus,
        notes: r.notes ? String(r.notes) : undefined,
        createdAt: String(r.created_at)
      }));
    } catch (e) {
      console.warn('Neon orders query failed:', e);
    }
  }
  return getLocalStore().orders;
}

export async function createOrder(order: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'status'> & Partial<Pick<Order, 'status'>>): Promise<Order> {
  const orderCode = `FLV-${Math.floor(1000 + Math.random() * 8999)}`;
  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now()}`,
    orderCode,
    status: order.status || 'received',
    paymentMethod: order.paymentMethod || 'Cash on Delivery',
    paymentStatus: order.paymentStatus || 'pending',
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO orders (id, order_code, order_type, table_number, customer_name, customer_phone, items, total_amount, status, notes, created_at)
        VALUES (${newOrder.id}, ${newOrder.orderCode}, ${newOrder.orderType}, ${newOrder.tableNumber || null}, ${newOrder.customerName}, ${newOrder.customerPhone}, ${JSON.stringify(newOrder.items)}, ${newOrder.totalAmount}, ${newOrder.status}, ${newOrder.notes || ''}, ${newOrder.createdAt})
      `;
      return newOrder;
    } catch (e: unknown) {
      console.error('Neon create order error:', e);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database transaction failed. Order not recorded.');
      }
    }
  }

  const store = getLocalStore();
  store.orders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
      const rows = await sql`SELECT * FROM orders WHERE id = ${id}`;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: String(r.id),
          orderCode: String(r.order_code),
          orderType: (r.order_type as Order['orderType']) || 'Dine-In',
          tableNumber: r.table_number ? String(r.table_number) : undefined,
          customerName: String(r.customer_name),
          customerPhone: String(r.customer_phone),
          paymentMethod: (r.payment_method as Order['paymentMethod']) || 'Cash on Delivery',
          paymentStatus: (r.payment_status as Order['paymentStatus']) || 'pending',
          items: (Array.isArray(r.items) ? r.items : (typeof r.items === 'string' ? JSON.parse(r.items) : [])) as Order['items'],
          totalAmount: Number(r.total_amount),
          status: r.status as OrderStatus,
          notes: r.notes ? String(r.notes) : undefined,
          createdAt: String(r.created_at)
        };
      }
    } catch (e) {
      console.warn('Neon update order failed:', e);
    }
  }

  const store = getLocalStore();
  const index = store.orders.findIndex(o => o.id === id);
  if (index !== -1) {
    store.orders[index].status = status;
    return store.orders[index];
  }
  return null;
}

// ========================
// DINING TABLES METHODS
// ========================
export async function getTables(): Promise<DiningTable[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM dining_tables ORDER BY table_number ASC`;
      return rows.map((r: Record<string, unknown>) => ({
        id: String(r.id),
        tableNumber: String(r.table_number),
        name: String(r.name),
        capacity: Number(r.capacity),
        area: r.area as DiningTable['area'],
        status: r.status as TableStatus,
        currentGuest: r.current_guest ? String(r.current_guest) : undefined,
        reservationTime: r.reservation_time ? String(r.reservation_time) : undefined
      }));
    } catch (e) {
      console.warn('Neon tables query failed:', e);
    }
  }
  return getLocalStore().tables;
}

export async function updateTableStatus(
  id: string, 
  status: TableStatus, 
  currentGuest?: string, 
  reservationTime?: string
): Promise<DiningTable | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        UPDATE dining_tables 
        SET status = ${status}, current_guest = ${currentGuest || null}, reservation_time = ${reservationTime || null}
        WHERE id = ${id}
      `;
      const rows = await sql`SELECT * FROM dining_tables WHERE id = ${id}`;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: String(r.id),
          tableNumber: String(r.table_number),
          name: String(r.name),
          capacity: Number(r.capacity),
          area: r.area as DiningTable['area'],
          status: r.status as TableStatus,
          currentGuest: r.current_guest ? String(r.current_guest) : undefined,
          reservationTime: r.reservation_time ? String(r.reservation_time) : undefined
        };
      }
    } catch (e) {
      console.warn('Neon update table failed:', e);
    }
  }

  const store = getLocalStore();
  const index = store.tables.findIndex(t => t.id === id);
  if (index !== -1) {
    store.tables[index].status = status;
    store.tables[index].currentGuest = currentGuest;
    store.tables[index].reservationTime = reservationTime;
    return store.tables[index];
  }
  return null;
}

// ========================
// INVENTORY METHODS
// ========================
export async function getInventory(): Promise<InventoryItem[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM inventory_items ORDER BY name ASC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          category: r.category as InventoryItem['category'],
          currentStock: Number(r.current_stock),
          unit: String(r.unit),
          reorderLevel: Number(r.reorder_level),
          costPerUnit: Number(r.cost_per_unit),
          supplier: String(r.supplier),
          status: r.status as InventoryItem['status'],
          updatedAt: String(r.updated_at)
        }));
      }
    } catch (e) {
      console.warn('Neon inventory query failed:', e);
    }
  }
  return getLocalStore().inventory;
}

export async function updateInventoryStock(id: string, delta: number): Promise<InventoryItem | null> {
  const store = getLocalStore();
  const item = store.inventory.find(i => i.id === id);
  if (!item) return null;

  item.currentStock = Math.max(0, item.currentStock + delta);
  if (item.currentStock === 0) item.status = 'out_of_stock';
  else if (item.currentStock <= item.reorderLevel) item.status = 'low_stock';
  else item.status = 'in_stock';
  item.updatedAt = new Date().toISOString();

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE inventory_items 
        SET current_stock = ${item.currentStock}, status = ${item.status}, updated_at = ${item.updatedAt}
        WHERE id = ${id}
      `;
    } catch (e) {
      console.warn(e);
    }
  }
  return item;
}

// ========================
// WAITLIST METHODS
// ========================
export async function getWaitlist(): Promise<WaitlistEntry[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM waitlist ORDER BY created_at ASC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          guestName: String(r.guest_name),
          phone: String(r.phone),
          partySize: Number(r.party_size),
          areaPreference: String(r.area_preference),
          estimatedWaitMins: Number(r.estimated_wait_mins),
          status: r.status as WaitlistEntry['status'],
          createdAt: String(r.created_at)
        }));
      }
    } catch (e) {
      console.warn('Neon waitlist query failed:', e);
    }
  }
  return getLocalStore().waitlist;
}

export async function addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): Promise<WaitlistEntry> {
  const newEntry: WaitlistEntry = {
    ...entry,
    id: `wt-${Date.now()}`,
    status: 'waiting',
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO waitlist (id, guest_name, phone, party_size, area_preference, estimated_wait_mins, status, created_at)
        VALUES (${newEntry.id}, ${newEntry.guestName}, ${newEntry.phone}, ${newEntry.partySize}, ${newEntry.areaPreference}, ${newEntry.estimatedWaitMins}, ${newEntry.status}, ${newEntry.createdAt})
      `;
    } catch (e) {
      console.warn(e);
    }
  }

  const store = getLocalStore();
  store.waitlist.push(newEntry);
  return newEntry;
}

export async function updateWaitlistStatus(id: string, status: WaitlistEntry['status']): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`UPDATE waitlist SET status = ${status} WHERE id = ${id}`;
    } catch (e) {
      console.warn(e);
    }
  }
  const store = getLocalStore();
  const found = store.waitlist.find(w => w.id === id);
  if (found) {
    found.status = status;
    return true;
  }
  return false;
}

// ========================
// STAFF METHODS
// ========================
export async function getStaff(): Promise<StaffMember[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM staff_members ORDER BY name ASC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          email: r.email ? String(r.email) : undefined,
          pinCode: r.pin_code ? String(r.pin_code) : '1234',
          role: r.role as StaffMember['role'],
          shift: r.shift as StaffMember['shift'],
          isClockedIn: Boolean(r.is_clocked_in),
          hoursWorkedToday: Number(r.hours_worked_today),
          phone: String(r.phone),
          station: r.station as StaffMember['station'],
          permissions: Array.isArray(r.permissions) ? r.permissions : []
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().staff;
}

export async function toggleStaffClockIn(id: string): Promise<StaffMember | null> {
  const store = getLocalStore();
  const member = store.staff.find(s => s.id === id);
  if (!member) return null;

  member.isClockedIn = !member.isClockedIn;
  if (!member.isClockedIn) {
    member.hoursWorkedToday = Math.round((member.hoursWorkedToday + 1.5) * 10) / 10;
  }

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE staff_members 
        SET is_clocked_in = ${member.isClockedIn}, hours_worked_today = ${member.hoursWorkedToday} 
        WHERE id = ${id}
      `;
    } catch (e) {
      console.warn(e);
    }
  }
  return member;
}

// ========================
// GUEST CRM PROFILES
// ========================
export async function getGuestProfiles(): Promise<GuestProfile[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM guest_profiles ORDER BY lifetime_spend DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          email: String(r.email),
          phone: String(r.phone),
          totalVisits: Number(r.total_visits),
          lifetimeSpend: Number(r.lifetime_spend),
          vipTier: r.vip_tier as GuestProfile['vipTier'],
          allergies: Array.isArray(r.allergies) ? r.allergies : [],
          favoriteTable: String(r.favorite_table || ''),
          notes: String(r.notes || ''),
          lastVisit: String(r.last_visit || '')
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().guestProfiles;
}

// ========================
// PROMO CODES
// ========================
export async function getPromoCodes(): Promise<PromoCode[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM promo_codes ORDER BY discount_percent DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          code: String(r.code),
          discountPercent: Number(r.discount_percent),
          description: String(r.description),
          minOrderAmount: Number(r.min_order_amount),
          usageCount: Number(r.usage_count),
          maxUses: Number(r.max_uses),
          expiresAt: String(r.expires_at || ''),
          isActive: Boolean(r.is_active)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().promoCodes;
}

export async function validatePromoCode(code: string, amount: number): Promise<{ valid: boolean; discountPercent: number; message: string }> {
  const codes = await getPromoCodes();
  const match = codes.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!match) {
    return { valid: false, discountPercent: 0, message: 'Invalid or expired promotional code.' };
  }
  if (amount < match.minOrderAmount) {
    return { valid: false, discountPercent: 0, message: `Minimum order amount of $${match.minOrderAmount} required for this code.` };
  }
  return { valid: true, discountPercent: match.discountPercent, message: `${match.discountPercent}% VIP discount applied!` };
}

// ========================
// GIFT CARDS
// ========================
export async function getGiftCards(): Promise<GiftCard[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM gift_cards ORDER BY created_at DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          code: String(r.code),
          initialBalance: Number(r.initial_balance),
          currentBalance: Number(r.current_balance),
          senderName: String(r.sender_name),
          recipientName: String(r.recipient_name),
          recipientEmail: String(r.recipient_email),
          message: String(r.message || ''),
          status: r.status as GiftCard['status'],
          createdAt: String(r.created_at)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().giftCards;
}

export async function createGiftCard(data: Omit<GiftCard, 'id' | 'code' | 'createdAt' | 'status' | 'currentBalance'>): Promise<GiftCard> {
  const code = `FLV-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
  const newCard: GiftCard = {
    ...data,
    id: `gc-${Date.now()}`,
    code,
    currentBalance: data.initialBalance,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO gift_cards (id, code, initial_balance, current_balance, sender_name, recipient_name, recipient_email, message, status, created_at)
        VALUES (${newCard.id}, ${newCard.code}, ${newCard.initialBalance}, ${newCard.currentBalance}, ${newCard.senderName}, ${newCard.recipientName}, ${newCard.recipientEmail}, ${newCard.message}, ${newCard.status}, ${newCard.createdAt})
      `;
    } catch (e) {
      console.warn(e);
    }
  }

  const store = getLocalStore();
  store.giftCards.unshift(newCard);
  return newCard;
}

// ========================
// PRIVATE EVENTS
// ========================
export async function getEvents(): Promise<EventInquiry[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM event_inquiries ORDER BY created_at DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          contactName: String(r.contact_name),
          email: String(r.email),
          phone: String(r.phone),
          eventType: r.event_type as EventInquiry['eventType'],
          guestCount: Number(r.guest_count),
          preferredDate: String(r.preferred_date),
          packageTier: r.package_tier as EventInquiry['packageTier'],
          estimatedBudget: Number(r.estimated_budget),
          status: r.status as EventInquiry['status'],
          notes: String(r.notes || ''),
          createdAt: String(r.created_at)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().events;
}

export async function createEventInquiry(inquiry: Omit<EventInquiry, 'id' | 'createdAt' | 'status'>): Promise<EventInquiry> {
  const newInquiry: EventInquiry = {
    ...inquiry,
    id: `ev-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`
        INSERT INTO event_inquiries (id, contact_name, email, phone, event_type, guest_count, preferred_date, package_tier, estimated_budget, status, notes, created_at)
        VALUES (${newInquiry.id}, ${newInquiry.contactName}, ${newInquiry.email}, ${newInquiry.phone}, ${newInquiry.eventType}, ${newInquiry.guestCount}, ${newInquiry.preferredDate}, ${newInquiry.packageTier}, ${newInquiry.estimatedBudget}, ${newInquiry.status}, ${newInquiry.notes || ''}, ${newInquiry.createdAt})
      `;
    } catch (e) {
      console.warn(e);
    }
  }

  const store = getLocalStore();
  store.events.unshift(newInquiry);
  return newInquiry;
}

// ============================================
// 12. DELIVERY LOGISTICS
// ============================================
export async function getDeliveryDrivers(): Promise<DeliveryDriver[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM delivery_drivers`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          phone: String(r.phone),
          vehicle: r.vehicle as DeliveryDriver['vehicle'],
          status: r.status as DeliveryDriver['status'],
          activeOrdersCount: Number(r.active_orders_count),
          rating: Number(r.rating)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().drivers;
}

export async function updateDriverStatus(id: string, status: DeliveryDriver['status']): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      await sql`UPDATE delivery_drivers SET status = ${status} WHERE id = ${id}`;
    } catch (e) {
      console.warn(e);
    }
  }
  const store = getLocalStore();
  const driver = store.drivers.find(d => d.id === id);
  if (driver) driver.status = status;
  return true;
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM delivery_zones`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          minTimeMins: Number(r.min_time_mins),
          maxTimeMins: Number(r.max_time_mins),
          deliveryFee: Number(r.delivery_fee),
          minOrderAmount: Number(r.min_order_amount),
          isActive: Boolean(r.is_active)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().zones;
}

// ============================================
// 13. RECIPES & FOOD COSTING
// ============================================
export async function getRecipes(): Promise<Recipe[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM recipes`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          menuItemId: String(r.menu_item_id),
          dishName: String(r.dish_name),
          category: String(r.category),
          ingredients: (r.ingredients as Recipe['ingredients']) || [],
          totalCost: Number(r.total_cost),
          sellingPrice: Number(r.selling_price),
          grossMarginPercent: Number(r.gross_margin_percent),
          targetFoodCostPercent: Number(r.target_food_cost_percent)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().recipes;
}

// ============================================
// 14. SUPPLIERS & PURCHASE ORDERS
// ============================================
export async function getSuppliers(): Promise<Supplier[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM suppliers`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name),
          contactPerson: String(r.contact_person),
          email: String(r.email),
          phone: String(r.phone),
          category: String(r.category),
          paymentTerms: String(r.payment_terms),
          status: r.status as Supplier['status']
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().suppliers;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM purchase_orders ORDER BY created_at DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          poNumber: String(r.po_number),
          supplierId: String(r.supplier_id),
          supplierName: String(r.supplier_name),
          items: (r.items as PurchaseOrder['items']) || [],
          totalAmount: Number(r.total_amount),
          status: r.status as PurchaseOrder['status'],
          expectedDeliveryDate: String(r.expected_delivery_date),
          createdAt: String(r.created_at)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().purchaseOrders;
}

export async function createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'createdAt'>): Promise<PurchaseOrder> {
  const newPO: PurchaseOrder = {
    ...po,
    id: `po-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const store = getLocalStore();
  store.purchaseOrders.unshift(newPO);
  return newPO;
}

// ============================================
// 15. EXPENSES
// ============================================
export async function getExpenses(): Promise<Expense[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM expenses ORDER BY date DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          category: r.category as Expense['category'],
          description: String(r.description),
          amount: Number(r.amount),
          paymentMethod: String(r.payment_method),
          vendor: String(r.vendor),
          date: String(r.date),
          recordedBy: String(r.recorded_by)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().expenses;
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const newExp: Expense = {
    ...expense,
    id: `exp-${Date.now()}`
  };
  const store = getLocalStore();
  store.expenses.unshift(newExp);
  return newExp;
}

// ============================================
// 16. REVIEWS
// ============================================
export async function getCustomerReviews(): Promise<CustomerReview[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM customer_reviews ORDER BY date DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          customerName: String(r.customer_name),
          rating: Number(r.rating),
          dishName: r.dish_name ? String(r.dish_name) : undefined,
          comment: String(r.comment),
          date: String(r.date),
          status: r.status as CustomerReview['status'],
          staffResponse: r.staff_response ? String(r.staff_response) : undefined
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().reviews;
}

export async function replyToReview(reviewId: string, reply: string): Promise<boolean> {
  const store = getLocalStore();
  const rev = store.reviews.find(r => r.id === reviewId);
  if (rev) rev.staffResponse = reply;
  return true;
}

// ============================================
// 17. AUDIT LOGS
// ============================================
export async function getAuditLogs(): Promise<AuditLog[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          timestamp: String(r.timestamp),
          action: String(r.action),
          category: r.category as AuditLog['category'],
          user: String(r.user),
          role: String(r.role),
          details: String(r.details)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().auditLogs;
}

export async function logAuditEvent(action: string, category: AuditLog['category'], user: string, role: string, details: string): Promise<AuditLog> {
  const entry: AuditLog = {
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    category,
    user,
    role,
    details
  };
  const store = getLocalStore();
  store.auditLogs.unshift(entry);
  return entry;
}

// ============================================
// 18. TABLE CALLS & ASSISTANCE
// ============================================
export async function getTableCalls(): Promise<TableCallRequest[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM table_calls ORDER BY created_at DESC`;
      if (rows.length > 0) {
        return rows.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          tableNumber: String(r.table_number),
          type: r.type as TableCallRequest['type'],
          status: r.status as TableCallRequest['status'],
          notes: r.notes ? String(r.notes) : undefined,
          createdAt: String(r.created_at)
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalStore().tableCalls;
}

export async function createTableCall(tableNumber: string, type: TableCallRequest['type'], notes?: string): Promise<TableCallRequest> {
  const call: TableCallRequest = {
    id: `call-${Date.now()}`,
    tableNumber,
    type,
    status: 'pending',
    notes,
    createdAt: new Date().toISOString()
  };
  const store = getLocalStore();
  store.tableCalls.unshift(call);
  return call;
}

export async function resolveTableCall(id: string): Promise<boolean> {
  const store = getLocalStore();
  const c = store.tableCalls.find(item => item.id === id);
  if (c) c.status = 'attended';
  return true;
}

// ============================================
// 19. RESTAURANT SETTINGS & CMS
// ============================================
export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  return getLocalStore().settings;
}

export async function updateRestaurantSettings(updates: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const store = getLocalStore();
  store.settings = { ...store.settings, ...updates };
  return store.settings;
}

// Reset data to seeds
export function resetLocalStore() {
  const store = getLocalStore();
  store.menu = [...INITIAL_MENU_ITEMS];
  store.reservations = [...INITIAL_RESERVATIONS];
  store.tables = [...INITIAL_TABLES];
  store.orders = [...INITIAL_ORDERS];
  store.inventory = [...INITIAL_INVENTORY];
  store.waitlist = [...INITIAL_WAITLIST];
  store.staff = [...INITIAL_STAFF];
  store.guestProfiles = [...INITIAL_GUEST_PROFILES];
  store.promoCodes = [...INITIAL_PROMO_CODES];
  store.giftCards = [...INITIAL_GIFT_CARDS];
  store.events = [...INITIAL_EVENTS];
  store.drivers = [...INITIAL_DELIVERY_DRIVERS];
  store.zones = [...INITIAL_DELIVERY_ZONES];
  store.recipes = [...INITIAL_RECIPES];
  store.suppliers = [...INITIAL_SUPPLIERS];
  store.purchaseOrders = [...INITIAL_PURCHASE_ORDERS];
  store.expenses = [...INITIAL_EXPENSES];
  store.reviews = [...INITIAL_REVIEWS];
  store.auditLogs = [...INITIAL_AUDIT_LOGS];
  store.tableCalls = [...INITIAL_TABLE_CALLS];
  store.settings = { ...DEFAULT_SETTINGS };
  return true;
}
