import { neon } from '@neondatabase/serverless';
import { unstable_cache } from 'next/cache';
import type {
  AuditLog,
  CustomerReview,
  DeliveryDriver,
  DeliveryZone,
  DiningTable,
  Expense,
  GiftCard,
  GuestProfile,
  InventoryItem,
  MenuItem,
  Order,
  OrderStatus,
  PromoCode,
  PurchaseOrder,
  Recipe,
  Reservation,
  ReservationStatus,
  RestaurantSettings,
  StaffMember,
  Supplier,
  TableCallRequest,
  TableStatus,
  WaitlistEntry,
} from '@/types';
import {
  DEFAULT_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DELIVERY_DRIVERS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_EXPENSES,
  INITIAL_GIFT_CARDS,
  INITIAL_GUEST_PROFILES,
  INITIAL_INVENTORY,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_PROMO_CODES,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RECIPES,
  INITIAL_RESERVATIONS,
  INITIAL_REVIEWS,
  INITIAL_STAFF,
  INITIAL_SUPPLIERS,
  INITIAL_TABLE_CALLS,
  INITIAL_TABLES,
  INITIAL_WAITLIST,
} from './seed-data';
import { CACHE_TAGS, STOREFRONT_PATHS, invalidateCache, purgeAndRewarmAll } from './cache';

type DbRow = Record<string, unknown>;

let schemaInitialized = false;
let schemaPromise: Promise<void> | null = null;

export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

export function getNeonSql() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error('DATABASE_URL is not configured. Aura Luxe runs strictly in Neon PostgreSQL database-only mode.');
  }
  return neon(url);
}

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' && value.trim()) return value;
  return new Date().toISOString();
}

function toNum(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function toOptNum(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function toStrArr(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function randomCode(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function ensureNeonSchema(): Promise<void> {
  if (schemaInitialized) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const sql = getNeonSql();

    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(100) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        guest_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        guests INTEGER NOT NULL,
        date VARCHAR(50) NOT NULL,
        time_slot VARCHAR(50) NOT NULL,
        area VARCHAR(100) NOT NULL,
        table_number VARCHAR(50),
        special_requests TEXT,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(100),
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        is_signature BOOLEAN DEFAULT FALSE,
        is_sold_out BOOLEAN DEFAULT FALSE,
        dietary_tags TEXT[] DEFAULT '{}',
        allergens TEXT[] DEFAULT '{}',
        spice_levels TEXT[] DEFAULT '{}',
        variants JSONB DEFAULT '[]'::jsonb,
        addons JSONB DEFAULT '[]'::jsonb,
        image_url TEXT NOT NULL,
        calories INTEGER,
        prep_time_mins INTEGER,
        wine_pairing VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS sub_category VARCHAR(100)`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_sold_out BOOLEAN DEFAULT FALSE`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}'`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS spice_levels TEXT[] DEFAULT '{}'`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS calories INTEGER`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS prep_time_mins INTEGER`;
    await sql`ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS wine_pairing VARCHAR(255)`;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_code VARCHAR(50) UNIQUE NOT NULL,
        order_type VARCHAR(50) NOT NULL,
        table_number VARCHAR(50),
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(100) NOT NULL,
        customer_email VARCHAR(255),
        delivery_address TEXT,
        delivery_zone VARCHAR(100),
        delivery_fee NUMERIC(10, 2) DEFAULT 0,
        scheduled_for VARCHAR(100),
        assigned_driver_id VARCHAR(100),
        assigned_driver_name VARCHAR(255),
        payment_method VARCHAR(100) DEFAULT 'Credit Card',
        payment_status VARCHAR(50) DEFAULT 'paid',
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2),
        tax_amount NUMERIC(10, 2),
        tip_amount NUMERIC(10, 2),
        discount_amount NUMERIC(10, 2),
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'received',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_zone VARCHAR(100)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10, 2) DEFAULT 0`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS scheduled_for VARCHAR(100)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_driver_id VARCHAR(100)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_driver_name VARCHAR(255)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'Credit Card'`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'paid'`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10, 2)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tip_amount NUMERIC(10, 2)`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2)`;

    await sql`
      CREATE TABLE IF NOT EXISTS dining_tables (
        id VARCHAR(100) PRIMARY KEY,
        table_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        capacity INTEGER NOT NULL,
        area VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        current_guest VARCHAR(255),
        reservation_time VARCHAR(50),
        active_order_code VARCHAR(50),
        qr_code_url TEXT
      )
    `;

    await sql`ALTER TABLE dining_tables ADD COLUMN IF NOT EXISTS active_order_code VARCHAR(50)`;
    await sql`ALTER TABLE dining_tables ADD COLUMN IF NOT EXISTS qr_code_url TEXT`;

    await sql`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        current_stock NUMERIC(10, 2) NOT NULL,
        unit VARCHAR(50) NOT NULL,
        reorder_level NUMERIC(10, 2) NOT NULL,
        cost_per_unit NUMERIC(10, 2) NOT NULL,
        supplier VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'in_stock',
        expiry_date VARCHAR(50),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS expiry_date VARCHAR(50)`;

    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id VARCHAR(100) PRIMARY KEY,
        guest_name VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        party_size INTEGER NOT NULL,
        area_preference VARCHAR(100) NOT NULL,
        estimated_wait_mins INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'waiting',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS staff_members (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        pin_code VARCHAR(20),
        role VARCHAR(50) NOT NULL,
        shift VARCHAR(50) NOT NULL,
        is_clocked_in BOOLEAN DEFAULT FALSE,
        hours_worked_today NUMERIC(5, 2) DEFAULT 0,
        phone VARCHAR(100) NOT NULL,
        station VARCHAR(100) NOT NULL,
        permissions TEXT[] DEFAULT '{}'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS guest_profiles (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        total_visits INTEGER DEFAULT 0,
        lifetime_spend NUMERIC(10, 2) DEFAULT 0,
        vip_tier VARCHAR(50) DEFAULT 'Regular',
        allergies TEXT[] DEFAULT '{}',
        favorite_table VARCHAR(100),
        notes TEXT,
        last_visit VARCHAR(50)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code VARCHAR(50) PRIMARY KEY,
        discount_percent INTEGER NOT NULL,
        description TEXT,
        min_order_amount NUMERIC(10, 2) DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        max_uses INTEGER DEFAULT 100,
        expires_at VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id VARCHAR(100) PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        initial_balance NUMERIC(10, 2) NOT NULL,
        current_balance NUMERIC(10, 2) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        recipient_email VARCHAR(255) NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS delivery_drivers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        vehicle VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        active_orders_count INTEGER DEFAULT 0,
        rating NUMERIC(3, 2) DEFAULT 5.0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS delivery_zones (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        min_time_mins INTEGER NOT NULL,
        max_time_mins INTEGER NOT NULL,
        delivery_fee NUMERIC(10, 2) NOT NULL,
        min_order_amount NUMERIC(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id VARCHAR(100) PRIMARY KEY,
        menu_item_id VARCHAR(100) NOT NULL,
        dish_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        ingredients JSONB NOT NULL,
        total_cost NUMERIC(10, 2) NOT NULL,
        selling_price NUMERIC(10, 2) NOT NULL,
        gross_margin_percent NUMERIC(5, 2) NOT NULL,
        target_food_cost_percent NUMERIC(5, 2) NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        payment_terms VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id VARCHAR(100) PRIMARY KEY,
        po_number VARCHAR(100) UNIQUE NOT NULL,
        supplier_id VARCHAR(100) NOT NULL,
        supplier_name VARCHAR(255) NOT NULL,
        items JSONB NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'ordered',
        expected_delivery_date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        vendor VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        recorded_by VARCHAR(255) NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS customer_reviews (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        dish_name VARCHAR(255),
        comment TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'published',
        staff_response TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        action VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        "user" VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        details TEXT NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS table_calls (
        id VARCHAR(100) PRIMARY KEY,
        table_number VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS restaurant_settings (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline TEXT NOT NULL,
        phone VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        currency VARCHAR(20) NOT NULL,
        tax_rate_percent NUMERIC(5, 2) NOT NULL,
        delivery_fee_default NUMERIC(10, 2) NOT NULL,
        announcement_banner TEXT NOT NULL,
        is_online_ordering_open BOOLEAN DEFAULT TRUE,
        is_reservations_open BOOLEAN DEFAULT TRUE,
        theme_mode VARCHAR(20) DEFAULT 'light'
      )
    `;

    await seedAllEmptyTables(sql);
    await sql`DELETE FROM staff_members WHERE role NOT IN ('Admin', 'Manager')`;

    schemaInitialized = true;
  })().catch((err) => {
    schemaPromise = null;
    throw err;
  });

  return schemaPromise;
}

