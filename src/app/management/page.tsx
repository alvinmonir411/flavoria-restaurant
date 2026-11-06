'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import StaffAuthGuard from '@/components/auth/StaffAuthGuard';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UtensilsCrossed, 
  ChefHat, 
  Grid, 
  Database, 
  ArrowLeft, 
  RefreshCw, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Users, 
  DollarSign, 
  Flame, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Eye, 
  Sparkles, 
  X,
  ExternalLink,
  Copy,
  Check,
  Package,
  BellRing,
  UserCheck,
  CreditCard,
  FileSpreadsheet,
  Award,
  Crown,
  Percent,
  Download,
  Building,
  Truck
} from 'lucide-react';
import { 
  Reservation, 
  ReservationStatus, 
  MenuItem, 
  MenuCategory, 
  Order, 
  OrderStatus, 
  DiningTable, 
  TableStatus,
  InventoryItem,
  WaitlistEntry,
  StaffMember,
  GuestProfile,
  PromoCode,
  GiftCard,
  EventInquiry,
  TableCallRequest
} from '@/types';

type ManagementTab = 
  | 'overview' 
  | 'reservations' 
  | 'tables' 
  | 'waitlist' 
  | 'kds' 
  | 'menu' 
  | 'inventory' 
  | 'staff' 
  | 'crm' 
  | 'marketing' 
  | 'reports' 
  | 'database';

export default function ManagementPage() {
  return (
    <StaffAuthGuard
      portalName="Enterprise Operations & Admin Dashboard"
      allowedRoles={[
        'Owner / Admin',
        'Restaurant Manager',
        'Order Manager',
        'Inventory Manager',
        'Accountant',
        'Floor Manager'
      ]}
    >
      <ManagementContent />
    </StaffAuthGuard>
  );
}

