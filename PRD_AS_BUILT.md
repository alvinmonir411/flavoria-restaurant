# Flavoria Restaurant & Operational Management System
## Developer-Ready As-Built Product Requirements Document (PRD v2.0)

**Project Identification:** Single-Restaurant Enterprise Management System  
**Target Market:** Bangladesh (Dhaka Central Delivery & Dine-In)  
**Restaurant Concept:** Flavoria Restaurant — Modern Mixed Gastronomy & Café  
**Branch Model:** Single Flagship Branch  
**Ordering Channels:** Delivery, Takeaway, Dine-in QR  
**Payment Protocol:** Cash-Only (Cash on Delivery, Cash at Pickup, Cash at Table)  
**Database:** Neon Serverless PostgreSQL with Local In-Memory Fallback Singleton  
**Frontend Framework:** Next.js 16.4.5 (App Router, Turbopack, React 19, Tailwind CSS v4)  
**Active Production Server:** `http://localhost:3000`  
**Document Status:** **As-Built Reality Specification (100% Codebase Verified)**  

---

# 1. Executive Summary & As-Built Scope

The **Flavoria Restaurant Management System** is a full-stack, enterprise-grade restaurant web platform designed to handle customer discovery, online ordering, table reservations, kitchen fulfillment, delivery dispatch, and back-office management. 

Every requirement documented herein corresponds directly to implemented code in the active repository at `C:\Users\alvin monir\.gemini\antigravity\scratch\aura-luxe-restaurant`.

---

# 2. Role-Based Access Control (RBAC) & Authentication

The system implements strict Role-Based Access Control (RBAC) enforced by the client-side `StaffAuthGuard` (`src/components/auth/StaffAuthGuard.tsx`), `StaffAuthContext` (`src/context/StaffAuthContext.tsx`), and the backend `/api/staff/login` API.

### 2.1 Staff Roles & Access Matrix

| Role | Default PIN | Staff Email | Authorized Portals | System Privileges |
|---|---|---|---|---|
| **Owner / Admin** | `1111` | `admin@flavoria.com` | `/management`, `/kitchen`, `/driver`, `/staff-login` | Full system access, financials, settings, inventory, staff, DB diagnostics |
| **Restaurant Manager** | `2222` | `manager@flavoria.com` | `/management`, `/kitchen`, `/driver` | Orders, floor tables, KDS, attendance, reservations, CRM |
| **Executive Chef** | `3333` | `chef@flavoria.com` | `/kitchen`, `/management` (Menu/Inv) | KDS preparation, menu engineering, recipe food costing |
| **Kitchen Staff / Cook** | `4444` | `kitchen@flavoria.com` | `/kitchen` only | View KDS tickets, bump station progress (Cooking ➔ Ready) |
| **Delivery Staff / Driver** | `5555` | `driver@flavoria.com` | `/driver` only | View assigned deliveries, 1-click customer call, log cash collected |
| **Order Manager / Cashier** | `6666` | `cashier@flavoria.com` | `/management` (Orders) | Order pipeline management, table status updates, payment receipt |
| **Inventory Manager** | `7777` | `inventory@flavoria.com` | `/management` (Inventory/PO) | Stock items, reorder levels, suppliers, purchase orders |
| **Accountant** | `8888` | `accounts@flavoria.com` | `/management` (Reports/Exp) | Daily Z-Reports, operating expenses ledger, CSV export |
| **Customer** | N/A | Self-registered | `/account`, `/order`, `/reservation` | View own order history, saved addresses, VIP points |

### 2.2 Security Enforcement Rules
1. **Unauthenticated Access:** Navigating directly to `/management`, `/kitchen`, or `/driver` without a valid session renders the **Staff Login Portal** featuring:
   - 4-Digit Touchscreen PIN Keypad (1–9, Clear, 0, Backspace).
   - Staff Email & Password input tab.
   - 1-Click Role Switcher for instant evaluation.
2. **Unauthorized Role Access (HTTP 403):** If a staff member attempts to open a portal outside their authorized roles (e.g. Delivery Driver opening `/management` or `/kitchen`), the system renders a dedicated **403 Access Restricted Screen** with the authorized roles listed and a 1-click button to switch accounts.
3. **Active Session Banner:** When authorized, a top persistent dark status bar displays:
   - Active staff avatar and full name.
   - Staff role badge.
   - Shift and Clock-In status indicator (`🟢 Shift: Evening (Clocked In)`).
   - Quick cross-portal shortcuts (`Admin`, `KDS`, `Driver`).
   - `[Switch / Logout]` action button.