async function seedAllEmptyTables(sql: ReturnType<typeof getNeonSql>) {
  const counts = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM menu_items) AS menu_count,
      (SELECT COUNT(*)::int FROM dining_tables) AS table_count,
      (SELECT COUNT(*)::int FROM reservations) AS res_count,
      (SELECT COUNT(*)::int FROM orders) AS ord_count,
      (SELECT COUNT(*)::int FROM inventory_items) AS inv_count,
      (SELECT COUNT(*)::int FROM promo_codes) AS promo_count,
      (SELECT COUNT(*)::int FROM waitlist) AS waitlist_count,
      (SELECT COUNT(*)::int FROM staff_members) AS staff_count,
      (SELECT COUNT(*)::int FROM guest_profiles) AS guest_count,
      (SELECT COUNT(*)::int FROM gift_cards) AS gift_count,
      (SELECT COUNT(*)::int FROM delivery_drivers) AS driver_count,
      (SELECT COUNT(*)::int FROM delivery_zones) AS zone_count,
      (SELECT COUNT(*)::int FROM recipes) AS recipe_count,
      (SELECT COUNT(*)::int FROM suppliers) AS supplier_count,
      (SELECT COUNT(*)::int FROM purchase_orders) AS po_count,
      (SELECT COUNT(*)::int FROM expenses) AS expense_count,
      (SELECT COUNT(*)::int FROM customer_reviews) AS review_count,
      (SELECT COUNT(*)::int FROM audit_logs) AS audit_count,
      (SELECT COUNT(*)::int FROM table_calls) AS call_count,
      (SELECT COUNT(*)::int FROM restaurant_settings) AS settings_count
  `;

  const c = counts[0] as Record<string, number>;

  if ((c?.menu_count ?? 0) === 0) {
    for (const m of INITIAL_MENU_ITEMS) {
      await sql`
        INSERT INTO menu_items (
          id, name, category, sub_category, description, price, is_available, is_signature, is_sold_out,
          dietary_tags, allergens, spice_levels, variants, addons, image_url, calories, prep_time_mins, wine_pairing
        )
        VALUES (
          ${m.id}, ${m.name}, ${m.category}, ${m.subCategory ?? null}, ${m.description}, ${m.price},
          ${m.isAvailable}, ${m.isSignature}, ${m.isSoldOut ?? false},
          ${m.dietaryTags}, ${m.allergens ?? []}, ${m.spiceLevels ?? []},
          ${JSON.stringify(m.variants ?? [])}::jsonb, ${JSON.stringify(m.addons ?? [])}::jsonb,
          ${m.imageUrl}, ${m.calories ?? null}, ${m.prepTimeMins ?? null}, ${m.winePairing ?? null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.table_count ?? 0) === 0) {
    for (const t of INITIAL_TABLES) {
      await sql`
        INSERT INTO dining_tables (id, table_number, name, capacity, area, status, current_guest, reservation_time, active_order_code, qr_code_url)
        VALUES (${t.id}, ${t.tableNumber}, ${t.name}, ${t.capacity}, ${t.area}, ${t.status}, ${t.currentGuest ?? null}, ${t.reservationTime ?? null}, ${t.activeOrderCode ?? null}, ${t.qrCodeUrl ?? null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.res_count ?? 0) === 0) {
    for (const r of INITIAL_RESERVATIONS) {
      await sql`
        INSERT INTO reservations (id, code, guest_name, email, phone, guests, date, time_slot, area, table_number, special_requests, status)
        VALUES (${r.id}, ${r.code}, ${r.guestName}, ${r.email}, ${r.phone}, ${r.guests}, ${r.date}, ${r.timeSlot}, ${r.area}, ${r.tableNumber ?? null}, ${r.specialRequests ?? null}, ${r.status})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.ord_count ?? 0) === 0) {
    for (const o of INITIAL_ORDERS) {
      await sql`
        INSERT INTO orders (
          id, order_code, order_type, table_number, customer_name, customer_phone, customer_email,
          delivery_address, delivery_zone, delivery_fee, scheduled_for, assigned_driver_id, assigned_driver_name,
          payment_method, payment_status, items, subtotal, tax_amount, tip_amount, discount_amount, total_amount, status, notes
        )
        VALUES (
          ${o.id}, ${o.orderCode}, ${o.orderType}, ${o.tableNumber ?? null}, ${o.customerName}, ${o.customerPhone}, ${o.customerEmail ?? null},
          ${o.deliveryAddress ?? null}, ${o.deliveryZone ?? null}, ${o.deliveryFee ?? 0}, ${o.scheduledFor ?? null}, ${o.assignedDriverId ?? null}, ${o.assignedDriverName ?? null},
          ${o.paymentMethod}, ${o.paymentStatus}, ${JSON.stringify(o.items)}::jsonb, ${o.subtotal ?? null}, ${o.taxAmount ?? null}, ${o.tipAmount ?? null}, ${o.discountAmount ?? null},
          ${o.totalAmount}, ${o.status}, ${o.notes ?? null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.inv_count ?? 0) === 0) {
    for (const inv of INITIAL_INVENTORY) {
      await sql`
        INSERT INTO inventory_items (id, name, category, current_stock, unit, reorder_level, cost_per_unit, supplier, status, expiry_date)
        VALUES (${inv.id}, ${inv.name}, ${inv.category}, ${inv.currentStock}, ${inv.unit}, ${inv.reorderLevel}, ${inv.costPerUnit}, ${inv.supplier}, ${inv.status}, ${inv.expiryDate ?? null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.promo_count ?? 0) === 0) {
    for (const p of INITIAL_PROMO_CODES) {
      await sql`
        INSERT INTO promo_codes (code, discount_percent, description, min_order_amount, usage_count, max_uses, expires_at, is_active)
        VALUES (${p.code}, ${p.discountPercent}, ${p.description}, ${p.minOrderAmount}, ${p.usageCount}, ${p.maxUses}, ${p.expiresAt}, ${p.isActive})
        ON CONFLICT (code) DO NOTHING
      `;
    }
  }

  if ((c?.waitlist_count ?? 0) === 0) {
    for (const w of INITIAL_WAITLIST) {
      await sql`
        INSERT INTO waitlist (id, guest_name, phone, party_size, area_preference, estimated_wait_mins, status, created_at)
        VALUES (${w.id}, ${w.guestName}, ${w.phone}, ${w.partySize}, ${w.areaPreference}, ${w.estimatedWaitMins}, ${w.status}, ${w.createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.staff_count ?? 0) === 0) {
    for (const s of INITIAL_STAFF) {
      await sql`
        INSERT INTO staff_members (id, name, email, pin_code, role, shift, is_clocked_in, hours_worked_today, phone, station, permissions)
        VALUES (${s.id}, ${s.name}, ${s.email ?? null}, ${s.pinCode ?? null}, ${s.role}, ${s.shift}, ${s.isClockedIn}, ${s.hoursWorkedToday}, ${s.phone}, ${s.station}, ${s.permissions ?? []})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.guest_count ?? 0) === 0) {
    for (const g of INITIAL_GUEST_PROFILES) {
      await sql`
        INSERT INTO guest_profiles (id, name, email, phone, total_visits, lifetime_spend, vip_tier, allergies, favorite_table, notes, last_visit)
        VALUES (${g.id}, ${g.name}, ${g.email}, ${g.phone}, ${g.totalVisits}, ${g.lifetimeSpend}, ${g.vipTier}, ${g.allergies}, ${g.favoriteTable}, ${g.notes}, ${g.lastVisit})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.gift_count ?? 0) === 0) {
    for (const gc of INITIAL_GIFT_CARDS) {
      await sql`
        INSERT INTO gift_cards (id, code, initial_balance, current_balance, sender_name, recipient_name, recipient_email, message, status, created_at)
        VALUES (${gc.id}, ${gc.code}, ${gc.initialBalance}, ${gc.currentBalance}, ${gc.senderName}, ${gc.recipientName}, ${gc.recipientEmail}, ${gc.message}, ${gc.status}, ${gc.createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.driver_count ?? 0) === 0) {
    for (const d of INITIAL_DELIVERY_DRIVERS) {
      await sql`
        INSERT INTO delivery_drivers (id, name, phone, vehicle, status, active_orders_count, rating)
        VALUES (${d.id}, ${d.name}, ${d.phone}, ${d.vehicle}, ${d.status}, ${d.activeOrdersCount}, ${d.rating})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.zone_count ?? 0) === 0) {
    for (const z of INITIAL_DELIVERY_ZONES) {
      await sql`
        INSERT INTO delivery_zones (id, name, min_time_mins, max_time_mins, delivery_fee, min_order_amount, is_active)
        VALUES (${z.id}, ${z.name}, ${z.minTimeMins}, ${z.maxTimeMins}, ${z.deliveryFee}, ${z.minOrderAmount}, ${z.isActive})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.recipe_count ?? 0) === 0) {
    for (const r of INITIAL_RECIPES) {
      await sql`
        INSERT INTO recipes (id, menu_item_id, dish_name, category, ingredients, total_cost, selling_price, gross_margin_percent, target_food_cost_percent)
        VALUES (${r.id}, ${r.menuItemId}, ${r.dishName}, ${r.category}, ${JSON.stringify(r.ingredients)}::jsonb, ${r.totalCost}, ${r.sellingPrice}, ${r.grossMarginPercent}, ${r.targetFoodCostPercent})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.supplier_count ?? 0) === 0) {
    for (const s of INITIAL_SUPPLIERS) {
      await sql`
        INSERT INTO suppliers (id, name, contact_person, email, phone, category, payment_terms, status)
        VALUES (${s.id}, ${s.name}, ${s.contactPerson}, ${s.email}, ${s.phone}, ${s.category}, ${s.paymentTerms}, ${s.status})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.po_count ?? 0) === 0) {
    for (const po of INITIAL_PURCHASE_ORDERS) {
      await sql`
        INSERT INTO purchase_orders (id, po_number, supplier_id, supplier_name, items, total_amount, status, expected_delivery_date, created_at)
        VALUES (${po.id}, ${po.poNumber}, ${po.supplierId}, ${po.supplierName}, ${JSON.stringify(po.items)}::jsonb, ${po.totalAmount}, ${po.status}, ${po.expectedDeliveryDate}, ${po.createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.expense_count ?? 0) === 0) {
    for (const e of INITIAL_EXPENSES) {
      await sql`
        INSERT INTO expenses (id, category, description, amount, payment_method, vendor, date, recorded_by)
        VALUES (${e.id}, ${e.category}, ${e.description}, ${e.amount}, ${e.paymentMethod}, ${e.vendor}, ${e.date}, ${e.recordedBy})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.review_count ?? 0) === 0) {
    for (const rev of INITIAL_REVIEWS) {
      await sql`
        INSERT INTO customer_reviews (id, customer_name, rating, dish_name, comment, date, status, staff_response)
        VALUES (${rev.id}, ${rev.customerName}, ${rev.rating}, ${rev.dishName ?? null}, ${rev.comment}, ${rev.date}, ${rev.status}, ${rev.staffResponse ?? null})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.audit_count ?? 0) === 0) {
    for (const log of INITIAL_AUDIT_LOGS) {
      await sql`
        INSERT INTO audit_logs (id, timestamp, action, category, "user", role, details)
        VALUES (${log.id}, ${log.timestamp}, ${log.action}, ${log.category}, ${log.user}, ${log.role}, ${log.details})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.call_count ?? 0) === 0) {
    for (const tc of INITIAL_TABLE_CALLS) {
      await sql`
        INSERT INTO table_calls (id, table_number, type, status, notes, created_at)
        VALUES (${tc.id}, ${tc.tableNumber}, ${tc.type}, ${tc.status}, ${tc.notes ?? null}, ${tc.createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  if ((c?.settings_count ?? 0) === 0) {
    const s = DEFAULT_SETTINGS;
    await sql`
      INSERT INTO restaurant_settings (
        id, name, tagline, phone, email, address, currency, tax_rate_percent, delivery_fee_default,
        announcement_banner, is_online_ordering_open, is_reservations_open, theme_mode
      )
      VALUES (
        'default', ${s.name}, ${s.tagline}, ${s.phone}, ${s.email}, ${s.address}, ${s.currency},
        ${s.taxRatePercent}, ${s.deliveryFeeDefault}, ${s.announcementBanner}, ${s.isOnlineOrderingOpen},
        ${s.isReservationsOpen}, ${s.themeMode}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

// =========================================================================
// ROW MAPPERS
// =========================================================================

function mapMenuItem(r: DbRow): MenuItem {
  return {
    id: String(r.id),
    name: String(r.name),
    category: r.category as MenuItem['category'],
    subCategory: r.sub_category ? String(r.sub_category) : undefined,
    description: String(r.description),
    price: toNum(r.price),
    isAvailable: Boolean(r.is_available),
    isSignature: Boolean(r.is_signature),
    isSoldOut: r.is_sold_out !== undefined && r.is_sold_out !== null ? Boolean(r.is_sold_out) : undefined,
    dietaryTags: toStrArr(r.dietary_tags),
    allergens: r.allergens ? toStrArr(r.allergens) : undefined,
    spiceLevels: r.spice_levels ? (toStrArr(r.spice_levels) as MenuItem['spiceLevels']) : undefined,
    variants: r.variants ? toJson<MenuItem['variants']>(r.variants, []) : undefined,
    addons: r.addons ? toJson<MenuItem['addons']>(r.addons, []) : undefined,
    imageUrl: String(r.image_url),
    calories: toOptNum(r.calories),
    prepTimeMins: toOptNum(r.prep_time_mins),
    winePairing: r.wine_pairing ? String(r.wine_pairing) : undefined,
    createdAt: toIso(r.created_at),
  };
}

function mapReservation(r: DbRow): Reservation {
  return {
    id: String(r.id),
    code: String(r.code),
    guestName: String(r.guest_name),
    email: String(r.email),
    phone: String(r.phone),
    guests: toNum(r.guests, 2),
    date: String(r.date),
    timeSlot: String(r.time_slot),
    area: String(r.area),
    tableNumber: r.table_number ? String(r.table_number) : undefined,
    specialRequests: r.special_requests ? String(r.special_requests) : undefined,
    status: (r.status || 'confirmed') as ReservationStatus,
    createdAt: toIso(r.created_at),
  };
}

function mapOrder(r: DbRow): Order {
  return {
    id: String(r.id),
    orderCode: String(r.order_code),
    orderType: String(r.order_type) as Order['orderType'],
    tableNumber: r.table_number ? String(r.table_number) : undefined,
    customerName: String(r.customer_name),
    customerPhone: String(r.customer_phone),
    customerEmail: r.customer_email ? String(r.customer_email) : undefined,
    deliveryAddress: r.delivery_address ? String(r.delivery_address) : undefined,
    deliveryZone: r.delivery_zone ? String(r.delivery_zone) : undefined,
    deliveryFee: toOptNum(r.delivery_fee),
    scheduledFor: r.scheduled_for ? String(r.scheduled_for) : undefined,
    assignedDriverId: r.assigned_driver_id ? String(r.assigned_driver_id) : undefined,
    assignedDriverName: r.assigned_driver_name ? String(r.assigned_driver_name) : undefined,
    paymentMethod: (r.payment_method || 'Credit Card') as Order['paymentMethod'],
    paymentStatus: (r.payment_status || 'paid') as Order['paymentStatus'],
    items: toJson<Order['items']>(r.items, []),
    subtotal: toOptNum(r.subtotal),
    taxAmount: toOptNum(r.tax_amount),
    tipAmount: toOptNum(r.tip_amount),
    discountAmount: toOptNum(r.discount_amount),
    totalAmount: toNum(r.total_amount),
    status: (r.status || 'received') as OrderStatus,
    notes: r.notes ? String(r.notes) : undefined,
    createdAt: toIso(r.created_at),
  };
}

function mapTable(r: DbRow): DiningTable {
  return {
    id: String(r.id),
    tableNumber: String(r.table_number),
    name: String(r.name),
    capacity: toNum(r.capacity, 2),
    area: String(r.area),
    status: (r.status || 'available') as TableStatus,
    currentGuest: r.current_guest ? String(r.current_guest) : undefined,
    reservationTime: r.reservation_time ? String(r.reservation_time) : undefined,
    activeOrderCode: r.active_order_code ? String(r.active_order_code) : undefined,
    qrCodeUrl: r.qr_code_url ? String(r.qr_code_url) : undefined,
  };
}

function mapInventory(r: DbRow): InventoryItem {
  return {
    id: String(r.id),
    name: String(r.name),
    category: String(r.category) as InventoryItem['category'],
    currentStock: toNum(r.current_stock),
    unit: String(r.unit),
    reorderLevel: toNum(r.reorder_level),
    costPerUnit: toNum(r.cost_per_unit),
    supplier: String(r.supplier),
    status: String(r.status) as InventoryItem['status'],
    expiryDate: r.expiry_date ? String(r.expiry_date) : undefined,
    updatedAt: toIso(r.updated_at),
  };
}

function mapWaitlist(r: DbRow): WaitlistEntry {
  return {
    id: String(r.id),
    guestName: String(r.guest_name),
    phone: String(r.phone),
    partySize: toNum(r.party_size, 2),
    areaPreference: String(r.area_preference),
    estimatedWaitMins: toNum(r.estimated_wait_mins, 15),
    status: String(r.status) as WaitlistEntry['status'],
    createdAt: toIso(r.created_at),
  };
}

function mapStaff(r: DbRow): StaffMember {
  return {
    id: String(r.id),
    name: String(r.name),
    email: r.email ? String(r.email) : undefined,
    pinCode: r.pin_code ? String(r.pin_code) : undefined,
    role: (r.role === 'Admin' ? 'Admin' : 'Manager') as StaffMember['role'],
    shift: String(r.shift) as StaffMember['shift'],
    isClockedIn: Boolean(r.is_clocked_in),
    hoursWorkedToday: toNum(r.hours_worked_today),
    phone: String(r.phone),
    station: String(r.station) as StaffMember['station'],
    permissions: r.permissions ? toStrArr(r.permissions) : [],
  };
}

function mapGuest(r: DbRow): GuestProfile {
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    totalVisits: toNum(r.total_visits),
    lifetimeSpend: toNum(r.lifetime_spend),
    vipTier: String(r.vip_tier) as GuestProfile['vipTier'],
    allergies: toStrArr(r.allergies),
    favoriteTable: String(r.favorite_table ?? ''),
    notes: String(r.notes ?? ''),
    lastVisit: String(r.last_visit ?? ''),
  };
}

function mapPromo(r: DbRow): PromoCode {
  return {
    code: String(r.code),
    discountPercent: toNum(r.discount_percent),
    description: String(r.description ?? ''),
    minOrderAmount: toNum(r.min_order_amount),
    usageCount: toNum(r.usage_count),
    maxUses: toNum(r.max_uses, 100),
    expiresAt: String(r.expires_at ?? ''),
    isActive: Boolean(r.is_active),
  };
}

function mapGiftCard(r: DbRow): GiftCard {
  return {
    id: String(r.id),
    code: String(r.code),
    initialBalance: toNum(r.initial_balance),
    currentBalance: toNum(r.current_balance),
    senderName: String(r.sender_name),
    recipientName: String(r.recipient_name),
    recipientEmail: String(r.recipient_email),
    message: String(r.message ?? ''),
    createdAt: toIso(r.created_at),
    status: String(r.status) as GiftCard['status'],
  };
}

function mapDriver(r: DbRow): DeliveryDriver {
  return {
    id: String(r.id),
    name: String(r.name),
    phone: String(r.phone),
    vehicle: String(r.vehicle) as DeliveryDriver['vehicle'],
    status: String(r.status) as DeliveryDriver['status'],
    activeOrdersCount: toNum(r.active_orders_count),
    rating: toNum(r.rating, 5),
  };
}

function mapZone(r: DbRow): DeliveryZone {
  return {
    id: String(r.id),
    name: String(r.name),
    minTimeMins: toNum(r.min_time_mins),
    maxTimeMins: toNum(r.max_time_mins),
    deliveryFee: toNum(r.delivery_fee),
    minOrderAmount: toNum(r.min_order_amount),
    isActive: Boolean(r.is_active),
  };
}

function mapRecipe(r: DbRow): Recipe {
  return {
    id: String(r.id),
    menuItemId: String(r.menu_item_id),
    dishName: String(r.dish_name),
    category: String(r.category),
    ingredients: toJson<Recipe['ingredients']>(r.ingredients, []),
    totalCost: toNum(r.total_cost),
    sellingPrice: toNum(r.selling_price),
    grossMarginPercent: toNum(r.gross_margin_percent),
    targetFoodCostPercent: toNum(r.target_food_cost_percent),
  };
}

function mapSupplier(r: DbRow): Supplier {
  return {
    id: String(r.id),
    name: String(r.name),
    contactPerson: String(r.contact_person),
    email: String(r.email),
    phone: String(r.phone),
    category: String(r.category),
    paymentTerms: String(r.payment_terms),
    status: String(r.status) as Supplier['status'],
  };
}

function mapPurchaseOrder(r: DbRow): PurchaseOrder {
  return {
    id: String(r.id),
    poNumber: String(r.po_number),
    supplierId: String(r.supplier_id),
    supplierName: String(r.supplier_name),
    items: toJson<PurchaseOrder['items']>(r.items, []),
    totalAmount: toNum(r.total_amount),
    status: String(r.status) as PurchaseOrder['status'],
    expectedDeliveryDate: String(r.expected_delivery_date),
    createdAt: toIso(r.created_at),
  };
}

function mapExpense(r: DbRow): Expense {
  return {
    id: String(r.id),
    category: String(r.category) as Expense['category'],
    description: String(r.description),
    amount: toNum(r.amount),
    paymentMethod: String(r.payment_method),
    vendor: String(r.vendor),
    date: String(r.date),
    recordedBy: String(r.recorded_by),
  };
}

function mapReview(r: DbRow): CustomerReview {
  return {
    id: String(r.id),
    customerName: String(r.customer_name),
    rating: toNum(r.rating, 5),
    dishName: r.dish_name ? String(r.dish_name) : undefined,
    comment: String(r.comment),
    date: String(r.date),
    status: String(r.status) as CustomerReview['status'],
    staffResponse: r.staff_response ? String(r.staff_response) : undefined,
  };
}

function mapAuditLog(r: DbRow): AuditLog {
  return {
    id: String(r.id),
    timestamp: toIso(r.timestamp),
    action: String(r.action),
    category: String(r.category) as AuditLog['category'],
    user: String(r.user),
    role: String(r.role),
    details: String(r.details),
  };
}

function mapTableCall(r: DbRow): TableCallRequest {
  return {
    id: String(r.id),
    tableNumber: String(r.table_number),
    type: String(r.type) as TableCallRequest['type'],
    status: String(r.status) as TableCallRequest['status'],
    notes: r.notes ? String(r.notes) : undefined,
    createdAt: toIso(r.created_at),
  };
}

function mapSettings(r: DbRow): RestaurantSettings {
  return {
    name: String(r.name),
    tagline: String(r.tagline),
    phone: String(r.phone),
    email: String(r.email),
    address: String(r.address),
    currency: String(r.currency) as RestaurantSettings['currency'],
    taxRatePercent: toNum(r.tax_rate_percent, 8.875),
    deliveryFeeDefault: toNum(r.delivery_fee_default, 6),
    announcementBanner: String(r.announcement_banner),
    isOnlineOrderingOpen: Boolean(r.is_online_ordering_open),
    isReservationsOpen: Boolean(r.is_reservations_open),
    themeMode: (r.theme_mode === 'dark' ? 'dark' : 'light'),
  };
}

// =========================================================================
// CACHED READERS & INVALIDATING WRITERS (NEON POSTGRESQL ONLY)
// =========================================================================

// 1. MENU
export const getMenuItems = unstable_cache(
  async (): Promise<MenuItem[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM menu_items ORDER BY is_signature DESC, created_at ASC`;
    return (rows as DbRow[]).map(mapMenuItem);
  },
  ['db-menu-items'],
  { revalidate: false, tags: [CACHE_TAGS.menu, CACHE_TAGS.all] }
);

export async function createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `menu-${Date.now()}`;
  const rows = await sql`
    INSERT INTO menu_items (
      id, name, category, sub_category, description, price, is_available, is_signature, is_sold_out,
      dietary_tags, allergens, spice_levels, variants, addons, image_url, calories, prep_time_mins, wine_pairing
    )
    VALUES (
      ${id}, ${item.name}, ${item.category}, ${item.subCategory ?? null}, ${item.description}, ${item.price},
      ${item.isAvailable ?? true}, ${item.isSignature ?? false}, ${item.isSoldOut ?? false},
      ${item.dietaryTags ?? []}, ${item.allergens ?? []}, ${item.spiceLevels ?? []},
      ${JSON.stringify(item.variants ?? [])}::jsonb, ${JSON.stringify(item.addons ?? [])}::jsonb,
      ${item.imageUrl}, ${item.calories ?? null}, ${item.prepTimeMins ?? null}, ${item.winePairing ?? null}
    )
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.menu],
    paths: ['/', '/menu', '/order'],
    rewarm: () => getMenuItems(),
  });
  return mapMenuItem(rows[0] as DbRow);
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const existingRows = await sql`SELECT * FROM menu_items WHERE id = ${id} LIMIT 1`;
  if (existingRows.length === 0) return null;

  const current = mapMenuItem(existingRows[0] as DbRow);
  const merged = { ...current, ...updates };

  const rows = await sql`
    UPDATE menu_items
    SET
      name = ${merged.name},
      category = ${merged.category},
      sub_category = ${merged.subCategory ?? null},
      description = ${merged.description},
      price = ${merged.price},
      is_available = ${merged.isAvailable},
      is_signature = ${merged.isSignature},
      is_sold_out = ${merged.isSoldOut ?? false},
      dietary_tags = ${merged.dietaryTags ?? []},
      allergens = ${merged.allergens ?? []},
      spice_levels = ${merged.spiceLevels ?? []},
      variants = ${JSON.stringify(merged.variants ?? [])}::jsonb,
      addons = ${JSON.stringify(merged.addons ?? [])}::jsonb,
      image_url = ${merged.imageUrl},
      calories = ${merged.calories ?? null},
      prep_time_mins = ${merged.prepTimeMins ?? null},
      wine_pairing = ${merged.winePairing ?? null}
    WHERE id = ${id}
    RETURNING *
  `;

  invalidateCache({
    tags: [CACHE_TAGS.menu],
    paths: ['/', '/menu', '/order'],
    rewarm: () => getMenuItems(),
  });
  return mapMenuItem(rows[0] as DbRow);
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`DELETE FROM menu_items WHERE id = ${id} RETURNING id`;
  const deleted = rows.length > 0;
  if (deleted) {
    invalidateCache({
      tags: [CACHE_TAGS.menu],
      paths: ['/', '/menu', '/order'],
      rewarm: () => getMenuItems(),
    });
  }
  return deleted;
}

// 2. RESERVATIONS
export const getReservations = unstable_cache(
  async (): Promise<Reservation[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM reservations ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapReservation);
  },
  ['db-reservations'],
  { revalidate: false, tags: [CACHE_TAGS.reservations, CACHE_TAGS.all] }
);

export async function createReservation(
  res: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status'> & Partial<Pick<Reservation, 'status' | 'tableNumber'>>
): Promise<Reservation> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `res-${Date.now()}`;
  const code = randomCode('RES');
  const status: ReservationStatus = res.status ?? 'confirmed';

  const rows = await sql`
    INSERT INTO reservations (id, code, guest_name, email, phone, guests, date, time_slot, area, table_number, special_requests, status)
    VALUES (${id}, ${code}, ${res.guestName}, ${res.email}, ${res.phone}, ${res.guests}, ${res.date}, ${res.timeSlot}, ${res.area}, ${res.tableNumber ?? null}, ${res.specialRequests ?? null}, ${status})
    RETURNING *
  `;

  invalidateCache({
    tags: [CACHE_TAGS.reservations],
    paths: ['/reservation'],
    rewarm: () => getReservations(),
  });
  return mapReservation(rows[0] as DbRow);
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`
    UPDATE reservations SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  if (rows.length === 0) return null;

  invalidateCache({
    tags: [CACHE_TAGS.reservations],
    paths: ['/reservation'],
    rewarm: () => getReservations(),
  });
  return mapReservation(rows[0] as DbRow);
}

// 3. ORDERS
export const getOrders = unstable_cache(
  async (): Promise<Order[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapOrder);
  },
  ['db-orders'],
  { revalidate: false, tags: [CACHE_TAGS.orders, CACHE_TAGS.all] }
);

export async function createOrder(
  order: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'status'> & Partial<Order>
): Promise<Order> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `ord-${Date.now()}`;
  const orderCode = randomCode('ORD');
  const status: OrderStatus = order.status ?? 'received';
  const paymentMethod = order.paymentMethod ?? 'Credit Card';
  const paymentStatus = order.paymentStatus ?? 'paid';

  const rows = await sql`
    INSERT INTO orders (
      id, order_code, order_type, table_number, customer_name, customer_phone, customer_email,
      delivery_address, delivery_zone, delivery_fee, scheduled_for, assigned_driver_id, assigned_driver_name,
      payment_method, payment_status, items, subtotal, tax_amount, tip_amount, discount_amount,
      total_amount, status, notes
    )
    VALUES (
      ${id}, ${orderCode}, ${order.orderType}, ${order.tableNumber ?? null}, ${order.customerName}, ${order.customerPhone}, ${order.customerEmail ?? null},
      ${order.deliveryAddress ?? null}, ${order.deliveryZone ?? null}, ${order.deliveryFee ?? 0}, ${order.scheduledFor ?? null}, ${order.assignedDriverId ?? null}, ${order.assignedDriverName ?? null},
      ${paymentMethod}, ${paymentStatus}, ${JSON.stringify(order.items)}::jsonb, ${order.subtotal ?? null}, ${order.taxAmount ?? null}, ${order.tipAmount ?? null}, ${order.discountAmount ?? null},
      ${order.totalAmount}, ${status}, ${order.notes ?? null}
    )
    RETURNING *
  `;

  invalidateCache({
    tags: [CACHE_TAGS.orders],
    paths: ['/order', '/kitchen', '/driver'],
    rewarm: () => getOrders(),
  });
  return mapOrder(rows[0] as DbRow);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  updates?: Partial<Pick<Order, 'paymentStatus' | 'assignedDriverId' | 'assignedDriverName'>>
): Promise<Order | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`
    UPDATE orders
    SET
      status = ${status},
      payment_status = COALESCE(${updates?.paymentStatus ?? null}, payment_status),
      assigned_driver_id = COALESCE(${updates?.assignedDriverId ?? null}, assigned_driver_id),
      assigned_driver_name = COALESCE(${updates?.assignedDriverName ?? null}, assigned_driver_name)
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;

  invalidateCache({
    tags: [CACHE_TAGS.orders],
    paths: ['/order', '/kitchen', '/driver'],
    rewarm: () => getOrders(),
  });
  return mapOrder(rows[0] as DbRow);
}

// 4. TABLES
export const getTables = unstable_cache(
  async (): Promise<DiningTable[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM dining_tables ORDER BY table_number ASC`;
    return (rows as DbRow[]).map(mapTable);
  },
  ['db-tables'],
  { revalidate: false, tags: [CACHE_TAGS.tables, CACHE_TAGS.all] }
);

export async function updateTableStatus(
  id: string,
  status: TableStatus,
  currentGuest?: string,
  reservationTime?: string
): Promise<DiningTable | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const clearGuest = status === 'available' || status === 'cleaning';
  const rows = await sql`
    UPDATE dining_tables
    SET
      status = ${status},
      current_guest = ${clearGuest ? null : (currentGuest ?? null)},
      reservation_time = ${clearGuest ? null : (reservationTime ?? null)}
    WHERE id = ${id} OR table_number = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;

  invalidateCache({
    tags: [CACHE_TAGS.tables],
    paths: ['/reservation', '/order'],
    rewarm: () => getTables(),
  });
  return mapTable(rows[0] as DbRow);
}

// 5. INVENTORY
export const getInventory = unstable_cache(
  async (): Promise<InventoryItem[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM inventory_items ORDER BY name ASC`;
    return (rows as DbRow[]).map(mapInventory);
  },
  ['db-inventory'],
  { revalidate: false, tags: [CACHE_TAGS.inventory, CACHE_TAGS.all] }
);

export async function updateInventoryStock(id: string, delta: number): Promise<InventoryItem | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const existingRows = await sql`SELECT * FROM inventory_items WHERE id = ${id} LIMIT 1`;
  if (existingRows.length === 0) return null;

  const current = mapInventory(existingRows[0] as DbRow);
  const nextStock = Math.max(0, Number((current.currentStock + delta).toFixed(2)));
  const nextStatus: InventoryItem['status'] =
    nextStock <= 0 ? 'out_of_stock' : nextStock <= current.reorderLevel ? 'low_stock' : 'in_stock';

  const rows = await sql`
    UPDATE inventory_items
    SET current_stock = ${nextStock}, status = ${nextStatus}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;

  invalidateCache({
    tags: [CACHE_TAGS.inventory],
    rewarm: () => getInventory(),
  });
  return mapInventory(rows[0] as DbRow);
}

// 6. WAITLIST
export const getWaitlist = unstable_cache(
  async (): Promise<WaitlistEntry[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM waitlist ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapWaitlist);
  },
  ['db-waitlist'],
  { revalidate: false, tags: [CACHE_TAGS.waitlist, CACHE_TAGS.all] }
);

export async function addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>): Promise<WaitlistEntry> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `wl-${Date.now()}`;
  const rows = await sql`
    INSERT INTO waitlist (id, guest_name, phone, party_size, area_preference, estimated_wait_mins, status)
    VALUES (${id}, ${entry.guestName}, ${entry.phone}, ${entry.partySize}, ${entry.areaPreference}, ${entry.estimatedWaitMins}, 'waiting')
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.waitlist],
    rewarm: () => getWaitlist(),
  });
  return mapWaitlist(rows[0] as DbRow);
}

export async function updateWaitlistStatus(id: string, status: WaitlistEntry['status']): Promise<boolean> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`UPDATE waitlist SET status = ${status} WHERE id = ${id} RETURNING id`;
  const updated = rows.length > 0;
  if (updated) {
    invalidateCache({
      tags: [CACHE_TAGS.waitlist],
      rewarm: () => getWaitlist(),
    });
  }
  return updated;
}

// 7. STAFF
export const getStaff = unstable_cache(
  async (): Promise<StaffMember[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM staff_members ORDER BY role ASC, name ASC`;
    return (rows as DbRow[]).map(mapStaff);
  },
  ['db-staff'],
  { revalidate: false, tags: [CACHE_TAGS.staff, CACHE_TAGS.all] }
);

