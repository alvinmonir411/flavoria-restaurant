import { NextResponse } from 'next/server';
import { getGuestProfiles } from '@/lib/db';

export async function GET() {
  try {
    const guests = await getGuestProfiles();
    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}
