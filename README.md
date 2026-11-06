# L'Aura Étoile — Fine Dining Landing Page & Restaurant Management System

An ultra-luxury restaurant web application and operational management platform built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Neon Serverless PostgreSQL**.

---

## 🌟 Features Overview

### 1. Customer-Facing Haute Gastronomie Landing Page (`/`)
- **Atmospheric Hero Showcase**: Evocative nocturnal design with Three Michelin Stars 2026 distinction badges, reserve cellar highlights, and instant booking CTAs.
- **Philosophy & Chef's Story**: Spotlight on Executive Chef Jean-Luc Fontaine, sustainable terroir provenance, and artisanal craftsmanship.
- **Interactive Seasonal Tasting Menu**:
  - Filter by category (*Tasting Experience*, *Starters & Caviar*, *Mains*, *Desserts*, *Fine Wines & Cocktails*).
  - Dietary pills (*GF*, *Vegetarian*, *Vegan*, *Chef's Signature*).
  - Instant Add-to-Tasting-Order button integrated into the live slide-over cart.
- **Interactive Table Reservation System**:
  - Real-time party size selector, calendar date picker, lunch & dinner time slots.
  - Seating area selection (*Main Dining Room*, *Chef's Counter*, *Terrace Garden*, *The Private Wine Vault*).
  - Instant luxury Golden Reservation Confirmation Certificate with unique reference code (`AUR-XXXX`).
- **Private Salons & Bespoke Banquets**: Highlighting the sommelier cellar vault and the starlight glass conservatory.
- **Critic Acclaim & Guest Reviews**: The Michelin Guide, The New York Times, Forbes Travel 5-Star reviews, and guest ratings.
- **Location, Service Timings & Valet Protocol**: Hours, dress code notes, and direct concierge contact.
- **Tasting Box & Takeaway Cart Drawer**: Real-time calculated subtotal, tax, thermal packaging, and instant order dispatch directly into the Kitchen Display System (KDS).

---

### 2. Full-Featured Staff & Restaurant Management Portal (`/management`)
- **Executive Overview & KPI Dashboard**:
  - Live calculated Today's Revenue ($), Total Covers booked, and Floor Occupancy Rate (%).
  - Real-time active kitchen tickets counter.
  - Seating schedule with 1-click guest seating workflow.
- **Maître d' Reservation Manager**:
  - Filter by status (*All*, *Confirmed*, *Seated*, *Completed*, *Cancelled*).
  - Live search by guest name, reservation code, or phone number.
  - 1-click status transitions: *Seat Guest* → *Complete* → *Cancel*.
  - Manual creation modal for VIP phone & walk-in reservations.
- **Menu Item Manager (Full CRUD)**:
  - Add new dishes with photos, pricing, descriptions, dietary tags, and signature highlights.
  - Edit existing dish details.
  - Delete dishes.
  - 1-Click Toggle for stock status (**"In Stock"** vs **"86'd / Sold Out"**).
- **Live Kitchen Display System (KDS) Kanban**:
  - 4-Lane Real-time Kanban pipeline:
    1. **Received (Queued)**
    2. **In Kitchen (Prep)**
    3. **Plated & Ready (Pass)**
    4. **Served / Completed**
  - Itemized dishes, special chef notes, and 1-click advance buttons.
- **Visual Table Floor Layout**:
  - Interactive grid representing all dining tables across the restaurant.
  - Color-coded live status: *Available* (Emerald), *Occupied* (Rose), *Reserved* (Amber), *Cleaning / Turn* (Sky).
  - 1-Click table status updates and guest assignment.
- **Neon Database & Settings Console**:
  - Real-time Neon PostgreSQL connection diagnostic.
  - Copy-ready SQL schema script.
  - 1-Click local sample seed reset.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with Node.js 24)
- npm or pnpm

### Installation
```bash
# Navigate to the project directory
cd aura-luxe-restaurant

# Install dependencies (already performed)
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Management System**: [http://localhost:3000/management](http://localhost:3000/management)

---

## 🗄️ Neon PostgreSQL Setup

The project includes dual-mode data persistence:
1. **Out-of-the-box In-Memory Fallback**: Runs immediately with rich seed data without any database setup required.
2. **Neon Serverless PostgreSQL**: Seamlessly connect your live serverless database by adding your connection string to `.env.local`:

```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Once `DATABASE_URL` is configured:
1. The app automatically runs `CREATE TABLE IF NOT EXISTS` for all tables on first startup.
2. Tables are auto-populated with the initial fine dining seed dishes and dining tables if empty.
3. You can review the connection status anytime at `/management` under the **Neon DB Settings** tab.

The complete SQL schema is also available in `src/lib/schema.sql`.

---

## 📁 Project Architecture
```
aura-luxe-restaurant/
├── public/                 # Static assets & icons
├── src/
│   ├── app/
│   │   ├── api/            # Serverless API routes
│   │   │   ├── db-status/  # Neon connection diagnostics & reset
│   │   │   ├── menu/       # Menu CRUD operations
│   │   │   ├── orders/     # Kitchen & online orders
│   │   │   ├── reservations/# Table booking & status updates
│   │   │   ├── stats/      # Executive KPI analytics
│   │   │   └── tables/     # Table floor occupancy management
│   │   ├── management/     # Staff & Management Suite page
│   │   ├── globals.css     # Luxury styling & custom scrollbars
│   │   ├── layout.tsx      # Font optimization & root layout
│   │   └── page.tsx        # Customer Fine Dining Landing Page
│   ├── components/
│   │   └── landing/        # Customer landing components
│   │       ├── CartDrawer.tsx
│   │       ├── ChefStory.tsx
│   │       ├── Footer.tsx
│   │       ├── Hero.tsx
│   │       ├── LocationHours.tsx
│   │       ├── MenuSection.tsx
│   │       ├── Navbar.tsx
│   │       ├── PrivateDining.tsx
│   │       ├── ReservationSection.tsx
│   │       └── Reviews.tsx
│   ├── context/
│   │   └── CartContext.tsx # Shopping bag & tasting order state
│   ├── lib/
│   │   ├── db.ts           # Hybrid Neon serverless DB / resilient store
│   │   ├── schema.sql      # PostgreSQL DDL migration
│   │   └── seed-data.ts    # Gastronomic seed data
│   └── types/
│       └── index.ts        # TypeScript data interfaces
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```