export async function toggleStaffClockIn(id: string): Promise<StaffMember | null> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`
    UPDATE staff_members
    SET is_clocked_in = NOT is_clocked_in
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;

  invalidateCache({
    tags: [CACHE_TAGS.staff],
    rewarm: () => getStaff(),
  });
  return mapStaff(rows[0] as DbRow);
}

// 8. GUEST PROFILES
export const getGuestProfiles = unstable_cache(
  async (): Promise<GuestProfile[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM guest_profiles ORDER BY lifetime_spend DESC`;
    return (rows as DbRow[]).map(mapGuest);
  },
  ['db-guests'],
  { revalidate: false, tags: [CACHE_TAGS.guests, CACHE_TAGS.all] }
);

// 9. PROMO CODES
export const getPromoCodes = unstable_cache(
  async (): Promise<PromoCode[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM promo_codes ORDER BY code ASC`;
    return (rows as DbRow[]).map(mapPromo);
  },
  ['db-promo-codes'],
  { revalidate: false, tags: [CACHE_TAGS.promo, CACHE_TAGS.all] }
);

export async function validatePromoCode(
  code: string,
  amount: number
): Promise<{ valid: boolean; discountPercent: number; discountAmount: number; message: string }> {
  const promos = await getPromoCodes();
  const cleanCode = code.trim().toUpperCase();
  const promo = promos.find((p) => p.code.toUpperCase() === cleanCode);

  if (!promo || !promo.isActive) {
    return { valid: false, discountPercent: 0, discountAmount: 0, message: 'Invalid or inactive promo code.' };
  }
  if (promo.usageCount >= promo.maxUses) {
    return { valid: false, discountPercent: 0, discountAmount: 0, message: 'This promo code has reached its redemption limit.' };
  }
  if (amount < promo.minOrderAmount) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: `Minimum order of $${promo.minOrderAmount} required for ${promo.code}.`,
    };
  }
  const discountAmount = Number(((amount * promo.discountPercent) / 100).toFixed(2));
  return {
    valid: true,
    discountPercent: promo.discountPercent,
    discountAmount,
    message: `${promo.discountPercent}% discount applied!`,
  };
}

// 10. GIFT CARDS
export const getGiftCards = unstable_cache(
  async (): Promise<GiftCard[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM gift_cards ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapGiftCard);
  },
  ['db-gift-cards'],
  { revalidate: false, tags: [CACHE_TAGS.giftCards, CACHE_TAGS.all] }
);

export async function createGiftCard(
  data: Omit<GiftCard, 'id' | 'code' | 'createdAt' | 'status' | 'currentBalance'>
): Promise<GiftCard> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `gc-${Date.now()}`;
  const code = `AURA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const rows = await sql`
    INSERT INTO gift_cards (id, code, initial_balance, current_balance, sender_name, recipient_name, recipient_email, message, status)
    VALUES (${id}, ${code}, ${data.initialBalance}, ${data.initialBalance}, ${data.senderName}, ${data.recipientName}, ${data.recipientEmail}, ${data.message ?? ''}, 'active')
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.giftCards],
    rewarm: () => getGiftCards(),
  });
  return mapGiftCard(rows[0] as DbRow);
}

// 11. DELIVERY DRIVERS & ZONES
export const getDeliveryDrivers = unstable_cache(
  async (): Promise<DeliveryDriver[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM delivery_drivers ORDER BY name ASC`;
    return (rows as DbRow[]).map(mapDriver);
  },
  ['db-delivery-drivers'],
  { revalidate: false, tags: [CACHE_TAGS.drivers, CACHE_TAGS.all] }
);