function ManagementContent() {
  const [activeTab, setActiveTab] = useState<ManagementTab>('overview');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Datasets
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [events, setEvents] = useState<EventInquiry[]>([]);
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; connected: boolean; mode: string; message: string } | null>(null);
  const [tableCalls, setTableCalls] = useState<TableCallRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [kdsStationFilter, setKdsStationFilter] = useState<string>('All');
  const [smsSentId, setSmsSentId] = useState<string | null>(null);

  // Modals & Form states
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showNewResModal, setShowNewResModal] = useState(false);
  const [selectedTableForEdit, setSelectedTableForEdit] = useState<DiningTable | null>(null);
  const [showAddWaitlistModal, setShowAddWaitlistModal] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({ guestName: '', phone: '', partySize: 2, areaPreference: 'Main Dining Room' });

  const [dishForm, setDishForm] = useState({
    name: '',
    category: 'Dinner' as MenuCategory,
    price: 24.99,
    description: '',
    imageUrl: '',
    isSignature: false,
    dietaryTagsStr: 'Chef Special'
  });

  const [todayStr, setTodayStr] = useState('2026-11-05');
  const [resForm, setResForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    guests: 2,
    date: '2026-11-05',
    timeSlot: '19:30',
    area: 'Main Dining Room' as Reservation['area'],
    specialRequests: ''
  });

  // Clock
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayStr(today);
    setResForm(prev => ({ ...prev, date: today }));

    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all enterprise endpoints
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [resR, resM, resO, resT, resD, resW, resI, resS, resG, resP, resGc, resE, resC] = await Promise.all([
        fetch('/api/reservations').then(r => r.json()).catch(() => ({ reservations: [] })),
        fetch('/api/menu').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('/api/orders').then(r => r.json()).catch(() => ({ orders: [] })),
        fetch('/api/tables').then(r => r.json()).catch(() => ({ tables: [] })),
        fetch('/api/db-status').then(r => r.json()).catch(() => null),
        fetch('/api/waitlist').then(r => r.json()).catch(() => ({ waitlist: [] })),
        fetch('/api/inventory').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('/api/staff').then(r => r.json()).catch(() => ({ staff: [] })),
        fetch('/api/guests').then(r => r.json()).catch(() => ({ guests: [] })),
        fetch('/api/promo').then(r => r.json()).catch(() => ({ promoCodes: [] })),
        fetch('/api/gift-cards').then(r => r.json()).catch(() => ({ giftCards: [] })),
        fetch('/api/events').then(r => r.json()).catch(() => ({ events: [] })),
        fetch('/api/table-calls').then(r => r.json()).catch(() => ({ calls: [] }))
      ]);

      if (resR.reservations) setReservations(resR.reservations);
      if (resM.items) setMenuItems(resM.items);
      if (resO.orders) setOrders(resO.orders);
      if (resT.tables) setTables(resT.tables);
      if (resD) setDbStatus(resD);
      if (resW.waitlist) setWaitlist(resW.waitlist);
      if (resI.items) setInventory(resI.items);
      if (resS.staff) setStaff(resS.staff);
      if (resG.guests) setGuests(resG.guests);
      if (resP.promoCodes) setPromoCodes(resP.promoCodes);
      if (resGc.giftCards) setGiftCards(resGc.giftCards);
      if (resE.events) setEvents(resE.events);
      if (resC.calls) setTableCalls(resC.calls);
    } catch (e) {
      console.error('Fetch operations data failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Poll for live table calls every 5 seconds
  useEffect(() => {
    fetchData(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/table-calls');
        if (res.ok) {
          const d = await res.json();
          if (d.calls) setTableCalls(d.calls);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleResolveTableCall = async (callId: string) => {
    try {
      await fetch('/api/table-calls', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: callId })
      });
      setTableCalls(prev => prev.map(c => c.id === callId ? { ...c, status: 'attended' } : c));
    } catch (e) {
      console.error(e);
    }
  };

  // Actions
  const handleUpdateResStatus = async (id: string, status: ReservationStatus) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTableStatus = async (id: string, status: TableStatus, guest?: string) => {
    try {
      const res = await fetch('/api/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, currentGuest: guest || (status === 'occupied' ? 'Walk-in Guests' : null) })
      });
      if (res.ok) {
        setTables(prev => prev.map(t => t.id === id ? { ...t, status, currentGuest: guest } : t));
        setSelectedTableForEdit(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleDishAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable })
      });
      if (res.ok) {
        setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, isAvailable: !m.isAvailable } : m));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdjustInventory = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setInventory(prev => prev.map(i => i.id === id ? data.item : i));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStaffClock = async (id: string) => {
    try {
      const res = await fetch('/api/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.member) {
          setStaff(prev => prev.map(s => s.id === id ? data.member : s));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waitlistForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          setWaitlist(prev => [...prev, data.entry]);
          setShowAddWaitlistModal(false);
          setWaitlistForm({ guestName: '', phone: '', partySize: 2, areaPreference: 'Main Dining Room' });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotifyWaitlistGuest = (id: string) => {
    setSmsSentId(id);
    setTimeout(() => setSmsSentId(null), 3000);
  };

  // Financial Z-Report CSV Export
  const handleExportCSV = () => {
    const grossSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const taxTotal = grossSales * 0.085;
    const tipsTotal = grossSales * 0.15;
    const netSales = grossSales - taxTotal;

    const rows = [
      ['FLAVORIA RESTAURANT - DAILY FINANCIAL Z-REPORT'],
      ['Generated On', new Date().toLocaleString()],
      ['Report Date', todayStr],
      [''],
      ['FINANCIAL SUMMARY', 'AMOUNT ($)'],
      ['Gross Sales', grossSales.toFixed(2)],
      ['Net Revenue', netSales.toFixed(2)],
      ['Taxes Collected (8.5%)', taxTotal.toFixed(2)],
      ['Total Gratuity / Tips', tipsTotal.toFixed(2)],
      ['Total Table Covers', reservations.reduce((s, r) => s + r.guests, 0)],
      ['Average Spend Per Cover (PPA)', (grossSales / (reservations.length || 1)).toFixed(2)],
      ['Table Occupancy Rate', `${Math.round((tables.filter(t => t.status === 'occupied').length / (tables.length || 1)) * 100)}%`],
      [''],
      ['COMPLETED ORDERS LIST'],
      ['Order Code', 'Type', 'Table', 'Customer', 'Amount ($)', 'Status']
    ];

    orders.forEach(o => {
      rows.push([o.orderCode, o.orderType, o.tableNumber || 'N/A', o.customerName, o.totalAmount.toFixed(2), o.status]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flavoria-z-report-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalCovers = reservations.reduce((sum, r) => sum + r.guests, 0);
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalGrossRevenue = totalOrderRevenue + (totalCovers * 45);
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const occupancyRate = tables.length > 0 ? Math.round((occupiedTables / tables.length) * 100) : 0;
  const activeKdsCount = orders.filter(o => o.status === 'received' || o.status === 'in_kitchen').length;

  // Filtered lists
  const filteredReservations = reservations.filter(r => {
    const matchSearch = r.guestName.toLowerCase().includes(resSearch.toLowerCase()) || r.code.toLowerCase().includes(resSearch.toLowerCase());
    const matchStatus = resStatusFilter === 'all' || r.status === resStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredMenu = menuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchCat = menuCategoryFilter === 'all' || m.category === menuCategoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#ea580c] selection:text-white">
      
      {/* Top Operations Header */}
      <header className="bg-[#0b0f19] border-b border-slate-800/80 px-4 sm:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-[#ea580c] group-hover:-translate-x-1 transition-transform" />
              <span>Landing Page</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg border border-[#ea580c]/60 flex items-center justify-center bg-black/60">
                <UtensilsCrossed className="w-3.5 h-3.5 text-[#ea580c]" />
              </div>
              <span className="font-serif font-bold text-white text-sm tracking-wide">
                FLAVORIA RESTAURANT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-[#ea580c] border border-orange-500/30 font-bold uppercase">
                ENTERPRISE SUITE
              </span>
            </div>
          </div>

          {/* Quick Screen Launchers & Clock & Neon DB Status */}
          <div className="flex items-center gap-2.5 text-xs w-full sm:w-auto justify-end flex-wrap">
            <Link
              href="/kitchen"
              className="px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-[#ea580c] border border-orange-500/30 font-bold flex items-center gap-1.5 transition-colors"
              title="Launch Fullscreen Kitchen Display Screen"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>KDS Screen</span>
            </Link>

            <Link
              href="/driver"
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold flex items-center gap-1.5 transition-colors"
              title="Launch Delivery Staff Portal"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Driver Dispatch</span>
            </Link>

            <Link
              href="/account"
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-colors"
              title="View Customer Account Portal"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </Link>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>{currentTime || '19:30:00'}</span>
            </div>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                dbStatus?.connected
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dbStatus?.connected ? 'Neon PostgreSQL Live' : 'In-Memory Fallback'}</span>
            </button>

            <button
              onClick={() => fetchData()}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh all metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#ea580c]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* 12 Tab Navigation Bar */}
      <div className="bg-[#090d16] border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2 text-xs">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'overview' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'reservations' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Reservations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-current">{reservations.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'tables' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Floor Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'waitlist' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>Waitlist</span>
            {waitlist.filter(w => w.status === 'waiting').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                {waitlist.filter(w => w.status === 'waiting').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kds')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'kds' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen KDS</span>
            {activeKdsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white animate-pulse">
                {activeKdsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'menu' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & 86&apos;d</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'inventory' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'staff' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Staff & Shifts</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'crm' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>VIP CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'marketing' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Marketing</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'reports' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Z-Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === 'database' ? 'bg-[#ea580c] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database</span>
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-400">Connecting to Neon Serverless PostgreSQL & Loading Operations...</p>
          </div>
        ) : (
          <>
            {/* Live Table Calls & Waiter Requests Alert Banner */}
            {tableCalls.filter(c => c.status === 'pending').length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <BellRing className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-300">
                      🚨 Active Table Assistance / Bill Requests ({tableCalls.filter(c => c.status === 'pending').length})
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tableCalls.filter(c => c.status === 'pending').map(c => (
                        <span key={c.id} className="text-xs text-amber-200 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800">
                          <strong>Table {c.tableNumber}:</strong> {c.type === 'bill' ? 'Bill Requested 💳' : c.type === 'water' ? 'Refill Water 💧' : 'Service Assistance 🛎️'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tableCalls.filter(c => c.status === 'pending').slice(0, 1).map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleResolveTableCall(c.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Table {c.tableNumber} Attended</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 1: OVERVIEW & EXECUTIVE KPIS                     */}
            {/* ==================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-5 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Total Revenue (Live)
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        ${totalGrossRevenue.toFixed(2)}
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                        +18.4% vs last evening service
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#ea580c] flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Table Covers (Guests)
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {totalCovers} Diners
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {reservations.length} total parties booked
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Floor Occupancy
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {occupancyRate}%
                      </h3>
                      <span className="text-[10px] text-amber-400 block mt-1">
                        {occupiedTables} of {tables.length} tables active
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Grid className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Active Kitchen Tickets
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {activeKdsCount} Tickets
                      </h3>
                      <span className="text-[10px] text-rose-400 block mt-1">
                        Live on KDS Display
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Flame className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Operations Quick Actions */}
                <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-white">
                      Operations Fast-Action Center
                    </h4>
                    <span className="text-xs text-slate-400">1-click administrative triggers</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <button
                      onClick={() => { setActiveTab('kds'); }}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all"
                    >
                      <ChefHat className="w-4 h-4 text-[#ea580c] mb-2" />
                      <strong className="block text-white">Open Kitchen KDS</strong>
                      <span className="text-[10px] text-slate-400">Direct station cook lane</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('waitlist'); setShowAddWaitlistModal(true); }}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all"
                    >
                      <BellRing className="w-4 h-4 text-amber-400 mb-2" />
                      <strong className="block text-white">Add Walk-in Party</strong>
                      <span className="text-[10px] text-slate-400">Queue to waitlist</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('tables'); }}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all"
                    >
                      <Grid className="w-4 h-4 text-emerald-400 mb-2" />
                      <strong className="block text-white">Host Stand Floor Map</strong>
                      <span className="text-[10px] text-slate-400">Seat or clear tables</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all"
                    >
                      <Download className="w-4 h-4 text-sky-400 mb-2" />
                      <strong className="block text-white">Export Daily Z-Report</strong>
                      <span className="text-[10px] text-slate-400">Download CSV audit</span>
                    </button>
                  </div>
                </div>

                {/* Split Quick Overview Grid: Recent Bookings & Kitchen Snapshot */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Next Incoming Reservations */}
                  <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h4 className="font-serif font-bold text-base text-white">
                        Upcoming Seating Schedule
                      </h4>
                      <button onClick={() => setActiveTab('reservations')} className="text-xs text-[#ea580c] font-bold hover:underline">
                        View All ({reservations.length})
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {reservations.slice(0, 5).map(res => (
                        <div key={res.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-white text-sm">{res.guestName}</span>
                              <span className="font-mono text-[10px] text-[#ea580c]">{res.code}</span>
                            </div>
                            <span className="text-slate-400 text-[11px] block">
                              {res.guests} Guests • {res.timeSlot} • {res.area}
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            res.status === 'seated' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Urgent Inventory Stock Alerts */}
                  <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h4 className="font-serif font-bold text-base text-white">
                        Inventory & Ingredient Watch
                      </h4>
                      <button onClick={() => setActiveTab('inventory')} className="text-xs text-[#ea580c] font-bold hover:underline">
                        Manage Stock
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      {inventory.slice(0, 5).map(item => (
                        <div key={item.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <strong className="block text-white text-sm">{item.name}</strong>
                            <span className="text-slate-400 text-[11px]">
                              Supplier: {item.supplier}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-white text-sm">
                              {item.currentStock} {item.unit}
                            </span>
                            <span className={`block text-[10px] font-bold uppercase ${
                              item.status === 'out_of_stock' ? 'text-rose-400' :
                              item.status === 'low_stock' ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 2: RESERVATIONS MANAGER                          */}
            {/* ==================================================== */}
            {activeTab === 'reservations' && (
              <div className="space-y-6 animate-fade-in">
                {/* Search Bar & Actions */}
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search guest name or FLV code..."
                      value={resSearch}
                      onChange={(e) => setResSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto text-xs">
                    {(['all', 'confirmed', 'seated', 'completed', 'cancelled'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setResStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                          resStatusFilter === st
                            ? 'bg-[#ea580c] text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowNewResModal(true)}
                    className="px-4 py-2 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>New Booking</span>
                  </button>
                </div>

                {/* Table */}
                <div className="rounded-3xl bg-[#0b0f19] border border-slate-800 overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0f1420] text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Ref Code</th>
                        <th className="py-3.5 px-4">Guest Details</th>
                        <th className="py-3.5 px-4">Party / Area</th>
                        <th className="py-3.5 px-4">Date & Time</th>
                        <th className="py-3.5 px-4">Special Notes</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredReservations.map(res => (
                        <tr key={res.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#ea580c]">
                            {res.code}
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="block text-white text-sm">{res.guestName}</strong>
                            <span className="text-[11px] text-slate-400">{res.phone}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white">{res.guests} Guests</span>
                            <span className="text-slate-400 block text-[11px]">{res.area}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-white block font-medium">{res.date}</span>
                            <span className="text-[#ea580c] font-mono text-[11px]">{res.timeSlot}</span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs truncate text-slate-400 italic">
                            {res.specialRequests || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              res.status === 'seated' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30' :
                              res.status === 'completed' ? 'bg-slate-800 text-slate-400' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {res.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateResStatus(res.id, 'seated')}
                                  className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold"
                                >
                                  Seat Guest
                                </button>
                              )}
                              {res.status === 'seated' && (
                                <button
                                  onClick={() => handleUpdateResStatus(res.id, 'completed')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                                >
                                  Complete
                                </button>
                              )}
                              {res.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateResStatus(res.id, 'cancelled')}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 text-[11px]"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 3: FLOOR PLAN & HOST STAND                       */}
            {/* ==================================================== */}
            {activeTab === 'tables' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Interactive Table Floor Grid</h3>
                    <p className="text-xs text-slate-400">Click any table to update occupancy status or seat guests.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Cleaning</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tables.map(tbl => (
                    <div
                      key={tbl.id}
                      onClick={() => setSelectedTableForEdit(tbl)}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02] ${
                        tbl.status === 'occupied' ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-900/10' :
                        tbl.status === 'reserved' ? 'bg-amber-950/20 border-amber-500/40 shadow-amber-900/10' :
                        tbl.status === 'cleaning' ? 'bg-sky-950/20 border-sky-500/40' :
                        'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm text-white">{tbl.tableNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 font-bold uppercase text-slate-300">
                          {tbl.capacity} Seats
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate mb-1">{tbl.name}</h4>
                      <span className="text-[10px] text-slate-400 block mb-3">{tbl.area}</span>
                      
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="capitalize font-bold text-white">{tbl.status}</span>
                        <span className="text-slate-400 text-[10px]">{tbl.currentGuest || 'Empty'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 4: LIVE WALK-IN WAITLIST                         */}
            {/* ==================================================== */}
            {activeTab === 'waitlist' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Walk-in Host Stand Waitlist</h3>
                    <p className="text-xs text-slate-400">Queue walk-in diners and alert via simulated SMS when a table is cleared.</p>
                  </div>
                  <button
                    onClick={() => setShowAddWaitlistModal(true)}
                    className="px-4 py-2 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>Add Walk-in Diner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {waitlist.map(w => (
                    <div key={w.id} className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <strong className="text-white text-base font-serif">{w.guestName}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'waiting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          w.status === 'notified' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 animate-pulse' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {w.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-400">
                        <div>Party: <strong className="text-white">{w.partySize} Guests</strong></div>
                        <div>Area: <strong className="text-white">{w.areaPreference}</strong></div>
                        <div>Estimated Wait: <strong className="text-[#ea580c]">{w.estimatedWaitMins} mins</strong></div>
                        <div>Contact: {w.phone}</div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                        <button
                          onClick={() => handleNotifyWaitlistGuest(w.id)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                        >
                          <BellRing className="w-3 h-3 text-amber-400" />
                          <span>{smsSentId === w.id ? 'SMS Sent!' : 'Alert SMS'}</span>
                        </button>
                        <button
                          onClick={() => handleUpdateTableStatus('tbl-1', 'occupied', w.guestName)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Seat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 5: KITCHEN DISPLAY SYSTEM (KDS)                  */}
            {/* ==================================================== */}
            {activeTab === 'kds' && (
              <div className="space-y-6 animate-fade-in">
                {/* Station Filter Pills */}
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-x-auto text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 mr-2">Cook Station:</span>
                    {['All', 'Grill', 'Saute', 'Larder', 'Pastry', 'Bar'].map(st => (
                      <button
                        key={st}
                        onClick={() => setKdsStationFilter(st)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          kdsStationFilter === st ? 'bg-[#ea580c] text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-rose-400 font-bold">
                    {activeKdsCount} Orders Active
                  </span>
                </div>

                {/* 4 Lanes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(['received', 'in_kitchen', 'ready', 'served'] as OrderStatus[]).map(statusLane => {
                    const laneOrders = orders.filter(o => o.status === statusLane);
                    return (
                      <div key={statusLane} className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-4 flex flex-col min-h-[500px]">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                            {statusLane.replace('_', ' ')}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                            {laneOrders.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto">
                          {laneOrders.map(ord => (
                            <div key={ord.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="font-mono font-bold text-sm text-[#ea580c]">{ord.orderCode}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-white font-bold">
                                  {ord.tableNumber || ord.orderType}
                                </span>
                              </div>

                              <div className="space-y-1 text-xs">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between text-slate-300">
                                    <span className="font-medium">{it.quantity}x {it.name}</span>
                                  </div>
                                ))}
                              </div>

                              {ord.notes && (
                                <p className="text-[10px] text-amber-300/80 italic pt-1 border-t border-slate-800">
                                  {ord.notes}
                                </p>
                              )}

                              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                                <span className="text-slate-400 font-mono">12m prep</span>
                                {statusLane === 'received' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'in_kitchen')}
                                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px]"
                                  >
                                    Start Prep →
                                  </button>
                                )}
                                {statusLane === 'in_kitchen' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                                    className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px]"
                                  >
                                    Ready to Plate →
                                  </button>
                                )}
                                {statusLane === 'ready' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'served')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                  >
                                    Serve Table ✓
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 6: MENU & 86'D DISHES                            */}
            {/* ==================================================== */}
            {activeTab === 'menu' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search dishes..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {['all', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks', "Chef's Special"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setMenuCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                          menuCategoryFilter === cat ? 'bg-[#ea580c] text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddDishModal(true)}
                    className="px-4 py-2 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredMenu.map(dish => (
                    <div key={dish.id} className="p-4 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-900 mb-3">
                          <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                          <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            dish.isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {dish.isAvailable ? 'Available' : '86’D / Sold Out'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#ea580c] uppercase">{dish.category}</span>
                        <h4 className="font-serif font-bold text-sm text-white line-clamp-1">{dish.name}</h4>
                        <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{dish.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-white text-base">${dish.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleToggleDishAvailability(dish)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                            dish.isAvailable ? 'bg-slate-800 text-rose-300 hover:bg-rose-950' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {dish.isAvailable ? '86 Dish' : 'Restore'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 7: INVENTORY & STOCK DEPLETION                   */}
            {/* ==================================================== */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">Recipe Ingredient Stock</h3>
                    <p className="text-xs text-slate-400">Track key kitchen raw materials, reorder levels, and automatic dish depletion.</p>
                  </div>
                  <button
                    onClick={() => alert('Purchase Order generated & sent to supplier emails.')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Generate Supplier PO
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {inventory.map(inv => (
                    <div key={inv.id} className="p-5 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">{inv.category}</span>
                          <h4 className="font-serif font-bold text-sm text-white line-clamp-1">{inv.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          inv.status === 'out_of_stock' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          inv.status === 'low_stock' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {inv.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline py-2 border-y border-slate-800 text-xs">
                        <span className="text-slate-400">Current Stock:</span>
                        <span className="font-mono font-bold text-lg text-white">
                          {inv.currentStock} {inv.unit}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Reorder Alert Level:</span>
                          <span className="font-mono text-white">{inv.reorderLevel} {inv.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Per Unit:</span>
                          <span className="font-mono text-white">${inv.costPerUnit.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 truncate">{inv.supplier}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleAdjustInventory(inv.id, -1)}
                            className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleAdjustInventory(inv.id, 5)}
                            className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center justify-center"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 8: STAFF ROSTER & TIP POOL                       */}
            {/* ==================================================== */}
            {activeTab === 'staff' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white">Culinary Brigade & Front of House</h3>
                    <p className="text-xs text-slate-400 mt-1">Shift attendance, live clock in/out, and tip pool sharing.</p>
                  </div>

                  {/* Tip Pool Metric */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Today&apos;s Gratuity Pool</span>
                    <span className="font-serif text-2xl font-bold text-[#ea580c]">${(totalGrossRevenue * 0.15).toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      ~${((totalGrossRevenue * 0.15) / (staff.filter(s => s.isClockedIn).length || 1)).toFixed(2)} per active staff
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {staff.map(member => (
                    <div key={member.id} className="p-5 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-white text-base block font-serif">{member.name}</strong>
                          <span className="text-xs text-[#ea580c] font-bold">{member.role}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          member.isClockedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {member.isClockedIn ? 'Clocked In' : 'Off Shift'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 py-2 border-y border-slate-800">
                        <div>Station: <strong className="text-white">{member.station}</strong></div>
                        <div>Shift: <strong className="text-white">{member.shift}</strong></div>
                        <div>Hours Today: <strong className="text-white">{member.hoursWorkedToday}h</strong></div>
                        <div>Phone: <span className="text-slate-300">{member.phone}</span></div>
                      </div>

                      <button
                        onClick={() => handleToggleStaffClock(member.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          member.isClockedIn
                            ? 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {member.isClockedIn ? 'Clock Out' : 'Clock In Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 9: VIP GUEST CRM                                 */}
            {/* ==================================================== */}
            {activeTab === 'crm' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-4 rounded-2xl bg-[#0f1420] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">VIP Guest CRM & Lifetime Spend</h3>
                    <p className="text-xs text-slate-400">High-value diner profiling, allergy records, and private concierge notes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guests.map(g => (
                    <div key={g.id} className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-white">{g.name}</h4>
                          <span className="text-xs text-slate-400">{g.email}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {g.vipTier}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900 text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Lifetime Spend:</span>
                          <span className="font-serif font-bold text-[#ea580c]">${g.lifetimeSpend.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Visits:</span>
                          <span className="font-bold text-white">{g.totalVisits} Dinners</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Favorite Table:</span>
                          <span className="text-white font-medium">{g.favoriteTable}</span>
                        </div>
                      </div>

                      {g.allergies.length > 0 && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Allergies: {g.allergies.join(', ')}</span>
                        </div>
                      )}

                      <div className="text-xs text-slate-400 italic bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                        &quot;{g.notes}&quot;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 10: MARKETING & PROMOS                           */}
            {/* ==================================================== */}
            {activeTab === 'marketing' && (
              <div className="space-y-8 animate-fade-in">
                {/* Active Promo Codes */}
                <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-white">Active Promotional Codes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    {promoCodes.map(p => (
                      <div key={p.code} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-base font-bold text-[#ea580c]">{p.code}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                            {p.discountPercent}% OFF
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{p.description}</p>
                        <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
                          <span>Used: {p.usageCount} / {p.maxUses}</span>
                          <span>Min Spend: ${p.minOrderAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gift Cards Issued */}
                <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-white">Active Digital Gift Cards</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {giftCards.map(gc => (
                      <div key={gc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="font-mono text-sm font-bold text-[#ea580c] block">{gc.code}</span>
                          <span className="text-slate-300 font-medium">To: {gc.recipientName} ({gc.recipientEmail})</span>
                          <span className="text-slate-500 block text-[10px]">From: {gc.senderName}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-serif text-lg font-bold text-white">${gc.currentBalance.toFixed(2)}</span>
                          <span className="text-[10px] text-emerald-400 block uppercase font-bold">{gc.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Private Dining Inquiries */}
                <div className="p-6 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-white">Private Event Inquiries</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {events.map(ev => (
                      <div key={ev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-white text-sm block">{ev.contactName} ({ev.eventType})</strong>
                            <span className="text-slate-400 text-[11px]">{ev.email} • {ev.phone}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#ea580c]/10 text-[#ea580c] border border-orange-500/20 font-bold uppercase text-[10px]">
                            {ev.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                          <span>{ev.guestCount} Guests • {ev.preferredDate}</span>
                          <span className="font-serif font-bold text-white">${ev.estimatedBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 11: FINANCIAL Z-REPORTS & CSV EXPORT             */}
            {/* ==================================================== */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] block mb-1">
                        DAILY AUDIT & AUDITING SUITE
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        End-of-Day Financial Z-Report
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Automated reconciliation for accounting, POS, tax audit, and tip disbursement.
                      </p>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      className="px-6 py-3 rounded-2xl btn-primary-orange text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Z-Report (CSV)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Gross Sales</span>
                      <span className="font-serif text-xl font-bold text-white block mt-1">${totalGrossRevenue.toFixed(2)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">State Tax (8.5%)</span>
                      <span className="font-serif text-xl font-bold text-white block mt-1">${(totalGrossRevenue * 0.085).toFixed(2)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Staff Tip Pool (15%)</span>
                      <span className="font-serif text-xl font-bold text-[#ea580c] block mt-1">${(totalGrossRevenue * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Earnings</span>
                      <span className="font-serif text-xl font-bold text-emerald-400 block mt-1">${(totalGrossRevenue * 0.915).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 12: NEON DATABASE SETTINGS                       */}
            {/* ==================================================== */}
            {activeTab === 'database' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                <div className="p-8 rounded-3xl bg-[#0b0f19] border border-slate-800 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">Neon Serverless PostgreSQL Live</h3>
                      <p className="text-xs text-slate-400 mt-1">High-performance auto-scaling cloud database for Flavoria.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Connection Status:</span>
                      <span className="text-emerald-400 font-bold font-mono">Connected & Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Region:</span>
                      <span className="text-white font-mono">AWS us-east-2 (Ohio)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schema Tables:</span>
                      <span className="text-white font-mono">menu_items, reservations, dining_tables, orders, inventory_items, waitlist, staff_members, guest_profiles, promo_codes, gift_cards, event_inquiries</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal: Add Walk-in Waitlist */}
      {showAddWaitlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0b0e17] border border-slate-700 shadow-2xl">
            <button onClick={() => setShowAddWaitlistModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-white mb-4">Add Walk-in Diner to Waitlist</h3>
            <form onSubmit={handleAddWaitlist} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Thorne"
                  value={waitlistForm.guestName}
                  onChange={e => setWaitlistForm({ ...waitlistForm, guestName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">Phone Number (for SMS) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={waitlistForm.phone}
                  onChange={e => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#ea580c]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">Party Size</label>
                  <select
                    value={waitlistForm.partySize}
                    onChange={e => setWaitlistForm({ ...waitlistForm, partySize: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold uppercase text-[10px]">Area Preference</label>
                  <select
                    value={waitlistForm.areaPreference}
                    onChange={e => setWaitlistForm({ ...waitlistForm, areaPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option>Main Dining Room</option>
                    <option>Garden Terrace</option>
                    <option>Chef&apos;s Counter</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl btn-primary-orange text-xs font-bold uppercase tracking-wider shadow-md">
                Queue to Waitlist
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Table Status */}
      {selectedTableForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm p-6 rounded-3xl bg-[#0b0e17] border border-slate-700 shadow-2xl">
            <button onClick={() => setSelectedTableForEdit(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-white mb-1">
              {selectedTableForEdit.tableNumber} — {selectedTableForEdit.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Capacity: {selectedTableForEdit.capacity} Guests • {selectedTableForEdit.area}
            </p>
            <div className="space-y-2 mb-6">
              {(['available', 'occupied', 'reserved', 'cleaning'] as TableStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => handleUpdateTableStatus(selectedTableForEdit.id, st)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold text-left flex items-center justify-between transition-all ${
                    selectedTableForEdit.status === st ? 'bg-[#ea580c] text-white font-bold' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>Set as {st}</span>
                  {selectedTableForEdit.status === st && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedTableForEdit(null)} className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
