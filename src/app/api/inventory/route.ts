import { NextResponse } from 'next/server';
import { getInventory, updateInventoryStock } from '@/lib/db';

export async function GET() {
  try {
    const items = await getInventory();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || body.delta === undefined) {
      return NextResponse.json({ error: 'ID and delta required' }, { status: 400 });
    }
    const updated = await updateInventoryStock(body.id, Number(body.delta));
    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