export async function updateDriverStatus(id: string, status: DeliveryDriver['status']): Promise<boolean> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`UPDATE delivery_drivers SET status = ${status} WHERE id = ${id} RETURNING id`;
  const updated = rows.length > 0;
  if (updated) {
    invalidateCache({
      tags: [CACHE_TAGS.drivers],
      paths: ['/driver'],
      rewarm: () => getDeliveryDrivers(),
    });
  }
  return updated;
}

export const getDeliveryZones = unstable_cache(
  async (): Promise<DeliveryZone[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM delivery_zones ORDER BY min_time_mins ASC`;
    return (rows as DbRow[]).map(mapZone);
  },
  ['db-delivery-zones'],
  { revalidate: false, tags: [CACHE_TAGS.zones, CACHE_TAGS.all] }
);

// 12. RECIPES & SUPPLIERS & PURCHASE ORDERS & EXPENSES
export const getRecipes = unstable_cache(
  async (): Promise<Recipe[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM recipes ORDER BY dish_name ASC`;
    return (rows as DbRow[]).map(mapRecipe);
  },
  ['db-recipes'],
  { revalidate: false, tags: [CACHE_TAGS.recipes, CACHE_TAGS.all] }
);

export const getSuppliers = unstable_cache(
  async (): Promise<Supplier[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM suppliers ORDER BY name ASC`;
    return (rows as DbRow[]).map(mapSupplier);
  },
  ['db-suppliers'],
  { revalidate: false, tags: [CACHE_TAGS.suppliers, CACHE_TAGS.all] }
);

export const getPurchaseOrders = unstable_cache(
  async (): Promise<PurchaseOrder[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM purchase_orders ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapPurchaseOrder);
  },
  ['db-purchase-orders'],
  { revalidate: false, tags: [CACHE_TAGS.purchaseOrders, CACHE_TAGS.all] }
);

export async function createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'createdAt'>): Promise<PurchaseOrder> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `po-${Date.now()}`;
  const poNumber = po.poNumber || randomCode('PO');
  const rows = await sql`
    INSERT INTO purchase_orders (id, po_number, supplier_id, supplier_name, items, total_amount, status, expected_delivery_date)
    VALUES (${id}, ${poNumber}, ${po.supplierId}, ${po.supplierName}, ${JSON.stringify(po.items)}::jsonb, ${po.totalAmount}, ${po.status || 'ordered'}, ${po.expectedDeliveryDate})
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.purchaseOrders],
    rewarm: () => getPurchaseOrders(),
  });
  return mapPurchaseOrder(rows[0] as DbRow);
}

