import { NextResponse } from 'next/server';
import { getReservations, getOrders, getTables } from '@/lib/db';

export async function GET() {
  try {
    const [reservations, orders, tables] = await Promise.all([
      getReservations(),
      getOrders(),
      getTables()
    ]);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === todayStr);

    // Calculate revenue from non-cancelled orders + seated reservations (avg spend ~$220/guest)
    const orderRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const totalCoversToday = todayReservations.reduce((sum, r) => sum + (r.guests || 2), 0);
    const seatedCovers = todayReservations
      .filter(r => r.status === 'seated' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.guests || 2), 0);

    const estimatedCoversRevenue = seatedCovers * 210;
    const totalRevenue = orderRevenue + estimatedCoversRevenue;

    const totalTables = tables.length;
    const occupiedOrReservedTables = tables.filter(t => t.status === 'occupied' || t.status === 'reserved').length;
    const occupancyRate = totalTables > 0 ? Math.round((occupiedOrReservedTables / totalTables) * 100) : 0;

    const activeKitchenOrders = orders.filter(o => o.status === 'received' || o.status === 'in_kitchen').length;

    return NextResponse.json({
      totalRevenue,
      todayCovers: totalCoversToday,
      totalReservations: reservations.length,
      occupancyRate,
      activeKitchenOrders,
      tablesSummary: {
        total: totalTables,
        occupied: tables.filter(t => t.status === 'occupied').length,
        reserved: tables.filter(t => t.status === 'reserved').length,
        available: tables.filter(t => t.status === 'available').length,
        cleaning: tables.filter(t => t.status === 'cleaning').length
      }
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
  }
}
