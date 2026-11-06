# Flavoria Restaurant Management System
## Developer-Ready Master Development Blueprint

**Document Version:** 3.0 (Master Development Blueprint)  
**Target Environment:** Single Flagship Restaurant (Dhaka Central, Bangladesh)  
**Project Execution Status:** `New Build` / `Production-Ready Target`  
**Base Currency:** BDT (৳)  
**Timezone:** Asia/Dhaka (BST)  
**Payment Architecture:** Cash-Only Protocol (Delivery, Takeaway, Dine-in)  
**Primary Tech Stack:** Next.js 16.4.5 (App Router, Turbopack, React 19), Tailwind CSS v4, Neon Serverless PostgreSQL  
**Local Network Endpoint:** `http://localhost:3000` (and `http://172.16.0.2:3000`)

---

# 1. Complete Project Folder Structure

The project follows the standard Next.js App Router modular directory structure:

```
flavoria-restaurant/
├── public/                                # Static visual assets, favicons, logos, icons
├── src/
│   ├── app/                               # Next.js 16 App Router Routes & Handlers
│   │   ├── (customer)/                    # Customer-Facing Public Pages
│   │   │   ├── page.tsx                   # Homepage (Hero, Popular 4-Dish Grid, Offer, Book Table)
│   │   │   ├── about/page.tsx             # Brand Story, Master Chefs & Philosophy
│   │   │   ├── menu/page.tsx              # Filterable Menu (Breakfast, Lunch, Dinner, Drinks, Special)
│   │   │   ├── order/page.tsx             # Multi-Channel Ordering (Dine-in QR, Delivery, Takeaway)
│   │   │   ├── reservation/page.tsx       # 2D Floor Plan Table Booking & Digital Boarding Pass
│   │   │   ├── account/page.tsx           # Customer Account, Saved Addresses, 1-Click Reorder
│   │   │   ├── loyalty/page.tsx           # VIP Membership Tiers, Points Calculator, Gift Cards
│   │   │   ├── events/page.tsx            # Private Dining & Banquet Budget Calculator
│   │   │   └── contact/page.tsx           # Location, Hours, Contact Form, Phone
│   │   ├── (operations)/                  # Protected Staff Interfaces (StaffAuthGuard)
│   │   │   ├── staff-login/page.tsx       # 4-Digit PIN Touchpad & Staff Email Login
│   │   │   ├── kitchen/page.tsx           # Standalone Kitchen Display System (KDS 2.0)
│   │   │   ├── driver/page.tsx            # Delivery Staff Portal & Cash Collection Log
│   │   │   └── management/page.tsx        # 15-Module Enterprise Operations Admin Dashboard
│   │   ├── api/                           # 27 RESTful Server Route Handlers
│   ├── components/                        # Modular Component Library
│   │   ├── auth/StaffAuthGuard.tsx        # Security & 403 Forbidden Screen
│   │   ├── landing/                       # Homepage & Public UI Blocks
│   │   └── ClientProviders.tsx            # Global Context Provider Hierarchy
│   ├── context/                           # React State Contexts (Staff, Cart, Currency, Lang, Theme)
│   ├── lib/                               # Data & Business Logic Layer (db.ts, seed-data.ts)
│   └── types/index.ts                     # Domain Model TypeScript Types
```

---

# 2. Final Normalized PostgreSQL Schema & SQL Migrations

The production schema is normalized to **3NF (Third Normal Form)** with foreign key constraints, status audit histories, and cash reconciliation records.

Key Relational Tables (22 total):
1. `restaurant_settings`: Global business settings (Dhaka Central address, BST timezone, tax rates).
2. `delivery_zones`: Zone definitions for Dhaka (Zones 1-4, fees ৳50-৳140).
3. `staff_members`: Staff members with PIN codes (`1111`-`8888`), emails, roles, shifts, clock-in status.
4. `staff_sessions`: Staff shift clock-in/out audit logs.
5. `menu_categories`: Menu category taxonomy (`Breakfast`, `Lunch`, `Dinner`, `Desserts`, `Drinks`, `Chef's Special`).
6. `menu_items`: Food catalogue, prices, categories, dietary tags, availability flags.
7. `dining_tables`: Floor plan (T-01 to T-10), capacities, areas, live status.
8. `reservations`: Bookings register with unique constraint `(table_number, date, time_slot)` for concurrency locking.
9. `table_calls`: Live table assistance, bill, and water requests.
10. `delivery_drivers`: Driver fleet, vehicles, active order count, ratings.
11. `orders`: Master orders table with delivery addresses, zones, driver IDs, cash collection tracking.
12. `order_items`: Order line items with variants, add-ons, and station tags.
13. `suppliers`: Vendor directory, contact details, payment terms.
14. `inventory_items`: Raw ingredients, current stock, reorder thresholds, supplier links.
15. `recipes`: Bill of materials, ingredient costs, food cost %, gross margins.
16. `purchase_orders`: Inventory purchase orders, items JSON, delivery dates, PO status.
17. `expenses`: Operating expense records, categories, payment methods, recorded by.
18. `customer_reviews`: Customer ratings, dish reviews, staff responses.
19. `audit_logs`: Operational activity logs, timestamps, actors, severity.
20. `waitlist`: Walk-in party waitlist, estimated wait mins, seating status.
21. `guest_profiles`: Customer VIP CRM, lifetime spend, visit count, allergy notes.
22. `gift_cards` & `promo_codes`: Marketing vouchers and loyalty rewards.

---

# 3. Role-Wise Permission Matrix (RBAC)

- **Owner / Admin (PIN `1111`):** Full system access (all 15 modules, KDS, Driver, DB status).
- **Restaurant Manager (PIN `2222`):** Orders, tables, KDS, attendance, reservations, CRM.
- **Executive Chef (PIN `3333`):** KDS preparation, menu engineering, recipe food costing.
- **Kitchen Cook (PIN `4444`):** View KDS tickets, bump station progress (Cooking ➔ Ready).
- **Delivery Staff (PIN `5555`):** View assigned deliveries, 1-click customer call, log cash collected.
- **Cashier / Orders (PIN `6666`):** Order pipeline management, table status updates, payment receipt.
- **Inventory Manager (PIN `7777`):** Stock items, reorder levels, suppliers, purchase orders.
- **Accountant (PIN `8888`):** Daily Z-Reports, operating expenses ledger, CSV export.