export const getExpenses = unstable_cache(
  async (): Promise<Expense[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    return (rows as DbRow[]).map(mapExpense);
  },
  ['db-expenses'],
  { revalidate: false, tags: [CACHE_TAGS.expenses, CACHE_TAGS.all] }
);

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `exp-${Date.now()}`;
  const rows = await sql`
    INSERT INTO expenses (id, category, description, amount, payment_method, vendor, date, recorded_by)
    VALUES (${id}, ${expense.category}, ${expense.description}, ${expense.amount}, ${expense.paymentMethod}, ${expense.vendor}, ${expense.date}, ${expense.recordedBy})
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.expenses],
    rewarm: () => getExpenses(),
  });
  return mapExpense(rows[0] as DbRow);
}

// 13. REVIEWS
export const getCustomerReviews = unstable_cache(
  async (): Promise<CustomerReview[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM customer_reviews ORDER BY date DESC`;
    return (rows as DbRow[]).map(mapReview);
  },
  ['db-reviews'],
  { revalidate: false, tags: [CACHE_TAGS.reviews, CACHE_TAGS.all] }
);

export async function replyToReview(reviewId: string, reply: string): Promise<boolean> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`
    UPDATE customer_reviews SET staff_response = ${reply} WHERE id = ${reviewId} RETURNING id
  `;
  const updated = rows.length > 0;
  if (updated) {
    invalidateCache({
      tags: [CACHE_TAGS.reviews],
      paths: ['/'],
      rewarm: () => getCustomerReviews(),
    });
  }
  return updated;
}