---

# 3. Core Business Logic & Rules

### 3.1 Cash-Only Payment Protocol
In strict compliance with the project specifications:
- **No online payment gateways** (no Stripe/bKash checkout popups in v1.0).
- Order payments are categorized strictly into:
  - `Cash on Delivery` (For delivery orders)
  - `Cash at Pickup` (For takeaway orders)
  - `Cash at Table` (For dine-in QR orders)
- Initial status of all orders is `paymentStatus: 'pending'`.
- Status is only transitioned to `'paid'` when:
  - Delivery staff inputs the exact cash collected in `/driver`.
  - Cashier marks the order as paid in `/management`.

### 3.2 Anti-Overlap Table Reservation Logic
- To prevent double-booking of physical dining tables, `/api/reservations` validates requests against existing bookings in the PostgreSQL `reservations` table.
- **Rule:** If a reservation request has the same `table_number`, `date`, and `time_slot` with an active status (`confirmed` or `pending`), the API immediately rejects the request with **HTTP 409 Conflict**:
  ```json
  {
    "error": "Table T-02 is already reserved for 19:30 on 2026-11-06. Please select another table or time."
  }
  ```

### 3.3 Dynamic Delivery Zones (Dhaka Central)
The delivery module calculates dynamic delivery fees and delivery windows based on zones:
- **Zone 1: Gulshan / Banani:** Fee ৳50 ($0.45) | Time: 25–40 mins | Min Order: ৳400
- **Zone 2: Dhanmondi / Mohakhali:** Fee ৳80 ($0.70) | Time: 35–50 mins | Min Order: ৳500
- **Zone 3: Uttara / Mirpur:** Fee ৳110 ($0.95) | Time: 45–65 mins | Min Order: ৳700
- **Zone 4: Old Dhaka / Bashundhara:** Fee ৳140 ($1.20) | Time: 50–75 mins | Min Order: ৳800

---

# 4. Database Schema (22 PostgreSQL Tables)

The system automatically initializes and synchronizes 22 relational tables on live **Neon Serverless PostgreSQL** via `src/lib/db.ts`:
1. `menu_items`: Food catalogue, prices, categories, dietary tags, availability flags.
2. `dining_tables`: Restaurant floor plan (T-01 to T-10), capacities, areas, live status.
3. `reservations`: Bookings register with `table_number` anti-overlap validation.
4. `orders`: Master orders table with delivery addresses, zones, driver IDs, cash collection tracking.
5. `order_items`: Order line items with variants, add-ons, and station tags.
6. `inventory_items`: Raw ingredients, current stock, reorder thresholds, supplier links.
7. `staff_members`: Staff members with PIN codes (`1111`-`8888`), emails, roles, shifts, clock-in status.
8. `guest_profiles`: Customer VIP CRM, lifetime spend, visit count, allergy notes.
9. `promo_codes`: Promotional discount codes, percentage off, usage counts.
10. `gift_cards`: Digital gift cards, unique codes, balances, redemption status.
11. `event_inquiries`: Private banquet inquiries, budgets, package tiers.
12. `delivery_drivers`: Driver fleet, vehicles, active order count, ratings.
13. `delivery_zones`: Zone definitions, minimum order amounts, delivery fees.
14. `recipes`: Bill of materials, ingredient costs, food cost %, gross margins.
15. `suppliers`: Vendor directory, contact details, payment terms.
16. `purchase_orders`: Inventory purchase orders, items JSON, delivery dates, PO status.
17. `expenses`: Operating expense records, categories, payment methods, recorded by.
18. `customer_reviews`: Customer ratings, dish reviews, staff responses.
19. `audit_logs`: Operational activity logs, timestamps, actors, severity.
20. `waitlist`: Walk-in party waitlist, estimated wait mins, seating status.
21. `table_calls`: Live table assistance, bill, and water requests.
22. `restaurant_settings`: Operational settings, tax rates, delivery fees, hours, theme mode.

---

# 5. Frontend Pages & Operational Portals (40 Compiled Routes)

