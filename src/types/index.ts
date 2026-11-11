export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  code: string;
  guestName: string;
  email: string;
  phone: string;
  guests: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "19:30"
  area: 'Main Dining Room' | "Chef's Counter" | 'Terrace Garden' | 'Private Wine Vault' | string;
  tableNumber?: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export type MenuCategory = 
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Desserts'
  | 'Drinks'
  | "Chef's Special"
  | 'Tasting Experience'
  | 'Starters & Caviar'
  | 'Mains'
  | 'Fine Wines & Cocktails';

export interface DishVariant {
  name: string; // e.g. "Standard", "Large", "Chef Platter"
  priceDelta: number; // e.g. 0, +5, +12
}

export interface DishAddon {
  id: string;
  name: string; // e.g. "Extra Black Truffle", "Aged Burrata", "Organic Fried Egg"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  subCategory?: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isSignature: boolean;
  isSoldOut?: boolean;
  dietaryTags: string[]; // e.g. ['GF', 'Vegetarian', 'Vegan', 'Halal', "Chef's Special"]
  allergens?: string[]; // e.g. ['Dairy', 'Gluten', 'Nuts', 'Shellfish']
  spiceLevels?: ('Mild' | 'Medium' | 'Hot' | 'Extra Hot')[];
  variants?: DishVariant[];
  addons?: DishAddon[];
  imageUrl: string;
  videoUrl?: string;
  calories?: number;
  prepTimeMins?: number;
  winePairing?: string;
  createdAt: string;
}

export type OrderStatus = 'received' | 'in_kitchen' | 'ready' | 'out_for_delivery' | 'served' | 'cancelled';
export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  selectedAddons?: { name: string; price: number }[];
  spiceLevel?: string;
  station?: 'Grill' | 'Saute' | 'Larder' | 'Pastry' | 'Bar';
  customNotes?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  orderType: OrderType;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryZone?: string;
  deliveryFee?: number;
  scheduledFor?: string; // Scheduled time slot or 'ASAP'
  assignedDriverId?: string;
  assignedDriverName?: string;
  paymentMethod: 'Credit Card' | 'Cash on Delivery' | 'bKash / Mobile Wallet' | 'Apple Pay';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  items: OrderItem[];
  subtotal?: number;
  taxAmount?: number;
  tipAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface DiningTable {
  id: string;
  tableNumber: string;
  name: string;
  capacity: number;
  area: 'Main Dining Room' | "Chef's Counter" | 'Terrace Garden' | 'Private Wine Vault' | string;
  status: TableStatus;
  currentGuest?: string;
  reservationTime?: string;
  activeOrderCode?: string;
  qrCodeUrl?: string;
}

// Table Calls: Assistance / Bill Requests
export interface TableCallRequest {
  id: string;
  tableNumber: string;
  type: 'assistance' | 'bill' | 'water' | 'cleaning';
  status: 'pending' | 'attended';
  notes?: string;
  createdAt: string;
}

// ========================
// ENTERPRISE ADVANCED TYPES
// ========================

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD 1.0
}

export interface WaitlistEntry {
  id: string;
  guestName: string;
  phone: string;
  partySize: number;
  areaPreference: string;
  estimatedWaitMins: number;
  status: 'waiting' | 'notified' | 'seated' | 'cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Meat & Poultry' | 'Seafood' | 'Dairy & Cheese' | 'Produce' | 'Pantry & Truffles' | 'Beverages';
  currentStock: number;
  unit: string; // e.g. 'kg', 'oz', 'bottles', 'grams', 'tins'
  reorderLevel: number;
  costPerUnit: number;
  supplier: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  expiryDate?: string;
  updatedAt: string;
}

// Recipe & Food Costing
export interface RecipeIngredient {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  cost: number;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  dishName: string;
  category: string;
  ingredients: RecipeIngredient[];
  totalCost: number;
  sellingPrice: number;
  grossMarginPercent: number;
  targetFoodCostPercent: number;
}

// Delivery Logistics
export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: 'Motorbike' | 'Electric Scooter' | 'Car';
  status: 'available' | 'on_delivery' | 'offline';
  activeOrdersCount: number;
  rating: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  minTimeMins: number;
  maxTimeMins: number;
  deliveryFee: number;
  minOrderAmount: number;
  isActive: boolean;
}

// Suppliers & Purchase Orders
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  paymentTerms: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'ordered' | 'received' | 'paid';
  expectedDeliveryDate: string;
  createdAt: string;
}

// Operating Expenses
export interface Expense {
  id: string;
  category: 'Produce & Ingredients' | 'Payroll & Wages' | 'Utilities' | 'Rent & Facility' | 'Marketing' | 'Equipment & Maintenance';
  description: string;
  amount: number;
  paymentMethod: string;
  vendor: string;
  date: string;
  recordedBy: string;
}

// Customer Reviews & Feedback
export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  dishName?: string;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'flagged';
  staffResponse?: string;
}

// Staff & Shifts (Strictly Admin and Manager roles)
export type StaffRole = 'Admin' | 'Manager';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  pinCode?: string;
  role: StaffRole;
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
  isClockedIn: boolean;
  hoursWorkedToday: number;
  phone: string;
  station: 'Grill' | 'Saute' | 'Larder' | 'Pastry' | 'Floor' | 'Bar' | 'Delivery';
  permissions?: string[];
}

// Customer VIP CRM
export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  lifetimeSpend: number;
  vipTier: 'Regular' | 'Silver VIP' | 'Gold VIP' | 'Black Diamond VIP';
  allergies: string[];
  favoriteTable: string;
  notes: string;
  lastVisit: string;
}

// Marketing & Loyalty
export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minOrderAmount: number;
  usageCount: number;
  maxUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  initialBalance: number;
  currentBalance: number;
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  createdAt: string;
  status: 'active' | 'redeemed' | 'expired';
}

// Private Events & Banquets
export interface EventInquiry {
  id: string;
  contactName: string;
  email: string;
  phone: string;
  eventType: 'Wedding Reception' | 'Corporate Gala' | 'Birthday Celebration' | 'VIP Wine Tasting';
  guestCount: number;
  preferredDate: string;
  packageTier: 'Classic Elegance' | 'Gourmet Gold' | 'Royal Gastronomy';
  estimatedBudget: number;
  status: 'new' | 'contacted' | 'booked' | 'declined';
  notes?: string;
  createdAt: string;
}

// Security & Audit Logs
export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'Order' | 'Menu' | 'Table' | 'Inventory' | 'Staff' | 'System' | 'Payment' | 'Security';
  user: string;
  role: string;
  details: string;
}

// Global System Settings
export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: CurrencyCode;
  taxRatePercent: number;
  deliveryFeeDefault: number;
  announcementBanner: string;
  isOnlineOrderingOpen: boolean;
  isReservationsOpen: boolean;
  themeMode: 'light' | 'dark';
}
