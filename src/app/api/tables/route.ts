import { NextResponse } from 'next/server';
import { getTables, updateTableStatus } from '@/lib/db';
import { TableStatus } from '@/types';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  try {
    const tables = await getTables();
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Owner / Admin', 'Restaurant Manager', 'Floor Manager', 'Server', 'Order Manager']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Table ID and status are required' }, { status: 400 });
    }

    const updated = await updateTableStatus(
      body.id,
      body.status as TableStatus,
      body.currentGuest,
      body.reservationTime
    );

    if (!updated) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ table: updated });
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}