### 5.1 Customer-Facing Interfaces
- `/`: Pinterest Flavoria design layout, circular signature salmon platter, 30+ signature dishes badge, 4 popular dishes, 20% discount offer banner, table booking widget, trust badges.
- `/menu`: Category filter pills (`Breakfast`, `Lunch`, `Dinner`, `Desserts`, `Drinks`, `Chef's Special`), search bar, live counts, query sync (`/menu?category=...`), and dish customization modal.
- `/order`: Complete ordering flow for **Dine-In** (Table selection T-01 to T-10, Split Bill calculator 1-8 ways, Waiter/Bill request), **Delivery** (Dhaka address, zones 1-4 with dynamic fees ৳50-৳140, Cash on Delivery), and **Takeaway** (Pickup time slots, Cash at Pickup).
- `/reservation`: Interactive 2D floor plan table selection, celebration add-ons, anti-overlap conflict validation, and digital reservation boarding pass.
- `/account`: Customer account portal with profile details, saved delivery addresses with zones, order history, and 1-click **Reorder Items**.
- `/loyalty`: VIP tiers (Bronze, Silver, Gold, Black Diamond), rewards calculator, digital gift cards.
- `/events`: Private dining & banquet inquiry budget calculator.
- `/about` & `/contact`: Master chefs story, contact form, map, operating hours.

### 5.2 Operational Portals
- `/kitchen`: Standalone fullscreen KDS 2.0 for kitchen tablets with live tickets, preparation timers (<10m green, 10-20m amber, >20m red pulsing alert), station filters (Grill, Saute, Pastry, Cold Bar, Bar), and ticket bump actions.
- `/driver`: Delivery staff portal with assigned delivery queue, 1-click customer phone calling, address & zone details, status transitions (`Assigned` ➔ `Picked Up` ➔ `Delivered`), and exact cash collected input.
- `/management`: 15-module enterprise Admin Operations Dashboard with live executive KPIs, order pipeline, table floor plan, KDS, inventory ledger, recipe costing, staff attendance, expenses, and Daily Financial Z-Report CSV download.
- `/staff-login`: Dedicated Staff Portal Login with 4-Digit PIN Touchscreen Keypad, Staff Email/Password, and 1-Click Role Switcher.

---

# 6. Complete REST API Specification (27 Endpoints)

All API route handlers are located in `src/app/api/**` and return standard JSON payloads:
- `/api/staff/login`: Authenticate staff by PIN or email (POST).
- `/api/staff`: Retrieve full staff roster with shifts (GET) & toggle shift clock-in/out (PATCH).
- `/api/orders`: Retrieve orders (GET), place new order (POST), update status / assign driver / collect cash (PATCH).
- `/api/reservations`: Fetch reservations (GET), book table with anti-overlap conflict check (POST), update status (PATCH).
- `/api/menu`: Fetch items (GET), add dish (POST), update price/tags (PUT), delete dish (DELETE).
- `/api/tables`: Fetch tables (GET), update status (PATCH).
- `/api/drivers`: Fetch fleet (GET), update status (PATCH).
- `/api/delivery-zones`: Fetch Dhaka zones and dynamic fees (GET).
- `/api/inventory`: Raw stock levels (GET), add stock item (POST), update quantity (PATCH).
- `/api/recipes`: Fetch recipe food costing (GET), create recipe (POST).
- `/api/suppliers`: Vendor list (GET), create vendor (POST).
- `/api/purchase-orders`: List POs (GET), issue PO (POST), mark received (PATCH).
- `/api/expenses`: Expense vouchers list (GET), record expense (POST).
- `/api/reviews`: Customer feedback (GET), submit review (POST), publish/respond (PATCH).
- `/api/guests`: VIP CRM profiles (GET), create profile (POST), update spend/tier (PATCH).
- `/api/promo`: Validate promo code (GET), create code (POST).
- `/api/gift-cards`: Check balance (GET), issue card (POST), redeem balance (PATCH).
- `/api/events`: Banquet inquiries (GET), submit inquiry (POST), update status (PATCH).
- `/api/waitlist`: Walk-in queue (GET), add party (POST), seat/cancel party (PATCH).
- `/api/table-calls`: Table assistance requests (GET), create request (POST), mark attended (PATCH).
- `/api/stats`: Executive KPI metrics (GET).
- `/api/settings`: Restaurant operational settings (GET), update hours/taxes (PUT).
- `/api/audit-logs`: Audit logs history (GET).
- `/api/db-status`: Neon PostgreSQL connectivity health check (GET).

---

# 7. Localization, Currency & Theme

- **Base Currency:** Bangladeshi Taka (BDT ৳) with live conversion to USD ($), EUR (€), GBP (£).
- **Languages:** English (`en`) and Bengali (`bn`) with real-time UI switching.
- **Themes:** High-contrast Light Theme (`#FFFFFF`, `#FAF8F5`, `#EA580C`, `#1A4231`) and Dark Mode.
