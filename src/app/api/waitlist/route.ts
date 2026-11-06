import { NextResponse } from 'next/server';
import { getWaitlist, addWaitlistEntry, updateWaitlistStatus } from '@/lib/db';

export async function GET() {
  try {
    const waitlist = await getWaitlist();
    return NextResponse.json({ waitlist });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.guestName || !body.phone) {
      return NextResponse.json({ error: 'Guest name and phone required' }, { status: 400 });
    }
    const entry = await addWaitlistEntry({
      guestName: body.guestName,
      phone: body.phone,
      partySize: Number(body.partySize || 2),
      areaPreference: body.areaPreference || 'Main Dining Room',
      estimatedWaitMins: Number(body.estimatedWaitMins || 15)
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }
    const ok = await updateWaitlistStatus(body.id, body.status);
    return NextResponse.json({ success: ok });
  } catch (error) {
    console.error('Error updating waitlist:', error);
    return NextResponse.json({ error: 'Failed to update waitlist' }, { status: 500 });
  }
}