// 14. AUDIT LOGS
export const getAuditLogs = unstable_cache(
  async (): Promise<AuditLog[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM audit_logs ORDER BY timestamp DESC`;
    return (rows as DbRow[]).map(mapAuditLog);
  },
  ['db-audit-logs'],
  { revalidate: false, tags: [CACHE_TAGS.auditLogs, CACHE_TAGS.all] }
);

export async function logAuditEvent(
  action: string,
  category: AuditLog['category'],
  user: string,
  role: string,
  details: string
): Promise<AuditLog> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `aud-${Date.now()}`;
  const rows = await sql`
    INSERT INTO audit_logs (id, action, category, "user", role, details)
    VALUES (${id}, ${action}, ${category}, ${user}, ${role}, ${details})
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.auditLogs],
    rewarm: () => getAuditLogs(),
  });
  return mapAuditLog(rows[0] as DbRow);
}

// 15. TABLE CALLS
export const getTableCalls = unstable_cache(
  async (): Promise<TableCallRequest[]> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM table_calls ORDER BY created_at DESC`;
    return (rows as DbRow[]).map(mapTableCall);
  },
  ['db-table-calls'],
  { revalidate: false, tags: [CACHE_TAGS.tableCalls, CACHE_TAGS.all] }
);

export async function createTableCall(
  tableNumber: string,
  type: TableCallRequest['type'],
  notes?: string
): Promise<TableCallRequest> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const id = `tc-${Date.now()}`;
  const rows = await sql`
    INSERT INTO table_calls (id, table_number, type, status, notes)
    VALUES (${id}, ${tableNumber}, ${type}, 'pending', ${notes ?? null})
    RETURNING *
  `;
  invalidateCache({
    tags: [CACHE_TAGS.tableCalls],
    rewarm: () => getTableCalls(),
  });
  return mapTableCall(rows[0] as DbRow);
}

export async function resolveTableCall(id: string): Promise<boolean> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const rows = await sql`UPDATE table_calls SET status = 'attended' WHERE id = ${id} RETURNING id`;
  const updated = rows.length > 0;
  if (updated) {
    invalidateCache({
      tags: [CACHE_TAGS.tableCalls],
      rewarm: () => getTableCalls(),
    });
  }
  return updated;
}

// 16. GLOBAL SETTINGS
export const getRestaurantSettings = unstable_cache(
  async (): Promise<RestaurantSettings> => {
    await ensureNeonSchema();
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM restaurant_settings WHERE id = 'default' LIMIT 1`;
    if (rows.length === 0) {
      throw new Error('Restaurant settings record is missing from Neon PostgreSQL.');
    }
    return mapSettings(rows[0] as DbRow);
  },
  ['db-restaurant-settings'],
  { revalidate: false, tags: [CACHE_TAGS.settings, CACHE_TAGS.all] }
);

