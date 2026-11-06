import { NextResponse } from 'next/server';
import { getPurchaseOrders, createPurchaseOrder } from '@/lib/db';

export async function GET() {
  try {
    const orders = await getPurchaseOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPO = await createPurchaseOrder(body);
    return NextResponse.json({ order: newPO }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}
