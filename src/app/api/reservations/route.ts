import { NextResponse } from 'next/server';
import { getReservations, createReservation, updateReservationStatus } from '@/lib/db';
import { ReservationStatus } from '@/types';
import { verifyStaffAuth } from '@/lib/auth-server';

export async function GET() {
  try {
    const reservations = await getReservations();
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.guestName || !body.email || !body.phone || !body.date || !body.timeSlot) {
      return NextResponse.json({ error: 'Missing required reservation fields' }, { status: 400 });
    }

    // Pre-flight anti-overlap check
    const existing = await getReservations();
    const conflict = existing.find(r => 
      r.status !== 'cancelled' &&
      r.date === body.date &&
      r.timeSlot === body.timeSlot &&
      Boolean(r.tableNumber && body.tableNumber && r.tableNumber === body.tableNumber)
    );

    if (conflict) {
      return NextResponse.json({ 
        error: `Table ${body.tableNumber} is already reserved for ${body.timeSlot} on ${body.date}. Please select an alternate table or dining time.` 
      }, { status: 409 });
    }

    const reservation = await createReservation({
      guestName: body.guestName,
      email: body.email,
      phone: body.phone,
      guests: Number(body.guests || 2),
      date: body.date,
      timeSlot: body.timeSlot,
      area: body.area || 'Main Dining Room',
      tableNumber: body.tableNumber,
      specialRequests: body.specialRequests || ''
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error('Error creating reservation:', err);
    if (err?.message?.includes('CONCURRENCY_CONFLICT') || err?.message?.includes('already booked')) {
      const cleanMsg = err.message.replace('CONCURRENCY_CONFLICT: ', '');
      return NextResponse.json({ error: cleanMsg }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyStaffAuth(req, ['Owner / Admin', 'Restaurant Manager', 'Floor Manager', 'Server']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.statusCode || 401 });
    }

    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Reservation ID and status are required' }, { status: 400 });
    }

    const updated = await updateReservationStatus(body.id, body.status as ReservationStatus);
    if (!updated) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ reservation: updated });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}
