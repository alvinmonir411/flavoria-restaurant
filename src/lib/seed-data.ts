import { 
  MenuItem, 
  Reservation, 
  DiningTable, 
  Order,
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

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- BREAKFAST ---
  {
    id: 'bk-1',
    name: 'Truffled Eggs Benedict & Smoked Brioche',
    category: 'Breakfast',
    description: 'Poached organic farm eggs, artisanal smoked ham, silky tarragon hollandaise, fresh garden chives on toasted brioche.',
    price: 18.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Organic'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'bk-2',
    name: 'Avocado Croissant Supreme',
    category: 'Breakfast',
    description: 'Freshly baked flaky butter croissant, smashed Haas avocado, heirloom cherry tomatoes, poached egg, and microgreens.',
    price: 14.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'bk-3',
    name: 'Artisanal Berry Ricotta Hotcakes',
    category: 'Breakfast',
    description: 'Golden fluffy ricotta pancakes, wild forest blueberries, pure Grade-A Canadian maple syrup, and whipped honey butter.',
    price: 15.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'bk-4',
    name: 'Smoked Salmon Florentine Toast',
    category: 'Breakfast',
    description: 'Oak-smoked Scottish salmon, wilted organic baby spinach, caper berries, pickled shallots, whipped dill crème on sourdough.',
    price: 19.50,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Seafood'],
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // --- LUNCH ---
  {
    id: 'ln-1',
    name: 'Creamy Alfredo Pasta',
    category: 'Lunch',
    subCategory: 'Handmade Pasta',
    description: 'Rich and velvety white parmesan sauce, sautéed cremini mushrooms, garlic confit, and fragrant flat-leaf Italian parsley.',
    price: 14.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Vegetarian'],
    allergens: ['Dairy', 'Gluten'],
    spiceLevels: ['Mild', 'Medium'],
    variants: [
      { name: 'Standard Bowl', priceDelta: 0 },
      { name: 'Large Truffle Feast', priceDelta: 4.5 },
      { name: 'Family Sharing Platter', priceDelta: 11.0 }
    ],
    addons: [
      { id: 'ad-1', name: 'Fresh Shaved Black Truffle', price: 5.5 },
      { id: 'ad-2', name: 'Grilled Herb Chicken', price: 4.0 },
      { id: 'ad-3', name: 'Toasted Garlic Herb Brioche', price: 2.5 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ln-2',
    name: 'Quinoa & Avocado Sunshine Salad',
    category: 'Lunch',
    description: 'Organic tri-color quinoa, ripe avocado, Kalamata olives, English cucumber, cherry tomatoes, and cold-pressed citrus dressing.',
    price: 12.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegan', 'GF'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ln-3',
    name: 'Artisan Margherita Rustica Pizza',
    category: 'Lunch',
    subCategory: 'Woodfired Pizza',
    description: 'Slow-fermented Neapolitan dough, San Marzano tomato sauce, fresh Fior di Latte mozzarella, basil, extra virgin olive oil.',
    price: 16.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegetarian', 'Italian'],
    allergens: ['Dairy', 'Gluten'],
    spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    variants: [
      { name: '10" Personal Stonebaked', priceDelta: 0 },
      { name: '14" Classic Sharing', priceDelta: 5.0 },
      { name: '16" Party Crust Supreme', priceDelta: 9.0 }
    ],
    addons: [
      { id: 'ad-4', name: 'Fresh Buffalo Burrata', price: 4.5 },
      { id: 'ad-5', name: 'Prosciutto di Parma', price: 5.0 },
      { id: 'ad-6', name: 'Hot Chili Honey Drizzle', price: 2.0 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ln-4',
    name: 'Truffled Morel & Forest Mushroom Consomme',
    category: 'Lunch',
    description: 'Clarified double herbal broth, caramelized sweetbreads, stuffed wild morel caps, and fresh winter black truffle shaving.',
    price: 18.50,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'GF'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // --- DINNER ---
  {
    id: 'dn-1',
    name: 'Grilled Prime Ribeye Steak',
    category: 'Dinner',
    description: 'Juicy 12oz wood-grilled prime steak, roasted garlic bone marrow butter, grilled asparagus, and rosemary fingerling potatoes.',
    price: 24.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'GF'],
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dn-2',
    name: 'A5 Miyazaki Wagyu Tenderloin',
    category: 'Dinner',
    description: 'Binchotan charcoal-grilled A5 Japanese beef, bone marrow glazed pomme purée, charred Tokyo negi, and 30-year Madeira jus.',
    price: 65.00,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'GF', 'Halal Available'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dn-3',
    name: 'Glacier 51 Toothfish en Papillote',
    category: 'Dinner',
    description: 'Patagonian sea bass, braised baby artichokes, sweet kombu broth, sea succulents, and candied yuzu zest.',
    price: 32.00,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['GF', 'Sustainable', 'Seafood'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dn-4',
    name: 'Canard de Challans Roti',
    category: 'Dinner',
    description: 'Dry-aged spiced duck breast, caramelized sour cherries, lavender honey glaze, and parsnip silk.',
    price: 28.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['GF', 'Classic'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // --- DESSERTS ---
  {
    id: 'ds-1',
    name: 'Warm Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Rich dark Belgian chocolate cake with a molten gooey center, paired with Madagascar vanilla bean gelato and fresh berries.',
    price: 8.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ds-2',
    name: 'Grand Cru Valrhona Chocolate Sphere',
    category: 'Desserts',
    description: 'Warm smoked Venezuelan chocolate dome, salted Tahitian vanilla bean gelato, hazelnut praline feuillantine, espresso ganache.',
    price: 14.50,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ds-3',
    name: 'Golden Mirabelle Plum & Shiso Souffle',
    category: 'Desserts',
    description: 'Air-light warm souffle, mirabelle compote, crystallized shiso leaf, and Armagnac sabayon tableside.',
    price: 12.00,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'ds-4',
    name: 'Artisanal Tiramisu Tradizionale',
    category: 'Desserts',
    description: 'Savoiardi ladyfingers soaked in dark roast espresso and Marsala, layers of whipped mascarpone crema, dusted with cocoa.',
    price: 9.99,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Vegetarian'],
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // --- DRINKS ---
  {
    id: 'dr-1',
    name: 'Refreshing Berry Fizz Mocktail',
    category: 'Drinks',
    description: 'Fresh muddled blackberries, crushed mint leaves, organic lime juice, agave nectar, and sparkling spring water.',
    price: 6.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Mocktail'],
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dr-2',
    name: 'Smoked Obsidian Negroni',
    category: 'Drinks',
    description: 'Monkey 47 Gin infused with lapsang souchong tea, Carpano Antica Formula, Campari, ignited rosemary sprig.',
    price: 14.00,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Craft Cocktail'],
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dr-3',
    name: 'Chateau d\'Yquem Reserve Cocktail',
    category: 'Drinks',
    description: 'Chateau d\'Yquem Sauternes 2011, Remy Martin Louis XIII essence, saffron bitters, orange blossom mist, hand-carved ice.',
    price: 18.50,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Vintage Cocktail'],
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'dr-4',
    name: 'Cold Brew Single Origin Roast',
    category: 'Drinks',
    description: 'Ethiopian Yirgacheffe slow-dripped cold brew over 18 hours, served with Madagascar vanilla foam.',
    price: 5.50,
    isAvailable: true,
    isSignature: false,
    dietaryTags: ['Organic Coffee'],
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },

  // --- CHEF'S SPECIAL ---
  {
    id: 'cs-1',
    name: "Flavoria 7-Course Seasonal Tasting Odyssey",
    category: "Chef's Special",
    description: "An evocative tasting journey crafted by Executive Chef Marco Rossi featuring Brittany blue lobster, A5 Miyazaki Wagyu, and Périgord truffles.",
    price: 85.00,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Signature Experience'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cs-2',
    name: 'Imperial Ossetra Caviar Tartlet',
    category: "Chef's Special",
    description: 'Golden Ossetra pearls, crisp buckwheat tartlet, smoked brioche crème, Charentes butter emulsion, and delicate 24k edible gold leaf.',
    price: 45.00,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Caviar Reserve'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'cs-3',
    name: 'Acquerello Risotto with White Alba Truffle',
    category: "Chef's Special",
    description: 'Aged Carnaroli rice, mountain cultured butter, 36-month Vacche Rosse Parmigiano-Reggiano, and hand-shaved white truffle.',
    price: 28.99,
    isAvailable: true,
    isSignature: true,
    dietaryTags: ["Chef's Special", 'Vegetarian', 'GF'],
    imageUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const INITIAL_TABLES: DiningTable[] = [
  { id: 'tbl-1', tableNumber: 'T-01', name: 'Window Alcove 1', capacity: 2, area: 'Main Dining Room', status: 'occupied', currentGuest: 'Lord & Lady Harrington', reservationTime: '19:00' },
  { id: 'tbl-2', tableNumber: 'T-02', name: 'Window Alcove 2', capacity: 2, area: 'Main Dining Room', status: 'available' },
  { id: 'tbl-3', tableNumber: 'T-03', name: 'Center Salon 3', capacity: 4, area: 'Main Dining Room', status: 'reserved', currentGuest: 'Dr. Aris Vance', reservationTime: '20:15' },
  { id: 'tbl-4', tableNumber: 'T-04', name: 'Center Salon 4', capacity: 4, area: 'Main Dining Room', status: 'available' },
  { id: 'tbl-5', tableNumber: 'T-05', name: 'Grand Booth 5', capacity: 6, area: 'Main Dining Room', status: 'occupied', currentGuest: 'Somerset Partners', reservationTime: '19:30' },
  { id: 'tbl-6', tableNumber: 'C-01', name: "Chef's Counter 1", capacity: 2, area: "Chef's Counter", status: 'occupied', currentGuest: 'Elena Rostova', reservationTime: '19:00' },
  { id: 'tbl-7', tableNumber: 'C-02', name: "Chef's Counter 2", capacity: 2, area: "Chef's Counter", status: 'available' },
  { id: 'tbl-8', tableNumber: 'TG-01', name: 'Rose Pergola 1', capacity: 4, area: 'Terrace Garden', status: 'cleaning' },
  { id: 'tbl-9', tableNumber: 'TG-02', name: 'Rose Pergola 2', capacity: 4, area: 'Terrace Garden', status: 'available' },
  { id: 'tbl-10', tableNumber: 'VIP-01', name: 'The Private Wine Vault', capacity: 10, area: 'Private Wine Vault', status: 'reserved', currentGuest: 'Gala Tasting Party', reservationTime: '20:30' }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    code: 'FLV-8492',
    guestName: 'Eleanor Vance',
    email: 'eleanor.vance@chambers.com',
    phone: '+1 (555) 392-8812',
    guests: 2,
    date: '2026-11-05',
    timeSlot: '19:30',
    area: 'Main Dining Room',
    specialRequests: 'Celebrating 10th wedding anniversary. Preference for quiet booth and sommelier wine pairing.',
    status: 'seated',
    createdAt: '2026-11-05T03:00:00.000Z'
  },
  {
    id: 'res-2',
    code: 'FLV-9124',
    guestName: 'Marcus Sterling',
    email: 'm.sterling@capital.io',
    phone: '+1 (555) 728-1199',
    guests: 4,
    date: '2026-11-05',
    timeSlot: '20:15',
    area: 'Terrace Garden',
    specialRequests: 'One guest has severe shellfish allergy. Requesting sparkling water upon arrival.',
    status: 'confirmed',
    createdAt: '2026-11-05T01:00:00.000Z'
  },
  {
    id: 'res-3',
    code: 'FLV-3048',
    guestName: 'Madame Vivienne Laurent',
    email: 'vivienne@laurent-design.fr',
    phone: '+33 6 42 19 88 01',
    guests: 2,
    date: '2026-11-05',
    timeSlot: '20:30',
    area: "Chef's Counter",
    specialRequests: 'Chef tasting experience with prestige French champagne pairing.',
    status: 'confirmed',
    createdAt: '2026-11-04T22:00:00.000Z'
  },
  {
    id: 'res-4',
    code: 'FLV-5519',
    guestName: 'Katsumi Tanaka',
    email: 'tanaka.k@tokyo-arts.jp',
    phone: '+81 90 4123 9981',
    guests: 6,
    date: '2026-11-06',
    timeSlot: '19:00',
    area: 'Private Wine Vault',
    specialRequests: 'Curated 7-course menu. Please arrange floral centerpiece.',
    status: 'confirmed',
    createdAt: '2026-11-04T12:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderCode: 'KDS-301',
    orderType: 'Dine-In',
    tableNumber: 'T-01',
    customerName: 'Lord & Lady Harrington',
    customerPhone: '+1 (555) 392-8812',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'paid',
    items: [
      { menuItemId: 'ln-1', name: 'Creamy Alfredo Pasta', price: 14.99, quantity: 2 },
      { menuItemId: 'dn-1', name: 'Grilled Prime Ribeye Steak', price: 24.99, quantity: 2 },
      { menuItemId: 'dr-1', name: 'Refreshing Berry Fizz Mocktail', price: 6.99, quantity: 2 }
    ],
    totalAmount: 93.94,
    status: 'in_kitchen',
    notes: 'Steaks medium-rare. Fast table service.',
    createdAt: '2026-11-05T05:00:00.000Z'
  },
  {
    id: 'ord-102',
    orderCode: 'KDS-302',
    orderType: 'Dine-In',
    tableNumber: 'C-01',
    customerName: 'Elena Rostova',
    customerPhone: '+1 (555) 441-2091',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'paid',
    items: [
      { menuItemId: 'cs-1', name: "Flavoria 7-Course Seasonal Tasting Odyssey", price: 85.00, quantity: 2 }
    ],
    totalAmount: 170.00,
    status: 'in_kitchen',
    notes: 'Course 3 underway: Brittany Blue Lobster.',
    createdAt: '2026-11-05T04:45:00.000Z'
  },
  {
    id: 'ord-103',
    orderCode: 'KDS-303',
    orderType: 'Delivery',
    customerName: 'Sir Arthur Wellesley',
    customerPhone: '+1 (555) 890-4421',
    deliveryAddress: 'Gulshan-2, Road 71, Block NW(B)',
    deliveryZone: 'Zone 1: Gulshan / Banani ($5.00)',
    deliveryFee: 0.5,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'paid',
    items: [
      { menuItemId: 'bk-1', name: 'Truffled Eggs Benedict & Smoked Brioche', price: 18.99, quantity: 2 },
      { menuItemId: 'ds-1', name: 'Warm Chocolate Lava Cake', price: 8.99, quantity: 2 }
    ],
    totalAmount: 55.96,
    status: 'received',
    notes: 'Flavoria packaging. Chilled thermal carrier requested.',
    createdAt: '2026-11-05T05:10:00.000Z'
  },
  {
    id: 'ord-104',
    orderCode: 'KDS-300',
    orderType: 'Dine-In',
    tableNumber: 'T-05',
    customerName: 'Somerset Partners',
    customerPhone: '+1 (555) 991-3200',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'paid',
    items: [
      { menuItemId: 'ln-3', name: 'Artisan Margherita Rustica Pizza', price: 16.99, quantity: 2 },
      { menuItemId: 'cs-3', name: 'Acquerello Risotto with White Alba Truffle', price: 28.99, quantity: 2 }
    ],
    totalAmount: 91.96,
    status: 'ready',
    notes: 'Plated and inspected by Sous Chef. Ready for floor runner.',
    createdAt: '2026-11-05T04:30:00.000Z'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'A5 Miyazaki Wagyu Tenderloin',
    category: 'Meat & Poultry',
    currentStock: 18.5,
    unit: 'kg',
    reorderLevel: 5.0,
    costPerUnit: 140.0,
    supplier: 'Miyazaki Fine Meats Ltd.',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-2',
    name: 'Périgord Winter Black Truffles',
    category: 'Pantry & Truffles',
    currentStock: 320,
    unit: 'grams',
    reorderLevel: 100,
    costPerUnit: 1.85,
    supplier: 'Maison de la Truffe France',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-3',
    name: 'Brittany Blue Lobster',
    category: 'Seafood',
    currentStock: 14,
    unit: 'tails',
    reorderLevel: 8,
    costPerUnit: 34.0,
    supplier: 'Brittany Atlantic Catch',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-4',
    name: 'Imperial Ossetra Caviar (50g)',
    category: 'Seafood',
    currentStock: 9,
    unit: 'tins',
    reorderLevel: 6,
    costPerUnit: 48.0,
    supplier: 'Caspian Caviar Heritage',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-5',
    name: 'San Marzano DOP Tomatoes',
    category: 'Produce',
    currentStock: 45,
    unit: 'cans',
    reorderLevel: 15,
    costPerUnit: 4.20,
    supplier: 'Agro Sarnese-Nocerino Italy',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-6',
    name: 'Vacche Rosse Parmigiano 36-Mo',
    category: 'Dairy & Cheese',
    currentStock: 12.0,
    unit: 'kg',
    reorderLevel: 4.0,
    costPerUnit: 38.5,
    supplier: 'Consorzio Vacche Rosse',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-7',
    name: 'Grand Cru Valrhona Chocolate 70%',
    category: 'Dairy & Cheese',
    currentStock: 8.5,
    unit: 'kg',
    reorderLevel: 3.0,
    costPerUnit: 26.0,
    supplier: 'Valrhona Chocolaterie',
    status: 'in_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  },
  {
    id: 'inv-8',
    name: 'Monkey 47 Schwarzwald Dry Gin',
    category: 'Beverages',
    currentStock: 3,
    unit: 'bottles',
    reorderLevel: 5,
    costPerUnit: 42.0,
    supplier: 'Black Forest Distillers',
    status: 'low_stock',
    updatedAt: '2026-11-05T04:00:00.000Z'
  }
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wt-1',
    guestName: 'Julian Thorne',
    phone: '+1 (555) 312-9844',
    partySize: 2,
    areaPreference: 'Garden Terrace',
    estimatedWaitMins: 15,
    status: 'waiting',
    createdAt: '2026-11-05T05:15:00.000Z'
  },
  {
    id: 'wt-2',
    guestName: 'Dr. Celine Moreau',
    phone: '+1 (555) 782-0193',
    partySize: 4,
    areaPreference: 'Main Dining Room',
    estimatedWaitMins: 25,
    status: 'waiting',
    createdAt: '2026-11-05T05:22:00.000Z'
  },
  {
    id: 'wt-3',
    guestName: 'Robert Langdon',
    phone: '+1 (555) 604-2211',
    partySize: 2,
    areaPreference: "Chef's Counter",
    estimatedWaitMins: 5,
    status: 'notified',
    createdAt: '2026-11-05T04:55:00.000Z'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'st-admin', name: 'Alvin Monir', email: 'admin@gmail.com', role: 'Admin', shift: 'Morning', isClockedIn: true, hoursWorkedToday: 4.0, phone: '+880 1711-000001', station: 'Floor', permissions: ['all'] },
  { id: 'st-manager', name: 'Rahim Chowdhury', email: 'manager@gamil.com', role: 'Manager', shift: 'Morning', isClockedIn: true, hoursWorkedToday: 6.0, phone: '+880 1711-000002', station: 'Floor', permissions: ['management', 'kds', 'inventory', 'reservations', 'tables', 'waitlist'] }
];

export const STAFF_SEED_PASSWORDS: Record<string, string> = {
  'st-admin': '136633',
  'st-manager': '136633',
};

export const INITIAL_GUEST_PROFILES: GuestProfile[] = [
  {
    id: 'gp-1',
    name: 'Lord & Lady Harrington',
    email: 'harrington@chambers.co.uk',
    phone: '+1 (555) 392-8812',
    totalVisits: 14,
    lifetimeSpend: 4850,
    vipTier: 'Black Diamond VIP',
    allergies: ['Shellfish'],
    favoriteTable: 'T-01 (Window Alcove)',
    notes: 'Prefers 2011 Château d’Yquem and corner alcove with soft lighting.',
    lastVisit: '2026-11-05'
  },
  {
    id: 'gp-2',
    name: 'Sir Arthur Wellesley',
    email: 'wellesley@capital.io',
    phone: '+1 (555) 890-4421',
    totalVisits: 8,
    lifetimeSpend: 2420,
    vipTier: 'Gold VIP',
    allergies: ['Gluten-sensitive'],
    favoriteTable: 'TG-01 (Rose Pergola)',
    notes: 'Enjoys outdoor dining, always orders Grand Cru Valrhona dome.',
    lastVisit: '2026-10-28'
  },
  {
    id: 'gp-3',
    name: 'Madame Vivienne Laurent',
    email: 'vivienne@laurent-design.fr',
    phone: '+33 6 42 19 88 01',
    totalVisits: 6,
    lifetimeSpend: 1980,
    vipTier: 'Silver VIP',
    allergies: [],
    favoriteTable: "C-01 (Chef's Counter)",
    notes: 'Fashion house designer. Prefers chef front row seat and French pairings.',
    lastVisit: '2026-11-05'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME20', discountPercent: 20, description: '20% off for first order or newsletter signups', minOrderAmount: 30, usageCount: 42, maxUses: 500, expiresAt: '2026-12-31', isActive: true },
  { code: 'VIPLUXE', discountPercent: 25, description: 'VIP Club member seasonal tasting privilege', minOrderAmount: 100, usageCount: 18, maxUses: 100, expiresAt: '2026-12-31', isActive: true },
  { code: 'WEEKEND10', discountPercent: 10, description: '10% off any lunch or dinner booking', minOrderAmount: 50, usageCount: 89, maxUses: 1000, expiresAt: '2026-12-31', isActive: true }
];

export const INITIAL_GIFT_CARDS: GiftCard[] = [
  { id: 'gc-1', code: 'FLV-GIFT-5001', initialBalance: 150, currentBalance: 150, senderName: 'Julian Croft', recipientName: 'Amelia Croft', recipientEmail: 'amelia@example.com', message: 'Happy Birthday! Treat yourself to an unforgettable dinner at Flavoria.', createdAt: '2026-11-01T10:00:00.000Z', status: 'active' },
  { id: 'gc-2', code: 'FLV-GIFT-5002', initialBalance: 250, currentBalance: 180, senderName: 'TechVanguard Inc', recipientName: 'Sarah Connor', recipientEmail: 'sarah@techvanguard.com', message: 'Thank you for your outstanding leadership this quarter.', createdAt: '2026-10-24T14:00:00.000Z', status: 'active' }
];

export const INITIAL_EVENTS: EventInquiry[] = [
  {
    id: 'ev-1',
    contactName: 'Victoria Sterling',
    email: 'events@sterling-media.com',
    phone: '+1 (555) 772-9102',
    eventType: 'Corporate Gala',
    guestCount: 35,
    preferredDate: '2026-11-20',
    packageTier: 'Royal Gastronomy',
    estimatedBudget: 8500,
    status: 'booked',
    notes: 'Full private lounge buyout with champagne reception & 5-course customized menu.',
    createdAt: '2026-11-01T12:00:00.000Z'
  },
  {
    id: 'ev-2',
    contactName: 'Alexander Hayes',
    email: 'alex.hayes@wedding.org',
    phone: '+1 (555) 441-3990',
    eventType: 'Wedding Reception',
    guestCount: 50,
    preferredDate: '2026-12-12',
    packageTier: 'Gourmet Gold',
    estimatedBudget: 11000,
    status: 'contacted',
    notes: 'Terrace garden ceremony followed by reception dinner. Wine pairing requested.',
    createdAt: '2026-11-03T15:30:00.000Z'
  }
];

// ============================================
// 1. DELIVERY LOGISTICS
// ============================================
export const INITIAL_DELIVERY_DRIVERS: DeliveryDriver[] = [
  { id: 'drv-1', name: 'Tariq Al-Mansoor', phone: '+1 (555) 301-4491', vehicle: 'Motorbike', status: 'available', activeOrdersCount: 0, rating: 4.9 },
  { id: 'drv-2', name: 'Marco Silva', phone: '+1 (555) 819-2041', vehicle: 'Electric Scooter', status: 'on_delivery', activeOrdersCount: 1, rating: 4.8 },
  { id: 'drv-3', name: 'David Chen', phone: '+1 (555) 492-8812', vehicle: 'Car', status: 'available', activeOrdersCount: 0, rating: 5.0 },
  { id: 'drv-4', name: 'Elena Rostova', phone: '+1 (555) 603-9110', vehicle: 'Electric Scooter', status: 'offline', activeOrdersCount: 0, rating: 4.7 }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone-1', name: 'Downtown & Financial District', minTimeMins: 20, maxTimeMins: 35, deliveryFee: 3.99, minOrderAmount: 25.0, isActive: true },
  { id: 'zone-2', name: 'Uptown & Luxury Alcove', minTimeMins: 30, maxTimeMins: 45, deliveryFee: 5.99, minOrderAmount: 35.0, isActive: true },
  { id: 'zone-3', name: 'Riverfront & West End', minTimeMins: 35, maxTimeMins: 55, deliveryFee: 7.99, minOrderAmount: 50.0, isActive: true },
  { id: 'zone-4', name: 'Suburban Express Perimeter', minTimeMins: 45, maxTimeMins: 65, deliveryFee: 9.99, minOrderAmount: 60.0, isActive: true }
];

// ============================================
// 2. RECIPES & FOOD COSTING
// ============================================
export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rcp-1',
    menuItemId: 'ln-1',
    dishName: 'Creamy Alfredo Pasta',
    category: 'Lunch',
    ingredients: [
      { inventoryItemId: 'inv-3', name: 'Charentes Artisan Butter & Cream', quantity: 0.15, unit: 'kg', unitCost: 18.5, cost: 2.78 },
      { inventoryItemId: 'inv-4', name: 'Black Winter Perigord Truffles', quantity: 0.005, unit: 'kg', unitCost: 1200, cost: 6.00 },
      { inventoryItemId: 'inv-5', name: 'Heirloom San Marzano Tomatoes & Herbs', quantity: 0.10, unit: 'kg', unitCost: 8.5, cost: 0.85 }
    ],
    totalCost: 4.63,
    sellingPrice: 14.99,
    grossMarginPercent: 69.1,
    targetFoodCostPercent: 28.0
  },
  {
    id: 'rcp-2',
    menuItemId: 'dn-1',
    dishName: 'Grilled Prime Ribeye Steak',
    category: 'Dinner',
    ingredients: [
      { inventoryItemId: 'inv-1', name: 'Miyazaki A5 Wagyu Tenderloin', quantity: 0.35, unit: 'kg', unitCost: 185.0, cost: 8.50 },
      { inventoryItemId: 'inv-3', name: 'Charentes Artisan Butter', quantity: 0.05, unit: 'kg', unitCost: 18.5, cost: 0.93 },
      { inventoryItemId: 'inv-5', name: 'Fresh Asparagus & Rosemary', quantity: 0.15, unit: 'kg', unitCost: 8.5, cost: 1.28 }
    ],
    totalCost: 7.85,
    sellingPrice: 24.99,
    grossMarginPercent: 68.6,
    targetFoodCostPercent: 30.0
  },
  {
    id: 'rcp-3',
    menuItemId: 'dn-2',
    dishName: 'A5 Miyazaki Wagyu Tenderloin',
    category: 'Dinner',
    ingredients: [
      { inventoryItemId: 'inv-1', name: 'Miyazaki A5 Wagyu Tenderloin', quantity: 0.20, unit: 'kg', unitCost: 185.0, cost: 37.00 },
      { inventoryItemId: 'inv-4', name: 'Winter Truffle Jus Reduction', quantity: 0.01, unit: 'kg', unitCost: 450.0, cost: 4.50 }
    ],
    totalCost: 19.50,
    sellingPrice: 65.00,
    grossMarginPercent: 70.0,
    targetFoodCostPercent: 30.0
  },
  {
    id: 'rcp-4',
    menuItemId: 'ds-1',
    dishName: 'Warm Chocolate Lava Cake',
    category: 'Desserts',
    ingredients: [
      { inventoryItemId: 'inv-3', name: 'Artisan Butter & Belgian Chocolate', quantity: 0.12, unit: 'kg', unitCost: 16.0, cost: 1.92 },
      { inventoryItemId: 'inv-5', name: 'Madagascar Vanilla Bean & Berries', quantity: 0.05, unit: 'kg', unitCost: 12.0, cost: 0.60 }
    ],
    totalCost: 2.52,
    sellingPrice: 8.99,
    grossMarginPercent: 72.0,
    targetFoodCostPercent: 28.0
  }
];

// ============================================
// 3. SUPPLIERS & PURCHASE ORDERS
// ============================================
export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Kyoto Heritage Wagyu Guild', contactPerson: 'Kenji Takahashi', email: 'kenji@kyotowagyu.jp', phone: '+81 3 5555 0192', category: 'Prime Meat & A5 Beef', paymentTerms: 'Net 15', status: 'active' },
  { id: 'sup-2', name: 'Brittany Coastal Seafood Co.', contactPerson: 'Gaston Leroux', email: 'gaston@brittanyseafood.fr', phone: '+33 2 98 11 44 20', category: 'Live Lobster & Sea Bass', paymentTerms: 'Net 7', status: 'active' },
  { id: 'sup-3', name: 'Perigord Truffle Artisans', contactPerson: 'Marcel Dubois', email: 'orders@perigordtruffles.com', phone: '+33 5 53 01 22 19', category: 'Fresh Black & White Truffles', paymentTerms: 'Prepaid / Escrow', status: 'active' },
  { id: 'sup-4', name: 'Normandy Organic Dairies', contactPerson: 'Claire Moreau', email: 'claire@normandydairies.com', phone: '+33 2 31 88 41 90', category: 'Artisan Butter & Creams', paymentTerms: 'Net 30', status: 'active' }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-089',
    supplierId: 'sup-1',
    supplierName: 'Kyoto Heritage Wagyu Guild',
    items: [
      { name: 'A5 Miyazaki Wagyu Tenderloin Strips', quantity: 15, unit: 'kg', unitPrice: 185.0, total: 2775.0 }
    ],
    totalAmount: 2775.0,
    status: 'ordered',
    expectedDeliveryDate: '2026-11-08',
    createdAt: '2026-11-04T09:00:00.000Z'
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-090',
    supplierId: 'sup-3',
    supplierName: 'Perigord Truffle Artisans',
    items: [
      { name: 'Fresh Black Melanosporum Truffles', quantity: 3, unit: 'kg', unitPrice: 1200.0, total: 3600.0 }
    ],
    totalAmount: 3600.0,
    status: 'received',
    expectedDeliveryDate: '2026-11-05',
    createdAt: '2026-11-02T11:30:00.000Z'
  }
];

// ============================================
// 4. OPERATING EXPENSES
// ============================================
export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', category: 'Produce & Ingredients', description: 'Weekly organic produce & microgreens harvest', amount: 840.50, paymentMethod: 'Corporate ACH', vendor: 'Heritage Farm Organics', date: '2026-11-04', recordedBy: 'Executive Chef Marco' },
  { id: 'exp-2', category: 'Utilities', description: 'Natural gas & walk-in refrigeration electric bill', amount: 1240.00, paymentMethod: 'Direct Debit', vendor: 'City Energy Corp', date: '2026-11-01', recordedBy: 'Floor Manager Sarah' },
  { id: 'exp-3', category: 'Payroll & Wages', description: 'Bi-weekly kitchen team shift gratuity pool & wages', amount: 4850.00, paymentMethod: 'Payroll Wire', vendor: 'Flavoria Staffing', date: '2026-10-31', recordedBy: 'Executive Admin' },
  { id: 'exp-4', category: 'Equipment & Maintenance', description: 'Binchotan charcoal grill hood servicing & calibration', amount: 390.00, paymentMethod: 'Company Card', vendor: 'Apex Culinary Services', date: '2026-10-28', recordedBy: 'Executive Chef Marco' }
];

// ============================================
// 5. CUSTOMER REVIEWS & FEEDBACK
// ============================================
export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Jonathan Brandis',
    rating: 5,
    dishName: 'Creamy Alfredo Pasta',
    comment: 'The velvety consistency and freshly shaved truffles made this the highlight of our anniversary dinner. World-class hospitality!',
    date: '2026-11-04',
    status: 'published',
    staffResponse: 'Thank you Jonathan! We look forward to welcoming you and your spouse back very soon.'
  },
  {
    id: 'rev-2',
    customerName: 'Sophia Lindqvist',
    rating: 5,
    dishName: 'A5 Miyazaki Wagyu Tenderloin',
    comment: 'Literally melted in my mouth. The table QR ordering was seamless and our split bill was handled in seconds. 10/10.',
    date: '2026-11-03',
    status: 'published',
    staffResponse: 'Merci Sophia! Our culinary team takes great pride in sourcing the highest pedigree Miyazaki beef.'
  },
  {
    id: 'rev-3',
    customerName: 'Marcus Aurel',
    rating: 4,
    dishName: 'Warm Chocolate Lava Cake',
    comment: 'Rich decadent dessert. A minor 5-minute wait during the peak 8 PM rush, but the floor manager was exceptionally gracious.',
    date: '2026-11-01',
    status: 'published',
    staffResponse: 'Thank you for your valuable feedback, Marcus. We have tuned our pastry station prep times.'
  }
];

// ============================================
// 6. SYSTEM AUDIT LOGS
// ============================================
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-1', timestamp: '2026-11-05T11:45:12.000Z', action: 'Table Order Created', category: 'Order', user: 'Guest #T-02', role: 'Dine-In Customer', details: 'Order FLV-9201 placed for Table T-02 ($114.97)' },
  { id: 'aud-2', timestamp: '2026-11-05T11:32:00.000Z', action: 'Menu Item Price Adjusted', category: 'Menu', user: 'Marco Rossi', role: 'Executive Chef', details: 'A5 Wagyu Tenderloin set to $65.00' },
  { id: 'aud-3', timestamp: '2026-11-05T11:15:30.000Z', action: 'Staff Clock-In', category: 'Staff', user: 'Jean-Luc Fontaine', role: 'Sous Chef', details: 'Clocked in at Saute Station for Evening Shift' },
  { id: 'aud-4', timestamp: '2026-11-05T10:50:18.000Z', action: 'Inventory Restock', category: 'Inventory', user: 'Sarah Jenkins', role: 'Floor Manager', details: 'Added 5.0 kg Black Winter Perigord Truffles from PO-2026-090' },
  { id: 'aud-5', timestamp: '2026-11-05T10:10:00.000Z', action: 'Neon DB Schema Verified', category: 'Security', user: 'System Worker', role: 'Neon Engine', details: 'All 15 tables validated on Neon Serverless Postgres' }
];

// ============================================
// 7. TABLE CALLS & ASSISTANCE
// ============================================
export const INITIAL_TABLE_CALLS: TableCallRequest[] = [
  { id: 'call-1', tableNumber: 'T-02', type: 'water', status: 'pending', notes: 'Sparkling mineral water requested', createdAt: '2026-11-05T11:50:00.000Z' },
  { id: 'call-2', tableNumber: 'T-05', type: 'bill', status: 'attended', notes: 'Split bill 3 ways requested', createdAt: '2026-11-05T11:35:00.000Z' }
];

// ============================================
// 8. GLOBAL RESTAURANT SETTINGS & CMS
// ============================================
export const DEFAULT_SETTINGS: RestaurantSettings = {
  name: 'Flavoria Restaurant',
  tagline: 'Delicious Food for Every Mood — Good Food, Good Life',
  phone: '+1 234 567 8900',
  email: 'concierge@flavoria.com',
  address: '123 Food Street, Flavor Town, FT 56789',
  currency: 'USD',
  taxRatePercent: 8.5,
  deliveryFeeDefault: 4.99,
  announcementBanner: '🌟 Awarded Best Haute Bistro 2026 — Experience our 4-Course Seasonal Tasting & Table-Side Sommelier Flight!',
  isOnlineOrderingOpen: true,
  isReservationsOpen: true,
  themeMode: 'light'
};

