import { NextResponse } from 'next/server';
import { getDeliveryZones } from '@/lib/db';

export async function GET() {
  try {
    const zones = await getDeliveryZones();
    return NextResponse.json({ zones });
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    return NextResponse.json({ error: 'Failed to fetch delivery zones' }, { status: 500 });
  }
}