export async function updateRestaurantSettings(updates: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  await ensureNeonSchema();
  const sql = getNeonSql();
  const current = await getRestaurantSettings();
  const merged: RestaurantSettings = { ...current, ...updates };

  const rows = await sql`
    UPDATE restaurant_settings
    SET
      name = ${merged.name},
      tagline = ${merged.tagline},
      phone = ${merged.phone},
      email = ${merged.email},
      address = ${merged.address},
      currency = ${merged.currency},
      tax_rate_percent = ${merged.taxRatePercent},
      delivery_fee_default = ${merged.deliveryFeeDefault},
      announcement_banner = ${merged.announcementBanner},
      is_online_ordering_open = ${merged.isOnlineOrderingOpen},
      is_reservations_open = ${merged.isReservationsOpen},
      theme_mode = ${merged.themeMode}
    WHERE id = 'default'
    RETURNING *
  `;

  invalidateCache({
    tags: [CACHE_TAGS.settings],
    paths: [...STOREFRONT_PATHS, '/about', '/contact'],
    rewarm: () => getRestaurantSettings(),
  });
  return mapSettings(rows[0] as DbRow);
}

// 17. FULL CACHE PURGE + REWARM
export async function revalidateAllDatabaseCaches(): Promise<void> {
  await purgeAndRewarmAll([
    () => getMenuItems(),
    () => getReservations(),
    () => getOrders(),
    () => getTables(),
    () => getInventory(),
    () => getWaitlist(),
    () => getStaff(),
    () => getGuestProfiles(),
    () => getPromoCodes(),
    () => getGiftCards(),
    () => getDeliveryDrivers(),
    () => getDeliveryZones(),
    () => getRecipes(),
    () => getSuppliers(),
    () => getPurchaseOrders(),
    () => getExpenses(),
    () => getCustomerReviews(),
    () => getAuditLogs(),
    () => getTableCalls(),
    () => getRestaurantSettings(),
  ]);
}
