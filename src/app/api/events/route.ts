import { NextResponse } from 'next/server';
import { getEvents, createEventInquiry } from '@/lib/db';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.contactName || !body.email || !body.preferredDate) {
      return NextResponse.json({ error: 'Contact name, email and preferred date required' }, { status: 400 });
    }
    const inquiry = await createEventInquiry({
      contactName: body.contactName,
      email: body.email,
      phone: body.phone || '',
      eventType: body.eventType || 'Corporate Gala',
      guestCount: Number(body.guestCount || 20),
      preferredDate: body.preferredDate,
      packageTier: body.packageTier || 'Gourmet Gold',
      estimatedBudget: Number(body.estimatedBudget || 2500),
      notes: body.notes || ''
    });
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error('Error creating event inquiry:', error);
    return NextResponse.json({ error: 'Failed to create event inquiry' }, { status: 500 });
  }
}
