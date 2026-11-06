import { NextResponse } from 'next/server';
import { getDeliveryDrivers, updateDriverStatus } from '@/lib/db';
import { DeliveryDriver } from '@/types';

export async function GET() {
  try {
    const drivers = await getDeliveryDrivers();
    return NextResponse.json({ drivers });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'Driver id and status required' }, { status: 400 });
    }
    const success = await updateDriverStatus(id, status as DeliveryDriver['status']);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}
